import type { ArchivePhoto } from '../data/photoArchive';
import type { PhotoGridCopy } from '../i18n/content';
import { normalizePhotoSearch } from '../utils/photoSearch';

let cleanupGrid: (() => void) | undefined;

export function setupPhotoGrid() {
  cleanupGrid?.();
  cleanupGrid = undefined;
  const root = document.querySelector<HTMLElement>('[data-photo-grid]');
  if (!root) return;
  const items = root.querySelector<HTMLElement>('[data-grid-items]')!;
  const form = root.querySelector<HTMLFormElement>('[data-grid-filters]')!;
  const search = root.querySelector<HTMLInputElement>('[data-grid-search]')!;
  const more = root.querySelector<HTMLAnchorElement>('[data-grid-more]')!;
  const count = root.querySelector<HTMLElement>('[data-grid-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-grid-empty]')!;
  const end = root.querySelector<HTMLElement>('[data-grid-end]')!;
  const error = root.querySelector<HTMLElement>('[data-grid-error]')!;
  const clear = root.querySelector<HTMLButtonElement>('[data-grid-clear]')!;
  const all = root.querySelector<HTMLButtonElement>('[data-grid-all]')!;
  const sentinel = root.querySelector<HTMLElement>('[data-grid-sentinel]')!;
  const labels: PhotoGridCopy = JSON.parse(root.querySelector('[data-grid-copy]')!.textContent!);
  const tagButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-grid-tag]')];
  const validTags = new Set(tagButtons.map((button) => button.dataset.gridTag!));
  const tagAliases = new Map<string, string>();
  validTags.forEach((tag) => tagAliases.set(normalizePhotoSearch(tag.replace(/-/g, ' ')), tag));
  const tagLabels: Record<string, string>[] = JSON.parse(root.dataset.tagLabels!);
  tagLabels.forEach((translations) => Object.entries(translations).forEach(([tag, label]) => {
    tagAliases.set(normalizePhotoSearch(label), tag);
  }));
  const selected = new Set<string>();
  const batchSize = Number(root.dataset.batchSize);
  const sizes = items.querySelector('img')?.sizes ?? '46vw';
  const controller = new AbortController();
  const { signal } = controller;
  let cursor = Number(root.dataset.offset) + items.children.length;
  let total = Number(root.dataset.total);
  let manifest: Promise<ArchivePhoto[]> | undefined;
  let matches: ArchivePhoto[] | undefined;
  let busy = false;
  let revision = 0;
  let inputTimer = 0;
  let layoutFrame = 0;
  let hasScrolled = false;
  let failedAction: 'filter' | 'more' = 'more';
  const changedCards = new Set<HTMLElement>();

  // A one-pixel grid track keeps appended cards in place; only resized cards are measured.
  const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver((entries) => {
    entries.forEach(({ target }) => changedCards.add(target as HTMLElement));
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      const gap = parseFloat(getComputedStyle(items).columnGap) || 0;
      const spans = [...changedCards].filter((card) => card.isConnected).map((card) => ({
        card, span: Math.ceil(card.getBoundingClientRect().height + gap),
      }));
      changedCards.clear();
      spans.forEach(({ card, span }) => { card.style.gridRowEnd = `span ${Math.max(1, span)}`; });
    });
  });
  if (resize) {
    items.classList.add('is-masonry');
    [...items.children].forEach((card) => resize.observe(card));
  }

  const updateControls = () => {
    count.textContent = labels.count.replace('{shown}', String(cursor)).replace('{total}', String(total));
    more.hidden = cursor >= total;
    more.textContent = busy ? labels.loading : labels.loadMore;
    more.setAttribute('aria-disabled', String(busy));
    items.setAttribute('aria-busy', String(busy));
    empty.hidden = total !== 0;
    end.hidden = total === 0 || cursor < total;
    clear.hidden = selected.size === 0 && !search.value;
    all.setAttribute('aria-pressed', String(selected.size === 0 && !search.value));
    tagButtons.forEach((button) => button.setAttribute('aria-pressed', String(selected.has(button.dataset.gridTag!))));
  };

  const getPhotos = () => {
    manifest ??= fetch(root.dataset.manifest!, { signal }).then(async (response) => {
      if (!response.ok) throw new Error('Photo archive unavailable');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid photo archive');
      return data as ArchivePhoto[];
    }).catch((reason) => { manifest = undefined; throw reason; });
    return manifest;
  };

  const createCard = (photo: ArchivePhoto) => {
    const card = document.createElement('figure');
    card.className = 'photo-grid__card';
    card.dataset.gridCard = '';
    card.dataset.photoId = photo.id;
    const link = document.createElement('a');
    link.className = 'photo-grid__open';
    link.href = photo.viewer;
    link.setAttribute('aria-label', `${root.dataset.openLabel}: ${photo.alt}`);
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'photo-lightbox');
    link.dataset.lightboxOpen = '';
    link.dataset.lightboxSrc = photo.viewer;
    link.dataset.lightboxAlt = photo.alt;
    link.dataset.lightboxFilename = photo.filename;
    const image = document.createElement('img');
    image.width = photo.width;
    image.height = photo.height;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.sizes = sizes;
    image.srcset = photo.srcset;
    image.src = photo.src;
    link.append(image);
    const caption = document.createElement('figcaption');
    const title = document.createElement('span');
    const tags = document.createElement('span');
    title.textContent = photo.title;
    tags.textContent = photo.tagLabel;
    caption.append(title, tags);
    card.append(link, caption);
    return card;
  };

  const renderBatch = (photos: ArchivePhoto[], replace = false) => {
    if (replace) {
      [...items.children].forEach((card) => resize?.unobserve(card));
      changedCards.clear();
      items.replaceChildren();
    }
    const cards = photos.map(createCard);
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => fragment.append(card));
    items.append(fragment);
    cards.forEach((card) => resize?.observe(card));
  };

  const showError = (action: 'filter' | 'more') => {
    failedAction = action;
    error.hidden = false;
  };

  const loadMore = async () => {
    if (busy || cursor >= total || !error.hidden) return;
    busy = true;
    const requestRevision = revision;
    let firstAddedLink: HTMLAnchorElement | null = null;
    updateControls();
    try {
      const photos = matches ?? await getPhotos();
      if (signal.aborted || requestRevision !== revision) return;
      const batch = photos.slice(cursor, cursor + batchSize);
      renderBatch(batch);
      firstAddedLink = items.querySelector<HTMLAnchorElement>(`[data-grid-card]:nth-child(${items.children.length - batch.length + 1}) a`);
      cursor += batch.length;
      const nextPage = Math.floor(cursor / batchSize) + 1;
      more.href = `${root.dataset.manifest!.replace('photos.json', '')}${nextPage}/`;
    } catch {
      if (!signal.aborted && requestRevision === revision) showError('more');
    } finally {
      if (!signal.aborted && requestRevision === revision) {
        busy = false;
        updateControls();
        if (more.hidden && document.activeElement === more) firstAddedLink?.focus();
      }
    }
  };

  const syncUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('tag');
    url.searchParams.delete('q');
    selected.forEach((tag) => url.searchParams.append('tag', tag));
    if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    history.replaceState(null, '', url);
    document.querySelectorAll<HTMLAnchorElement>('[data-language-link]').forEach((link) => {
      const alternate = new URL(link.href);
      alternate.search = url.search;
      link.href = alternate.toString();
    });
  };

  const applyFilters = async () => {
    const requestRevision = ++revision;
    busy = true;
    error.hidden = true;
    syncUrl();
    updateControls();
    const query = normalizePhotoSearch(search.value.trim());
    const queryTag = tagAliases.get(query);
    const words = queryTag ? [] : query.split(/\s+/).filter(Boolean);
    const tags = [...selected];
    if (queryTag) tags.push(queryTag);
    try {
      const photos = await getPhotos();
      if (signal.aborted || requestRevision !== revision) return;
      matches = photos.filter((photo) => tags.every((tag) => (photo.tags as readonly string[]).includes(tag))
        && words.every((word) => {
          const tag = tagAliases.get(word);
          return tag ? (photo.tags as readonly string[]).includes(tag) : photo.search.includes(word);
        }));
      total = matches.length;
      cursor = Math.min(batchSize, total);
      renderBatch(matches.slice(0, cursor), true);
    } catch {
      if (!signal.aborted && requestRevision === revision) showError('filter');
    } finally {
      if (!signal.aborted && requestRevision === revision) {
        busy = false;
        updateControls();
      }
    }
  };

  const reset = () => {
    window.clearTimeout(inputTimer);
    selected.clear();
    search.value = '';
    if (document.activeElement === clear) search.focus();
    void applyFilters();
  };

  form.hidden = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.clearTimeout(inputTimer);
    void applyFilters();
  }, { signal });
  search.addEventListener('input', () => {
    // Invalidate a pending append before the debounce so it cannot render stale results.
    revision += 1;
    busy = true;
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(() => void applyFilters(), 180);
  }, { signal });
  tagButtons.forEach((button) => button.addEventListener('click', () => {
    window.clearTimeout(inputTimer);
    const tag = button.dataset.gridTag!;
    if (selected.has(tag)) selected.delete(tag); else selected.add(tag);
    void applyFilters();
  }, { signal }));
  all.addEventListener('click', reset, { signal });
  clear.addEventListener('click', reset, { signal });
  more.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    error.hidden = true;
    void loadMore();
  }, { signal });
  root.querySelector('[data-grid-retry]')!.addEventListener('click', () => {
    error.hidden = true;
    if (failedAction === 'filter') void applyFilters(); else void loadMore();
  }, { signal });

  const intersection = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver((entries) => {
    if (hasScrolled && entries.some((entry) => entry.isIntersecting)) void loadMore();
  }, { rootMargin: '240px 0px' });
  intersection?.observe(sentinel);
  window.addEventListener('scroll', () => {
    hasScrolled = true;
    if (sentinel.getBoundingClientRect().top < window.innerHeight + 240) void loadMore();
  }, { signal, passive: true, once: true });

  const readUrl = () => {
    const params = new URLSearchParams(window.location.search);
    selected.clear();
    params.getAll('tag').filter((tag) => validTags.has(tag)).forEach((tag) => selected.add(tag));
    search.value = params.get('q') ?? '';
    if (selected.size || search.value || matches) void applyFilters();
  };
  window.addEventListener('popstate', readUrl, { signal });
  updateControls();
  readUrl();
  cleanupGrid = () => {
    controller.abort();
    resize?.disconnect();
    intersection?.disconnect();
    window.clearTimeout(inputTimer);
    cancelAnimationFrame(layoutFrame);
  };
}

document.addEventListener('astro:before-swap', () => {
  cleanupGrid?.();
  cleanupGrid = undefined;
});

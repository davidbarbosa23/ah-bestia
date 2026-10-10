import {
  easePageTurn,
  distanceBetween,
  calculatePaperFold,
  toBookPoint,
  paperClipPath,
  shadowClipPath,
  type PaperPoint,
  type PaperFold,
} from '../utils/paperFold';
import { setPhotoUrl } from '../utils/photoUrl';
const setupMagazines = () => {
  const controlledDocument = document as Document & {
    magazineController?: AbortController;
  };
  controlledDocument.magazineController?.abort();
  controlledDocument.magazineController = new AbortController();
  const { signal } = controlledDocument.magazineController;

  document.querySelectorAll<HTMLElement>('[data-magazine]').forEach((magazine) => {
    const viewport = magazine.querySelector<HTMLElement>('.magazine__viewport');
    const book = magazine.querySelector<HTMLElement>('[data-magazine-book]');
    const pages = [...magazine.querySelectorAll<HTMLElement>('[data-magazine-page]')];
    const previous = magazine.querySelector<HTMLButtonElement>('[data-magazine-previous]');
    const next = magazine.querySelector<HTMLButtonElement>('[data-magazine-next]');
    const count = magazine.querySelector<HTMLOutputElement>('[data-magazine-count]');
    const compactCount = magazine.querySelector<HTMLElement>('[data-magazine-compact-count]');
    const progress = magazine.querySelector<HTMLInputElement>('[data-magazine-progress]');
    const fullscreen = magazine.querySelector<HTMLButtonElement>('[data-magazine-fullscreen]');
    const fullscreenText = magazine.querySelector<HTMLElement>('[data-magazine-fullscreen-text]');
    const zoomControls = magazine.querySelector<HTMLElement>('[data-magazine-zoom-controls]');
    const zoomOut = magazine.querySelector<HTMLButtonElement>('[data-magazine-zoom-out]');
    const zoomReset = magazine.querySelector<HTMLButtonElement>('[data-magazine-zoom-reset]');
    const zoomIn = magazine.querySelector<HTMLButtonElement>('[data-magazine-zoom-in]');
    const turnLayer = magazine.querySelector<HTMLElement>('[data-magazine-turn-layer]');
    const turnPage = magazine.querySelector<HTMLElement>('[data-magazine-turn-page]');
    const turnFront = magazine.querySelector<HTMLElement>('[data-magazine-turn-front]');
    const turnBottom = magazine.querySelector<HTMLElement>('[data-magazine-turn-bottom]');
    const turnShadow = magazine.querySelector<HTMLElement>('[data-magazine-turn-shadow]');
    const turnInnerShadow = magazine.querySelector<HTMLElement>('[data-magazine-turn-inner-shadow]');

    if (!viewport || !book || !pages.length || !previous || !next || !count || !compactCount || !progress) return;
    if (!zoomControls || !zoomOut || !zoomReset || !zoomIn) return;
    if (!turnLayer || !turnPage || !turnFront || !turnBottom) return;
    if (!turnShadow || !turnInnerShadow) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const durationInMilliseconds = (value: string, fallback: number) => {
      const duration = value.trim();
      const amount = Number.parseFloat(duration);
      if (!Number.isFinite(amount)) return fallback;
      return duration.endsWith('ms') ? amount : duration.endsWith('s') ? amount * 1000 : amount;
    };
    const lastIndex = pages.length - 1;
    const pageLabel = magazine.dataset.pageLabel ?? '';
    const pagesLabel = magazine.dataset.pagesLabel ?? '';
    const ofLabel = magazine.dataset.ofLabel ?? '';
    const minimumScale = 1;
    const maximumScale = 3;
    let currentIndex = 0;
    let settledIndex = 0;
    let pointerId: number | undefined;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerCaptured = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let scale = minimumScale;
    let translateX = 0;
    let translateY = 0;
    let pinchStartDistance = 0;
    let pinchStartScale = minimumScale;
    let baseBookWidth = 0;
    let turnFrame: number | undefined;
    let turnSequence = 0;

    type TurnDirection = 'next' | 'previous';
    type TurnSurfaces = {
      layer: HTMLElement;
      turnPage: HTMLElement;
      turnFront: HTMLElement;
      turnBottom: HTMLElement;
      turnShadow: HTMLElement;
      turnInnerShadow: HTMLElement;
    };
    type ActiveTurn = TurnSurfaces & {
      toIndex: number;
      direction: TurnDirection;
      sequence: number;
      progress: number;
      startedAt: number;
      updatedAt: number;
      duration: number;
    };
    const activeTurns: ActiveTurn[] = [];
    type BufferedTurn = {
      fromIndex: number;
      toIndex: number;
      surfaces?: TurnSurfaces;
    };
    const turnBuffer: BufferedTurn[] = [];

    const normalizeIndex = (requestedIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(lastIndex, requestedIndex));
      if (clampedIndex === 0) return clampedIndex;
      return 1 + Math.floor((clampedIndex - 1) / 2) * 2;
    };

    const visibleIndices = (startIndex: number) => {
      if (startIndex === 0 || startIndex === lastIndex) {
        return [startIndex];
      }
      return [startIndex, Math.min(lastIndex, startIndex + 1)];
    };

    const isFallbackExpanded = () => magazine.classList.contains('is-expanded');
    const isFullscreen = () => document.fullscreenElement === magazine || isFallbackExpanded();

    const controlsIdleDelay = durationInMilliseconds(
      getComputedStyle(magazine).getPropertyValue('--dur-magazine-controls-idle'),
      2400,
    );
    let controlsIdleTimer: ReturnType<typeof setTimeout> | undefined;
    const revealControls = () => {
      if (!isFullscreen()) return;
      clearTimeout(controlsIdleTimer);
      magazine.classList.add('is-controls-active');
      controlsIdleTimer = setTimeout(() => {
        magazine.classList.remove('is-controls-active');
        controlsIdleTimer = undefined;
      }, controlsIdleDelay);
    };

    // Keep the controls discoverable without covering the photographs while reading.
    for (const event of ['pointermove', 'pointerdown', 'keydown', 'focusin', 'input', 'wheel']) {
      magazine.addEventListener(event, revealControls, { signal, passive: true });
    }

    const clampPosition = () => {
      const maxX = Math.max(0, (book.offsetWidth - viewport.clientWidth) / 2);
      const maxY = Math.max(0, (book.offsetHeight - viewport.clientHeight) / 2);
      translateX = Math.min(maxX, Math.max(-maxX, translateX));
      translateY = Math.min(maxY, Math.max(-maxY, translateY));
    };

    const renderZoom = () => {
      if (scale === minimumScale) {
        if (book.style.width) book.style.removeProperty('width');
        baseBookWidth = book.offsetWidth;
      } else {
        if (baseBookWidth === 0) {
          book.style.removeProperty('width');
          baseBookWidth = book.offsetWidth;
        }
        const zoomedWidth = `${baseBookWidth * scale}px`;
        if (book.style.width !== zoomedWidth) book.style.width = zoomedWidth;
      }
      clampPosition();
      const centerOffsetX = (viewport.clientWidth - book.offsetWidth) / 2 - book.offsetLeft;
      const centerOffsetY = (viewport.clientHeight - book.offsetHeight) / 2 - book.offsetTop;
      book.style.transform = `translate(${centerOffsetX + translateX}px, ${centerOffsetY + translateY}px)`;
      zoomReset.textContent = `${Math.round(scale * 100)}%`;
      zoomOut.disabled = scale <= minimumScale;
      zoomIn.disabled = scale >= maximumScale;
      magazine.classList.toggle('is-zoomed', scale > minimumScale);
    };

    const resetZoom = () => {
      scale = minimumScale;
      translateX = 0;
      translateY = 0;
      renderZoom();
    };

    const setScale = (nextScale: number) => {
      scale = Math.min(maximumScale, Math.max(minimumScale, nextScale));
      if (scale === minimumScale) {
        translateX = 0;
        translateY = 0;
      }
      renderZoom();
    };

    const decodeImage = async (image: HTMLImageElement) => {
      await image.decode().catch(() => {
        // Keep the browser's normal loading and error behavior if decoding is interrupted.
      });
    };

    const loadPage = (index: number) => {
      const image = pages[index]?.querySelector<HTMLImageElement>('[data-magazine-image]');
      if (!image) return Promise.resolve();
      if (!image.getAttribute('src')) {
        image.loading = 'eager';
        image.srcset = image.dataset.srcset ?? '';
        image.src = image.dataset.src ?? '';
      }
      return decodeImage(image);
    };

    const expandedLoads = new WeakMap<HTMLImageElement, Promise<void>>();

    const loadExpandedPage = (index: number) => {
      const image = pages[index]?.querySelector<HTMLImageElement>('[data-magazine-image]');
      const source = image?.dataset.expandedSrc;
      if (!image || !source) return Promise.resolve();
      if (image.dataset.expandedLoaded === 'true') return decodeImage(image);
      const pending = expandedLoads.get(image);
      if (pending) return pending;

      const expanded = new Image();
      expanded.decoding = 'async';
      expanded.src = source;
      const ready = expanded.decode().then(async () => {
        if (signal.aborted || !isFullscreen()) return;
        // Keep the displayed image intact until its fullscreen replacement
        // is decoded, then update both source attributes in the same frame.
        image.loading = 'eager';
        image.src = source;
        image.removeAttribute('srcset');
        image.dataset.expandedLoaded = 'true';
        await decodeImage(image);
      }).catch(() => {
        // A failed upgrade must leave the already visible photograph intact.
      }).finally(() => {
        expandedLoads.delete(image);
      });
      expandedLoads.set(image, ready);
      return ready;
    };

    const preloadAround = (indices: number[]) => {
      const first = indices[0] ?? 0;
      const last = indices.at(-1) ?? first;
      const candidates = [first - 2, first - 1, ...indices, last + 1, last + 2];
      candidates.forEach((index) => {
        if (index >= 0 && index <= lastIndex) void loadPage(index);
      });
    };

    const preloadNextExpandedTurn = (indices: number[]) => {
      const lastVisible = indices.at(-1) ?? currentIndex;
      if (lastVisible >= lastIndex) return;
      const nextStart = normalizeIndex(lastVisible + 1);
      if (nextStart <= lastVisible) return;
      visibleIndices(nextStart).forEach((index) => void loadExpandedPage(index));
    };

    const restorePageSources = () => {
      pages.forEach((page) => {
        const image = page.querySelector<HTMLImageElement>('[data-magazine-image]');
        if (!image || image.dataset.expandedLoaded !== 'true') return;
        // Fullscreen textures must not remain the source for subsequent
        // inline turns. The browser can reuse the responsive images in cache.
        image.srcset = image.dataset.srcset ?? '';
        image.src = image.dataset.src ?? '';
        delete image.dataset.expandedLoaded;
      });
    };

    type PagePosition = 'left' | 'right' | 'single';
    const setVisualPages = (positions: Map<number, PagePosition>) => {
      pages.forEach((page, index) => {
        const position = positions.get(index);
        if (position) page.dataset.position = position;
        else delete page.dataset.position;
      });
    };

    const positionsFor = (indices: number[]) => {
      const positions = new Map<number, PagePosition>();
      if (indices.length === 1) {
        const index = indices[0];
        if (index !== undefined) {
          positions.set(index, index === 0 ? 'right' : index === lastIndex ? 'left' : 'single');
        }
      } else {
        const left = indices[0];
        const right = indices[1];
        if (left !== undefined) positions.set(left, 'left');
        if (right !== undefined) positions.set(right, 'right');
      }
      return positions;
    };

    const copyPageToSurface = (index: number, surface: HTMLElement) => {
      const page = pages[index];
      const photo = page?.querySelector<HTMLElement>('.magazine__photo');
      if (!page || !photo) return Promise.resolve();
      delete surface.dataset.empty;
      const copy = photo.cloneNode(true) as HTMLElement;
      const sourceImage = photo.querySelector<HTMLImageElement>('img');
      const image = copy.querySelector<HTMLImageElement>('img');
      if (image) {
        image.alt = '';
        image.loading = 'eager';
        // Pin the clone to the displayed bitmap rather than selecting a
        // different responsive source for a temporary animation surface.
        image.decoding = 'async';
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.src = sourceImage?.currentSrc || sourceImage?.src || image.src;
      }
      surface.replaceChildren(copy);
      surface.dataset.fit = page.dataset.fit ?? 'cover';
      surface.dataset.tone = page.dataset.tone ?? 'ink';
      // Match the static page's spine shading before and after the handoff.
      surface.dataset.position = index === 0 || (index !== lastIndex && index % 2 === 0)
        ? 'right' : 'left';
      surface.style.setProperty(
        '--magazine-photo-position',
        page.style.getPropertyValue('--magazine-photo-position'),
      );
      // A decoded source does not guarantee that a new image element is
      // paintable. Prepare the clone before exposing its paper background.
      return image ? decodeImage(image) : Promise.resolve();
    };

    const drawPaperShadows = (
      surfaces: TurnSurfaces,
      fold: PaperFold,
      direction: 'next' | 'previous',
      pageWidth: number,
      pageHeight: number,
    ) => {
      const { turnShadow, turnInnerShadow } = surfaces;
      const start = fold.sideIntersect ?? fold.topIntersect;
      const end = fold.sideIntersect ? fold.bottomIntersect : fold.bottomIntersect;
      if (!start || !end) {
        turnShadow.style.display = 'none';
        turnInnerShadow.style.display = 'none';
        return;
      }

      const segmentLength = distanceBetween(start, end);
      if (!Number.isFinite(segmentLength) || segmentLength < 0.01) return;
      const baseAngle = Math.acos(Math.max(-1, Math.min(1, (end.x - start.x) / segmentLength)));
      const shadowAngle = (direction === 'next' ? baseAngle : Math.PI - baseAngle) + 3 * Math.PI / 2;
      const progress = Math.abs(((fold.position.x - pageWidth) / (2 * pageWidth)) * 100);
      const shadowWidth = Math.max(1, pageWidth * 0.75 * progress / 100);
      const opacity = Math.max(0, (100 - progress) * 0.0035);
      const globalPosition = toBookPoint(start, direction, pageWidth);

      const outerTranslate = direction === 'previous' ? shadowWidth : 0;
      const outerArea: PaperPoint[] = [
        { x: 0, y: 0 },
        { x: pageWidth, y: 0 },
        { x: pageWidth, y: pageHeight },
        { x: 0, y: pageHeight },
      ];
      turnShadow.style.display = 'block';
      turnShadow.style.width = `${shadowWidth}px`;
      turnShadow.style.height = `${pageHeight * 2}px`;
      turnShadow.style.background = direction === 'next'
        ? `linear-gradient(to right, rgb(0 0 0 / ${opacity}), transparent)`
        : `linear-gradient(to left, rgb(0 0 0 / ${opacity}), transparent)`;
      turnShadow.style.transformOrigin = `${outerTranslate}px 100px`;
      turnShadow.style.transform = `translate(${globalPosition.x - outerTranslate}px, ${globalPosition.y - 100}px) rotate(${shadowAngle}rad)`;
      turnShadow.style.clipPath = shadowClipPath(
        outerArea,
        start,
        outerTranslate,
        shadowAngle,
        direction,
      );

      const innerWidth = Math.max(1, shadowWidth * 0.75);
      const innerTranslate = direction === 'next' ? innerWidth : 0;
      const turnedArea = [
        fold.rect.topLeft,
        fold.rect.topRight,
        fold.rect.bottomRight,
        fold.rect.bottomLeft,
      ];
      turnInnerShadow.style.display = 'block';
      turnInnerShadow.style.width = `${innerWidth}px`;
      turnInnerShadow.style.height = `${pageHeight * 2}px`;
      turnInnerShadow.style.background = direction === 'next'
        ? `linear-gradient(to left, rgb(0 0 0 / ${opacity}) 5%, rgb(0 0 0 / 0.05) 15%, rgb(0 0 0 / ${opacity}) 35%, transparent 100%)`
        : `linear-gradient(to right, rgb(0 0 0 / ${opacity}) 5%, rgb(0 0 0 / 0.05) 15%, rgb(0 0 0 / ${opacity}) 35%, transparent 100%)`;
      turnInnerShadow.style.transformOrigin = `${innerTranslate}px 100px`;
      turnInnerShadow.style.transform = `translate(${globalPosition.x - innerTranslate}px, ${globalPosition.y - 100}px) rotate(${shadowAngle}rad)`;
      turnInnerShadow.style.clipPath = shadowClipPath(
        turnedArea,
        start,
        innerTranslate,
        shadowAngle,
        direction,
      );
    };

    const drawSoftTurn = (
      surfaces: TurnSurfaces,
      progress: number,
      direction: 'next' | 'previous',
      pageWidth: number,
      pageHeight: number,
    ) => {
      const { turnPage, turnBottom } = surfaces;
      const margin = Math.min(pageHeight / 10, pageWidth * 0.16);
      const eased = easePageTurn(Math.min(progress, 0.999));
      const localPosition = {
        x: pageWidth - margin + (-2 * pageWidth + margin) * eased,
        y: pageHeight - margin + margin * eased,
      };
      const fold = calculatePaperFold(localPosition, pageWidth, pageHeight);
      if (!fold) return;

      const pagePosition = direction === 'next' ? fold.rect.topLeft : fold.rect.topRight;
      const pageAngle = direction === 'next' ? -fold.angle : fold.angle;
      const globalPagePosition = toBookPoint(pagePosition, direction, pageWidth);
      turnPage.style.transform = `translate(${globalPagePosition.x}px, ${globalPagePosition.y}px) rotate(${pageAngle}rad)`;
      turnPage.style.clipPath = paperClipPath(
        fold.flippingArea,
        pagePosition,
        pageAngle,
        direction,
      );

      const bottomPosition = direction === 'next'
        ? { x: 0, y: 0 }
        : { x: pageWidth, y: 0 };
      turnBottom.style.clipPath = paperClipPath(
        fold.bottomArea,
        bottomPosition,
        0,
        direction,
        true,
      );

      drawPaperShadows(surfaces, fold, direction, pageWidth, pageHeight);
    };

    const redrawTurns = () => {
      if (activeTurns.length === 0) return;
      const { width, height: pageHeight } = book.getBoundingClientRect();
      const pageWidth = width / 2;
      activeTurns.forEach((turn) => {
        drawSoftTurn(turn, turn.progress, turn.direction, pageWidth, pageHeight);
      });
    };

    const clearTurns = () => {
      if (turnFrame !== undefined) cancelAnimationFrame(turnFrame);
      turnFrame = undefined;
      activeTurns.forEach((turn) => turn.layer.remove());
      activeTurns.length = 0;
      turnBuffer.length = 0;
      magazine.classList.remove('is-turning');
    };

    const updateNavigation = () => {
      previous.disabled = currentIndex === 0;
      next.disabled = visibleIndices(currentIndex).at(-1) === lastIndex;
    };

    const render = (updateVisuals = true) => {
      currentIndex = normalizeIndex(currentIndex);
      const visible = visibleIndices(currentIndex);
      if (isFullscreen()) {
        const selectedPhoto = new URLSearchParams(window.location.search).get('photo');
        const selectedIsVisible = visible.some((index) => pages[index]?.dataset.photoId === selectedPhoto);
        setPhotoUrl(selectedIsVisible ? selectedPhoto : pages[currentIndex]?.dataset.photoId ?? null);
      }
      const visibleSet = new Set(visible);
      preloadAround(visible);
      if (isFullscreen()) {
        visible.forEach((index) => void loadExpandedPage(index));
        preloadNextExpandedTurn(visible);
      }

      const latestTurn = activeTurns.at(-1);
      // Navigation can run ahead while images load. Only prepared sheets
      // may replace the spread that is actually being painted.
      const positions = positionsFor(visibleIndices(latestTurn?.toIndex ?? settledIndex));
      if (latestTurn) {
        // The receiving side stays on the last landed sheet; the other side
        // reveals the newest destination beneath the moving sheets.
        const receivingSide = latestTurn.direction === 'next' ? 'left' : 'right';
        positions.forEach((position, index) => {
          if (position === receivingSide) positions.delete(index);
        });
        positionsFor(visibleIndices(settledIndex)).forEach((position, index) => {
          if (position === receivingSide) positions.set(index, position);
        });
      }
      if (updateVisuals) setVisualPages(positions);
      pages.forEach((page, index) => {
        const active = visibleSet.has(index);
        page.setAttribute('aria-hidden', String(!active));
        page.toggleAttribute('inert', !active);
      });

      const endIndex = visible.at(-1) ?? currentIndex;
      updateNavigation();
      // Preserve the chosen page within a spread so native arrow keys can
      // reach both pages without snapping the slider to the spread's end.
      if (!visible.includes(progress.valueAsNumber - 1)) {
        progress.value = String(endIndex + 1);
      }
      progress.disabled = pages.length < 2;
      progress.setAttribute('aria-valuetext', `${pageLabel} ${progress.value} ${ofLabel} ${pages.length}`);
      const percentage = lastIndex > 0 ? (progress.valueAsNumber - 1) / lastIndex * 100 : 0;
      progress.style.backgroundSize = `${percentage}% var(--space-3xs), 100% var(--space-3xs)`;
      count.value = visible.length === 1
        ? `${pageLabel} ${currentIndex + 1} ${ofLabel} ${pages.length}`
        : `${pagesLabel} ${currentIndex + 1}-${endIndex + 1} ${ofLabel} ${pages.length}`;
      compactCount.textContent = visible.length === 1
        ? `${currentIndex + 1} / ${pages.length}`
        : `${currentIndex + 1}-${endIndex + 1} / ${pages.length}`;
    };

    const advanceTurn = (turn: ActiveTurn, now: number) => {
      if (now <= turn.updatedAt) return;
      turn.progress = Math.min(1, turn.progress + (now - turn.updatedAt) / turn.duration);
      turn.updatedAt = now;
    };

    const drawTurns = (now: number) => {
      turnFrame = undefined;
      if (signal.aborted) return;
      const started = Boolean(turnBuffer[0]?.surfaces);
      // Measure once before writing any sheet styles, even during rapid flipping.
      const { width, height: pageHeight } = book.getBoundingClientRect();
      const pageWidth = width / 2;
      flushTurnBuffer(now);
      let landed = false;
      activeTurns.forEach((turn) => {
        advanceTurn(turn, now);
        // Before crossing the spine, earlier sheets sit on top. After it,
        // later sheets stack above the sheets that are landing.
        const order = turn.progress < 0.5
          ? turnSequence - turn.sequence + 1
          : turnSequence + turn.sequence + 1;
        turn.layer.style.zIndex = `calc(var(--layer-overlay) + ${order})`;
        drawSoftTurn(turn, turn.progress, turn.direction, pageWidth, pageHeight);
      });
      while (activeTurns[0]?.progress === 1) {
        const turn = activeTurns.shift()!;
        settledIndex = turn.toIndex;
        turn.layer.remove();
        landed = true;
      }
      if (activeTurns.length > 0) {
        turnFrame = requestAnimationFrame(drawTurns);
      } else {
        magazine.classList.toggle('is-turning', turnBuffer.length > 0);
      }
      // Replace the static outgoing page only after its clipped turn surface
      // has been mounted and drawn, so both changes reach the same paint.
      if (landed || started) render();
    };

    const prepareTurn = async (fromIndex: number, toIndex: number): Promise<TurnSurfaces> => {
      const direction = toIndex > fromIndex ? 'next' : 'previous';
      const fromIndices = visibleIndices(fromIndex);
      const toIndices = visibleIndices(toIndex);
      await Promise.all([...new Set([...fromIndices, ...toIndices])].map(async (index) => {
        await loadPage(index);
        if (isFullscreen()) await loadExpandedPage(index);
      }));
      const layer = turnLayer.cloneNode(true) as HTMLElement;
      const surfaces: TurnSurfaces = {
        layer,
        turnPage: layer.querySelector<HTMLElement>('[data-magazine-turn-page]')!,
        turnFront: layer.querySelector<HTMLElement>('[data-magazine-turn-front]')!,
        turnBottom: layer.querySelector<HTMLElement>('[data-magazine-turn-bottom]')!,
        turnShadow: layer.querySelector<HTMLElement>('[data-magazine-turn-shadow]')!,
        turnInnerShadow: layer.querySelector<HTMLElement>('[data-magazine-turn-inner-shadow]')!,
      };
      await Promise.all([
        copyPageToSurface(direction === 'next' ? toIndices[0] : toIndices.at(-1)!, surfaces.turnFront),
        copyPageToSurface(direction === 'next' ? fromIndices.at(-1)! : fromIndices[0], surfaces.turnBottom),
      ]);
      layer.dataset.direction = direction;
      return surfaces;
    };

    const startTurn = (request: BufferedTurn, startedAt: number, duration: number) => {
      const surfaces = request.surfaces!;
      const { layer } = surfaces;
      const direction = request.toIndex > request.fromIndex ? 'next' : 'previous';
      layer.hidden = false;
      book.append(layer);
      const turn: ActiveTurn = {
        ...surfaces, toIndex: request.toIndex, direction, sequence: ++turnSequence,
        progress: 0, startedAt, updatedAt: startedAt, duration,
      };
      activeTurns.push(turn);
    };

    const flushTurnBuffer = (now: number) => {
      const requests: BufferedTurn[] = [];
      // Preserve input order even if a later spread finishes decoding first.
      while (turnBuffer[0]?.surfaces) requests.push(turnBuffer.shift()!);
      if (requests.length === 0) return;
      const styles = getComputedStyle(magazine);
      const normalDuration = durationInMilliseconds(styles.getPropertyValue('--dur-page-turn'), 720);
      const minimumDuration = durationInMilliseconds(styles.getPropertyValue('--dur-long'), 420);
      const fanDuration = durationInMilliseconds(styles.getPropertyValue('--dur-micro'), 120);
      const sheetCount = activeTurns.length + requests.length;
      const duration = Math.max(minimumDuration, normalDuration / (1 + (sheetCount - 1) * 0.2));
      const spacing = fanDuration / Math.max(3, requests.length);

      activeTurns.forEach((turn) => {
        advanceTurn(turn, now);
        // Speed up the whole stack without rushing older sheets to the end.
        // Their progress stays ahead of the newer sheets throughout the turn.
        turn.duration = Math.min(turn.duration, duration);
      });

      requests.forEach((request) => {
        const previousTurn = activeTurns.at(-1);
        const startedAt = Math.max(now, previousTurn ? previousTurn.startedAt + spacing : now);
        startTurn(request, startedAt, duration);
      });
    };

    const showWithoutMotion = () => {
      const targetIndex = currentIndex;
      clearTurns();
      render();
      void Promise.all(visibleIndices(targetIndex).map(async (pageIndex) => {
        await loadPage(pageIndex);
        if (isFullscreen()) await loadExpandedPage(pageIndex);
      })).then(() => {
        if (signal.aborted || currentIndex !== targetIndex) return;
        settledIndex = targetIndex;
        render();
      });
    };

    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) showWithoutMotion();
    }, { signal });

    const goTo = (index: number) => {
      const nextIndex = normalizeIndex(index);
      if (signal.aborted) return;
      if (nextIndex === currentIndex) {
        // Moving between the two pages of one spread still updates the
        // slider, without interrupting a turn already in progress.
        render(false);
        return;
      }
      const fromIndex = currentIndex;
      resetZoom();
      currentIndex = nextIndex;
      if (reducedMotion.matches) {
        showWithoutMotion();
      } else {
        const request: BufferedTurn = { fromIndex, toIndex: nextIndex };
        turnBuffer.push(request);
        magazine.classList.add('is-turning');
        void prepareTurn(fromIndex, nextIndex).then((surfaces) => {
          if (signal.aborted || !turnBuffer.includes(request)) return;
          request.surfaces = surfaces;
          if (turnFrame === undefined) turnFrame = requestAnimationFrame(drawTurns);
        });
      }
      render(false);
    };

    const goPrevious = () => goTo(currentIndex > 1 ? currentIndex - 2 : currentIndex - 1);
    const goNext = () => goTo(currentIndex > 0 ? currentIndex + 2 : currentIndex + 1);

    const syncFullscreenState = () => {
      const active = isFullscreen();
      const label = active
        ? magazine.dataset.exitFullscreenLabel ?? ''
        : magazine.dataset.fullscreenLabel ?? '';
      magazine.classList.toggle('is-fullscreen', active);
      fullscreen?.setAttribute('aria-label', label);
      fullscreen?.setAttribute('title', label);
      if (fullscreenText) fullscreenText.textContent = label;
      zoomControls.hidden = !active;
      pointerId = undefined;
      pointerCaptured = false;
      magazine.classList.remove('is-dragging');
      if (active) {
        revealControls();
        render();
      } else {
        setPhotoUrl(null);
        clearTimeout(controlsIdleTimer);
        magazine.classList.remove('is-controls-active');
        restorePageSources();
      }
      resetZoom();
      redrawTurns();
    };

    const enterFallbackFullscreen = () => {
      magazine.classList.add('is-expanded');
      document.body.classList.add('magazine-expanded');
      syncFullscreenState();
      magazine.focus({ preventScroll: true });
    };

    const exitFallbackFullscreen = () => {
      magazine.classList.remove('is-expanded');
      document.body.classList.remove('magazine-expanded');
      syncFullscreenState();
      fullscreen?.focus({ preventScroll: true });
    };

    previous.addEventListener('click', () => void goPrevious(), { signal });
    next.addEventListener('click', () => void goNext(), { signal });
    progress.addEventListener('input', () => goTo(progress.valueAsNumber - 1), { signal });

    magazine.addEventListener('keydown', (event) => {
      if (isFallbackExpanded() && event.key === 'Escape') {
        event.preventDefault();
        exitFallbackFullscreen();
        return;
      }
      // Let the native slider handle arrows, Home, End and Page Up/Down.
      if (event.target === progress) return;
      if (isFullscreen() && (event.key === '+' || event.key === '=')) {
        event.preventDefault();
        setScale(scale + 0.25);
        return;
      }
      if (isFullscreen() && (event.key === '-' || event.key === '_')) {
        event.preventDefault();
        setScale(scale - 0.25);
        return;
      }
      if (isFullscreen() && event.key === '0') {
        event.preventDefault();
        resetZoom();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        void goPrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        void goNext();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        void goTo(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        void goTo(lastIndex);
      }
    }, { signal });

    book.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary) return;
      pointerId = event.pointerId;
      if (isFullscreen() && scale > minimumScale) {
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        pointerCaptured = true;
        book.setPointerCapture(event.pointerId);
        magazine.classList.add('is-dragging');
        return;
      }
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerCaptured = false;
    }, { signal });

    book.addEventListener('pointermove', (event) => {
      if (pointerId !== event.pointerId) return;
      if (isFullscreen() && scale > minimumScale) {
        translateX += event.clientX - lastPointerX;
        translateY += event.clientY - lastPointerY;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        renderZoom();
        return;
      }
      if (pointerCaptured) return;
      const distanceX = event.clientX - pointerStartX;
      const distanceY = event.clientY - pointerStartY;
      if (Math.abs(distanceX) <= 8 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
      pointerCaptured = true;
      book.setPointerCapture(event.pointerId);
    }, { signal });

    const finishPointer = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const wasPanning = isFullscreen() && scale > minimumScale;
      const distanceX = event.clientX - pointerStartX;
      const distanceY = event.clientY - pointerStartY;
      pointerId = undefined;
      pointerCaptured = false;
      magazine.classList.remove('is-dragging');
      if (wasPanning) return;
      if (Math.abs(distanceX) < 48 || Math.abs(distanceX) <= Math.abs(distanceY) * 1.2) return;
      if (distanceX < 0) void goNext();
      else void goPrevious();
    };

    book.addEventListener('pointerup', finishPointer, { signal });
    book.addEventListener('pointercancel', (event) => {
      if (pointerId !== event.pointerId) return;
      pointerId = undefined;
      pointerCaptured = false;
      magazine.classList.remove('is-dragging');
    }, { signal });

    zoomOut.addEventListener('click', () => setScale(scale - 0.25), { signal });
    zoomIn.addEventListener('click', () => setScale(scale + 0.25), { signal });
    zoomReset.addEventListener('click', resetZoom, { signal });

    book.addEventListener('dblclick', (event) => {
      if (!isFullscreen()) return;
      event.preventDefault();
      setScale(scale === minimumScale ? 2 : minimumScale);
    }, { signal });

    viewport.addEventListener('wheel', (event) => {
      if (!isFullscreen()) return;
      event.preventDefault();
      setScale(scale + (event.deltaY < 0 ? 0.25 : -0.25));
    }, { passive: false, signal });

    const touchDistance = (touches: TouchList) => {
      const first = touches[0];
      const second = touches[1];
      return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
    };

    viewport.addEventListener('touchstart', (event) => {
      if (!isFullscreen() || event.touches.length !== 2) return;
      event.preventDefault();
      pinchStartDistance = touchDistance(event.touches);
      pinchStartScale = scale;
      pointerId = undefined;
      pointerCaptured = false;
      magazine.classList.remove('is-dragging');
    }, { passive: false, signal });

    viewport.addEventListener('touchmove', (event) => {
      if (!isFullscreen() || event.touches.length !== 2 || pinchStartDistance === 0) return;
      event.preventDefault();
      setScale(pinchStartScale * touchDistance(event.touches) / pinchStartDistance);
    }, { passive: false, signal });

    const finishPinch = (event: TouchEvent) => {
      if (event.touches.length < 2) pinchStartDistance = 0;
    };

    const handleResize = () => {
      book.style.removeProperty('width');
      baseBookWidth = book.offsetWidth;
      renderZoom();
      redrawTurns();
    };

    viewport.addEventListener('touchend', finishPinch, { signal });
    viewport.addEventListener('touchcancel', finishPinch, { signal });
    window.addEventListener('resize', handleResize, { signal });

    if (fullscreen && fullscreenText) {
      fullscreen.hidden = false;
      fullscreen.addEventListener('click', () => {
        if (document.fullscreenElement === magazine) {
          void document.exitFullscreen();
          return;
        }
        if (isFallbackExpanded()) {
          exitFallbackFullscreen();
          return;
        }
        if (typeof magazine.requestFullscreen !== 'function') {
          enterFallbackFullscreen();
          return;
        }
        try {
          void magazine.requestFullscreen().catch(enterFallbackFullscreen);
        } catch {
          enterFallbackFullscreen();
        }
      }, { signal });

      document.addEventListener('fullscreenchange', syncFullscreenState, { signal });
    }

    signal.addEventListener('abort', () => {
      clearTimeout(controlsIdleTimer);
      clearTurns();
      magazine.classList.remove('is-expanded', 'is-fullscreen', 'is-controls-active');
      document.body.classList.remove('magazine-expanded');
    }, { once: true });

    const readPhotoUrl = () => {
      const id = new URLSearchParams(window.location.search).get('photo');
      if (!id) {
        if (isFallbackExpanded()) exitFallbackFullscreen();
        else if (document.fullscreenElement === magazine) void document.exitFullscreen();
        return;
      }
      const index = pages.findIndex((page) => page.dataset.photoId === id);
      if (index < 0) return;
      clearTurns();
      currentIndex = normalizeIndex(index);
      settledIndex = currentIndex;
      // Native fullscreen requires a user gesture; deep links use the same
      // expanded reader layout, with native fullscreen still available.
      if (!isFullscreen()) enterFallbackFullscreen();
      else render();
    };
    window.addEventListener('popstate', readPhotoUrl, { signal });
    readPhotoUrl();
    render();
  });
};

document.addEventListener('astro:page-load', setupMagazines);

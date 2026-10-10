/** Keep viewer state shareable without losing filters or the language switch. */
export function setPhotoUrl(photo: string | null) {
  const url = new URL(window.location.href);
  if (photo) url.searchParams.set('photo', photo);
  else url.searchParams.delete('photo');
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  document.querySelectorAll<HTMLAnchorElement>('[data-language-link]').forEach((link) => {
    const alternate = new URL(link.href);
    alternate.search = url.search;
    link.href = alternate.href;
  });
}

import { normalizePhotoSearch } from './photoSearch.ts';

/** The filter only needs search fields, independent of image delivery and rendering. */
export interface SearchablePhoto {
  folder: string;
  tags: readonly string[];
  search: string;
}

interface PhotoFilters {
  query: string;
  tags: Iterable<string>;
  folder: string;
}

export function createPhotoTagAliases(tags: Iterable<string>, translations: Record<string, string>[]) {
  const aliases = new Map<string, string>();
  for (const tag of tags) aliases.set(normalizePhotoSearch(tag.replace(/-/g, ' ')), tag);
  for (const translation of translations) {
    for (const [tag, label] of Object.entries(translation)) {
      aliases.set(normalizePhotoSearch(label), tag);
    }
  }
  return aliases;
}

export function filterPhotos<T extends SearchablePhoto>(
  photos: readonly T[],
  filters: PhotoFilters,
  aliases: ReadonlyMap<string, string>,
): T[] {
  const query = normalizePhotoSearch(filters.query.trim());
  const queryTag = aliases.get(query);
  const words = queryTag ? [] : query.split(/\s+/).filter(Boolean);
  const tags = [...filters.tags];
  if (queryTag) tags.push(queryTag);
  return photos.filter((photo) => (!filters.folder || photo.folder === filters.folder)
    && tags.every((tag) => photo.tags.includes(tag))
    && words.every((word) => {
      const tag = aliases.get(word);
      return tag ? photo.tags.includes(tag) : photo.search.includes(word);
    }));
}

import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { photoGalleries } from './photoGalleries';
import { photoAnnotations, photoTags, type PhotoTag } from './photoTags';
import { ui, type Lang } from '../i18n/content';
import { normalizePhotoSearch } from '../utils/photoSearch';

export const PHOTO_BATCH_SIZE = 18;
export const photoGridSizes = '(min-width: 80rem) 18vw, (min-width: 60rem) 23vw, (min-width: 40rem) 30vw, 46vw';

const modules = import.meta.glob<{ default: ImageMetadata }>([
  '../assets/photography/galleries/**/*.jpg',
  '../assets/photography/archive/**/*.jpg',
], { eager: true });

// Magazine assets stay in galleries; an archive override replaces only that series in the grid.
const replacedGalleryFolders = new Set(photoGalleries.filter(({ archiveFolder }) => archiveFolder).map(({ assetFolder }) => assetFolder));
const sourcePhotos = Object.entries(modules).flatMap(([path, module]) => {
  const isGalleryAsset = path.includes('/galleries/');
  const id = path.split(isGalleryAsset ? '/galleries/' : '/archive/')[1];
  const separator = id.lastIndexOf('/');
  const folder = id.slice(0, separator);
  const filename = id.slice(separator + 1);
  if (isGalleryAsset && replacedGalleryFolders.has(folder)) return [];
  const annotation = photoAnnotations[id];
  if (!annotation || !annotation.tags.length || !annotation.alt.en.trim() || !annotation.alt.es.trim() || annotation.tags.some((tag) => !photoTags.includes(tag))) {
    throw new Error(`Add reviewed tags and bilingual alt text for ${id} in src/data/photoTags.ts`);
  }
  const gallery = photoGalleries.find(({ assetFolder, archiveFolder }) => (isGalleryAsset ? assetFolder : archiveFolder) === folder);
  return [{ id, folder, filename, image: module.default, annotation, gallery }];
});

for (const gallery of photoGalleries) {
  if (gallery.archiveFolder && !sourcePhotos.some(({ folder }) => folder === gallery.archiveFolder)) {
    throw new Error(`Missing archive photographs for ${gallery.slug} in src/assets/photography/archive/${gallery.archiveFolder}`);
  }
}

// Round-robin series, cover first: the opening batch represents the whole archive.
const folders = [...new Set([...photoGalleries.map(({ assetFolder, archiveFolder }) => archiveFolder ?? assetFolder), ...sourcePhotos.map(({ folder }) => folder)])];
const groups = folders.map((folder) => sourcePhotos.filter((photo) => photo.folder === folder).sort((a, b) => {
  if (a.filename === a.gallery?.coverFilename) return -1;
  if (b.filename === b.gallery?.coverFilename) return 1;
  return a.filename.localeCompare(b.filename, 'en', { numeric: true });
}));
export const archivePhotos = Array.from({ length: Math.max(...groups.map((group) => group.length)) }, (_, index) =>
  groups.flatMap((group) => group[index] ? [group[index]] : []),
).flat();

export interface ArchivePhoto {
  id: string;
  filename: string;
  src: string;
  srcset: string;
  width: number;
  height: number;
  viewer: string;
  alt: string;
  title: string;
  tags: readonly PhotoTag[];
  tagLabel: string;
  search: string;
}

const assets = new Map<string, Promise<{ src: string; srcset: string; viewer: string }>>();

export async function prepareArchivePhotos(lang: Lang, photos = archivePhotos): Promise<ArchivePhoto[]> {
  return Promise.all(photos.map(async (photo) => {
    let optimized = assets.get(photo.id);
    if (!optimized) {
      optimized = Promise.all([240, 480, 720, 1600].map((width) => getImage({
        src: photo.image, width: Math.min(width, photo.image.width), format: 'webp', quality: 80,
      }))).then((variants) => ({
        src: variants[1].src,
        srcset: variants.slice(0, 3).map((variant) => `${variant.src} ${variant.attributes.width}w`).join(', '),
        viewer: variants[3].src,
      }));
      assets.set(photo.id, optimized);
    }
    const title = photo.gallery?.content[lang].cardTitle ?? (photo.folder === 'cat-achira' ? 'Achira' : ui[lang].photography.grid.archive);
    return {
      id: photo.id, filename: photo.filename, ...await optimized,
      width: photo.image.width, height: photo.image.height,
      alt: photo.annotation.alt[lang], title,
      tags: photo.annotation.tags,
      tagLabel: photo.annotation.tags.slice(0, 2).map((tag) => ui[lang].photography.grid.tags[tag]).join(' · '),
      search: normalizePhotoSearch([
        photo.folder.replace(/[/_-]/g, ' '), photo.filename.replace(/[_-]/g, ' '), title,
        ...Object.values(photo.annotation.alt),
        ...photo.annotation.tags.flatMap((tag) => [tag.replace(/-/g, ' '), ui.en.photography.grid.tags[tag], ui.es.photography.grid.tags[tag]]),
      ].join(' ')),
    };
  }));
}

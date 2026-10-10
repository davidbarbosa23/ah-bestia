import { getPhotoStory } from './photoStories';
import { resolvePhotoMagazine } from '../services/photoMagazine';
import { photoImageModules as imageModules } from './photoAssets';
import { galleryDefinitions } from './galleryDefinitions';
import type { MagazineConfig, PhotoGallery } from '../types/photos';

export type { GalleryImage, MagazinePage, PhotoGallery, PhotoMagazine } from '../types/photos';

const magazineConfigs = import.meta.glob<MagazineConfig>('./magazines/*.json', {
  eager: true,
  import: 'default',
});

const naturalFilenameOrder = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

export const photoGalleries: PhotoGallery[] = galleryDefinitions.map((definition) => {
  const folderMarker = `/${definition.assetSource ?? 'galleries'}/${definition.assetFolder}/`;
  const images = Object.entries(imageModules)
    .filter(([path]) => path.includes(folderMarker))
    .map(([path, module]) => ({
      filename: path.split('/').at(-1) ?? path,
      image: module.default,
    }))
    .sort((a, b) => naturalFilenameOrder.compare(a.filename, b.filename));

  const cover = images.find(
    ({ filename }) => filename === definition.coverFilename,
  )?.image;

  if (!cover) {
    throw new Error(
      `Missing cover image ${definition.coverFilename} for ${definition.slug}`,
    );
  }

  const indexDetail = images.find(
    ({ filename }) => filename === definition.indexDetailFilename,
  )?.image;

  if (!indexDetail) {
    throw new Error(
      `Missing index detail image ${definition.indexDetailFilename} for ${definition.slug}`,
    );
  }

  const magazine = resolvePhotoMagazine(definition.slug, magazineConfigs[`./magazines/${definition.slug}.json`], images);

  const story = magazine ? [] : getPhotoStory(definition.slug, images);
  if (story.length && story[0].photos[0].filename !== definition.coverFilename) {
    throw new Error(`Photo story for ${definition.slug} must open with its cover`);
  }
  return { ...definition, cover, indexDetail, images, magazine, story };
});

// Published reading order stays stable; the homepage retains its current curated layout.
export const photoSequence = [
  'spain-in-transit',
  'random',
  'autodromo',
  'motocross',
  'dogs',
  'umbra',
  'self-portrait',
].map((slug) => {
  const gallery = photoGalleries.find((item) => item.slug === slug);
  if (!gallery)
    throw new Error(`Missing gallery in published sequence: ${slug}`);
  return gallery;
});

export function getNextGallery(slug: string) {
  const currentIndex = photoSequence.findIndex(
    (gallery) => gallery.slug === slug,
  );
  return photoSequence[(currentIndex + 1) % photoSequence.length];
}

export function getPreviousGallery(slug: string) {
  const currentIndex = photoSequence.findIndex(
    (gallery) => gallery.slug === slug,
  );
  return photoSequence[
    (currentIndex - 1 + photoSequence.length) % photoSequence.length
  ];
}

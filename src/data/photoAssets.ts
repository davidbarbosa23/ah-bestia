import type { ImageMetadata } from 'astro';

/** One build-time asset catalogue shared by the series and archive loaders. */
export const photoImageModules = import.meta.glob<{ default: ImageMetadata }>([
  '../assets/photography/galleries/**/*.jpg',
  '../assets/photography/archive/**/*.jpg',
], { eager: true });

import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/content';
import type { PhotoTag } from '../data/photoTags';

interface GalleryCopy {
  title: string;
  cardTitle: string;
  description: string;
  location: string;
}

export interface GalleryDefinition {
  slug: string;
  assetFolder: string;
  assetSource?: 'archive';
  sourceFolder: string;
  /** Use standalone photographs from this archive folder instead of the gallery's composed pages. */
  archiveFolder?: string;
  coverFilename: string;
  indexDetailFilename: string;
  content: Record<Lang, GalleryCopy>;
}

type MagazinePageFit = 'cover' | 'contain';
type MagazinePageTone = 'paper' | 'ink';

interface MagazinePageConfig {
  image: string;
  fit?: MagazinePageFit;
  position?: string;
  tone?: MagazinePageTone;
  alt?: Partial<Record<Lang, string>>;
}

export interface MagazineConfig {
  pageSize?: {
    width: number;
    height: number;
  };
  pages: MagazinePageConfig[];
}

export interface GalleryImage {
  filename: string;
  image: ImageMetadata;
}

export interface MagazinePage extends MagazinePageConfig {
  imageAsset: ImageMetadata;
  fit: MagazinePageFit;
  position: string;
  tone: MagazinePageTone;
}

export interface PhotoMagazine {
  pageSize: {
    width: number;
    height: number;
  };
  pages: MagazinePage[];
}

export interface PhotoGallery extends GalleryDefinition {
  cover: ImageMetadata;
  indexDetail: ImageMetadata;
  images: GalleryImage[];
  magazine?: PhotoMagazine;
  story: PhotoStorySpread[];
}

export interface PhotoStorySpread {
  layout: 'pair' | 'feature' | 'wide';
  photos: (GalleryImage & { alt: Record<Lang, string> })[];
}

export interface ArchivePhoto {
  id: string;
  folder: string;
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

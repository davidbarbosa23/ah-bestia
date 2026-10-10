import type { GalleryImage, MagazineConfig, PhotoMagazine } from '../types/photos';

/** Resolve authored pages against supplied assets without coupling validation to Vite. */
export function resolvePhotoMagazine(
  slug: string,
  magazineConfig: MagazineConfig | undefined,
  images: readonly GalleryImage[],
): PhotoMagazine | undefined {
  if (!magazineConfig) return undefined;
  const pageSize = magazineConfig.pageSize ?? { width: 3, height: 4 };
  if (pageSize.width <= 0 || pageSize.height <= 0) {
    throw new Error(`Invalid magazine page size for ${slug}`);
  }
  if (!Array.isArray(magazineConfig.pages) || magazineConfig.pages.length === 0) {
    throw new Error(`Magazine ${slug} must include at least one page`);
  }

  return {
    pageSize,
    pages: magazineConfig.pages.map((page, index) => {
      const imageAsset = images.find(({ filename }) => filename === page.image)?.image;
      if (!imageAsset) {
        throw new Error(`Missing magazine image ${page.image} on page ${index + 1} for ${slug}`);
      }
      if (page.fit && !['cover', 'contain'].includes(page.fit)) {
        throw new Error(`Invalid fit on page ${index + 1} for ${slug}`);
      }
      if (page.tone && !['paper', 'ink'].includes(page.tone)) {
        throw new Error(`Invalid tone on page ${index + 1} for ${slug}`);
      }

      return {
        ...page,
        imageAsset,
        fit: page.fit ?? 'cover',
        position: page.position ?? '50% 50%',
        tone: page.tone ?? 'ink',
      };
    }),
  };
}

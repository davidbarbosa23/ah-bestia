import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/content';

interface GalleryCopy {
  title: string;
  cardTitle: string;
  description: string;
  location: string;
}

interface GalleryDefinition {
  slug: string;
  assetFolder: string;
  sourceFolder: string;
  coverFilename: string;
  indexDetailFilename: string;
  content: Record<Lang, GalleryCopy>;
}

interface ImageModule {
  default: ImageMetadata;
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

interface MagazineConfig {
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
}

const imageModules = import.meta.glob<ImageModule>(
  '../assets/photography/galleries/**/*.jpg',
  { eager: true },
);

const magazineConfigs = import.meta.glob<MagazineConfig>('./magazines/*.json', {
  eager: true,
  import: 'default',
});

const definitions: GalleryDefinition[] = [
  {
    slug: 'spain-in-transit',
    assetFolder: 'spain',
    sourceFolder: 'Spain',
    coverFilename: '_A741800.jpg',
    indexDetailFilename: '_A740195.jpg',
    content: {
      en: {
        title: 'Spain, in transit',
        cardTitle: 'Between stations',
        description:
          'Movement, distance, landscape, and the spaces between destinations.',
        location: 'Spain',
      },
      es: {
        title: 'España, en tránsito',
        cardTitle: 'Entre estaciones',
        description:
          'Movimiento, distancia, paisaje y los espacios entre destinos.',
        location: 'España',
      },
    },
  },
  {
    slug: 'autodromo',
    assetFolder: 'autodromo',
    sourceFolder: 'Autodromo',
    coverFilename: 'Corvette_2.jpg',
    indexDetailFilename: 'Performance.jpg',
    content: {
      en: {
        title: 'Track weather',
        cardTitle: 'Track weather',
        description:
          'Speed, color, and the quiet that settles over the circuit after rain.',
        location: 'Autódromo',
      },
      es: {
        title: 'Clima de pista',
        cardTitle: 'Clima de pista',
        description:
          'Velocidad, color y la calma que queda sobre el circuito después de la lluvia.',
        location: 'Autódromo',
      },
    },
  },
  {
    slug: 'motocross',
    assetFolder: 'campeonato-distrital-mxac',
    sourceFolder: 'CampeonatoDistritalMXAC',
    coverFilename: '07.jpg',
    indexDetailFilename: '03.jpg',
    content: {
      en: {
        title: 'Suspended',
        cardTitle: 'Suspended',
        description:
          'Dust, flight, and the compressed rhythm of a district motocross championship.',
        location: 'District motocross championship',
      },
      es: {
        title: 'Suspendidos',
        cardTitle: 'Suspendidos',
        description:
          'Polvo, vuelo y el ritmo comprimido de un campeonato distrital de motocross.',
        location: 'Campeonato distrital de motocross',
      },
    },
  },
  {
    slug: 'bikes',
    assetFolder: 'bikes',
    sourceFolder: 'Bikes',
    coverFilename: '3T_Handlebar.jpg',
    indexDetailFilename: 'Trek_Frame.jpg',
    content: {
      en: {
        title: 'Machine studies',
        cardTitle: 'Machine study',
        description:
          'Bicycles observed through frame lines, components, color, and use.',
        location: 'Bicycles',
      },
      es: {
        title: 'Estudios de máquina',
        cardTitle: 'Estudio de máquina',
        description:
          'Bicicletas observadas a través de líneas, componentes, color y uso.',
        location: 'Bicicletas',
      },
    },
  },
  {
    slug: 'dogs',
    assetFolder: 'dogs',
    sourceFolder: 'Dogs',
    coverFilename: '_A746900.jpg',
    indexDetailFilename: '_A746877.jpg',
    content: {
      en: {
        title: 'After play',
        cardTitle: 'After play',
        description:
          'Portraits of attention, motion, and the shared pause that follows play.',
        location: 'Dogs',
      },
      es: {
        title: 'Después del juego',
        cardTitle: 'Después del juego',
        description:
          'Retratos de atención, movimiento y la pausa compartida después del juego.',
        location: 'Perros',
      },
    },
  },
  {
    slug: 'achira',
    assetFolder: 'cat-achira',
    sourceFolder: 'Cat_Achira',
    coverFilename: '_A745963.jpg',
    indexDetailFilename: '_A746056-2.jpg',
    content: {
      en: {
        title: 'Achira',
        cardTitle: 'Achira',
        description:
          'A small portrait study of a new arrival finding her place.',
        location: 'Portrait of a new arrival',
      },
      es: {
        title: 'Achira',
        cardTitle: 'Achira',
        description:
          'Un pequeño estudio de una recién llegada encontrando su lugar.',
        location: 'Retrato de una recién llegada',
      },
    },
  },
  {
    slug: 'random',
    assetFolder: 'random',
    sourceFolder: 'Random',
    coverFilename: '_A745670-1-3.jpg',
    indexDetailFilename: 'ASC04981.jpg',
    content: {
      en: {
        title: 'City in layers',
        cardTitle: 'City in layers',
        description:
          'An open notebook of streets, landscapes, details, and passing light.',
        location: 'Ongoing archive',
      },
      es: {
        title: 'Ciudad en capas',
        cardTitle: 'Ciudad en capas',
        description:
          'Un cuaderno abierto de calles, paisajes, detalles y luz pasajera.',
        location: 'Archivo en proceso',
      },
    },
  },
  {
    slug: 'umbra',
    assetFolder: 'Umbra',
    sourceFolder: 'Umbra',
    coverFilename: '01_portada.jpg',
    indexDetailFilename: '03.jpg',
    content: {
      en: {
        title: 'Umbra',
        cardTitle: 'Umbra',
        description:
          'An editorial portrait study shaped by shadow, texture, and a western silhouette.',
        location: 'Portrait session',
      },
      es: {
        title: 'Umbra',
        cardTitle: 'Umbra',
        description:
          'Un estudio de retrato editorial entre sombras, textura y una silueta western.',
        location: 'Sesión de retrato',
      },
    },
  },
];

const naturalFilenameOrder = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

export const photoGalleries: PhotoGallery[] = definitions.map((definition) => {
  const folderMarker = `/galleries/${definition.assetFolder}/`;
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

  const magazineConfig = magazineConfigs[`./magazines/${definition.slug}.json`];
  let magazine: PhotoMagazine | undefined;

  if (magazineConfig) {
    const pageSize = magazineConfig.pageSize ?? { width: 3, height: 4 };
    if (pageSize.width <= 0 || pageSize.height <= 0) {
      throw new Error(`Invalid magazine page size for ${definition.slug}`);
    }
    if (
      !Array.isArray(magazineConfig.pages) ||
      magazineConfig.pages.length === 0
    ) {
      throw new Error(
        `Magazine ${definition.slug} must include at least one page`,
      );
    }

    magazine = {
      pageSize,
      pages: magazineConfig.pages.map((page, index) => {
        const imageAsset = images.find(
          ({ filename }) => filename === page.image,
        )?.image;
        if (!imageAsset) {
          throw new Error(
            `Missing magazine image ${page.image} on page ${index + 1} for ${definition.slug}`,
          );
        }
        if (page.fit && !['cover', 'contain'].includes(page.fit)) {
          throw new Error(
            `Invalid fit on page ${index + 1} for ${definition.slug}`,
          );
        }
        if (page.tone && !['paper', 'ink'].includes(page.tone)) {
          throw new Error(
            `Invalid tone on page ${index + 1} for ${definition.slug}`,
          );
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

  return { ...definition, cover, indexDetail, images, magazine };
});

export function getNextGallery(slug: string) {
  const currentIndex = photoGalleries.findIndex(
    (gallery) => gallery.slug === slug,
  );
  return photoGalleries[(currentIndex + 1) % photoGalleries.length];
}

export function getPreviousGallery(slug: string) {
  const currentIndex = photoGalleries.findIndex(
    (gallery) => gallery.slug === slug,
  );
  return photoGalleries[
    (currentIndex - 1 + photoGalleries.length) % photoGalleries.length
  ];
}

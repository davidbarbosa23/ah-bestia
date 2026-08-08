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
  content: Record<Lang, GalleryCopy>;
}

interface ImageModule {
  default: ImageMetadata;
}

export interface GalleryImage {
  filename: string;
  image: ImageMetadata;
}

export interface PhotoGallery extends GalleryDefinition {
  cover: ImageMetadata;
  images: GalleryImage[];
}

const imageModules = import.meta.glob<ImageModule>(
  '../assets/photography/galleries/**/*.jpg',
  { eager: true },
);

const definitions: GalleryDefinition[] = [
  {
    slug: 'spain-in-transit',
    assetFolder: 'spain',
    sourceFolder: 'Spain',
    coverFilename: '_A741800.jpg',
    content: {
      en: {
        title: 'Spain, in transit',
        cardTitle: 'Between stations',
        description: 'Movement, distance, landscape, and the spaces between destinations.',
        location: 'Spain',
      },
      es: {
        title: 'España, en tránsito',
        cardTitle: 'Entre estaciones',
        description: 'Movimiento, distancia, paisaje y los espacios entre destinos.',
        location: 'España',
      },
    },
  },
  {
    slug: 'autodromo',
    assetFolder: 'autodromo',
    sourceFolder: 'Autodromo',
    coverFilename: '_A742114-Edit.jpg',
    content: {
      en: {
        title: 'Track weather',
        cardTitle: 'Track weather',
        description: 'Speed, color, and the quiet that settles over the circuit after rain.',
        location: 'Autódromo',
      },
      es: {
        title: 'Clima de pista',
        cardTitle: 'Clima de pista',
        description: 'Velocidad, color y la calma que queda sobre el circuito después de la lluvia.',
        location: 'Autódromo',
      },
    },
  },
  {
    slug: 'motocross',
    assetFolder: 'campeonato-distrital-mxac',
    sourceFolder: 'CampeonatoDistritalMXAC',
    coverFilename: 'ASC04047.jpg',
    content: {
      en: {
        title: 'Suspended',
        cardTitle: 'Suspended',
        description: 'Dust, flight, and the compressed rhythm of a district motocross championship.',
        location: 'District motocross championship',
      },
      es: {
        title: 'Suspendidos',
        cardTitle: 'Suspendidos',
        description: 'Polvo, vuelo y el ritmo comprimido de un campeonato distrital de motocross.',
        location: 'Campeonato distrital de motocross',
      },
    },
  },
  {
    slug: 'bikes',
    assetFolder: 'bikes',
    sourceFolder: 'Bikes',
    coverFilename: '_A741435-Edit.jpg',
    content: {
      en: {
        title: 'Machine studies',
        cardTitle: 'Machine study',
        description: 'Bicycles observed through frame lines, components, color, and use.',
        location: 'Bicycles',
      },
      es: {
        title: 'Estudios de máquina',
        cardTitle: 'Estudio de máquina',
        description: 'Bicicletas observadas a través de líneas, componentes, color y uso.',
        location: 'Bicicletas',
      },
    },
  },
  {
    slug: 'dogs',
    assetFolder: 'dogs',
    sourceFolder: 'Dogs',
    coverFilename: '_A746900.jpg',
    content: {
      en: {
        title: 'After play',
        cardTitle: 'After play',
        description: 'Portraits of attention, motion, and the shared pause that follows play.',
        location: 'Dogs',
      },
      es: {
        title: 'Después del juego',
        cardTitle: 'Después del juego',
        description: 'Retratos de atención, movimiento y la pausa compartida después del juego.',
        location: 'Perros',
      },
    },
  },
  {
    slug: 'achira',
    assetFolder: 'cat-achira',
    sourceFolder: 'Cat_Achira',
    coverFilename: '_A745963.jpg',
    content: {
      en: {
        title: 'Achira',
        cardTitle: 'Achira',
        description: 'A small portrait study of a new arrival finding her place.',
        location: 'Portrait of a new arrival',
      },
      es: {
        title: 'Achira',
        cardTitle: 'Achira',
        description: 'Un pequeño estudio de una recién llegada encontrando su lugar.',
        location: 'Retrato de una recién llegada',
      },
    },
  },
  {
    slug: 'random',
    assetFolder: 'random',
    sourceFolder: 'Random',
    coverFilename: '_A745670-1-3.jpg',
    content: {
      en: {
        title: 'City in layers',
        cardTitle: 'City in layers',
        description: 'An open notebook of streets, landscapes, details, and passing light.',
        location: 'Ongoing archive',
      },
      es: {
        title: 'Ciudad en capas',
        cardTitle: 'Ciudad en capas',
        description: 'Un cuaderno abierto de calles, paisajes, detalles y luz pasajera.',
        location: 'Archivo en proceso',
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

  const cover = images.find(({ filename }) => filename === definition.coverFilename)?.image;

  if (!cover) {
    throw new Error(`Missing cover image ${definition.coverFilename} for ${definition.slug}`);
  }

  return { ...definition, cover, images };
});

export function getNextGallery(slug: string) {
  const currentIndex = photoGalleries.findIndex((gallery) => gallery.slug === slug);
  return photoGalleries[(currentIndex + 1) % photoGalleries.length];
}

export function getPreviousGallery(slug: string) {
  const currentIndex = photoGalleries.findIndex((gallery) => gallery.slug === slug);
  return photoGalleries[(currentIndex - 1 + photoGalleries.length) % photoGalleries.length];
}

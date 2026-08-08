export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];

export const copy = {
  en: {
    meta: {
      homeTitle: 'David Barbosa — Software Engineer & Photographer',
      homeDescription:
        'Software engineer in Bogotá building thoughtful web products, with an independent photography practice.',
      projectsTitle: 'Selected projects — David Barbosa',
      projectsDescription:
        'Selected software experiments and product work by David Barbosa.',
      photoTitle: 'Spain, in transit — David Barbosa',
      photoDescription:
        'A visual note on movement, distance, landscape, and the spaces between destinations in Spain.',
    },
    nav: {
      work: 'Work',
      about: 'About',
      contact: 'Contact',
      search: 'Jump to…',
      menu: 'Menu',
    },
    modes: {
      label: 'View as',
      developer: 'Developer',
      photographer: 'Photographer',
    },
    theme: { light: 'Use light theme', dark: 'Use dark theme' },
    dev: {
      status: 'Available for thoughtful collaborations',
      title: 'I make software\nfeel considered.',
      intro:
        'I’m David Barbosa, a software engineer in Bogotá. I work where product thinking, frontend craft, and reliable systems meet.',
      primaryCta: 'Explore projects',
      secondaryCta: 'Email David',
      codeLabel: 'david.ts',
      aboutTitle: 'Pragmatic by default. Curious on purpose.',
      aboutBody:
        'I turn ambiguous product questions into clear interfaces and maintainable systems. My background spans software engineering, web development, and graphic design—so I care about how a product works, reads, and feels.',
      current: 'Currently',
      currentValue: 'Software Engineer, Mercado Libre',
      location: 'Based in',
      locationValue: 'Bogotá, Colombia',
      focus: 'Working with',
      focusValue: 'TypeScript · React · Web platforms',
      experienceTitle: 'A career built across the stack.',
      experience: [
        ['2021—NOW', 'Mercado Libre', 'Senior Software Engineer'],
        ['2019—2020', 'Quantum Connexion', 'Software Engineer'],
        ['2016—2019', 'Tradeview / iLikeWebSites', 'Web Developer & Designer'],
        ['2015—2016', 'Rampa / Data Solutions Group', 'Web Designer'],
      ],
      projectsTitle: 'Selected output, not a feature grid.',
      projectsIntro:
        'A small collection of product work and self-directed experiments. More case studies can be added without changing the route structure.',
      projectName: 'Fixed Gear Calculator',
      projectDesc:
        'A bilingual gearing calculator for track and fixed-gear riders, translating chainring and sprocket choices into ratios, skid patches, development, and speed.',
      projectMeta: 'Product experiment · Calculation UI',
      projectLink: 'Read project note',
      contactTitle: 'Have a hard problem and a clear reason to solve it?',
      contactBody:
        'Write to me with the context, the constraints, and what success should look like.',
      contactLink: 'Start a conversation',
    },
    photo: {
      status: 'Independent photographic practice',
      title: 'Light,\nheld briefly.',
      intro:
        'Machines, animals, streets, and the seconds when motion settles into form.',
      galleryTitle: 'Selected series from an ongoing archive.',
      galleryHint: 'Scroll to move through the galleries',
      openNote: 'Open visual note',
      images: [
        [
          'spain-track.jpg',
          'Between stations',
          'Spain · movement and distance',
          'spain-in-transit',
        ],
        [
          'autodromo-blue.jpg',
          'Track weather',
          'Autódromo · speed after rain',
          null,
        ],
        [
          'motocross-air.jpg',
          'Suspended',
          'District motocross championship',
          null,
        ],
        ['bike-red.jpg', 'Machine study', 'Bicycles · form and detail', null],
        ['dogs-resting.jpg', 'After play', 'Dogs · a shared pause', null],
        ['achira.jpg', 'Achira', 'Portrait of a new arrival', null],
        [
          'city-crossing.jpg',
          'City in layers',
          'Bogotá · light across an intersection',
          null,
        ],
      ],
      creditNote:
        'All photographs by David Barbosa. Selected from an ongoing personal archive.',
    },
    projects: {
      back: 'Back home',
      title: 'Projects are questions with working answers.',
      intro:
        'This archive starts with one published experiment and is structured to grow into full case studies.',
      challenge: 'Question',
      challengeText:
        'How do gear choices change cadence, speed, and skid patches on a fixed-gear bicycle?',
      answer: 'Working answer',
      answerText:
        'A compact calculator with metric and imperial units, bilingual routing, and legible numeric output.',
      status: 'Status',
      statusText: 'Published experiment',
      stack: 'Surface',
      stackText: 'Web application',
      visit: 'Ask about this project',
    },
    article: {
      back: 'Back to the contact sheet',
      kicker: 'Visual note · Spain',
      title: 'Spain, in transit',
      lede: 'A travel note about the distance between arrival and understanding a place.',
      p1: 'Travel is often remembered through destinations, but the camera keeps returning to what happens between them: a train approaching through the trees, a line of coast seen from above, or a structure briefly framing the route ahead.',
      p2: 'These photographs follow movement without trying to resolve it. Landscapes, animals, stations, and streets become markers in a sequence—less a catalogue of landmarks than a record of where attention stopped.',
      p3: 'The series remains open: a collection shaped by crossings, pauses, and the geometry of getting somewhere.',
      next: 'Next note',
      nextTitle: 'Track studies — coming soon',
    },
    footer: {
      statement: 'Code for systems. Photographs for everything they miss.',
      copyright: 'David Barbosa',
    },
  },
  es: {
    meta: {
      homeTitle: 'David Barbosa — Ingeniero de Software y Fotógrafo',
      homeDescription:
        'Ingeniero de software en Bogotá que construye productos web con criterio y desarrolla una práctica fotográfica independiente.',
      projectsTitle: 'Proyectos seleccionados — David Barbosa',
      projectsDescription:
        'Experimentos de software y trabajo de producto seleccionado por David Barbosa.',
      photoTitle: 'España, en tránsito — David Barbosa',
      photoDescription:
        'Una nota visual sobre movimiento, distancia, paisaje y los espacios entre destinos en España.',
    },
    nav: {
      work: 'Trabajo',
      about: 'Acerca',
      contact: 'Contacto',
      search: 'Ir a…',
      menu: 'Menú',
    },
    modes: {
      label: 'Ver como',
      developer: 'Desarrollador',
      photographer: 'Fotógrafo',
    },
    theme: { light: 'Usar tema claro', dark: 'Usar tema oscuro' },
    dev: {
      status: 'Disponible para colaboraciones con propósito',
      title: 'Hago que el software\nse sienta pensado.',
      intro:
        'Soy David Barbosa, ingeniero de software en Bogotá. Trabajo donde se encuentran el producto, el cuidado del frontend y los sistemas confiables.',
      primaryCta: 'Explorar proyectos',
      secondaryCta: 'Escribirle a David',
      codeLabel: 'david.ts',
      aboutTitle: 'Pragmático por defecto. Curioso a propósito.',
      aboutBody:
        'Convierto preguntas ambiguas de producto en interfaces claras y sistemas mantenibles. Mi experiencia abarca ingeniería de software, desarrollo web y diseño gráfico: me importa cómo funciona, se lee y se siente un producto.',
      current: 'Actualmente',
      currentValue: 'Ingeniero de Software, Mercado Libre',
      location: 'Desde',
      locationValue: 'Bogotá, Colombia',
      focus: 'Trabajo con',
      focusValue: 'TypeScript · React · Plataformas web',
      experienceTitle: 'Una carrera construida a través del stack.',
      experience: [
        ['2021—HOY', 'Mercado Libre', 'Ingeniero de Software Senior'],
        ['2019—2020', 'Quantum Connexion', 'Ingeniero de Software'],
        [
          '2016—2019',
          'Tradeview / iLikeWebSites',
          'Desarrollador y Diseñador Web',
        ],
        ['2015—2016', 'Rampa / Data Solutions Group', 'Diseñador Web'],
      ],
      projectsTitle: 'Trabajo seleccionado, sin cuadrículas genéricas.',
      projectsIntro:
        'Una colección pequeña de trabajo de producto y experimentos propios. La estructura está lista para sumar más casos de estudio.',
      projectName: 'Calculadora de piñón fijo',
      projectDesc:
        'Una calculadora bilingüe para ciclistas de pista y piñón fijo que traduce coronillas y piñones en proporciones, skid patches, desarrollo y velocidad.',
      projectMeta: 'Experimento de producto · Interfaz de cálculo',
      projectLink: 'Leer nota del proyecto',
      contactTitle:
        '¿Tienes un problema difícil y una buena razón para resolverlo?',
      contactBody:
        'Escríbeme con el contexto, las restricciones y cómo debería verse un buen resultado.',
      contactLink: 'Iniciar una conversación',
    },
    photo: {
      status: 'Práctica fotográfica independiente',
      title: 'La luz,\npor un instante.',
      intro:
        'Máquinas, animales, calles y los segundos en que el movimiento encuentra una forma.',
      galleryTitle: 'Series seleccionadas de un archivo en proceso.',
      galleryHint: 'Desplázate para recorrer las galerías',
      openNote: 'Abrir nota visual',
      images: [
        [
          'spain-track.jpg',
          'Entre estaciones',
          'España · movimiento y distancia',
          'spain-in-transit',
        ],
        [
          'autodromo-blue.jpg',
          'Clima de pista',
          'Autódromo · velocidad después de la lluvia',
          null,
        ],
        [
          'motocross-air.jpg',
          'Suspendido',
          'Campeonato distrital de motocross',
          null,
        ],
        [
          'bike-red.jpg',
          'Estudio de máquina',
          'Bicicletas · forma y detalle',
          null,
        ],
        [
          'dogs-resting.jpg',
          'Después del juego',
          'Perros · una pausa compartida',
          null,
        ],
        ['achira.jpg', 'Achira', 'Retrato de una recién llegada', null],
        [
          'city-crossing.jpg',
          'Ciudad en capas',
          'Bogotá · luz sobre una intersección',
          null,
        ],
      ],
      creditNote:
        'Todas las fotografías son de David Barbosa. Selección de un archivo personal en proceso.',
    },
    projects: {
      back: 'Volver al inicio',
      title: 'Los proyectos son preguntas con respuestas funcionales.',
      intro:
        'Este archivo comienza con un experimento publicado y está preparado para crecer en casos de estudio completos.',
      challenge: 'Pregunta',
      challengeText:
        '¿Cómo cambian la cadencia, la velocidad y los skid patches según la relación de una bicicleta de piñón fijo?',
      answer: 'Respuesta funcional',
      answerText:
        'Una calculadora compacta con unidades métricas e imperiales, rutas bilingües y resultados numéricos legibles.',
      status: 'Estado',
      statusText: 'Experimento publicado',
      stack: 'Superficie',
      stackText: 'Aplicación web',
      visit: 'Preguntar por este proyecto',
    },
    article: {
      back: 'Volver a la hoja de contacto',
      kicker: 'Nota visual · España',
      title: 'España, en tránsito',
      lede: 'Una nota de viaje sobre la distancia entre llegar y comprender un lugar.',
      p1: 'Los viajes suelen recordarse a través de sus destinos, pero la cámara vuelve a lo que ocurre entre ellos: un tren que se acerca entre los árboles, una línea de costa vista desde arriba o una estructura que enmarca brevemente el camino.',
      p2: 'Estas fotografías siguen el movimiento sin intentar resolverlo. Paisajes, animales, estaciones y calles se convierten en marcas dentro de una secuencia: menos un catálogo de lugares que un registro de dónde se detuvo la atención.',
      p3: 'La serie permanece abierta: una colección construida con cruces, pausas y la geometría de llegar a algún lugar.',
      next: 'Siguiente nota',
      nextTitle: 'Estudios de pista — próximamente',
    },
    footer: {
      statement:
        'Código para los sistemas. Fotografías para todo lo que se les escapa.',
      copyright: 'David Barbosa',
    },
  },
} as const;

export const alternatePath = (pathname: string, lang: Lang) => {
  const target = lang === 'en' ? 'es' : 'en';
  return pathname.replace(/^\/(en|es)(?=\/|$)/, `/${target}`);
};

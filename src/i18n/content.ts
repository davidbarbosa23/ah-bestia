export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];

export const copy = {
  en: {
    meta: {
      homeTitle: 'David Barbosa — Senior Software Engineer',
      homeDescription:
        'Senior software engineer in Bogotá focused on product-minded web platforms, clear interfaces, and maintainable systems.',
      projectsTitle: 'Labs — David Barbosa',
      projectsDescription:
        'Small web tools and interface experiments by David Barbosa, documented from problem to working result.',
      photoTitle: 'Photography — David Barbosa',
      photoDescription:
        'Independent photography by David Barbosa exploring machines, animals, streets, movement, and light.',
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
      status: 'Available for selected collaborations',
      title: 'I make software\nfeel considered.',
      intro:
        'I’m David Barbosa, a senior software engineer in Bogotá. I turn complex product problems into clear web interfaces and dependable systems.',
      primaryCta: 'Explore Labs',
      secondaryCta: 'Email David',
      codeLabel: 'david.ts',
      aboutTitle: 'Pragmatic by default. Curious on purpose.',
      aboutBody:
        'I work from ambiguous requirements to shipped software: clarifying the problem, shaping the interface, and building systems teams can maintain. My background in graphic design helps me connect product intent, technical decisions, and the details users notice.',
      current: 'Currently',
      currentValue: 'Senior Software Engineer, Mercado Libre',
      location: 'Based in',
      locationValue: 'Bogotá, Colombia',
      focus: 'Working with',
      focusValue: 'TypeScript · React · Web platforms',
      experienceTitle: 'From web design to senior software engineering.',
      experience: [
        ['2021—NOW', 'Mercado Libre', 'Senior Software Engineer'],
        ['2020', 'Quantum Connexion', 'Software Engineer'],
        ['2016—2019', 'Tradeview / iLikeWebSites', 'Web Developer & Designer'],
        ['2015—2016', 'Rampa / Data Solutions Group', 'Web Designer'],
      ],
      projectsTitle: 'Selected experiments.',
      projectsIntro:
        'Small web tools and interface experiments, documented from the problem and decisions through to a working result.',
      projectName: 'Fixed Gear Calculator',
      projectDesc:
        'A bilingual gearing calculator for track and fixed-gear riders, translating chainring and sprocket choices into ratios, skid patches, development, and speed.',
      projectMeta: 'Product experiment · Calculation UI',
      projectLink: 'Try the calculator',
      contactTitle: 'Building something worth getting right?',
      contactBody:
        'Send me the problem, the constraints, and the outcome you need. I’ll tell you where I can help.',
      contactLink: 'Email me',
    },
    photo: {
      status: 'Independent photographic practice',
      title: 'Light,\nheld briefly.',
      intro:
        'Machines, animals, streets, and the seconds when motion settles into form.',
      galleryTitle: 'Selected series from an ongoing archive.',
      galleryHint: 'Hover to focus. Swipe on touch.',
      pauseGallery: 'Pause projects',
      playGallery: 'Play projects',
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
      title: 'Questions with working answers.',
      intro:
        'Each experiment starts with a practical question and ends with a working interface, plus notes on the decisions behind it.',
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
      copyright: 'David Barbosa',
    },
  },
  es: {
    meta: {
      homeTitle: 'David Barbosa — Ingeniero de Software Senior',
      homeDescription:
        'Ingeniero de software senior en Bogotá enfocado en plataformas web, interfaces claras y sistemas mantenibles.',
      projectsTitle: 'Labs — David Barbosa',
      projectsDescription:
        'Pequeñas herramientas web y experimentos de interfaz de David Barbosa, documentados desde el problema hasta un resultado funcional.',
      photoTitle: 'Fotografía — David Barbosa',
      photoDescription:
        'Fotografía independiente de David Barbosa sobre máquinas, animales, calles, movimiento y luz.',
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
      status: 'Disponible para colaboraciones seleccionadas',
      title: 'Construyo software que\nse siente bien pensado.',
      intro:
        'Soy David Barbosa, ingeniero de software senior en Bogotá. Convierto problemas complejos de producto en interfaces web claras y sistemas confiables.',
      primaryCta: 'Explorar Labs',
      secondaryCta: 'Escribirle a David',
      codeLabel: 'david.ts',
      aboutTitle: 'Pragmático por defecto. Curioso a propósito.',
      aboutBody:
        'Trabajo desde requisitos ambiguos hasta software en producción: aclaro el problema, doy forma a la interfaz y construyo sistemas que el equipo puede mantener. Mi formación en diseño gráfico me ayuda a conectar la intención del producto, las decisiones técnicas y los detalles que las personas perciben.',
      current: 'Actualmente',
      currentValue: 'Ingeniero de Software Senior, Mercado Libre',
      location: 'Desde',
      locationValue: 'Bogotá, Colombia',
      focus: 'Trabajo con',
      focusValue: 'TypeScript · React · Plataformas web',
      experienceTitle: 'Del diseño web a la ingeniería de software senior.',
      experience: [
        ['2021—HOY', 'Mercado Libre', 'Ingeniero de Software Senior'],
        ['2020', 'Quantum Connexion', 'Ingeniero de Software'],
        [
          '2016—2019',
          'Tradeview / iLikeWebSites',
          'Desarrollador y Diseñador Web',
        ],
        ['2015—2016', 'Rampa / Data Solutions Group', 'Diseñador Web'],
      ],
      projectsTitle: 'Experimentos seleccionados.',
      projectsIntro:
        'Pequeñas herramientas web y experimentos de interfaz, documentados desde el problema y las decisiones hasta un resultado funcional.',
      projectName: 'Calculadora de piñón fijo',
      projectDesc:
        'Una calculadora bilingüe para ciclistas de pista y piñón fijo que convierte elecciones de plato, piñón, cubierta y cadencia en relación, puntos de derrape, desarrollo y velocidad.',
      projectMeta: 'Experimento de producto · Interfaz de cálculo',
      projectLink: 'Probar la calculadora',
      contactTitle: '¿Estás construyendo algo que vale la pena hacer bien?',
      contactBody:
        'Cuéntame el problema, las restricciones y el resultado que necesitas. Te diré dónde puedo ayudar.',
      contactLink: 'Escríbeme',
    },
    photo: {
      status: 'Práctica fotográfica independiente',
      title: 'La luz,\npor un instante.',
      intro:
        'Máquinas, animales, calles y los segundos en que el movimiento encuentra una forma.',
      galleryTitle: 'Series seleccionadas de un archivo en proceso.',
      galleryHint: 'Pasa el cursor para enfocar. Desliza en pantallas táctiles.',
      pauseGallery: 'Pausar proyectos',
      playGallery: 'Reproducir proyectos',
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
      title: 'Preguntas con respuestas funcionales.',
      intro:
        'Cada experimento parte de una pregunta práctica y termina en una interfaz funcional, acompañada por notas sobre las decisiones detrás del resultado.',
      challenge: 'Pregunta',
      challengeText:
        '¿Cómo cambian la cadencia, la velocidad y los puntos de derrape según la relación de una bicicleta de piñón fijo?',
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
      copyright: 'David Barbosa',
    },
  },
} as const;

export type ErrorCode = '404' | '500';

interface ErrorPageCopy {
  errors: Record<ErrorCode, {
    title: string;
    description: string;
    primary: string;
  }>;
  actionsLabel: string;
}

export interface UiCopy {
  common: {
    skipToContent: string;
    utilityNavigation: string;
    homeLabel: string;
    switchLanguage: string;
    opensInNewTab: string;
    close: string;
    backToTop: string;
    top: string;
  };
  metadata: {
    locale: string;
    jobTitle: string;
    photographerHeroAlt: string;
    photographerHeroSocialAlt: string;
  };
  header: {
    searchPlaceholder: string;
    searchNoResults: string;
  };
  developer: {
    sourceCardLabel: string;
    sourceCardResult: string;
  };
    photography: {
      photographs: string;
      metaTitleSuffix: string;
      series: {
      back: string;
      kicker: string;
      source: string;
      previous: string;
      next: string;
      photo: string;
      from: string;
      openFullscreen: string;
    };
    lightbox: {
      viewer: string;
      previous: string;
      next: string;
      zoomOut: string;
      zoomIn: string;
      reset: string;
      close: string;
      hint: string;
    };
  };
  labs: {
    status: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    setup: string;
    chainring: string;
    sprocket: string;
    tire: string;
    skid: string;
    skidHelp: string;
    units: string;
    metric: string;
    imperial: string;
    analysis: string;
    diagram: string;
    ratio: string;
    ratioHelp: string;
    patches: string;
    patchesHelp: string;
    rollout: string;
    rolloutHelp: string;
    equivalent: string;
    equivalentHelp: string;
    cadence: string;
    rpm: string;
    teeth: string;
    combination: string;
    live: string;
  };
  error: ErrorPageCopy;
}

export const ui = {
  en: {
    common: {
      skipToContent: 'Skip to content',
      utilityNavigation: 'Utility navigation',
      homeLabel: 'David Barbosa — home',
      switchLanguage: 'Cambiar a español',
      opensInNewTab: 'opens in a new tab',
      close: 'Close',
      backToTop: 'Back to top',
      top: 'Top',
    },
    metadata: {
      locale: 'en_US',
      jobTitle: 'Senior Software Engineer',
      photographerHeroAlt: 'A Fujifilm X100VI camera emerging from deep shadow',
      photographerHeroSocialAlt: 'A Fujifilm X100VI camera emerging from shadow',
    },
    header: {
      searchPlaceholder: 'Labs, about, contact…',
      searchNoResults: 'No matching destinations',
    },
    developer: {
      sourceCardLabel: 'Developer profile as TypeScript',
      sourceCardResult: 'compiled without noise',
    },
    photography: {
      photographs: 'photographs',
      metaTitleSuffix: 'Photography by David Barbosa',
      series: {
        back: 'Back to all series',
        kicker: 'Photographic series',
        source: 'Archive folder',
        previous: 'Previous series',
        next: 'Next series',
        photo: 'Photograph',
        from: 'from',
        openFullscreen: 'Open full-screen view',
      },
      lightbox: {
        viewer: 'Full-screen photo viewer',
        previous: 'Previous photograph',
        next: 'Next photograph',
        zoomOut: 'Zoom out',
        zoomIn: 'Zoom in',
        reset: 'Reset zoom',
        close: 'Close full-screen viewer',
        hint: 'Swipe to browse. Pinch, scroll, or use + / - to zoom.',
      },
    },
    labs: {
      status: 'Status',
    },
    calculator: {
      title: 'Fixed gear calculator',
      subtitle: 'Change the setup. The analysis updates immediately.',
      setup: 'Setup',
      chainring: 'Chainring',
      sprocket: 'Rear sprocket',
      tire: 'Tire',
      skid: 'Count both leading feet',
      skidHelp: 'Use both left-foot-forward and right-foot-forward skid positions.',
      units: 'Units',
      metric: 'Metric',
      imperial: 'Imperial',
      analysis: 'Analysis',
      diagram: 'Rear wheel, chainring, and skid patch diagram',
      ratio: 'Ratio',
      ratioHelp: 'Rear-wheel turns for every complete turn of the cranks.',
      patches: 'Skid patches',
      patchesHelp: 'Distinct tire positions that touch the road while skidding.',
      rollout: 'Rollout',
      rolloutHelp: 'Distance travelled by one complete turn of the cranks.',
      equivalent: 'Equivalent gears within 2%',
      equivalentHelp: 'Choose a combination to load it into the calculator.',
      cadence: 'Cadence / speed',
      rpm: 'rpm',
      teeth: 'teeth',
      combination: 'Use gear combination',
      live: 'Calculator results updated',
    },
    error: {
      errors: {
        '404': {
          title: 'This page took a wrong turn.',
          description:
            'The address may have changed, or the page may no longer be here. Choose a place to continue.',
          primary: 'Back home',
        },
        '500': {
          title: 'Something got tangled.',
          description:
            'This page could not load right now. Try again, or choose another place to continue.',
          primary: 'Try again',
        },
      },
      actionsLabel: 'Choose where to continue',
    },
  },
  es: {
    common: {
      skipToContent: 'Saltar al contenido',
      utilityNavigation: 'Navegación de utilidades',
      homeLabel: 'David Barbosa — inicio',
      switchLanguage: 'Switch to English',
      opensInNewTab: 'se abre en una pestaña nueva',
      close: 'Cerrar',
      backToTop: 'Volver arriba',
      top: 'Inicio',
    },
    metadata: {
      locale: 'es_CO',
      jobTitle: 'Ingeniero de Software Senior',
      photographerHeroAlt: 'Una cámara Fujifilm X100VI emergiendo de una sombra profunda',
      photographerHeroSocialAlt: 'Una cámara Fujifilm X100VI emergiendo de la sombra',
    },
    header: {
      searchPlaceholder: 'Labs, acerca, contacto…',
      searchNoResults: 'No hay destinos que coincidan',
    },
    developer: {
      sourceCardLabel: 'Perfil del desarrollador como TypeScript',
      sourceCardResult: 'compilado sin ruido',
    },
    photography: {
      photographs: 'fotografías',
      metaTitleSuffix: 'Fotografía de David Barbosa',
      series: {
        back: 'Volver a todas las series',
        kicker: 'Serie fotográfica',
        source: 'Carpeta del archivo',
        previous: 'Serie anterior',
        next: 'Siguiente serie',
        photo: 'Fotografía',
        from: 'de',
        openFullscreen: 'Abrir vista de pantalla completa',
      },
      lightbox: {
        viewer: 'Visor de fotos en pantalla completa',
        previous: 'Fotografía anterior',
        next: 'Fotografía siguiente',
        zoomOut: 'Alejar',
        zoomIn: 'Acercar',
        reset: 'Restablecer zoom',
        close: 'Cerrar visor de pantalla completa',
        hint: 'Desliza para navegar. Pellizca, desplázate o usa + / - para ampliar.',
      },
    },
    labs: {
      status: 'Estado',
    },
    calculator: {
      title: 'Calculadora de piñón fijo',
      subtitle: 'Cambia la configuración. El análisis se actualiza de inmediato.',
      setup: 'Configuración',
      chainring: 'Plato',
      sprocket: 'Piñón trasero',
      tire: 'Cubierta',
      skid: 'Contar ambas piernas dominantes',
      skidHelp: 'Incluye skids con el pie izquierdo y el derecho adelante.',
      units: 'Unidades',
      metric: 'Métrico',
      imperial: 'Imperial',
      analysis: 'Análisis',
      diagram: 'Diagrama de rueda trasera, plato y puntos de derrape',
      ratio: 'Relación',
      ratioHelp: 'Vueltas de la rueda trasera por cada vuelta completa de las bielas.',
      patches: 'Skid patches',
      patchesHelp: 'Posiciones distintas de la cubierta que tocan el suelo al derrapar.',
      rollout: 'Desarrollo',
      rolloutHelp: 'Distancia recorrida por cada vuelta completa de las bielas.',
      equivalent: 'Relaciones equivalentes dentro del 2%',
      equivalentHelp: 'Elige una combinación para cargarla en la calculadora.',
      cadence: 'Cadencia / velocidad',
      rpm: 'rpm',
      teeth: 'dientes',
      combination: 'Usar combinación',
      live: 'Resultados de la calculadora actualizados',
    },
    error: {
      errors: {
        '404': {
          title: 'Esta página tomó un desvío.',
          description:
            'La dirección puede haber cambiado o la página ya no está aquí. Elige dónde continuar.',
          primary: 'Volver al inicio',
        },
        '500': {
          title: 'Algo se enredó.',
          description:
            'Esta página no pudo cargar ahora. Inténtalo de nuevo o elige otro lugar para continuar.',
          primary: 'Intentar de nuevo',
        },
      },
      actionsLabel: 'Elige dónde continuar',
    },
  },
} as const satisfies Record<Lang, UiCopy>;

export const alternatePath = (pathname: string, lang: Lang) => {
  const target = lang === 'en' ? 'es' : 'en';
  return pathname.replace(/^\/(en|es)(?=\/|$)/, `/${target}`);
};

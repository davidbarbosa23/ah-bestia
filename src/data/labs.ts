import type { Lang } from '../i18n/content';

interface LabProjectCopy {
  title: string;
  summary: string;
  lede: string;
  question: string;
  questionBody: string;
  approach: string;
  approachBody: string;
  result: string;
  resultBody: string;
  status: string;
}

export interface LabProject {
  slug: string;
  year: string;
  kind: 'live';
  tags: readonly string[];
  content: Record<Lang, LabProjectCopy>;
}

export const labsCopy = {
  en: {
    metaTitle: 'Developer Labs - David Barbosa',
    metaDescription:
      'I build small web tools and interface experiments, documenting each one from problem to working result.',
    back: 'Back home',
    label: 'Developer archive · 2026',
    title: 'Labs.',
    intro:
      'Small web tools and interface experiments, each documented from the problem and decisions through to a working result.',
    count: 'project',
    live: 'Live in the page',
    open: 'Open experiment',
    projectBack: 'Back to Labs',
    projectLabel: 'Lab 001 · Live experiment',
    builtWith: 'Built with',
    reference: 'Original reference',
    referenceText: 'Fantastic Fixed Gear Calculator by Surplace',
    next: 'Next lab',
    nextText: 'The next question is still open.',
    inputLabel: '01 / input',
    outputLabel: '02 / output',
  },
  es: {
    metaTitle: 'Labs de desarrollo - David Barbosa',
    metaDescription:
      'Construyo pequeñas herramientas web y experimentos de interfaz, documentando cada uno desde el problema hasta un resultado funcional.',
    back: 'Volver al inicio',
    label: 'Archivo de desarrollo · 2026',
    title: 'Labs.',
    intro:
      'Pequeñas herramientas web y experimentos de interfaz, documentados desde el problema y las decisiones hasta un resultado funcional.',
    count: 'proyecto',
    live: 'Funciona en la página',
    open: 'Abrir experimento',
    projectBack: 'Volver a Labs',
    projectLabel: 'Lab 001 · Experimento funcional',
    builtWith: 'Construido con',
    reference: 'Referencia original',
    referenceText: 'Fantastic Fixed Gear Calculator de Surplace',
    next: 'Siguiente lab',
    nextText: 'La siguiente pregunta sigue abierta.',
    inputLabel: '01 / entrada',
    outputLabel: '02 / resultado',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export const labProjects: LabProject[] = [
  {
    slug: 'fixed-gear-calculator',
    year: '2026',
    kind: 'live',
    tags: ['Astro', 'TypeScript', 'Three.js'],
    content: {
      en: {
        title: 'Fixed gear, made legible.',
        summary:
          'A gearing calculator that turns chainring, sprocket, tire, and cadence choices into ratios, skid patches, rollout, and speed.',
        lede:
          'The original Surplace calculator contains a remarkable amount of cycling knowledge in a very small interface. This version keeps that directness, then makes the arithmetic easier to read, compare, and learn from.',
        question: 'The question',
        questionBody:
          'What changes when one tooth moves from the chainring to the sprocket, and how can a rider understand the result without decoding a spreadsheet?',
        approach: 'The approach',
        approachBody:
          'Keep the bike, setup, and analysis together. A low-poly rider pedals at the selected cadence, while highlights on the rear tire show the calculated skid patches. Rotate the model to explore it from any angle.',
        result: 'The working answer',
        resultBody:
          'A small client-side calculator with no account, no saved state, and no hidden server work. Change a value and the ratio, rollout, equivalent gears, and cadence table recalculate in place.',
        status: 'Published experiment',
      },
      es: {
        title: 'Piñón fijo, explicado.',
        summary:
          'Una calculadora que convierte plato, piñón, cubierta y cadencia en relación, puntos de derrape, desarrollo y velocidad.',
        lede:
          'La calculadora original de Surplace concentra una cantidad notable de conocimiento ciclista en una interfaz muy pequeña. Esta versión conserva esa franqueza y hace que la aritmética sea más fácil de leer, comparar y aprender.',
        question: 'La pregunta',
        questionBody:
          '¿Qué cambia cuando un diente pasa del plato al piñón y cómo puede una persona entender el resultado sin descifrar una hoja de cálculo?',
        approach: 'El enfoque',
        approachBody:
          'Mantener la bicicleta, la configuración y el análisis juntos. Un ciclista low-poly pedalea a la cadencia seleccionada y las marcas en la cubierta trasera muestran los puntos de derrape calculados. Gira el modelo para explorarlo desde cualquier ángulo.',
        result: 'La respuesta funcional',
        resultBody:
          'Una calculadora pequeña del lado del cliente, sin cuenta, estado guardado ni trabajo oculto en el servidor. Al cambiar un valor se recalculan la relación, el desarrollo, las combinaciones equivalentes y la tabla de cadencia.',
        status: 'Experimento publicado',
      },
    },
  },
];

export const getLabProject = (slug: string) =>
  labProjects.find((project) => project.slug === slug);

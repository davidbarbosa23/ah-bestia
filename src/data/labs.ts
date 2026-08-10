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
    metaTitle: 'Developer Labs — David Barbosa',
    metaDescription:
      'Small web tools and interface experiments by David Barbosa, documented from problem to working result.',
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
    metaTitle: 'Labs de desarrollo — David Barbosa',
    metaDescription:
      'Pequeñas herramientas web y experimentos de interfaz de David Barbosa, documentados desde el problema hasta un resultado funcional.',
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
    tags: ['Astro', 'TypeScript', 'SVG'],
    content: {
      en: {
        title: 'Fixed gear, made legible.',
        summary:
          'A gearing calculator that turns chainring, sprocket, tire, and cadence choices into ratios, skid patches, rollout, and speed.',
        lede:
          'The original Surplace calculator contains a remarkable amount of cycling knowledge in a very small interface. This version keeps that directness, then makes the arithmetic easier to read, compare, and learn from.',
        question: 'The question',
        questionBody:
          'What changes when one tooth moves from the chainring to the sprocket—and how can a rider understand the result without decoding a spreadsheet?',
        approach: 'The approach',
        approachBody:
          'Keep every input visible, update the analysis immediately, and place a plain-language definition beside each number. The wheel diagram shows skid wear as part of the calculation, not decoration.',
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
          'Mantener todos los controles visibles, actualizar el análisis de inmediato y acompañar cada cifra con una definición clara. El diagrama de la rueda muestra los puntos de derrape como parte del cálculo, no como decoración.',
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

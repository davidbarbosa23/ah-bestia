import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const tokenFile = join(projectRoot, 'tokens.css');
const styleRoots = [
  join(projectRoot, 'src', 'components'),
  join(projectRoot, 'src', 'layouts'),
  join(projectRoot, 'src', 'styles'),
];

const tokenSource = await readFile(tokenFile, 'utf8');
const definedTokens = new Set(
  [...tokenSource.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]),
);

const sourceFiles = [];

async function collectSourceFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      await collectSourceFiles(path);
    } else if (['.astro', '.css'].includes(extname(entry.name))) {
      sourceFiles.push(path);
    }
  }
}

await Promise.all(styleRoots.map(collectSourceFiles));

const violations = [];
const colorLiteral = /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|hwb|lab|lch|oklab|oklch)\(/i;
const tokenizedProperty = /^(?:font-family|font-size|font-weight|letter-spacing|line-height|box-shadow|z-index)$/i;
const allowedKeywords = new Set(['inherit', 'initial', 'none', 'normal', 'revert', 'revert-layer', 'unset']);

function getStyleSources(path, source) {
  if (extname(path) === '.css') return [{ source, startLine: 1 }];

  return [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)].map((match) => ({
    source: match[1],
    startLine: source.slice(0, match.index).split(/\r?\n/).length,
  }));
}

for (const path of sourceFiles) {
  const source = await readFile(path, 'utf8');
  const displayPath = relative(projectRoot, path);

  for (const style of getStyleSources(path, source)) {
    const lines = style.source.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = style.startLine + index;

      if (colorLiteral.test(line)) {
        violations.push(`${displayPath}:${lineNumber} uses a color literal; add it to tokens.css.`);
      }

      const declaration = line.match(/^\s*([a-z-]+)\s*:\s*([^;]+);/i);
      if (!declaration || !tokenizedProperty.test(declaration[1])) return;

      const value = declaration[2].trim();
      if (!value.includes('var(') && !allowedKeywords.has(value)) {
        violations.push(
          `${displayPath}:${lineNumber} sets ${declaration[1]} without a CSS token.`,
        );
      }
    });

    for (const match of style.source.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
      if (!definedTokens.has(match[1])) {
        const lineNumber = style.startLine + style.source.slice(0, match.index).split(/\r?\n/).length - 1;
        violations.push(`${displayPath}:${lineNumber} references undefined token ${match[1]}.`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('CSS token check failed:\n');
  console.error(violations.map((violation) => `- ${violation}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`CSS token check passed for ${sourceFiles.length} style sources.`);
}

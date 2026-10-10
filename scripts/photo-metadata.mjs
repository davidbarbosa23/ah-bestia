import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { exiftool } from 'exiftool-vendored';
import { creator, email, rights, website } from '../src/data/photoMetadata.mjs';

const assets = new URL('../src/assets/', import.meta.url);
const defaults = {
  'IFD0:Artist': creator,
  'IFD0:Copyright': rights,
  'XMP-dc:Creator': [creator],
  'XMP-dc:Rights': rights,
  'XMP-xmpRights:WebStatement': website,
  'XMP-photoshop:Credit': creator,
  'XMP-iptcCore:CreatorWorkEmail': email,
};

let updated = 0;
let total = 0;
try {
  for (const entry of await readdir(assets, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.jpe?g$/i.test(entry.name)) continue;
    const file = `${entry.parentPath}/${entry.name}`;
    total++;
    const tags = await exiftool.readRaw(file, {
      readArgs: ['-G1', '-s', '-fast2', ...Object.keys(defaults).map((key) => `-${key}`)],
    });
    if (tags.errors?.length) throw new Error(`${file}: ${tags.errors.join('; ')}`);
    const matches = Object.entries(defaults).every(([key, expected]) => {
      const actual = tags[key];
      return Array.isArray(expected)
        ? JSON.stringify(Array.isArray(actual) ? actual : [actual]) === JSON.stringify(expected)
        : actual === expected;
    });
    if (matches) continue;

    // ExifTool edits metadata without decoding/recompressing the JPEG pixels.
    // Keep camera, location, capture dates, color profiles and other existing tags.
    const result = await exiftool.write(file, defaults, {
      writeArgs: ['-overwrite_original', '-P'],
    });
    if (result.warnings?.length) {
      console.warn(`${fileURLToPath(assets)}: ${entry.name}: ${result.warnings.join('; ')}`);
    }
    updated++;
  }
  console.log(`Photo metadata: updated ${updated} of ${total} source JPEGs.`);
} finally {
  await exiftool.end();
}

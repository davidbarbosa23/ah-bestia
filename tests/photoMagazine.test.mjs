import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolvePhotoMagazine } from '../src/services/photoMagazine.ts';

const image = { src: '/cover.jpg', width: 600, height: 800, format: 'jpg' };
const images = [{ filename: 'cover.jpg', image }];

test('magazine pages resolve supplied assets, defaults, and authored overrides', () => {
  assert.equal(resolvePhotoMagazine('series', undefined, images), undefined);
  const magazine = resolvePhotoMagazine('series', { pages: [{ image: 'cover.jpg' }] }, images);
  assert.deepEqual(magazine.pageSize, { width: 3, height: 4 });
  assert.deepEqual(magazine.pages[0], { image: 'cover.jpg', imageAsset: image, fit: 'cover', position: '50% 50%', tone: 'ink' });
  const custom = { pageSize: { width: 1, height: 1 }, pages: [{ image: 'cover.jpg', fit: 'contain', position: 'top', tone: 'paper', alt: { en: 'Cover', es: 'Portada' } }] };
  const before = structuredClone(custom);
  const resolved = resolvePhotoMagazine('series', custom, images);
  assert.deepEqual(resolved.pages[0], { ...custom.pages[0], imageAsset: image });
  assert.deepEqual(resolved.pageSize, custom.pageSize);
  assert.deepEqual(custom, before);
});

test('invalid authored magazines fail at build time with contextual errors', () => {
  assert.throws(() => resolvePhotoMagazine('series', { pages: [] }, images), /Magazine series must include at least one page/);
  assert.throws(() => resolvePhotoMagazine('series', { pages: null }, images), /must include at least one page/);
  for (const pageSize of [{ width: 0, height: 4 }, { width: 3, height: -1 }]) {
    assert.throws(() => resolvePhotoMagazine('series', { pageSize, pages: [{ image: 'cover.jpg' }] }, images), /Invalid magazine page size for series/);
  }
  assert.throws(() => resolvePhotoMagazine('series', { pages: [{ image: 'missing.jpg' }] }, images), /Missing magazine image missing.jpg on page 1 for series/);
  assert.throws(() => resolvePhotoMagazine('series', { pages: [{ image: 'cover.jpg', fit: 'invalid' }] }, images), /Invalid fit on page 1 for series/);
  assert.throws(() => resolvePhotoMagazine('series', { pages: [{ image: 'cover.jpg', tone: 'invalid' }] }, images), /Invalid tone on page 1 for series/);
});

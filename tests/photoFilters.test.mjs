import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPhotoTagAliases, filterPhotos } from '../src/utils/photoFilters.ts';

const aliases = createPhotoTagAliases(['portrait', 'black-and-white', 'travel'], [
  { portrait: 'Portrait', 'black-and-white': 'Black and white', travel: 'Travel' },
  { portrait: 'Retrato', 'black-and-white': 'Blanco y negro', travel: 'Viajes' },
]);
const photos = [
  { id: 'a', folder: 'friends/Juli', tags: ['portrait', 'black-and-white'], search: 'juli bogota retrato portrait sombra' },
  { id: 'b', folder: 'spain', tags: ['travel', 'black-and-white'], search: 'spain bilbao bridge puente' },
  { id: 'c', folder: 'friends/Juli', tags: ['portrait'], search: 'juli bogota retrato portrait sol' },
];
const filter = (query = '', tags = [], folder = '') => filterPhotos(photos, { query, tags, folder }, aliases).map(({ id }) => id);

test('multiword tag names and translated names select the same photographs', () => {
  assert.deepEqual(filter('BLACK AND WHITE'), ['a', 'b']);
  assert.deepEqual(filter('  blanco y negro '), ['a', 'b']);
  assert.deepEqual(filter('Retrato'), ['a', 'c']);
  assert.deepEqual(filter('Viajes'), ['b']);
});

test('free text ignores accents and case, and requires every word', () => {
  assert.deepEqual(filter('BOGOTÁ juli'), ['a', 'c']);
  assert.deepEqual(filter('bogota sombra'), ['a']);
  assert.deepEqual(filter('bogota bridge'), []);
  assert.deepEqual(filter('portrait sol'), ['c']);
});

test('selected tags and folders intersect with the search without mutating input', () => {
  const before = structuredClone(photos);
  const tags = new Set(['portrait']);
  assert.deepEqual(filter('blanco y negro', tags, 'friends/Juli'), ['a']);
  assert.deepEqual(filter('', ['portrait', 'travel']), []);
  assert.deepEqual(filter('', [], 'missing'), []);
  assert.deepEqual(filter(''), ['a', 'b', 'c']);
  assert.deepEqual(photos, before);
  assert.deepEqual([...tags], ['portrait']);
});

import test from 'node:test';
import assert from 'node:assert/strict';

test('builds a concise image-free Year 2 relay timeline', async () => {
  const { MIAO_YEAR_TWO } = await import('./cohortTimeline.js');

  assert.equal(MIAO_YEAR_TWO.length, 4);
  assert.deepEqual(MIAO_YEAR_TWO.map(node => node.y), ['Year 2 · 01', 'Year 2 · 02', 'Year 2 · 03', 'Year 2 · 04']);
  assert.ok(MIAO_YEAR_TWO.every(node => !node.img && !node.media));
});

import test from 'node:test';
import assert from 'node:assert/strict';

test('provides clearly labelled illustrative organization-wide impact metrics', async () => {
  const { IMPACT_METRICS, FUND_ALLOCATION } = await import('./impactData.js');

  assert.equal(IMPACT_METRICS.length, 4);
  assert.equal(FUND_ALLOCATION.reduce((sum, item) => sum + item.value, 0), 100);
  assert.ok(IMPACT_METRICS.every(item => item.illustrative === true));
});

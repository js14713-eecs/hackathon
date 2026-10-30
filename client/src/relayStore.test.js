import test from 'node:test';
import assert from 'node:assert/strict';

test('stores a trimmed relay idea under the selected open question', async () => {
  const relay = await import('./relayStore.js').catch(() => ({}));
  assert.equal(typeof relay.addRelayIdea, 'function');

  const memory = new Map();
  const storage = {
    getItem: key => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  };

  const saved = relay.addRelayIdea(storage, {
    storyId: '14',
    question: 'How could the next cohort test this idea?',
    author: '  Maya  ',
    comment: '  Compare two new models.  ',
    now: 1234,
  });

  assert.deepEqual(saved, {
    id: '14-1234',
    storyId: '14',
    question: 'How could the next cohort test this idea?',
    author: 'Maya',
    comment: 'Compare two new models.',
    createdAt: 1234,
  });
  assert.deepEqual(relay.readRelayIdeas(storage, '14', 'How could the next cohort test this idea?'), [saved]);
});

test('rejects an empty relay comment', async () => {
  const relay = await import('./relayStore.js').catch(() => ({}));
  assert.equal(typeof relay.addRelayIdea, 'function');
  assert.throws(() => relay.addRelayIdea({ getItem: () => null, setItem: () => {} }, {
    storyId: '14', question: 'What next?', author: '', comment: '   ', now: 1234,
  }), /idea/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('moves uploaded agent images into stable story attachments and selects a cover', async () => {
  const uploads = await import('./agentUploads.js').catch(() => ({}));
  assert.equal(typeof uploads.persistAgentImages, 'function');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adream-agent-'));
  const first = path.join(dir, 'tmp-a');
  const second = path.join(dir, 'tmp-b');
  fs.writeFileSync(first, 'first');
  fs.writeFileSync(second, 'second');

  const result = uploads.persistAgentImages({
    storyId: 42,
    uploadDir: dir,
    files: [
      { path: first, originalname: '银饰 海报.jpg', mimetype: 'image/jpeg' },
      { path: second, originalname: 'batik.png', mimetype: 'image/png' },
    ],
  });

  assert.deepEqual(result, {
    cover: '/uploads/story-42-image-1.jpg',
    attachments: [
      { filename: '银饰 海报.jpg', path: 'story-42-image-1.jpg' },
      { filename: 'batik.png', path: 'story-42-image-2.png' },
    ],
  });
  assert.equal(fs.readFileSync(path.join(dir, 'story-42-image-1.jpg'), 'utf8'), 'first');
  assert.equal(fs.readFileSync(path.join(dir, 'story-42-image-2.png'), 'utf8'), 'second');
  assert.equal(fs.existsSync(first), false);
  assert.equal(fs.existsSync(second), false);
});

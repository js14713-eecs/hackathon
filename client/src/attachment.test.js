import test from 'node:test';
import assert from 'node:assert/strict';

test('builds a public URL only for image attachments', async () => {
  const attachment = await import('./attachment.js').catch(() => ({}));
  assert.equal(typeof attachment.imageAttachmentUrl, 'function');
  assert.equal(attachment.imageAttachmentUrl({ filename: 'poster.jpg', path: 'story-15/poster.jpg' }), '/uploads/story-15/poster.jpg');
  assert.equal(attachment.imageAttachmentUrl({ filename: 'poster.jpg', path: 'poster.jpg' }, '/hackathon/'), '/hackathon/uploads/poster.jpg');
  assert.equal(attachment.imageAttachmentUrl({ filename: 'notes.pdf', path: 'story-15/notes.pdf' }), null);
});

import fs from 'node:fs';
import path from 'node:path';

const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export function persistAgentImages({ storyId, uploadDir, files }) {
  const attachments = files.map((file, index) => {
    const sourceExt = path.extname(file.originalname || '').toLowerCase();
    const ext = /^\.(jpe?g|png|webp|gif)$/.test(sourceExt) ? sourceExt.replace('.jpeg', '.jpg') : (MIME_EXT[file.mimetype] || '.jpg');
    const storedPath = `story-${storyId}-image-${index + 1}${ext}`;
    fs.renameSync(file.path, path.join(uploadDir, storedPath));
    return { filename: file.originalname || `Journey image ${index + 1}${ext}`, path: storedPath };
  });
  return {
    cover: attachments[0] ? `/uploads/${attachments[0].path}` : null,
    attachments,
  };
}

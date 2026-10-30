const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

export function imageAttachmentUrl(attachment, base = '/') {
  if (!attachment?.path || !IMAGE_EXT.test(attachment.filename || attachment.path)) return null;
  const prefix = base === '/' ? '' : `/${String(base).replace(/^\/+|\/+$/g, '')}`;
  return `${prefix}/uploads/${String(attachment.path).replace(/^\/+/, '')}`;
}

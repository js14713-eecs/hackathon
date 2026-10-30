const KEY = 'adream.relay.ideas';

function readAll(storage) {
  try {
    return JSON.parse(storage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function readRelayIdeas(storage, storyId, question) {
  return readAll(storage).filter(item => item.storyId === String(storyId) && item.question === question);
}

export function addRelayIdea(storage, { storyId, question, author, comment, now = Date.now() }) {
  const cleanComment = String(comment || '').trim();
  if (!cleanComment) throw new Error('Share an idea before submitting.');

  const item = {
    id: `${storyId}-${now}`,
    storyId: String(storyId),
    question,
    author: String(author || '').trim() || 'Next cohort student',
    comment: cleanComment,
    createdAt: now,
  };
  storage.setItem(KEY, JSON.stringify([...readAll(storage), item]));
  return item;
}

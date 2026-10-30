const KEY = 'adream.relay.ideas';
const CREDITS_KEY = 'adream.relay.credits';
const IDEA_REWARD = 10;

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

export function readRelayCredits(storage) {
  const credits = Number(storage.getItem(CREDITS_KEY));
  return Number.isFinite(credits) && credits > 0 ? credits : 0;
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
    creditsEarned: IDEA_REWARD,
  };
  storage.setItem(KEY, JSON.stringify([...readAll(storage), item]));
  storage.setItem(CREDITS_KEY, String(readRelayCredits(storage) + IDEA_REWARD));
  return item;
}

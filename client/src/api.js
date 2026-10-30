import { BASE, STATIC, withBase } from './static.js';

export const TYPES = {
  qyf:     { label: 'Go Far · Study Journey', color: '#f5a623' },
  caravan: { label: 'Dream Caravan',          color: '#ff6b35' },
  sports:  { label: 'Sports Dream',           color: '#2bb3a3' },
  border:  { label: 'Border School',          color: '#9b6bd6' },
  coach:   { label: 'Dream Coach Program',    color: '#3f7fb8' },
  citizen: { label: 'Kids in Governance',     color: '#4caf7d' },
};

const get = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

/* ---------- static build (GitHub Pages): data files + localStorage overlay ---------- */

const cache = new Map();
const loadData = (file) => {
  if (!cache.has(file)) {
    cache.set(file, get(`${BASE}/data/${file}`).then(withBase).then(d => {
      cache.set(file, Promise.resolve(d));
      return d;
    }).catch(e => {
      cache.delete(file);
      throw e;
    }));
  }
  return cache.get(file);
};

const PUB_KEY = 'adream.static.published';
const LIKE_KEY = 'adream.static.likes';

const readLocal = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const writeLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const extraLikes = (id) => readLocal(LIKE_KEY, {})[id] || 0;
const withLikes = (s) => ({ ...s, likes: (s.likes || 0) + extraLikes(s.id) });
const hotScore = (s) => (s.likes + 1) / Math.pow((Date.now() - s.created_at) / 3600e3 + 2, 1.2);

const publishedStories = () => readLocal(PUB_KEY, []);

const readRawStory = async (id) => {
  const key = String(id);
  if (key.startsWith('demo-')) {
    const s = publishedStories().find(x => String(x.id) === key);
    if (!s) throw new Error('Story not found');
    return s;
  }
  return loadData(`story-${key}.json`);
};

const staticApi = {
  map: async () => {
    const m = await loadData('map.json');
    const extra = publishedStories()
      .filter(s => s.lng != null && s.lat != null)
      .map(s => ({ id: s.id, title: s.title, coords: [s.lng, s.lat] }));
    return { ...m, stories: [...m.stories, ...extra] };
  },
  locations: () => loadData('locations.json'),
  location: async (id) => {
    const list = await loadData('locations.json');
    const l = list.find(x => x.id === id);
    if (!l) throw new Error('Location not found');
    return l;
  },
  impacts: () => loadData('impacts.json'),
  stories: async (sort = 'new') => {
    const base = await loadData('stories.json');
    const extra = publishedStories().map(s => ({
      id: s.id, title: s.title, summary: s.summary, location: s.location,
      lng: s.lng, lat: s.lat, image: s.image, likes: 0, tags: s.tags,
      created_at: s.created_at,
    }));
    const all = [...base, ...extra].map(withLikes);
    all.sort((a, b) => (sort === 'hot' ? hotScore(b) - hotScore(a) : b.created_at - a.created_at));
    return all;
  },
  story: async (id) => withLikes(await readRawStory(id)),
  like: async (id) => {
    const likes = readLocal(LIKE_KEY, {});
    likes[id] = (likes[id] || 0) + 1;
    writeLocal(LIKE_KEY, likes);
    return { likes: (await readRawStory(id)).likes + likes[id] };
  },
  submit: async () => {
    throw new Error('Story submissions are disabled in the static demo — run the app locally to submit.');
  },
  agentSamples: async (set = 'nanjing') => {
    const all = await loadData('samples.json');
    return all[set] || { text: '', images: [] };
  },
  agentGenerate: async (_text, _files, set) => {
    const all = await loadData('samples.json');
    const draft = all[set]?.draft;
    if (!draft) {
      throw new Error('This public demo replays the two bundled samples. Run the app locally (npm run dev) for live generation from your own materials.');
    }
    return { id: `${set}-sample`, engine: 'llm', model: 'pre-generated sample', data: draft };
  },
  agentPublish: async (id, draft) => {
    if (!draft) throw new Error('Nothing to publish.');
    const story = {
      id: `demo-${Date.now()}`,
      title: draft.title,
      summary: draft.summary,
      raw: '',
      location: draft.location,
      lng: draft.lng ?? null,
      lat: draft.lat ?? null,
      timeline: draft.timeline || [],
      stats: draft.stats || [],
      tags: draft.tags || [],
      image: null,
      status: 'ready',
      likes: 0,
      created_at: Date.now(),
      storyline: draft,
      attachments: [],
    };
    writeLocal(PUB_KEY, [...publishedStories(), story]);
    return { ok: true, id: story.id };
  },
};

/* ---------- live server ---------- */

const liveApi = {
  map: () => get('/api/map'),
  locations: () => get('/api/locations'),
  location: (id) => get(`/api/locations/${id}`),
  impacts: () => get('/api/impacts'),
  stories: (sort = 'new') => get(`/api/stories?sort=${sort}`),
  story: (id) => get(`/api/stories/${id}`),
  like: async (id) => {
    const r = await fetch(`/api/stories/${id}/like`, { method: 'POST' });
    return r.json();
  },
  submit: async ({ text, files }) => {
    const fd = new FormData();
    if (text) fd.append('text', text);
    for (const f of files) fd.append('files', f);
    const r = await fetch('/api/stories', { method: 'POST', body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
    return j;
  },
  agentSamples: (set = 'nanjing') => get(`/api/agent/samples?set=${encodeURIComponent(set)}`),
  agentGenerate: async (text, files) => {
    const fd = new FormData();
    if (text) fd.append('text', text);
    for (const f of files) fd.append('files', f);
    const r = await fetch('/api/agent/generate', { method: 'POST', body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
    return j;
  },
  agentPublish: async (id) => {
    const r = await fetch(`/api/agent/${id}/publish`, { method: 'POST' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
    return j;
  },
};

export const api = STATIC ? staticApi : liveApi;

export function timeAgo(ts) {
  const h = Math.floor((Date.now() - ts) / 3600e3);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

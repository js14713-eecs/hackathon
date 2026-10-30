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

export const api = {
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
};

export function timeAgo(ts) {
  const h = Math.floor((Date.now() - ts) / 3600e3);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

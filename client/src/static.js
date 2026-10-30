// Static (GitHub Pages) build support: no server, data comes from /data/*.json.
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');
export const STATIC = import.meta.env.VITE_STATIC === '1';

const ASSET_RE = /^\/(img|samples|geo|uploads)\//;

export const asset = (p) =>
  typeof p === 'string' && ASSET_RE.test(p) ? BASE + p : p;

export const withBase = (value) => {
  if (Array.isArray(value)) return value.map(withBase);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withBase(v)]));
  }
  return asset(value);
};

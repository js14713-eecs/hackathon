import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEED_STORIES } from './data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, '..', 'data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    raw TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT 'Uncategorized',
    lng REAL, lat REAL,
    timeline TEXT NOT NULL DEFAULT '[]',
    stats TEXT NOT NULL DEFAULT '[]',
    tags TEXT NOT NULL DEFAULT '[]',
    image TEXT,
    status TEXT NOT NULL DEFAULT 'processing',
    likes INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    path TEXT NOT NULL
  );
`);

const storyCols = db.prepare(`PRAGMA table_info(stories)`).all().map(c => c.name);
if (!storyCols.includes('storyline')) {
  db.exec(`ALTER TABLE stories ADD COLUMN storyline TEXT NOT NULL DEFAULT '[]'`);
}

function seedIfEmpty() {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM stories').get();
  if (n > 0) return;
  const ins = db.prepare(
    `INSERT INTO stories (title, summary, raw, location, lng, lat, timeline, stats, tags, image, status, likes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ready', ?, ?)`
  );
  for (const s of SEED_STORIES) {
    ins.run(
      s.title, s.summary, s.summary, s.location, s.coords[0], s.coords[1],
      JSON.stringify(s.timeline), JSON.stringify(s.timeline.slice(-1)[0]?.st || []),
      JSON.stringify(s.tags), s.image, s.likes, Date.now() - s.ageHours * 3600e3
    );
  }
}
seedIfEmpty();

export function createStory({ title, raw }) {
  const r = db.prepare(
    `INSERT INTO stories (title, raw, summary, status, created_at) VALUES (?, ?, '', 'processing', ?)`
  ).run(title, raw, Date.now());
  return Number(r.lastInsertRowid);
}

export function setStoryReady(id, data) {
  db.prepare(
    `UPDATE stories SET title=?, summary=?, location=?, lng=?, lat=?, timeline=?, stats=?, tags=?, status='ready' WHERE id=?`
  ).run(
    data.title, data.summary, data.location, data.lng ?? null, data.lat ?? null,
    JSON.stringify(data.timeline || []), JSON.stringify(data.stats || []),
    JSON.stringify(data.tags || []), id
  );
}

export function markStoryFailed(id) {
  db.prepare(`UPDATE stories SET status='failed' WHERE id=?`).run(id);
}

export function createDraftStory({ title, raw }) {
  const r = db.prepare(
    `INSERT INTO stories (title, raw, summary, status, created_at) VALUES (?, ?, '', 'draft', ?)`
  ).run(title, raw, Date.now());
  return Number(r.lastInsertRowid);
}

export function saveDraftStoryline(id, data) {
  db.prepare(
    `UPDATE stories SET title=?, summary=?, location=?, lng=?, lat=?, timeline=?, stats=?, tags=?, storyline=? WHERE id=?`
  ).run(
    data.title, data.summary, data.location, data.lng ?? null, data.lat ?? null,
    JSON.stringify(data.timeline || []), JSON.stringify(data.stats || []),
    JSON.stringify(data.tags || []), JSON.stringify(data), id
  );
}

export function publishStory(id) {
  const r = db.prepare(`UPDATE stories SET status='ready' WHERE id=? AND status='draft'`).run(id);
  return r.changes > 0;
}

export function addAttachment(storyId, filename, storedPath) {
  db.prepare(`INSERT INTO attachments (story_id, filename, path) VALUES (?, ?, ?)`).run(storyId, filename, storedPath);
}

export function getStory(id) {
  const s = db.prepare(`SELECT * FROM stories WHERE id=?`).get(id);
  if (!s) return null;
  const atts = db.prepare(`SELECT id, filename FROM attachments WHERE story_id=?`).all(id);
  return {
    ...s,
    timeline: JSON.parse(s.timeline), stats: JSON.parse(s.stats), tags: JSON.parse(s.tags),
    storyline: JSON.parse(s.storyline || '[]'),
    attachments: atts,
  };
}

export function hotScore(s, now) {
  const ageHours = (now - s.created_at) / 3600e3;
  return (s.likes + 1) / Math.pow(ageHours + 2, 1.2);
}

export function listStories(sort = 'new') {
  const now = Date.now();
  const rows = db.prepare(`SELECT * FROM stories WHERE status='ready'`).all();
  const out = rows.map(s => ({
    id: s.id, title: s.title, summary: s.summary, location: s.location,
    lng: s.lng, lat: s.lat, image: s.image, likes: s.likes,
    tags: JSON.parse(s.tags), created_at: s.created_at,
    hot: hotScore(s, now),
  }));
  out.sort((a, b) => (sort === 'hot' ? b.hot - a.hot : b.created_at - a.created_at));
  return out;
}

export function likeStory(id) {
  db.prepare(`UPDATE stories SET likes = likes + 1 WHERE id=?`).run(id);
  return db.prepare(`SELECT likes FROM stories WHERE id=?`).get(id);
}

export default db;

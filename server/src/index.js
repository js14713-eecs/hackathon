import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LOCATIONS, PARTICIPATING, FEATURED_GEO, IMPACTS } from './data.js';
import { createStory, setStoryReady, addAttachment, getStory, listStories, likeStory } from './db.js';
import { organizeStory } from './llm.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 20 * 1024 * 1024, files: 6 },
});

/* ---------- static site (production) ---------- */
const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
}

/* ---------- API ---------- */
app.get('/api/map', (_req, res) => {
  res.json({
    locations: LOCATIONS.map(l => ({
      id: l.id, name: l.name, geo: l.geo, coords: l.coords, tagline: l.tagline,
      types: [...new Set(l.projects.map(p => p.type))],
    })),
    stories: listStories('new')
      .filter(s => s.lng != null && s.lat != null)
      .slice(0, 30)
      .map(s => ({ id: s.id, title: s.title, coords: [s.lng, s.lat] })),
    tiers: { participating: PARTICIPATING, featured: FEATURED_GEO },
  });
});

app.get('/api/locations', (_req, res) => res.json(LOCATIONS));

app.get('/api/locations/:id', (req, res) => {
  const l = LOCATIONS.find(x => x.id === req.params.id);
  if (!l) return res.status(404).json({ error: 'Location not found' });
  res.json(l);
});

app.get('/api/impacts', (_req, res) => res.json(IMPACTS));

app.get('/api/stories', (req, res) => res.json(listStories(req.query.sort === 'hot' ? 'hot' : 'new')));

app.get('/api/stories/:id', (req, res) => {
  const s = getStory(Number(req.params.id));
  if (!s) return res.status(404).json({ error: 'Story not found' });
  res.json(s);
});

app.post('/api/stories/:id/like', (req, res) => {
  const r = likeStory(Number(req.params.id));
  if (!r) return res.status(404).json({ error: 'Story not found' });
  res.json({ likes: r.likes });
});

app.post('/api/stories', upload.array('files', 6), async (req, res) => {
  const text = (req.body.text || '').trim();
  const files = req.files || [];
  if (!text && files.length === 0) {
    files.forEach(f => fs.rmSync(f.path, { force: true }));
    return res.status(400).json({ error: 'Provide text or upload at least one file.' });
  }
  let raw = text;
  for (const f of files) {
    if (/^text\//.test(f.mimetype) || /\.(txt|md|markdown)$/i.test(f.originalname)) {
      raw += '\n\n' + fs.readFileSync(f.path, 'utf8').slice(0, 20000);
    }
  }
  const title = raw.split('\n').find(l => l.trim())?.slice(0, 60) || 'New story';
  const id = createStory({ title, raw });
  files.forEach(f => addAttachment(id, f.originalname, path.basename(f.path)));
  res.status(201).json({ id, status: 'processing' });

  // AI organizing runs async so the upload call returns immediately
  setImmediate(async () => {
    try {
      const data = await organizeStory(raw);
      setStoryReady(id, data);
    } catch (e) {
      console.error('[story] organize error:', e.message);
    }
  });
});

app.get('/uploads/:name', (req, res) => {
  const safe = path.basename(req.params.name);
  res.sendFile(path.join(UPLOAD_DIR, safe));
});

/* ---------- SPA fallback ---------- */
if (fs.existsSync(dist)) {
  app.get(/^\/(?!api|uploads).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API + static server listening on http://localhost:${PORT}`));

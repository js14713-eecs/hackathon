// Exports the live API responses as static JSON + assets for the GitHub Pages build.
// Run locally (with server/data.db populated) and commit the output:
//   npm run export:static
// The deploy workflow only builds; it does not re-run this script, so the
// committed snapshot is the source of truth for the public demo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCATIONS, PARTICIPATING, FEATURED_GEO, IMPACTS } from '../src/data.js';
import { listStories, getStory } from '../src/db.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dataDir = path.join(root, 'client', 'public', 'data');
const samplesOut = path.join(root, 'client', 'public', 'samples');
fs.mkdirSync(dataDir, { recursive: true });

const write = (name, data) => {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(data, null, 2));
  console.log(`  data/${name}`);
};

const stories = listStories('new');
const storyById = new Map(stories.map(s => [s.id, s]));

write('map.json', {
  locations: LOCATIONS.map(l => ({
    id: l.id, name: l.name, geo: l.geo, coords: l.coords, tagline: l.tagline,
    types: [...new Set(l.projects.map(p => p.type))],
  })),
  stories: stories
    .filter(s => s.lng != null && s.lat != null)
    .slice(0, 30)
    .map(s => ({ id: s.id, title: s.title, coords: [s.lng, s.lat] })),
  tiers: { participating: PARTICIPATING, featured: FEATURED_GEO },
});

write('locations.json', LOCATIONS);
write('impacts.json', IMPACTS);
write('stories.json', stories);

for (const s of stories) {
  const full = getStory(s.id);
  delete full.raw;
  write(`story-${s.id}.json`, full);
}

const SETS = { nanjing: 'Nanjing', hongyadong: 'Chongqing' };
const samples = {};

for (const [set, location] of Object.entries(SETS)) {
  const dir = path.join(root, 'server', 'samples', set);
  if (!fs.existsSync(dir)) continue;

  let text = '';
  const images = [];
  fs.mkdirSync(path.join(samplesOut, set), { recursive: true });

  for (const f of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, f);
    if (/\.(md|txt)$/i.test(f)) {
      text += `\n\n${fs.readFileSync(full, 'utf8').slice(0, 12000)}`;
    } else if (/\.(jpe?g|png|webp)$/i.test(f)) {
      images.push(`/samples/${set}/${f}`);
      fs.copyFileSync(full, path.join(samplesOut, set, f));
    }
  }

  samples[set] = { text: text.trim(), images };

  const withDraft = storyById.get(
    [...storyById.keys()].find(id => {
      const s = getStory(id);
      return s.location === location && s.storyline && !Array.isArray(s.storyline) && s.storyline.turns?.length;
    })
  );
  if (withDraft) samples[set].draft = getStory(withDraft.id).storyline;
}

write('samples.json', samples);

console.log(`\n${stories.length} stories · ${Object.keys(samples).length} sample sets → client/public/data`);

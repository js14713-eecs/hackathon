import { KNOWN_LOCATIONS, LOCATIONS } from './data.js';

const SYSTEM_PROMPT = `You are an editor for Adream Charity Foundation, which runs education programs for rural Chinese children (Go Far study journeys, Dream Caravan, Dream Centers).
Given raw text about a story of students completing a project or journey, organize it into a structured story page.
Reply with ONLY valid JSON in this exact shape:
{
  "title": "short engaging English title, under 80 chars",
  "summary": "2-3 sentence English summary",
  "location": "one of: ${KNOWN_LOCATIONS.join(' | ')} — pick the closest match, default 'Uncategorized'",
  "timeline": [ { "y": "year or day label", "lab": "short phase label", "t": "node title", "d": "1-2 sentence description", "ph": ["phase tags, 1-3 of: Course,Trip Plan,Team Defense,Journey,Sharing,Carnival,STEAM,Launch Ceremony,Training,Hearing,Adoption"] } ],
  "stats": [ ["value", "label"] ],
  "tags": ["2-4 lowercase tags"]
}
Rules: timeline must have 3-8 nodes ordered chronologically. All text in English. If the text mentions a Chinese city/province, translate the location name to English.`;

function fallbackOrganize(rawText) {
  const clean = (rawText || 'Untitled story').trim();
  const firstLine = clean.split('\n').find(l => l.trim().length > 0) || clean;
  const title = firstLine.slice(0, 80) || 'Untitled story';
  return {
    title,
    summary: clean.slice(0, 300),
    location: 'Uncategorized',
    timeline: [
      { y: 'Now', lab: 'Story', t: title.slice(0, 60), d: clean.slice(0, 500), ph: ['Sharing'] },
    ],
    stats: [],
    tags: ['unedited'],
  };
}

function coerceLocation(name) {
  if (KNOWN_LOCATIONS.includes(name)) return name;
  const hit = LOCATIONS.find(l => name && (name.includes(l.name.split(' ')[0]) || l.name.split(' ')[0].includes(name)));
  return hit ? hit.name : 'Uncategorized';
}

async function callLLM(rawText) {
  const { OPENAI_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL } = process.env;
  const base = (OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = OPENAI_MODEL || 'gpt-4o-mini';
  const body = {
    model,
    temperature: 0.3,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: rawText.slice(0, 8000) },
    ],
    response_format: { type: 'json_object' },
  };
  let res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify(body),
  });
  if (res.status === 400) {
    delete body.response_format;
    res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify(body),
    });
  }
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start < 0 || end < 0) throw new Error('No JSON in LLM response');
  return JSON.parse(content.slice(start, end + 1));
}

export async function organizeStory(rawText) {
  if (!process.env.OPENAI_API_KEY) return fallbackOrganize(rawText);
  try {
    const j = await callLLM(rawText);
    const loc = coerceLocation(j.location);
    const where = LOCATIONS.find(l => l.name === loc);
    return {
      title: String(j.title || 'Untitled story').slice(0, 100),
      summary: String(j.summary || '').slice(0, 500),
      location: loc,
      lng: where?.coords[0] ?? null,
      lat: where?.coords[1] ?? null,
      timeline: Array.isArray(j.timeline) ? j.timeline.slice(0, 8).map(n => ({
        y: String(n.y ?? ''), lab: String(n.lab ?? ''), t: String(n.t ?? ''),
        d: String(n.d ?? ''), ph: Array.isArray(n.ph) ? n.ph.slice(0, 3) : [], st: [],
      })) : [],
      stats: Array.isArray(j.stats) ? j.stats.slice(0, 6).map(s => [String(s[0] ?? ''), String(s[1] ?? '')]) : [],
      tags: Array.isArray(j.tags) ? j.tags.slice(0, 4).map(String) : [],
    };
  } catch (e) {
    console.warn('[llm] organize failed, falling back:', e.message);
    return fallbackOrganize(rawText);
  }
}

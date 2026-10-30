import { KNOWN_LOCATIONS, LOCATIONS } from './data.js';
import { coerceLocation } from './llm.js';

const SYSTEM_PROMPT = `You are a storytelling agent for Adream Charity Foundation, which runs education programs for rural Chinese children (Go Far study journeys, Dream Caravan, Dream Centers).
A teacher uploads raw materials about one student journey: task sheets, student reflections, teacher notes and photos.
Turn the materials into a structured English story journey — one core question, the turns the journey took, and the moments that matter.

Reply with ONLY valid JSON in this exact shape:
{
  "title": "short engaging English title, under 80 chars",
  "theme": "one-line journey theme, under 60 chars",
  "summary": "2-3 sentence English summary",
  "question": "the core research question the students set out to answer",
  "subQuestions": ["2-3 specific questions the students asked before departure"],
  "turns": [
    { "lab": "short phase label", "t": "phase title", "d": "1-2 sentence phase description", "ph": ["1-3 of: Preparation,Challenges,Field Work,Collaboration,Creation,Reflection,Outcomes"], "moments": [ { "t": "moment title", "d": "1 sentence detail" } ] }
  ],
  "openQuestions": [ { "q": "a new question this journey leaves for the next cohort", "d": "why it matters" } ],
  "outcomes": ["2-4 concrete outcomes the students produced or grew into"],
  "stats": [ ["value", "label"] ],
  "tags": ["2-4 lowercase tags"],
  "location": "one of: ${KNOWN_LOCATIONS.join(' | ')} — pick the closest match, default 'Uncategorized'"
}
Rules: 3-6 turns, 1-4 moments per turn, 2-4 openQuestions, chronological order. ALL text in English — translate any Chinese. Derive facts only from the materials and photos; never invent numbers or results.`;

const CN_CITY_LOC = [
  ['南京', 'Nanjing'], ['重庆', 'Chongqing'], ['北京', 'Beijing'], ['上海', 'Shanghai'],
  ['广州', 'Guangzhou'], ['深圳', 'Shenzhen'], ['成都', 'Chengdu'], ['昆明', 'Kunming'],
];

function fallbackLocation(text) {
  for (const [cn, en] of CN_CITY_LOC) {
    if (text.includes(cn) && LOCATIONS.some(l => l.name === en)) return en;
  }
  return 'Uncategorized';
}

const CN_DIGIT = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10' };

function pickStats(text) {
  const out = [];
  const add = (re, label) => {
    const m = text.match(re);
    if (m) out.push([CN_DIGIT[m[1]] || m[1], label]);
  };
  add(/(\d+|六|七|八|九)\s*名/, 'students');
  add(/(\d+|三|四|五|六|七)\s*天/, 'days');
  add(/(\d+)\s*张/, 'photos');
  add(/(\d+)\s*页/, 'pages');
  add(/(\d+)\s*本/, 'books');
  return out.slice(0, 4);
}

const TAG_WORDS = [
  ['建筑', 'architecture'], ['绘本', 'picture-book'], ['研学', 'study-journey'],
  ['合作', 'teamwork'], ['民国', 'heritage'], ['复盘', 'reflection'], ['探索', 'exploration'],
];

function pickTags(text) {
  const t = TAG_WORDS.filter(([k]) => text.includes(k)).map(([, v]) => v);
  if (!t.length) t.push('student-story');
  return [...new Set(t)].slice(0, 4);
}

export function fallbackStoryline(rawText) {
  const text = (rawText || '').trim();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const empty = () => ({
    title: 'Untitled journey', theme: '', summary: '', question: '', subQuestions: [],
    turns: [], openQuestions: [], outcomes: [], stats: [], tags: ['unedited'],
    location: 'Uncategorized', lng: null, lat: null, timeline: [], dataKind: 'provided',
  });
  if (!lines.length) return empty();

  const strip = l => l.replace(/^#{1,6}\s*/, '').replace(/^[-*]\s*/, '').trim();
  const title = strip(lines[0]).replace(/[：:].*$/, '').slice(0, 80) || 'Untitled journey';

  const qLine = lines.find(l => /核心研究问题|研究问题|研究主题/.test(l))
    || lines.find(l => /[？?]/.test(l) && !/^[-*]/.test(l));
  const question = qLine ? strip(qLine).replace(/^.*?[：:]\s*/, '').slice(0, 120) : '';
  const subQuestions = lines.filter(l => /^[-*]\s*.*[？?]/.test(l)).map(strip).slice(0, 3);

  const isMeta = l => /^(时间|日期|队员|带队|地点|指导)[：:]/.test(l) || l === lines[0];
  const sections = [];
  let sec = null;
  for (const l of lines) {
    if (/^#{1,4}\s+/.test(l)) {
      sec = { lab: strip(l).slice(0, 30), bullets: [], paras: [] };
      sections.push(sec);
      continue;
    }
    if (!sec) { sec = { lab: 'Journey', bullets: [], paras: [] }; sections.push(sec); }
    if (/^[-*]\s+/.test(l)) sec.bullets.push(strip(l));
    else if (l.length > 10 && !isMeta(l)) sec.paras.push(l.slice(0, 220));
  }

  const turns = sections
    .filter(s => s.lab !== title && (s.bullets.length || s.paras.length))
    .slice(0, 6)
    .map(s => ({
      lab: s.lab, t: s.lab, d: s.paras[0] || '', ph: ['Journey'],
      moments: (s.bullets.length ? s.bullets : s.paras).slice(0, 4).map(m => ({ t: m.slice(0, 80), d: '' })),
    }));

  const openSec = sections.find(s => /延伸|后续|接力|新问题/.test(s.lab));
  const openQuestions = (openSec ? openSec.bullets : []).slice(0, 4).map(q => ({ q: q.slice(0, 120), d: '' }));

  const outCands = sections.filter(s => /成果|收获|产出/.test(s.lab));
  const outSec = outCands.find(s => s.bullets.length) || outCands.find(s => s.paras.length);
  const outcomes = (outSec ? (outSec.bullets.length ? outSec.bullets : outSec.paras) : []).slice(0, 4).map(o => o.slice(0, 120));

  const location = fallbackLocation(text);
  const where = LOCATIONS.find(l => l.name === location);
  return {
    title, theme: '', summary: text.replace(/^#{1,6}\s+/gm, '').slice(0, 280),
    question, subQuestions, turns, openQuestions, outcomes,
    stats: pickStats(text), tags: pickTags(text),
    location, lng: where?.coords[0] ?? null, lat: where?.coords[1] ?? null,
    timeline: turns.map((t, i) => ({ y: `Phase ${i + 1}`, lab: t.lab, t: t.t, d: t.d, ph: t.ph, st: [], moments: t.moments })),
    dataKind: 'provided',
  };
}

function normalize(j) {
  const loc = coerceLocation(j.location);
  const where = LOCATIONS.find(l => l.name === loc);
  const turns = (Array.isArray(j.turns) ? j.turns : []).slice(0, 6).map(t => ({
    lab: String(t.lab || 'Phase'), t: String(t.t || t.lab || ''),
    d: String(t.d || ''), ph: Array.isArray(t.ph) ? t.ph.slice(0, 3) : [],
    moments: (Array.isArray(t.moments) ? t.moments : []).slice(0, 4).map(m => ({ t: String(m.t || ''), d: String(m.d || '') })),
  })).filter(t => t.t || t.moments.length);
  return {
    title: String(j.title || 'Untitled journey').slice(0, 100),
    theme: String(j.theme || '').slice(0, 80),
    summary: String(j.summary || '').slice(0, 500),
    question: String(j.question || '').slice(0, 200),
    subQuestions: (Array.isArray(j.subQuestions) ? j.subQuestions : []).slice(0, 3).map(String),
    turns,
    openQuestions: (Array.isArray(j.openQuestions) ? j.openQuestions : []).slice(0, 4)
      .map(o => ({ q: String(o?.q || ''), d: String(o?.d || '') })),
    outcomes: (Array.isArray(j.outcomes) ? j.outcomes : []).slice(0, 4).map(String),
    stats: (Array.isArray(j.stats) ? j.stats : []).slice(0, 6).map(s => [String(s?.[0] ?? ''), String(s?.[1] ?? '')]),
    tags: (Array.isArray(j.tags) ? j.tags : []).slice(0, 4).map(String),
    location: loc, lng: where?.coords[0] ?? null, lat: where?.coords[1] ?? null,
    timeline: turns.map((t, i) => ({ y: `Phase ${i + 1}`, lab: t.lab, t: t.t, d: t.d, ph: t.ph, st: [], moments: t.moments })),
    dataKind: 'provided',
  };
}

async function callLLM(text, images) {
  const { OPENAI_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL } = process.env;
  const base = (OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = OPENAI_MODEL || 'glm-4.5v-flash';
  const content = [{ type: 'text', text: text.slice(0, 8000) }];
  for (const im of (images || []).slice(0, 4)) {
    content.push({ type: 'image_url', image_url: { url: `data:${im.mime || 'image/jpeg'};base64,${im.b64}` } });
  }
  const body = {
    model,
    temperature: 0.3,
    max_tokens: 3000,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content }],
    response_format: { type: 'json_object' },
  };
  // Qwen3 family spends the output budget on reasoning unless told not to
  if (process.env.OPENAI_DISABLE_THINKING === '1') body.enable_thinking = false;
  const post = () => fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify(body),
  });
  let res = await post();
  if (res.status === 400 && body.response_format) { delete body.response_format; res = await post(); }
  if (res.status === 400 && content.length > 1) { body.messages[1].content = content[0]; res = await post(); }
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
  const data = await res.json();
  const out = data.choices?.[0]?.message?.content || '';
  const start = out.indexOf('{');
  const end = out.lastIndexOf('}');
  if (start < 0 || end < 0) throw new Error('No JSON in LLM response');
  return JSON.parse(out.slice(start, end + 1));
}

export async function generateStoryline({ text, images = [] }) {
  if (!process.env.OPENAI_API_KEY) return { data: fallbackStoryline(text), engine: 'fallback' };
  try {
    return {
      data: normalize(await callLLM(text, images)),
      engine: 'llm',
      model: process.env.OPENAI_MODEL || 'glm-4.5v-flash',
    };
  } catch (e) {
    console.warn('[agent] LLM failed, using fallback:', e.message);
    return { data: fallbackStoryline(text), engine: 'fallback' };
  }
}

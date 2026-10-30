import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { STATIC } from '../static.js';

async function resizeImage(file, maxDim = 1280, quality = 0.85) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error('Could not read image'));
      i.src = url;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function DraftPreview({ data, meta, phase, busy, onPublish }) {
  if (phase === 'loading') {
    return (
      <div className="tc-card tc-preview">
        <div className="status-panel processing" style={{ marginTop: 0 }}><span className="spinner" />The agent is reading your materials and writing the storyline…</div>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="tc-card tc-preview">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          {data.theme && <div className="eyebrow" style={{ fontSize: 11 }}>{data.theme}</div>}
          <h2 style={{ fontSize: 24, marginTop: data.theme ? 6 : 0 }}>{data.title}</h2>
        </div>
        <span className={`tc-engine ${meta?.engine === 'llm' ? 'llm' : 'fallback'}`}>
          {meta?.engine === 'llm' ? `AI engine · ${meta?.model}` : 'Offline organizer · no API key'}
        </span>
      </div>
      {data.summary && <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 10 }}>{data.summary}</p>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        <span className="tag" style={{ background: '#14324a' }}>{data.location}</span>
        {data.tags.map(t => <span key={t} className="tag" style={{ background: '#3d5f83' }}>{t}</span>)}
      </div>

      {data.question && (
        <div className="q-card">
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>The question</div>
          <div className="q">{data.question}</div>
          {data.subQuestions.length > 0 && (
            <div className="subq">{data.subQuestions.map((q, i) => <span key={i}>{q}</span>)}</div>
          )}
        </div>
      )}

      <h3 className="tc-sec">The turns</h3>
      {data.turns.map((t, i) => (
        <div className="turn" key={i}>
          <div className="turn-head">
            <span className="lab">{t.lab}</span>
            <h4>{t.t}</h4>
          </div>
          {t.d && <p className="d">{t.d}</p>}
          {t.moments.length > 0 && (
            <div className="moments">
              {t.moments.map((m, j) => (
                <div className="moment" key={j}><b>{m.t}</b><span>{m.d}</span></div>
              ))}
            </div>
          )}
        </div>
      ))}

      {data.openQuestions.length > 0 && (
        <>
          <h3 className="tc-sec">Left for the next cohort</h3>
          {data.openQuestions.map((o, i) => (
            <div className="oop" key={i}><b>{i + 1}. {o.q}</b>{o.d && <span> — {o.d}</span>}</div>
          ))}
        </>
      )}

      {(data.outcomes.length > 0 || data.stats.length > 0) && (
        <>
          <h3 className="tc-sec">Outcomes</h3>
          {data.outcomes.map((o, i) => <div className="oop" key={i}>{o}</div>)}
          {data.stats.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {data.stats.map((s, i) => (
                <span className="tl-stat" key={i}>{s[0]} <i>{s[1]}</i></span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="pub-bar">
        {phase === 'published' ? (
          <div className="status-panel ready" style={{ flex: 1, marginTop: 0 }}>
            Storyline published! <Link to={`/story/${meta.id}`} style={{ fontWeight: 700, textDecoration: 'underline' }}>View the story page →</Link>{' '}
            <Link to="/" style={{ fontWeight: 700, textDecoration: 'underline' }}>See it on the map</Link>
          </div>
        ) : (
          <>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Review the draft, then publish it to the website.</span>
            <button className="btn btn-primary" disabled={busy} onClick={onPublish}>{busy ? 'Publishing…' : 'Publish to website'}</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function TeacherPage() {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [draft, setDraft] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');
  const [sampleSet, setSampleSet] = useState(null);
  const fileRef = useRef(null);

  const addFiles = (list) => {
    const imgs = [...list].filter(f => f.type.startsWith('image/'));
    setImages(prev => [...prev, ...imgs.map(file => ({ file, url: URL.createObjectURL(file) }))].slice(0, 8));
  };

  const loadSample = async (set) => {
    setBusy(true); setError(''); setPhase('idle'); setDraft(null);
    try {
      const s = await api.agentSamples(set);
      setSampleSet(set);
      setText(s.text);
      const files = await Promise.all(s.images.map(async (u) => {
        const r = await fetch(u);
        const b = await r.blob();
        return new File([b], u.split('/').pop(), { type: b.type || 'image/png' });
      }));
      setImages(files.map(file => ({ file, url: URL.createObjectURL(file) })));
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  };

  const generate = async () => {
    if (!text.trim() && images.length === 0) return;
    setBusy(true); setError(''); setPhase('loading'); setDraft(null);
    try {
      const files = STATIC ? [] : await Promise.all(images.map(i => resizeImage(i.file)));
      const res = await api.agentGenerate(text, files, sampleSet);
      setDraft(res.data);
      setMeta({ engine: res.engine, model: res.model, id: res.id });
      setPhase('draft');
    } catch (e) {
      setError(e.message); setPhase('idle');
    }
    setBusy(false);
  };

  const publish = async () => {
    setBusy(true);
    try {
      const r = await api.agentPublish(meta.id, draft);
      if (r.id) setMeta(m => ({ ...m, id: r.id }));
      setPhase('published');
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  };

  return (
    <div className="container page">
      <span className="eyebrow">Teacher AI Studio</span>
      <h1 style={{ fontSize: 34, marginTop: 12 }}>Turn raw materials into a story journey</h1>
      <p className="sec-sub" style={{ marginTop: 8 }}>
        Paste scattered notes and drop in photos. The agent reads everything — including the pictures —
        and drafts a journey with one core question, its turns, its moments, and the questions it leaves for the next cohort.
      </p>

      {STATIC && (
        <div className="tc-hint" style={{ marginTop: 16, background: '#fff7e6', borderLeft: '3px solid var(--gold)', padding: '12px 16px', borderRadius: 10 }}>
          <b>Public demo build.</b> Live generation runs on the local server. Load a sample and hit
          <b> Generate storyline</b> to replay the AI draft produced from those same materials; publishing adds it
          to this browser's map and story list.
        </div>
      )}

      <div className="tc-grid">
        <div className="tc-card">
          <h3>1 · Materials</h3>
          <textarea
            placeholder={'Paste raw notes here — task sheets, student reflections, teacher logs…\n\nExample:\n核心研究问题：民国建筑有什么特别？\n屋顶为什么大多是斜的？…'}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <label className="file" style={{ display: 'block', marginTop: 14 }}>
            <div className="file-box" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
              Drop photos here or click to browse — .jpg / .png images are read by the agent; .txt / .md notes are merged into the text.
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,.txt,.md,text/*" hidden
              onChange={e => addFiles(e.target.files)} />
          </label>
          {images.length > 0 && (
            <div className="tc-thumbs">
              {images.map((im, i) => (
                <div className="tc-thumb" key={i}>
                  <img src={im.url} alt="" />
                  <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
          )}
          <div className="tc-actions">
            <button className="btn btn-line" disabled={busy} onClick={() => loadSample('nanjing')}>Sample · Nanjing</button>
            <button className="btn btn-line" disabled={busy} onClick={() => loadSample('hongyadong')}>Sample · Hongyadong</button>
            <button className="btn btn-line" disabled={busy || (!text && images.length === 0)} onClick={() => { setText(''); setImages([]); setDraft(null); setPhase('idle'); setError(''); }}>Clear</button>
            <button className="btn btn-primary" disabled={busy || (!text.trim() && images.length === 0)} onClick={generate}>
              {busy ? 'Generating…' : 'Generate storyline'}
            </button>
          </div>
          {error && <div className="status-panel error">{error}</div>}
          <div className="tc-hint">
            {STATIC
              ? 'Static demo: drafts are pre-generated from the bundled samples. Run the app locally (npm run dev) with an API key for live generation from your own materials.'
              : <>Engine: if <b>server/.env</b> has OPENAI_API_KEY, the agent uses a vision LLM (GLM / Qwen / any OpenAI-compatible API)
            and reads the photos too. Without a key it falls back to an offline organizer so the demo still works.</>}
          </div>
        </div>

        <div>
          <div className="tc-side-h"><h3>2 · Storyline draft</h3></div>
          {phase === 'idle' && (
            <div className="tc-card tc-preview empty" style={{ padding: '60px 30px' }}>
              <p>The generated journey will appear here —<br />question, turns, moments and the questions left behind.</p>
            </div>
          )}
          <DraftPreview data={draft} meta={meta} phase={phase} busy={busy} onPublish={publish} />
        </div>
      </div>
    </div>
  );
}

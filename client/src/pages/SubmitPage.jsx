import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function SubmitPage() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({ state: 'idle' });
  const fileRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && files.length === 0) return;
    setStatus({ state: 'processing' });
    try {
      const { id } = await api.submit({ text, files });
      setStatus({ state: 'processing', id });
      const poll = async () => {
        try {
          const s = await api.story(id);
          if (s.status === 'ready') {
            setStatus({ state: 'ready', story: s });
            return;
          }
        } catch { /* keep polling */ }
        setTimeout(poll, 2500);
      };
      setTimeout(poll, 2500);
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="container page">
      <span className="eyebrow">For field staff & teachers</span>
      <h1 style={{ fontSize: 36, marginTop: 12 }}>Submit a story</h1>
      <p className="sec-sub" style={{ marginTop: 8 }}>
        Paste raw notes or upload text files. The AI editor organizes them into a structured story page —
        timeline, phases and tags — saving hours of manual layout.
      </p>

      <form className="form-card" onSubmit={submit}>
        <textarea
          placeholder={'Paste the raw story here…\n\nExample:\nIn June 2025 our school in Wuzhishan, Hainan organized a robotics club. Ten kids built a water-quality robot in 2024. In 2025 they won the provincial contest and visited Guangzhou for the first time.'}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <label className="file">
          <div className="file-box" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFiles([...files, ...e.dataTransfer.files]); }}>
            Drop files here or click to browse — .txt / .md files are analyzed; images are stored as attachments.
          </div>
          <input ref={fileRef} type="file" multiple accept=".txt,.md,text/*,image/*" hidden
            onChange={e => setFiles([...files, ...e.target.files])} />
        </label>
        {files.length > 0 && <div className="file-list">{files.map((f, i) => <span key={i} style={{ marginRight: 12 }}>📎 {f.name}</span>)}</div>}

        <div style={{ marginTop: 22, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-primary" disabled={status.state === 'processing' || (!text.trim() && files.length === 0)}>
            {status.state === 'processing' ? 'Organizing…' : 'Submit & organize'}
          </button>
          {(text.trim() || files.length > 0) && (
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              {text.trim() ? `${text.trim().length} chars` : ''}{text.trim() && files.length > 0 ? ' · ' : ''}{files.length > 0 ? `${files.length} file(s)` : ''}
            </span>
          )}
        </div>

        {status.state === 'processing' && (
          <div className="status-panel processing"><span className="spinner" />The AI editor is reading and organizing your story…</div>
        )}
        {status.state === 'ready' && (
          <div className="status-panel ready">
            Your story page is ready! <Link to={`/story/${status.story.id}`} style={{ fontWeight: 700, textDecoration: 'underline' }}>View it here →</Link>
          </div>
        )}
        {status.state === 'error' && (
          <div className="status-panel error">Submission failed: {status.message}</div>
        )}
      </form>

      <p style={{ marginTop: 18, fontSize: 12.5, color: 'var(--ink-soft)', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
        Note: without an LLM key configured on the server, stories fall back to a simple auto-summary.
        Connect DeepSeek / Qwen / GLM / OpenAI via server/.env to enable full AI organization.
      </p>
    </div>
  );
}

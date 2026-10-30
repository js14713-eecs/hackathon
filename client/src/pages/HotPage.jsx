import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, timeAgo } from '../api.js';
import { asset } from '../static.js';

export default function HotPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stories('hot').then(s => { setStories(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const like = async (id, i) => {
    setStories(prev => prev.map((s, j) => (j === i ? { ...s, likes: s.likes + 1 } : s)));
    try {
      const r = await api.like(id);
      setStories(prev => prev.map((s, j) => (j === i ? { ...s, likes: r.likes } : s)));
    } catch {
      setStories(prev => prev.map((s, j) => (j === i ? { ...s, likes: s.likes - 1 } : s)));
    }
  };

  return (
    <div className="container page">
      <span className="eyebrow">Trending now</span>
      <h1 style={{ fontSize: 36, marginTop: 12 }}>Hottest stories this week</h1>
      <p className="sec-sub" style={{ marginTop: 8 }}>
        Ranked by likes and freshness — the stories the community is reading right now.
      </p>
      {loading ? (
        <div className="empty">Loading…</div>
      ) : stories.length === 0 ? (
        <div className="empty">No stories yet — be the first to <Link to="/submit" style={{ color: 'var(--orange)', fontWeight: 700 }}>submit one</Link>.</div>
      ) : (
        <div className="hot-list">
          {stories.map((s, i) => (
            <div className="hot-item" key={s.id}>
              <div className="hot-rank">{i + 1}</div>
              <img src={asset(s.image || '/img/hero.png')} alt="" />
              <div>
                <h3><Link to={`/story/${s.id}`}>{s.title}</Link></h3>
                <p>{s.summary}</p>
                <div className="hot-meta">
                  {s.location} · {timeAgo(s.created_at)} · {s.tags.map(t => `#${t}`).join(' ')}
                </div>
              </div>
              <button className="like-btn" onClick={() => like(s.id, i)}>♥ {s.likes}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, timeAgo } from '../api.js';
import Timeline from '../components/Timeline.jsx';

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setStory(null); setError(false);
    api.story(id)
      .then(s => { setStory(s); setLikes(s.likes); })
      .catch(() => setError(true));
  }, [id]);

  const like = async () => {
    if (liked) return;
    setLiked(true);
    setLikes(l => l + 1);
    try {
      const r = await api.like(id);
      setLikes(r.likes);
    } catch {
      setLikes(l => l - 1);
      setLiked(false);
    }
  };

  if (error) {
    return (
      <div className="container page empty">
        <h2 style={{ fontSize: 28 }}>Story not found</h2>
        <p style={{ margin: '10px 0 20px' }}>It may still be processing, or the link is wrong.</p>
        <Link className="btn btn-primary" to="/">Back to the map</Link>
      </div>
    );
  }
  if (!story) return <div className="container page empty">Loading…</div>;

  return (
    <div className="container page">
      <Link className="back-link" to="/">← Back to the map</Link>
      <div className="story-hero">
        <span className="eyebrow">Community Story · AI-organized draft</span>
        <h1>{story.title}</h1>
        <p className="sum">{story.summary}</p>
        <div className="story-meta">
          <span className="meta-item">📍 {story.location}</span>
          <span className="meta-item">🕐 {timeAgo(story.created_at)}</span>
          {story.tags.map((t, i) => <span className="meta-item" key={i}>#{t}</span>)}
          <button className={`like-btn${liked ? ' liked' : ''}`} onClick={like}>
            ♥ {likes} {likes === 1 ? 'like' : 'likes'}
          </button>
        </div>
      </div>

      {story.timeline?.length > 0 && <Timeline nodes={story.timeline} color="#4caf7d" summary="Organized by the AI editor from the submitted material — pending editorial review." />}

      {story.stats?.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
          {story.stats.map((s, i) => (
            <span className="tl-stat" key={i} style={{ padding: '10px 18px', fontSize: 14 }}>{s[0]} <i>{s[1]}</i></span>
          ))}
        </div>
      )}

      {story.attachments?.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 17, marginBottom: 10 }}>Original attachments</h3>
          {story.attachments.map(a => (
            <a key={a.id} className="attach" href={`/uploads/${a.path}`} target="_blank" rel="noopener noreferrer">
              📎 {a.filename}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

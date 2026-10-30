import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, timeAgo } from '../api.js';
import Timeline from '../components/Timeline.jsx';
import { imageAttachmentUrl } from '../attachment.js';

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

  const openQuestions = story.storyline?.openQuestions?.length
    ? story.storyline.openQuestions.map(item => typeof item === 'string' ? { q: item, d: '' } : item)
    : [
        { q: `What changed after ${story.title}?`, d: 'Look for evidence that the next cohort can compare.' },
        { q: 'What question did this journey leave unanswered?', d: 'Turn one loose end into a new field study.' },
        { q: 'How could another team test these findings?', d: 'Suggest a practical next step, interview, or experiment.' },
      ];
  const imageAttachments = (story.attachments || [])
    .map(a => ({ ...a, url: imageAttachmentUrl(a, import.meta.env.BASE_URL) }))
    .filter(a => a.url);

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

      {imageAttachments.length > 0 && (
        <section className="story-gallery">
          <div className="story-gallery-head">
            <span className="eyebrow">ORIGINAL FIELD MATERIALS</span>
            <h2>Created by the students</h2>
            <p>These posters, drawings, and notes are the evidence behind this journey.</p>
          </div>
          <div className="story-gallery-grid">
            {imageAttachments.map((a, index) => (
              <a href={a.url} target="_blank" rel="noopener noreferrer" key={a.id} className={index === 0 ? 'featured' : ''}>
                <img src={a.url} alt={`Student-created project material: ${a.filename}`} />
                <span>{a.filename}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="relay-cta">
        <div className="relay-cta-copy">
          <span className="eyebrow">PASS THE TORCH</span>
          <h2>Questions for the next cohort</h2>
          <p>Every journey should leave a door open. Pick a question, add your idea, and help the next group decide where to begin.</p>
        </div>
        <div className="relay-question-list">
          {openQuestions.slice(0, 3).map((item, index) => (
            <Link
              className="relay-question"
              key={`${item.q}-${index}`}
              to={`/story/${id}/relay?q=${encodeURIComponent(item.q)}`}
            >
              <span>0{index + 1}</span>
              <div><b>{item.q}</b>{item.d && <small>{item.d}</small>}</div>
              <i>Continue →</i>
            </Link>
          ))}
        </div>
      </section>

      {story.attachments?.some(a => !imageAttachmentUrl(a, import.meta.env.BASE_URL)) && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 17, marginBottom: 10 }}>Original attachments</h3>
          {story.attachments.filter(a => !imageAttachmentUrl(a, import.meta.env.BASE_URL)).map(a => (
            <a key={a.id} className="attach" href={`/uploads/${a.path}`} target="_blank" rel="noopener noreferrer">
              📎 {a.filename}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

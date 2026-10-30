import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, timeAgo } from '../api.js';
import Timeline from '../components/Timeline.jsx';
import { imageAttachmentUrl } from '../attachment.js';
import { attachTeacherNote, attachTimelineMedia } from '../timelineMedia.js';
import { MIAO_YEAR_TWO } from '../cohortTimeline.js';

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [cohortYear, setCohortYear] = useState(1);

  useEffect(() => {
    setStory(null); setError(false);
    setCohortYear(1);
    api.story(id)
      .then(s => { setStory(s); setLikes(s.likes); })
      .catch(() => setError(true));
  }, [id]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const close = event => event.key === 'Escape' && setLightbox(null);
    document.addEventListener('keydown', close);
    document.body.classList.add('lightbox-open');
    return () => {
      document.removeEventListener('keydown', close);
      document.body.classList.remove('lightbox-open');
    };
  }, [lightbox]);

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
  const mediaOrder = String(id) === '15' ? [3, 1, 0, 2] : imageAttachments.map((_, index) => index);
  const timelineWithMedia = attachTimelineMedia(story.timeline, imageAttachments, mediaOrder);
  const timeline = String(id) === '15'
    ? attachTeacherNote(timelineWithMedia, 2, 'Teacher note: This is the turning point—students moved beyond collecting facts and began listening for the passion, difficulty, and human choices behind cultural inheritance.')
    : timelineWithMedia;
  const hasMultiYearStory = String(id) === '15';
  const activeTimeline = hasMultiYearStory && cohortYear === 2 ? MIAO_YEAR_TWO : timeline;

  return (
    <div className="container page">
      <Link className="back-link" to="/">← Back to the map</Link>
      <div className="story-hero">
        <span className="eyebrow">Community Story · AI-organized draft</span>
        <h1>{story.title}</h1>
        {hasMultiYearStory && (
          <div className="cohort-tabs" role="tablist" aria-label="Explore this place across years">
            <button type="button" role="tab" aria-selected={cohortYear === 1} className={cohortYear === 1 ? 'active' : ''} onClick={() => setCohortYear(1)}>
              <b>Year 1</b><span>Original journey</span>
            </button>
            <button type="button" role="tab" aria-selected={cohortYear === 2} className={cohortYear === 2 ? 'active' : ''} onClick={() => setCohortYear(2)}>
              <b>Year 2</b><span>Next cohort relay</span>
            </button>
          </div>
        )}
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

      {activeTimeline?.length > 0 && (
        <Timeline
          nodes={activeTimeline}
          color="#4caf7d"
          summary={cohortYear === 2 ? 'AI-generated continuation concept: the next cohort returns to the same place, compares change, and passes the work forward.' : 'Organized by the AI editor from the submitted material — pending editorial review.'}
          onImageOpen={setLightbox}
        />
      )}

      {cohortYear === 1 && story.stats?.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
          {story.stats.map((s, i) => (
            <span className="tl-stat" key={i} style={{ padding: '10px 18px', fontSize: 14 }}>{s[0]} <i>{s[1]}</i></span>
          ))}
        </div>
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

      {lightbox && (
        <div className="story-lightbox" role="dialog" aria-modal="true" aria-label="Project image preview" onClick={() => setLightbox(null)}>
          <button type="button" className="story-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image preview">×</button>
          <figure onClick={event => event.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.filename || 'Student-created project material'} />
            {lightbox.filename && <figcaption>{lightbox.filename}</figcaption>}
          </figure>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api, timeAgo } from '../api.js';
import { addRelayIdea, readRelayCredits, readRelayIdeas } from '../relayStore.js';

export default function RelayPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const question = params.get('q') || 'What should the next cohort explore?';
  const [story, setStory] = useState(null);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [ideas, setIdeas] = useState(() => readRelayIdeas(localStorage, id, question));
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState(() => readRelayCredits(localStorage));

  useEffect(() => { api.story(id).then(setStory).catch(() => setStory(false)); }, [id]);
  useEffect(() => { setIdeas(readRelayIdeas(localStorage, id, question)); }, [id, question]);

  const starterPrompts = useMemo(() => [
    'What would you observe or measure?',
    'Who could you interview?',
    'What could you build or test?',
  ], []);

  const submit = e => {
    e.preventDefault();
    try {
      const saved = addRelayIdea(localStorage, { storyId: id, question, author, comment });
      setIdeas(current => [...current, saved]);
      setCredits(readRelayCredits(localStorage));
      setComment('');
      setMessage('+10 Credits earned! Your idea is now part of the relay.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (story === null) return <div className="container page empty">Loading relay…</div>;
  if (story === false) return <div className="container page empty">Story not found.</div>;

  return (
    <div className="container page relay-page">
      <Link className="back-link" to={`/story/${id}`}>← Back to the journey</Link>
      <section className="relay-hero">
        <div className="relay-hero-top">
          <span className="eyebrow">NEXT COHORT RELAY</span>
          <div className="credit-balance"><span>✦</span><b>{credits}</b> Credits</div>
        </div>
        <p className="relay-origin">Inspired by {story.title}</p>
        <h1>{question}</h1>
        <p>Leave one practical thought for the students who continue this journey. A small observation can become their starting point.</p>
      </section>

      <div className="relay-grid">
        <section className="relay-panel">
          <span className="eyebrow">START WITH ONE MOVE</span>
          <div className="relay-prompts">
            {starterPrompts.map(prompt => <button type="button" key={prompt} onClick={() => setComment(prompt + ' ')}>{prompt}</button>)}
          </div>
          <form onSubmit={submit} className="relay-form">
            <label>Your name or team <span>optional</span></label>
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. Class 6 · Dream Team" />
            <label>Your idea for the next cohort</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Suggest a question, field method, interview, experiment, or place to visit…" rows="6" />
            <button className="btn btn-primary" type="submit">Add idea · Earn 10 Credits →</button>
            {message && <p className="relay-message">{message}</p>}
          </form>
        </section>

        <section className="relay-panel relay-board">
          <div className="relay-board-head"><span className="eyebrow">IDEAS LEFT BEHIND</span><strong>{ideas.length}</strong></div>
          {ideas.length === 0 ? (
            <div className="relay-empty"><b>Be the first to pass the torch.</b><p>Your idea will appear here after submission.</p></div>
          ) : ideas.map(idea => (
            <article className="relay-idea" key={idea.id}>
              <p>{idea.comment}</p>
              <span>{idea.author} · {timeAgo(idea.createdAt)} <i>+{idea.creditsEarned || 10} Credits</i></span>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

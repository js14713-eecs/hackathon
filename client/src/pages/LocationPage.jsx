import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, TYPES } from '../api.js';
import Timeline from '../components/Timeline.jsx';

export default function LocationPage() {
  const { id } = useParams();
  const [loc, setLoc] = useState(null);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setLoc(null); setError(false); setActive(0);
    api.location(id).then(setLoc).catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="container page empty">
        <h2 style={{ fontSize: 28 }}>Location not found</h2>
        <p style={{ margin: '10px 0 20px' }}>This place isn't on the map yet.</p>
        <Link className="btn btn-primary" to="/">Back to the map</Link>
      </div>
    );
  }
  if (!loc) return <div className="container page empty">Loading…</div>;

  const project = loc.projects[active];
  const type = TYPES[project.type] || { label: '', color: '#f5a623' };

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link to="/">Impact Map</Link> / China / <b>{loc.name}</b>
      </div>
      <div className="loc-head">
        <div>
          <h1>{loc.name} · Project Stories</h1>
          <div className="loc-tags">
            {[...new Set(loc.projects.map(p => p.type))].map(t => (
              <span key={t} className="tag" style={{ background: TYPES[t].color }}>{TYPES[t].label}</span>
            ))}
          </div>
          <p className="sec-sub" style={{ marginTop: 10 }}>{loc.tagline}</p>
        </div>
        <div className="loc-stats">
          {loc.stats.map((s, i) => (
            <div className="loc-stat" key={i}><b>{s[0]}</b><span>{s[1]}</span></div>
          ))}
        </div>
      </div>

      <div className="proj-grid">
        {loc.projects.map((p, i) => {
          const t = TYPES[p.type] || { label: '', color: '#f5a623' };
          return (
            <div key={p.id} className={`card proj-card${i === active ? ' active' : ''}`} onClick={() => setActive(i)}>
              <div className="pic">
                <span className="type-badge" style={{ background: t.color }}>{t.label}</span>
                <img src={p.img} alt="" />
              </div>
              <div className="body">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="meta">
                  <span>Editions: <b>{p.years}</b></span>
                  <span><b>{p.timeline.length}</b> milestones</span>
                </div>
                <div className="go">{i === active ? 'View its timeline ↓' : 'View its timeline'}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Timeline nodes={project.timeline} color={type.color} summary={project.summary} />
    </div>
  );
}

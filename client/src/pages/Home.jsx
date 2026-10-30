import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, timeAgo } from '../api.js';
import ChinaMap from '../components/ChinaMap.jsx';

const FILTERS = [
  ['all', 'All'],
  ['qyf', 'Go Far'],
  ['caravan', 'Dream Caravan'],
  ['sports', 'Sports Dream'],
  ['border', 'Border School'],
];

export default function Home() {
  const [mapData, setMapData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [info, setInfo] = useState(null);
  const [stories, setStories] = useState([]);
  const [impacts, setImpacts] = useState([]);

  useEffect(() => {
    api.map().then(setMapData).catch(e => console.error(e));
    api.stories('hot').then(setStories).catch(() => {});
    api.impacts().then(setImpacts).catch(() => {});
  }, []);

  return (
    <>
      <header className="hero">
        <div className="container">
          <div>
            <span className="eyebrow">Shanghai Adream Charity Foundation · Impact Showcase</span>
            <h1>Every journey<br />deserves <em>to be seen</em></h1>
            <p className="lead">
              For 12 years, children across 30 provinces have planned their own routes, managed their own budgets,
              and traveled to their own faraway places. This map records every step — proof of change for donors,
              and courage for the next generation.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#map">Explore the Map</a>
              <Link className="btn btn-line" to="/location/yunnan">See the Timelines</Link>
            </div>
            <div className="hero-stats">
              <div className="hstat"><b>12<i> editions</i></b><span>of the Go Far program</span></div>
              <div className="hstat"><b>30<i> provinces</i></b><span>where children set off</span></div>
              <div className="hstat"><b>3,600<i>+</i></b><span>journey teams on the road</span></div>
              <div className="hstat"><b>1.9<i>M+</i></b><span>children took the course</span></div>
            </div>
          </div>
          <div className="hero-art">
            <img src="/img/hero.png" alt="Children on a hillside looking at a distant city" />
            <div className="float-card fc-1">2025 edition · 467 teams on the road<small>Destinations: Qingdao · Beijing · Shanghai…</small></div>
            <div className="float-card fc-2">First sight of the sea<small>Shunchang, Fujian → Qingdao</small></div>
          </div>
        </div>
      </header>

      <section id="map" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="map-wrap">
            <div className="map-head">
              <div>
                <h2>Every glowing point is a place where journeys happened</h2>
                <p>Click a province or marker to open its projects · scroll to zoom, drag to pan</p>
              </div>
              <div className="chips">
                {FILTERS.map(([k, label]) => (
                  <button key={k} className={`chip${filter === k ? ' active' : ''}`} onClick={() => setFilter(k)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="map-stage">
              {mapData ? (
                <ChinaMap mapData={mapData} filter={filter} onProvinceInfo={name => setInfo(name)} />
              ) : (
                <div className="map-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9db4c8' }}>
                  Loading map…
                </div>
              )}
              {info && (
                <div className="map-info" onClick={() => setInfo(null)}>
                  <h4>{info}</h4>
                  The Go Far course is running here — journey teams are on their way.
                  A detailed story page is coming soon.
                </div>
              )}
              <div className="map-legend">
                <span><i style={{ background: '#f5a623' }} />Story location</span>
                <span><i style={{ background: '#3d5f83' }} />Go Far course province</span>
                <span><i style={{ background: '#233f59' }} />Coming soon</span>
                <span><i style={{ background: '#7fd1c0', borderRadius: '50%' }} />Community story</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="container">
          <span className="eyebrow">Impact at a glance</span>
          <h2 className="sec-h" style={{ color: '#fff' }}>Behind every number is a child</h2>
          <p className="sec-sub">Figures compiled from Adream Foundation public reports (through 2025; some are illustrative).</p>
          <div className="impact-grid">
            {impacts.map((c, i) => (
              <div className="impact-card" key={i}><b>{c.fmt}</b><span>{c.txt}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <span className="eyebrow">Student Stories</span>
          <h2 className="sec-h">This is what "far away" sounds like</h2>
          <p className="sec-sub">The best reply to donors — and the best invitation to the next class of kids.</p>
          <div className="story-grid">
            {stories.slice(0, 4).map(s => (
              <Link to={`/story/${s.id}`} className="card story-card" key={s.id}>
                <div className="pic"><img src={s.image || '/img/hero.png'} alt="" /></div>
                <div className="body">
                  <div className="quote">{s.title}</div>
                  <div className="who">{s.location} · {timeAgo(s.created_at)} · {s.likes} likes</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Link className="btn btn-line" to="/hot">View trending stories →</Link>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Join the story</span>
          <h2 className="sec-h">Do you want to be part of it?</h2>
          <div className="join-grid">
            <div className="join-card join-donor">
              <h3>I want to support these children</h3>
              <p>Every donation becomes a Dream Course, a train ticket, a chance to see the world. Your support is recorded in these timelines.</p>
              <a className="btn" href="https://www.adream.org/" target="_blank" rel="noopener noreferrer">Donate →</a>
            </div>
            <div className="join-card join-kid">
              <h3>Next stop: your turn to depart</h3>
              <p>If you're a student at a Dream Center school, join the Go Far course and design your own journey with your team.</p>
              <a className="btn" href="https://www.adream.org/theme-activities" target="_blank" rel="noopener noreferrer">See activities →</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

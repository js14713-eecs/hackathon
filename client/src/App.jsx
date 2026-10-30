import { Routes, Route, NavLink, Outlet, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LocationPage from './pages/LocationPage.jsx';
import StoryPage from './pages/StoryPage.jsx';
import SubmitPage from './pages/SubmitPage.jsx';
import HotPage from './pages/HotPage.jsx';
import TeacherPage from './pages/TeacherPage.jsx';

const Heart = () => (
  <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.2 5c2.2 0 3.6 1.2 4.4 2.5L12 9l1.4-1.5C14.2 6.2 15.6 5 17.8 5c3.6 0 5.5 3.6 3.9 6.8C19.5 16.1 12 21 12 21z"/></svg>
);

function Nav() {
  return (
    <nav>
      <div className="container nav-inner">
        <Link className="logo" to="/">
          <span className="logo-mark"><Heart /></span>
          <span>ADREAM<small>JOURNEYS · IMPACT MAP</small></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Map</NavLink>
          <NavLink to="/hot">Trending</NavLink>
          <NavLink to="/teacher">Teacher AI</NavLink>
          <NavLink to="/submit">Submit a Story</NavLink>
        </div>
        <a className="btn btn-primary" style={{ padding: '9px 20px', fontSize: 14 }} href="https://www.adream.org/" target="_blank" rel="noopener noreferrer">Donate</a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <Link className="logo" to="/" style={{ color: '#fff', marginBottom: 12 }}>
              <span className="logo-mark"><Heart /></span>
              <span>ADREAM<small>JOURNEYS</small></span>
            </Link>
            <p style={{ maxWidth: 380 }}>
              Mission: education drives social progress.<br />
              Vision: help children grow with confidence, ease and dignity.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <Link to="/">Impact Map</Link>
            <Link to="/hot">Trending Stories</Link>
            <Link to="/teacher">Teacher AI</Link>
            <Link to="/submit">Submit a Story</Link>
          </div>
          <div>
            <h5>Links</h5>
            <a href="https://www.adream.org/" target="_blank" rel="noopener noreferrer">Adream Foundation</a>
            <a href="https://www.adream.org/theme-activities" target="_blank" rel="noopener noreferrer">Theme Activities</a>
          </div>
        </div>
        <div className="foot-note">
          Hackathon prototype. Project data is compiled from public reports by the Shanghai Adream Charity Foundation;
          some figures are illustrative. AI-organized stories are auto-generated from submitted material and may need editorial review.
          Illustrations are AI-generated placeholders.
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location/:id" element={<LocationPage />} />
          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/hot" element={<HotPage />} />
          <Route path="*" element={
            <div className="container page empty">
              <h2 style={{ fontSize: 30 }}>Page not found</h2>
              <p style={{ margin: '10px 0 20px' }}>This page doesn't exist yet — it may be the next thing the team builds.</p>
              <Link className="btn btn-primary" to="/">Back to the map</Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

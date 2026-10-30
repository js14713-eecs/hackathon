import { useRef } from 'react';

export default function Timeline({ nodes, color = '#f5a623', summary = '' }) {
  const cardRefs = useRef([]);
  const scrollTo = (i) => {
    const el = cardRefs.current[i];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="tl-wrap">
      <div className="tl-head">
        <div>
          <span className="eyebrow">Journey Timeline</span>
          <h3>How it happened, year by year</h3>
        </div>
        {summary && <p className="sum">{summary}</p>}
      </div>
      <div className="tl-chips">
        {nodes.map((n, i) => (
          <button key={i} className="tl-chip" onClick={() => scrollTo(i)}>
            {n.y} {n.lab}
          </button>
        ))}
      </div>
      <div className="tl">
        {nodes.map((n, i) => (
          <div className="tl-node" key={i}>
            <div className="tl-date">
              <b>{n.y}</b>
              <span>{n.lab}</span>
            </div>
            <div className="tl-dot" />
            <div className="tl-card" ref={el => (cardRefs.current[i] = el)}>
              <div>
                <h4>{n.t}</h4>
                <p>{n.d}</p>
                {n.moments?.length > 0 && (
                  <ul className="tl-moments">
                    {n.moments.map((m, j) => (
                      <li key={j}><b>{m.t}</b>{m.d ? ` — ${m.d}` : ''}</li>
                    ))}
                  </ul>
                )}
                {n.ph?.length > 0 && (
                  <div className="tl-phases">
                    {n.ph.map((p, j) => (
                      <span key={j} className="phase" style={{ color, background: `${color}1a` }}>
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {n.st?.length > 0 && (
                  <div className="tl-stats">
                    {n.st.map((s, j) => (
                      <span className="tl-stat" key={j}>
                        {s[0]} <i>{s[1]}</i>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {n.img && <img className="tl-thumb" src={n.img} alt="" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

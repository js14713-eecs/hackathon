import { FUND_ALLOCATION, IMPACT_METRICS, OUTCOMES } from '../impactData.js';

export default function ImpactPage() {
  return (
    <div className="impact-page">
      <section className="impact-hero">
        <div className="container">
          <span className="eyebrow">IMPACT FOR DONORS</span>
          <h1>Every contribution becomes<br /><em>a journey worth continuing.</em></h1>
          <p>See how support moves from student experience to reusable knowledge, stronger teaching, and the next generation of field research.</p>
          <span className="demo-data">Demo dashboard · figures below are illustrative</span>
        </div>
      </section>

      <section className="container impact-results">
        <div className="impact-metrics">
          {IMPACT_METRICS.map(item => (
            <article key={item.label}><b>{item.value}</b><h3>{item.label}</h3><p>{item.detail}</p></article>
          ))}
        </div>

        <div className="impact-storyline">
          <div>
            <span className="eyebrow">WHAT YOUR SUPPORT UNLOCKS</span>
            <h2>From one trip to long-term value</h2>
          </div>
          <div className="outcome-list">
            {OUTCOMES.map(item => <article key={item.title}><i>{item.icon}</i><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
          </div>
        </div>

        <div className="fund-card">
          <div><span className="eyebrow">ILLUSTRATIVE FUND USE</span><h2>Designed for maximum learning impact</h2><p>A simple view of how each ¥100 could be allocated in this demo model.</p></div>
          <div>
            <div className="fund-bar">{FUND_ALLOCATION.map(item => <span key={item.label} style={{ width: `${item.value}%`, background: item.color }} />)}</div>
            <div className="fund-legend">{FUND_ALLOCATION.map(item => <p key={item.label}><i style={{ background: item.color }} /><b>{item.value}%</b> {item.label}</p>)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

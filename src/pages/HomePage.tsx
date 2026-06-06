import { Link } from 'react-router-dom';
import { Badge } from '../components/ui';
import { calculatePrize, currency } from '../lib/finance';

export function HomePage() {
  const prize = calculatePrize(50, 100);
  const payouts = [
    { label: '1st', amount: Math.round(prize.net * 0.6 * 100) / 100 },
    { label: '2nd', amount: Math.round(prize.net * 0.25 * 100) / 100 },
    { label: '3rd', amount: Math.round(prize.net * 0.15 * 100) / 100 },
  ];

  return (
    <>
      <section className="sportsbook-hero">
        <div className="hero-panel">
          <Badge tone="info">Sports pick tournaments</Badge>
          <h1>Pick contests. Compete for real prize pools.</h1>
          <p>Create paid pick contests, invite players, and settle prize pools with transparent platform economics.</p>
          <div className="hero-actions">
            <Link to="/tournaments" className="primary-button large">Browse tournaments</Link>
            <Link to="/markets" className="secondary-button large">View markets</Link>
          </div>
          <div className="stat-strip">
            <span><strong>$1.02M</strong> Platform volume</span>
            <span><strong>11.2K</strong> Active users</span>
            <span><strong>99.9%</strong> Payout rate</span>
          </div>
        </div>
        <BetslipPreview payouts={payouts} prize={prize} />
      </section>

      <section className="section compact">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Built for competitive pick players</h2>
          </div>
          <div className="feature-rail">
            <div className="feature-item">
              <div className="feature-icon">$</div>
              <h3>Transparent prize math</h3>
              <p>Every pot shows gross and net. No hidden margins.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">LIVE</div>
              <h3>Live scoring</h3>
              <p>Real-time leaderboard updates as games settle. Know where you stand before the final whistle.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">SEC</div>
              <h3>Secure payouts</h3>
              <p>Stripe Connect handles entry fees and payouts. Bank-grade security for every transaction.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">KYC</div>
              <h3>Compliance first</h3>
              <p>Age verification, geo-restrictions, self-exclusion, and audit logs built into every contest.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section compact">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Get started</h2>
          </div>
          <div className="quick-links-grid">
            <Link to="/tournaments" className="feature-item">
              <div className="feature-icon">T</div>
              <h3>Tournaments</h3>
              <p>Browse and join pick contests across every sport. Compete for real prize pools.</p>
            </Link>
            <Link to="/markets" className="feature-item">
              <div className="feature-icon">M</div>
              <h3>Markets</h3>
              <p>Live odds, spreads, and scores across NFL, NBA, MLB, and more.</p>
            </Link>
          </div>
        </div>
      </section>

      <Compliance />
    </>
  );
}

function BetslipPreview({ payouts, prize }: { payouts: { label: string; amount: number }[]; prize: { gross: number; fee: number; net: number } }) {
  return (
    <aside className="betslip-card" aria-label="Tournament entry preview">
      <div className="card-header">
        <div>
          <span className="eyebrow">Entry preview</span>
          <h3>Sunday Gridiron</h3>
        </div>
        <Badge tone="success">Open</Badge>
      </div>
      <div className="ticket-selection">
        <span>NFL Spread Competition</span>
        <strong>$50 entry</strong>
      </div>
      <div className="fee-row"><span>100 entries</span><strong>{currency(prize.gross)}</strong></div>
      <div className="fee-row success"><span>Prize pool</span><strong>{currency(prize.net)}</strong></div>
      <div className="payout-bars compact-bars">
        {payouts.map((p) => <div key={p.label}><span style={{ width: `${p.amount / (prize.net || 1) * 100}%` }} />{p.label}: {currency(p.amount)}</div>)}
      </div>
      <Link to="/tournaments" className="primary-button large full-width">Enter tournament</Link>
    </aside>
  );
}

function Compliance() {
  const modules = [
    ['Age verification', 'KYC provider hook and configurable minimum age by jurisdiction.'],
    ['Geo-restrictions', 'Region allow/deny rules before joins, payments, and pick submissions.'],
    ['Responsible gaming', 'Self-exclusion, deposit limits, cooling-off flows, and support resources.'],
    ['Rules engine', 'Tournament rules loaded from configuration, not hardcoded.'],
    ['Audit logs', 'Admin and financial actions designed for immutable event capture.'],
    ['Legal pages', 'Terms, privacy policy, and contest disclosures ready for review.'],
  ];
  return (
    <section className="section" id="compliance">
      <div className="section-inner">
        <div className="section-heading">
          <h2>Regulated contest operations</h2>
        </div>
        <div className="module-grid">
          {modules.map(([title, body]) => (
            <article className="module-card sportsbook-panel" key={title}>
              <span className="module-index">{title.slice(0, 2).toUpperCase()}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

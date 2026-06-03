import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { env, getMissingIntegrationKeys } from './config/env';
import type { ApiState, CreateTournamentInput, Role, Sport, Tournament, TournamentType } from './domain/types';
import { calculatePayouts, calculatePrize, currency } from './lib/finance';
import { createTournament, loadDashboardData } from './lib/mockApi';
import { validateTournament } from './lib/validation';
import { Badge, EmptyState, Icon, MetricCard } from './components/ui';
import type { LeaderboardEntry, NotificationItem, SportsEvent, Transaction } from './domain/types';

const sports: Sport[] = ['NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA', 'Custom'];
const tournamentTypes: TournamentType[] = ['Pick’em', 'Survivor Pool', 'Confidence Pool', 'Spread Betting', 'Moneyline', 'Custom'];
const roles: Role[] = ['Participant', 'Tournament Organizer', 'Platform Admin'];

const featuredMarkets = [
  { league: 'NFL', matchup: 'Dallas Cowboys @ Philadelphia Eagles', time: 'Sun 8:20p', spread: 'PHI -3.5', total: 'O 46.5', moneyline: 'PHI -162' },
  { league: 'NBA', matchup: 'Boston Celtics @ New York Knicks', time: 'Live Q4', spread: 'NYK +2.0', total: 'U 219.5', moneyline: 'NYK +112' },
  { league: 'MLB', matchup: 'Los Angeles Dodgers @ San Francisco Giants', time: 'Top 7', spread: 'LAD -1.5', total: 'O 8.5', moneyline: 'LAD -135' },
];

interface DashboardData {
  tournaments: Tournament[];
  leaderboard: LeaderboardEntry[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  sportsEvents: SportsEvent[];
}

const initialDashboardData: DashboardData = {
  tournaments: [],
  leaderboard: [],
  transactions: [],
  notifications: [],
  sportsEvents: [],
};

function Header({ darkMode, setDarkMode, role, setRole }: { darkMode: boolean; setDarkMode: (value: boolean) => void; role: Role; setRole: (role: Role) => void }) {
  return (
    <header className="sportsbook-header">
      <div className="header-main">
        <div className="brand sportsbook-brand">
          <div className="brand-mark">TB</div>
          <div>
            <strong>{env.appName}</strong>
            <span>Sportsbook tournaments</span>
          </div>
        </div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#markets">Markets</a>
          <a href="#discover">Tournaments</a>
          <a href="#dashboard">My Hub</a>
          <a href="#admin">Admin</a>
        </nav>
        <div className="top-actions">
          <label className="role-select">
            <span className="sr-only">Preview role</span>
            <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
              {roles.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button className="ghost-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color mode">
            {darkMode ? 'Light' : 'Dark'} mode
          </button>
          <button className="primary-button">Log in</button>
          <button className="deposit-button">Deposit</button>
        </div>
      </div>
      <div className="sport-nav" aria-label="Sport quick filters">
        {sports.slice(0, 6).map((sport) => <a href="#discover" key={sport}>{sport}</a>)}
        <a href="#next-steps">Promos</a>
      </div>
    </header>
  );
}

function MarketButton({ label, value }: { label: string; value: string }) {
  return (
    <button className="odds-button" type="button">
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  );
}

function LiveMarketBoard() {
  return (
    <section className="market-board" id="markets" aria-label="Featured betting markets">
      <div className="market-board-header">
        <div>
          <Badge tone="success">Live markets</Badge>
          <h2>Featured tournament pick board</h2>
        </div>
        <span className="market-note">Lines shown for UI preview only</span>
      </div>
      <div className="market-table">
        <div className="market-table-head"><span>Event</span><span>Spread</span><span>Total</span><span>Moneyline</span></div>
        {featuredMarkets.map((market) => (
          <article className="market-row" key={market.matchup}>
            <div className="event-cell">
              <Badge tone={market.time.includes('Live') || market.time.includes('Top') ? 'danger' : 'info'}>{market.league}</Badge>
              <strong>{market.matchup}</strong>
              <span>{market.time}</span>
            </div>
            <MarketButton label="Spread" value={market.spread} />
            <MarketButton label="Total" value={market.total} />
            <MarketButton label="ML" value={market.moneyline} />
          </article>
        ))}
      </div>
    </section>
  );
}

function BetslipPreview() {
  const prize = calculatePrize(50, 100);
  const payouts = calculatePayouts(prize.net, [
    { label: '1st', percent: 60 },
    { label: '2nd', percent: 25 },
    { label: '3rd', percent: 15 },
  ]);

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
      <div className="fee-row danger"><span>Platform fee (5%)</span><strong>-{currency(prize.fee)}</strong></div>
      <div className="fee-row success"><span>Prize pool</span><strong>{currency(prize.net)}</strong></div>
      <div className="payout-bars compact-bars">
        {payouts.map((payout) => <div key={payout.label}><span style={{ width: `${payout.percent}%` }} />{payout.label}: {currency(payout.amount)}</div>)}
      </div>
      <button className="primary-button large full-width">Enter tournament</button>
    </aside>
  );
}

function Hero({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="sportsbook-hero">
      <div className="hero-panel">
        <Badge tone="info">Private contests · public tournaments · verified payouts</Badge>
        <h1>A professional sportsbook-style tournament platform.</h1>
        <p>
          Create paid pick contests, invite players, collect entry fees, surface odds-style picks,
          and settle prize pools with transparent 5% platform economics.
        </p>
        <div className="hero-actions">
          <button className="primary-button large" onClick={onCreate}>Create tournament</button>
          <a className="secondary-button large" href="#discover">Browse lobby</a>
        </div>
        <div className="stat-strip">
          <span><strong>$1.02M</strong> Mock volume</span>
          <span><strong>11.2K</strong> Active users</span>
          <span><strong>99.9%</strong> Payout audit target</span>
        </div>
      </div>
      <BetslipPreview />
    </section>
  );
}

function IntegrationBanner() {
  const missing = getMissingIntegrationKeys();
  return (
    <section className="integration-banner" aria-label="Integration readiness">
      <div>
        <Badge tone={missing.length ? 'warning' : 'success'}>MVP readiness</Badge>
        <h2>{missing.length ? 'Frontend lobby is ready; production integrations are pending.' : 'Production integration keys are configured.'}</h2>
        <p>{missing.length ? `Add ${missing.join(', ')} before accepting real users or payments.` : 'Environment variables are present for the configured integrations.'}</p>
      </div>
      <div className="integration-grid">
        {['Supabase Auth', 'Stripe Connect', 'Sports data', 'Realtime scoring', 'Storage', 'Google OAuth'].map((item) => (
          <span key={item}><Icon label="✓" /> {item}</span>
        ))}
      </div>
    </section>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const prize = calculatePrize(tournament.entryFee, tournament.participants);
  const inviteUrl = `/join/${tournament.id}/TB-${tournament.id.slice(-3).toUpperCase()}`;
  return (
    <article className="tournament-card pro-card">
      <div className="tournament-top" style={{ background: tournament.cover }}>
        <div>
          <Badge tone={tournament.visibility === 'Public' ? 'success' : 'warning'}>{tournament.visibility}</Badge>
          <h3>{tournament.name}</h3>
          <span>Hosted by {tournament.organizer}</span>
        </div>
        <strong>{currency(tournament.entryFee, tournament.currency)}</strong>
      </div>
      <div className="tournament-body">
        <p>{tournament.description}</p>
        <div className="chip-row">
          <Badge>{tournament.sport}</Badge>
          <Badge>{tournament.type}</Badge>
          <Badge tone={tournament.status === 'Live' ? 'danger' : 'info'}>{tournament.status}</Badge>
        </div>
        <div className="sportsbook-progress">
          <div><span style={{ width: `${Math.min(100, (tournament.participants / tournament.maxPlayers) * 100)}%` }} /></div>
          <p>{tournament.participants}/{tournament.maxPlayers} entries filled · min {tournament.minPlayers}</p>
        </div>
        <div className="mini-grid odds-grid">
          <span><b>{currency(prize.gross, tournament.currency)}</b> Total pot</span>
          <span><b>{currency(prize.fee, tournament.currency)}</b> House fee</span>
          <span><b>{currency(prize.net, tournament.currency)}</b> Prize pool</span>
        </div>
        <div className="compliance-row">
          <span><Icon label="18+" /> Age gate</span>
          <span><Icon label="GPS" /> {tournament.geoRestricted ? 'Geo-gated' : 'Invite rules'}</span>
        </div>
        <div className="invite-box">
          <code>{inviteUrl}</code>
          <button aria-label={`Copy invite link for ${tournament.name}`}>Copy</button>
        </div>
      </div>
    </article>
  );
}

function Discover({ tournaments: tournamentData }: { tournaments: Tournament[] }) {
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState<Sport | 'All'>('All');
  const filtered = tournamentData.filter((tournament) => {
    const matchesQuery = `${tournament.name} ${tournament.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (sport === 'All' || tournament.sport === sport);
  });

  return (
    <section className="section" id="discover">
      <div className="section-heading">
        <div>
          <Badge tone="info">Tournament lobby</Badge>
          <h2>Find contests by sport, format, field size, and entry fee.</h2>
        </div>
        <div className="filters">
          <label><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Team, sport, organizer" /></label>
          <select value={sport} onChange={(event) => setSport(event.target.value as Sport | 'All')}>
            <option>All</option>
            {sports.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      {filtered.length ? <div className="card-grid">{filtered.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)}</div> : <EmptyState title="No tournaments found" body="Adjust your search or choose a different sport filter." />}
    </section>
  );
}

function Dashboard({ data, role }: { data: DashboardData; role: Role }) {
  return (
    <section className="section" id="dashboard">
      <div className="section-heading">
        <div>
          <Badge tone="success">{role} hub</Badge>
          <h2>Balances, entries, standings, and notifications in one account view.</h2>
        </div>
      </div>
      <div className="metrics-grid">
        <MetricCard icon="W" label="Win rate" value="62%" detail="18 wins in 29 settled contests" />
        <MetricCard icon="$" label="ROI" value="24.8%" detail="Net positive over last 90 days" />
        <MetricCard icon="BAL" label="Wallet balance" value="$1,284" detail="$940 pending payout" />
        <MetricCard icon="REF" label="Referrals" value="37" detail="11 converted joins this month" />
      </div>
      <div className="dashboard-grid">
        <article className="panel wide sportsbook-panel">
          <div className="card-header"><h3>Live leaderboard</h3><Badge tone="danger">Realtime preview</Badge></div>
          <table>
            <thead><tr><th>Rank</th><th>User</th><th>Record</th><th>P/L</th><th>Points</th><th>ROI</th></tr></thead>
            <tbody>{data.leaderboard.map((entry) => (
              <tr key={entry.username}>
                <td>#{entry.rank}</td><td>{entry.username}</td><td>{entry.record}</td><td className="positive">{currency(entry.profitLoss)}</td><td>{entry.points}</td><td>{entry.roi}%</td>
              </tr>
            ))}</tbody>
          </table>
        </article>
        <article className="panel sportsbook-panel">
          <div className="card-header"><h3>Wallet ledger</h3><Badge>Stripe</Badge></div>
          {data.transactions.slice(0, 3).map((transaction) => (
            <div className="list-row" key={transaction.id}>
              <div><strong>{transaction.kind}</strong><span>{transaction.tournament}</span></div>
              <div><b>{currency(transaction.amount)}</b><Badge tone={transaction.status === 'Succeeded' ? 'success' : 'warning'}>{transaction.status}</Badge></div>
            </div>
          ))}
        </article>
        <article className="panel sportsbook-panel">
          <div className="card-header"><h3>Alerts</h3><Badge>Live</Badge></div>
          {data.notifications.map((item) => (
            <div className="list-row" key={item.id}>
              <div><strong>{item.title}</strong><span>{item.body}</span></div>
              <Badge tone={item.status === 'Sent' ? 'success' : 'warning'}>{item.channel}</Badge>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function SportsData({ events }: { events: SportsEvent[] }) {
  return (
    <section className="section compact">
      <div className="section-heading">
        <div>
          <Badge tone="info">Sports data feed</Badge>
          <h2>Provider-ready cards for live scores, schedules, odds, and settlement data.</h2>
        </div>
      </div>
      <div className="sports-strip">
        {events.map((event) => (
          <article key={event.event} className="event-card sportsbook-panel">
            <Badge>{event.league}</Badge>
            <h3>{event.event}</h3>
            <p>{event.line} · {event.odds}</p>
            <strong>{event.score}</strong>
            <span>{event.source}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Admin({ data, role }: { data: DashboardData; role: Role }) {
  const maxRevenue = Math.max(...[1, ...data.transactions.map((transaction) => transaction.amount)]);
  return (
    <section className="section" id="admin">
      <div className="section-heading">
        <div>
          <Badge tone="warning">Operator console</Badge>
          <h2>Revenue, payment volume, disputes, risk, and trust operations.</h2>
        </div>
        <button className="secondary-button">Export CSV</button>
      </div>
      {role !== 'Platform Admin' && <div className="permission-note"><Icon label="LOCK" /> Admin actions are disabled for the selected preview role. Switch to Platform Admin to preview controls.</div>}
      <div className="dashboard-grid">
        <article className="panel wide chart-panel sportsbook-panel">
          <div className="card-header"><h3>Payment volume sample</h3><Badge tone="success">5% default</Badge></div>
          <div className="bar-chart" aria-label="Payment volume chart">
            {data.transactions.map((transaction) => <div key={transaction.id} style={{ height: `${Math.max(16, (transaction.amount / maxRevenue) * 100)}%` }}><span>{transaction.kind}</span></div>)}
          </div>
        </article>
        <article className="panel sportsbook-panel">
          <div className="card-header"><h3>Risk controls</h3><Badge>RBAC</Badge></div>
          {['Suspend tournament', 'Review disputes', 'Configure fees', 'Manage users', 'Fraud flags'].map((control) => (
            <button className="control-button" disabled={role !== 'Platform Admin'} key={control}><Icon label="✓" /> {control}</button>
          ))}
        </article>
        <article className="panel wide sportsbook-panel">
          <div className="card-header"><h3>Payment ledger</h3><Badge>Audit-ready</Badge></div>
          <table>
            <thead><tr><th>Type</th><th>Tournament</th><th>Amount</th><th>Platform fee</th><th>Status</th><th>Stripe ID</th></tr></thead>
            <tbody>{data.transactions.map((transaction) => (
              <tr key={transaction.id}><td>{transaction.kind}</td><td>{transaction.tournament}</td><td>{currency(transaction.amount)}</td><td>{currency(transaction.platformFee)}</td><td>{transaction.status}</td><td><code>{transaction.stripeId}</code></td></tr>
            ))}</tbody>
          </table>
        </article>
      </div>
    </section>
  );
}

function Compliance() {
  const modules = [
    ['Age verification', 'KYC provider hook and configurable minimum age by jurisdiction.'],
    ['Geo-restrictions', 'Region allow/deny rules before joins, payments, and pick submissions.'],
    ['Responsible gaming', 'Self-exclusion, deposit limits, cooling-off flows, and support copy.'],
    ['Rules engine', 'Tournament rules and eligibility loaded from configuration, not hardcoded assumptions.'],
    ['Audit logs', 'Admin and financial actions designed for immutable event capture.'],
    ['Legal pages', 'Terms, privacy policy, and contest disclosures ready for counsel review.'],
  ];
  return (
    <section className="section" id="compliance">
      <div className="section-heading">
        <div>
          <Badge tone="danger">Compliance framework</Badge>
          <h2>Configurable controls for regulated contest operations.</h2>
        </div>
      </div>
      <div className="module-grid">
        {modules.map(([title, body]) => (
          <article className="module-card sportsbook-panel" key={title}><span className="module-index">{title.slice(0, 2).toUpperCase()}</span><h3>{title}</h3><p>{body}</p></article>
        ))}
      </div>
    </section>
  );
}

function NextSteps() {
  const steps = [
    ['Supabase schema', 'Create auth profiles, tournaments, participants, picks, payments, payouts, invitations, notifications, reports, disputes, and audit logs with RLS.'],
    ['Stripe Connect', 'Add checkout sessions, webhook verification, transfer groups, refunds, payout reconciliation, receipts, and ledger entries.'],
    ['Sports engine', 'Schedule odds sync jobs, settle picks, compute leaderboards, and broadcast updates through Supabase Realtime.'],
    ['Compliance launch gate', 'Wire KYC, age, geo, responsible gaming limits, legal copy, and jurisdiction rule configuration before real-money launch.'],
  ];
  return (
    <section className="section" id="next-steps">
      <div className="section-heading">
        <div>
          <Badge tone="success">Roadmap</Badge>
          <h2>Backend implementation plan for the next milestone.</h2>
        </div>
      </div>
      <div className="module-grid">
        {steps.map(([title, body], index) => <article className="module-card sportsbook-panel" key={title}><Badge tone="info">Step {index + 1}</Badge><h3>{title}</h3><p>{body}</p></article>)}
      </div>
    </section>
  );
}

function CreateTournamentModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (tournament: Tournament) => void }) {
  const [form, setForm] = useState<CreateTournamentInput>({
    name: 'Sunday Gridiron High Roller',
    description: 'Weekly NFL spread contest with automated scoring and transparent prize math.',
    sport: 'NFL',
    type: 'Spread Betting',
    visibility: 'Public',
    entryFee: 50,
    currency: 'USD',
    maxPlayers: 100,
    minPlayers: 20,
    registrationDeadline: '2026-09-12',
    startDate: '2026-09-13',
    endDate: '2026-09-14',
    rules: 'Picks lock before kickoff. Standings are scored by profit/loss, then points, then earliest submission. Refunds only if minimum participants are not met.',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const prize = useMemo(() => calculatePrize(form.entryFee, form.maxPlayers), [form.entryFee, form.maxPlayers]);

  if (!open) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = validateTournament(form);
    setErrors(result.errors);
    if (!result.valid) return;

    setSaving(true);
    const tournament = await createTournament(form);
    onCreated(tournament);
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Create tournament">
      <form className="modal-card sportsbook-panel" onSubmit={submit}>
        <div className="card-header"><h2>Create tournament</h2><button type="button" className="ghost-button" onClick={onClose}>Close</button></div>
        {errors.length > 0 && <div className="error-list" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
        <div className="form-grid">
          <label>Tournament name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Sport<select value={form.sport} onChange={(event) => setForm({ ...form, sport: event.target.value as Sport })}>{sports.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as TournamentType })}>{tournamentTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Visibility<select value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value as 'Public' | 'Private' })}><option>Public</option><option>Private</option></select></label>
          <label>Entry fee<input type="number" value={form.entryFee} min="0" onChange={(event) => setForm({ ...form, entryFee: Number(event.target.value) })} /></label>
          <label>Max participants<input type="number" value={form.maxPlayers} min="2" onChange={(event) => setForm({ ...form, maxPlayers: Number(event.target.value) })} /></label>
          <label>Min participants<input type="number" value={form.minPlayers} min="2" onChange={(event) => setForm({ ...form, minPlayers: Number(event.target.value) })} /></label>
          <label>Registration deadline<input type="date" value={form.registrationDeadline} onChange={(event) => setForm({ ...form, registrationDeadline: event.target.value })} /></label>
          <label>Start date<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label>
          <label>End date<input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></label>
          <label className="full">Rules<textarea value={form.rules} onChange={(event) => setForm({ ...form, rules: event.target.value })} /></label>
        </div>
        <div className="fee-summary">
          <div><span>Gross pot</span><strong>{currency(prize.gross)}</strong></div>
          <div><span>Platform fee (5%)</span><strong>{currency(prize.fee)}</strong></div>
          <div><span>Available prize pool</span><strong>{currency(prize.net)}</strong></div>
        </div>
        <div className="social-row">
          {['Facebook', 'X/Twitter', 'WhatsApp', 'Discord', 'Telegram'].map((network) => <button type="button" key={network}>Share to {network}</button>)}
        </div>
        <button className="primary-button large" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save draft tournament'}</button>
      </form>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState<Role>('Participant');
  const [state, setState] = useState<ApiState<DashboardData>>({ data: initialDashboardData, loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    loadDashboardData()
      .then((data) => mounted && setState({ data, loading: false, error: null }))
      .catch((error: Error) => mounted && setState({ data: initialDashboardData, loading: false, error: error.message }));
    return () => { mounted = false; };
  }, []);

  function addTournament(tournament: Tournament) {
    setState((current) => ({ ...current, data: { ...current.data, tournaments: [tournament, ...current.data.tournaments] } }));
  }

  return (
    <main className={darkMode ? 'app dark sportsbook-app' : 'app light sportsbook-app'}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} role={role} setRole={setRole} />
      <Hero onCreate={() => setModalOpen(true)} />
      <LiveMarketBoard />
      <IntegrationBanner />
      {state.loading && <section className="section"><EmptyState title="Loading TournamentBet" body="Hydrating mock API data and checking integration readiness." /></section>}
      {state.error && <section className="section"><EmptyState title="Unable to load data" body={state.error} /></section>}
      {!state.loading && !state.error && (
        <>
          <Discover tournaments={state.data.tournaments} />
          <Dashboard data={state.data} role={role} />
          <SportsData events={state.data.sportsEvents} />
          <Admin data={state.data} role={role} />
          <Compliance />
          <NextSteps />
        </>
      )}
      <footer>
        <strong>{env.appName}</strong>
        <span>Frontend MVP ready for Supabase auth, storage, realtime, PostgreSQL, and Stripe Connect integration.</span>
        <div><a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#responsible-gaming">Responsible Gaming</a></div>
      </footer>
      <CreateTournamentModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={addTournament} />
    </main>
  );
}

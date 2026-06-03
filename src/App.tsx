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
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Icon label="🏆" /></div>
        <div>
          <strong>{env.appName}</strong>
          <span>MVP sports contest platform</span>
        </div>
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#discover">Discover</a>
        <a href="#dashboard">Dashboard</a>
        <a href="#admin">Admin</a>
        <a href="#compliance">Compliance</a>
      </nav>
      <div className="top-actions">
        <label className="role-select">
          <span className="sr-only">Preview role</span>
          <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
            {roles.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="ghost-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color mode">
          <Icon label={darkMode ? '☀️' : '🌙'} /> {darkMode ? 'Light' : 'Dark'}
        </button>
        <button className="primary-button"><Icon label="🔐" /> Sign in</button>
      </div>
    </header>
  );
}

function Hero({ onCreate }: { onCreate: () => void }) {
  const prize = calculatePrize(50, 100);
  const payouts = calculatePayouts(prize.net, [
    { label: '1st', percent: 60 },
    { label: '2nd', percent: 25 },
    { label: '3rd', percent: 15 },
  ]);

  return (
    <section className="hero">
      <div className="hero-copy">
        <Badge tone="success"><Icon label="✨" /> MVP ready frontend</Badge>
        <h1>Run compliant sports pick tournaments with transparent prize math.</h1>
        <p>
          TournamentBet is now organized as an MVP-ready frontend with typed domain models, environment validation,
          mock API boundaries, form validation, role previews, compliance gates, and replaceable integration seams for Supabase and Stripe Connect.
        </p>
        <div className="hero-actions">
          <button className="primary-button large" onClick={onCreate}><Icon label="＋" /> Create tournament</button>
          <a className="secondary-button large" href="#next-steps">View next steps <Icon label="›" /></a>
        </div>
        <div className="trust-row">
          <span><Icon label="🛡️" /> RBAC and compliance previews</span>
          <span><Icon label="💳" /> Stripe Connect handoff states</span>
          <span><Icon label="⚡" /> Realtime leaderboard contract</span>
        </div>
      </div>
      <aside className="fee-card" aria-label="Fee calculation example">
        <div className="card-header">
          <span>Prize math preview</span>
          <Badge tone="info">5% platform fee</Badge>
        </div>
        <div className="fee-row"><span>100 players × $50</span><strong>{currency(prize.gross)}</strong></div>
        <div className="fee-row danger"><span>Platform fee</span><strong>-{currency(prize.fee)}</strong></div>
        <div className="fee-row success"><span>Prize pool</span><strong>{currency(prize.net)}</strong></div>
        <div className="payout-bars">
          {payouts.map((payout) => <div key={payout.label}><span style={{ width: `${payout.percent}%` }} />{payout.label}: {currency(payout.amount)}</div>)}
        </div>
      </aside>
    </section>
  );
}

function IntegrationBanner() {
  const missing = getMissingIntegrationKeys();
  return (
    <section className="integration-banner" aria-label="Integration readiness">
      <div>
        <Badge tone={missing.length ? 'warning' : 'success'}><Icon label="🔌" /> Integration status</Badge>
        <h2>{missing.length ? 'Frontend is MVP-ready; production keys are pending.' : 'Production integration keys are configured.'}</h2>
        <p>{missing.length ? `Add ${missing.join(', ')} before accepting real users or payments.` : 'Environment variables are present for the configured integrations.'}</p>
      </div>
      <div className="integration-grid">
        {['Supabase Auth', 'Stripe Connect', 'Sports data', 'Realtime', 'Storage', 'Google OAuth'].map((item) => (
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
    <article className="tournament-card">
      <div className="cover" style={{ background: tournament.cover }}>
        <Badge tone={tournament.visibility === 'Public' ? 'success' : 'warning'}>{tournament.visibility}</Badge>
        <Badge tone={tournament.status === 'Live' ? 'danger' : 'info'}>{tournament.status}</Badge>
      </div>
      <div className="tournament-body">
        <div className="split">
          <div>
            <h3>{tournament.name}</h3>
            <p>{tournament.description}</p>
          </div>
          <strong>{currency(tournament.entryFee, tournament.currency)}</strong>
        </div>
        <div className="chip-row">
          <Badge>{tournament.sport}</Badge>
          <Badge>{tournament.type}</Badge>
          <Badge>{tournament.participants}/{tournament.maxPlayers} players</Badge>
        </div>
        <div className="mini-grid">
          <span><b>{currency(prize.gross, tournament.currency)}</b> Gross pot</span>
          <span><b>{currency(prize.fee, tournament.currency)}</b> Platform fee</span>
          <span><b>{currency(prize.net, tournament.currency)}</b> Net prizes</span>
        </div>
        <div className="compliance-row">
          <span><Icon label={tournament.ageVerifiedRequired ? '🔞' : '✅'} /> Age gate</span>
          <span><Icon label={tournament.geoRestricted ? '📍' : '🌐'} /> {tournament.geoRestricted ? 'Geo-gated' : 'Invite rules'}</span>
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
          <Badge tone="info"><Icon label="🔎" /> Search & discovery</Badge>
          <h2>Browse public tournaments and preview private invite flows.</h2>
        </div>
        <div className="filters">
          <label><Icon label="🔎" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tournaments" /></label>
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
          <Badge tone="success"><Icon label="📊" /> {role} dashboard</Badge>
          <h2>Wallet, notifications, tournament history, and performance stats.</h2>
        </div>
      </div>
      <div className="metrics-grid">
        <MetricCard icon="🏆" label="Win rate" value="62%" detail="18 wins in 29 settled contests" />
        <MetricCard icon="💵" label="ROI" value="24.8%" detail="Net positive over last 90 days" />
        <MetricCard icon="👛" label="Wallet balance" value="$1,284" detail="$940 pending payout" />
        <MetricCard icon="🤝" label="Referrals" value="37" detail="11 converted joins this month" />
      </div>
      <div className="dashboard-grid">
        <article className="panel wide">
          <div className="card-header"><h3>Live tournament leaderboard</h3><Badge tone="danger">Realtime mock</Badge></div>
          <table>
            <thead><tr><th>Rank</th><th>User</th><th>Record</th><th>P/L</th><th>Points</th><th>ROI</th></tr></thead>
            <tbody>{data.leaderboard.map((entry) => (
              <tr key={entry.username}>
                <td>#{entry.rank}</td><td>{entry.username}</td><td>{entry.record}</td><td className="positive">{currency(entry.profitLoss)}</td><td>{entry.points}</td><td>{entry.roi}%</td>
              </tr>
            ))}</tbody>
          </table>
        </article>
        <article className="panel">
          <div className="card-header"><h3>Wallet & transactions</h3><Icon label="👛" /></div>
          {data.transactions.slice(0, 3).map((transaction) => (
            <div className="list-row" key={transaction.id}>
              <div><strong>{transaction.kind}</strong><span>{transaction.tournament}</span></div>
              <div><b>{currency(transaction.amount)}</b><Badge tone={transaction.status === 'Succeeded' ? 'success' : 'warning'}>{transaction.status}</Badge></div>
            </div>
          ))}
        </article>
        <article className="panel">
          <div className="card-header"><h3>Notifications</h3><Icon label="🔔" /></div>
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
          <Badge tone="info"><Icon label="⚡" /> Sports data adapters</Badge>
          <h2>Live score, schedule, odds, and statistics integration surface.</h2>
        </div>
      </div>
      <div className="sports-strip">
        {events.map((event) => (
          <article key={event.event} className="event-card">
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
          <Badge tone="warning"><Icon label="👑" /> Platform admin</Badge>
          <h2>Revenue, payment volume, users, disputes, and trust operations.</h2>
        </div>
        <button className="secondary-button"><Icon label="⬇" /> Export CSV</button>
      </div>
      {role !== 'Platform Admin' && <div className="permission-note"><Icon label="🔒" /> Admin actions are disabled for the selected preview role. Switch to Platform Admin to preview controls.</div>}
      <div className="dashboard-grid">
        <article className="panel wide chart-panel">
          <div className="card-header"><h3>Payment volume sample</h3><Badge tone="success">5% default</Badge></div>
          <div className="bar-chart" aria-label="Payment volume chart">
            {data.transactions.map((transaction) => <div key={transaction.id} style={{ height: `${Math.max(16, (transaction.amount / maxRevenue) * 100)}%` }}><span>{transaction.kind}</span></div>)}
          </div>
        </article>
        <article className="panel">
          <div className="card-header"><h3>Admin controls</h3><Icon label="🛡️" /></div>
          {['Suspend tournament', 'Review disputes', 'Configure fees', 'Manage users', 'Fraud flags'].map((control) => (
            <button className="control-button" disabled={role !== 'Platform Admin'} key={control}><Icon label="✓" /> {control}</button>
          ))}
        </article>
        <article className="panel wide">
          <div className="card-header"><h3>Payment ledger</h3><Icon label="💳" /></div>
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
          <Badge tone="danger"><Icon label="⚖️" /> Compliance framework</Badge>
          <h2>Configurable controls for gambling, contest, payments, and identity requirements.</h2>
        </div>
      </div>
      <div className="module-grid">
        {modules.map(([title, body]) => (
          <article className="module-card" key={title}><Icon label="🛡️" /><h3>{title}</h3><p>{body}</p></article>
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
          <Badge tone="success"><Icon label="🚀" /> Next steps</Badge>
          <h2>Backend implementation plan for the next milestone.</h2>
        </div>
      </div>
      <div className="module-grid">
        {steps.map(([title, body], index) => <article className="module-card" key={title}><Badge tone="info">Step {index + 1}</Badge><h3>{title}</h3><p>{body}</p></article>)}
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
      <form className="modal-card" onSubmit={submit}>
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
          {['Facebook', 'X/Twitter', 'WhatsApp', 'Discord', 'Telegram'].map((network) => <button type="button" key={network}><Icon label="↗" /> {network}</button>)}
        </div>
        <button className="primary-button large" type="submit" disabled={saving}><Icon label="＋" /> {saving ? 'Saving…' : 'Save draft tournament'}</button>
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
    <main className={darkMode ? 'app dark' : 'app light'}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} role={role} setRole={setRole} />
      <Hero onCreate={() => setModalOpen(true)} />
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

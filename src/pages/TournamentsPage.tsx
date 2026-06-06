import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { TournamentCard } from '../components/TournamentCard';
import { CreateTournamentModal } from '../components/CreateTournamentModal';
import { Badge, EmptyState, SkeletonCard } from '../components/ui';

export function TournamentsPage() {
  const tournaments = useStore((s) => s.tournaments);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const loadDashboard = useStore((s) => s.loadDashboard);
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (tournaments.length === 0) loadDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = tournaments.filter((t) => {
    const matchesQuery = `${t.name} ${t.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (sport === 'All' || t.sport === sport);
  });

  const sports = ['NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA', 'Custom'];

  return (
    <>
      <section className="section section-top-pad">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Browse tournaments</h2>
            <div className="filters">
              <label><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Team, sport, organizer" /></label>
              <select value={sport} onChange={(e) => setSport(e.target.value)}>
                <option>All</option>
                {sports.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <button className="primary-button create-tournament-btn" onClick={() => setModalOpen(true)}>Create tournament</button>
        </div>
      </section>

      <section className="section compact">
        <div className="section-inner">
          {loading ? (
            <div className="card-grid">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <EmptyState title="Error" body={error} />
          ) : (
            <>
              {filtered.length ? (
                <div className="card-grid">{filtered.map((t) => <TournamentCard key={t.id} tournament={t} />)}</div>
              ) : (
                <EmptyState title="No tournaments found" body="Adjust your search or try a different sport filter." />
              )}
            </>
          )}
        </div>
      </section>

      <CreateTournamentModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={() => setModalOpen(false)} />
    </>
  );
}

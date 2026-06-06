import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Tournament } from '../domain/types';
import { Badge } from './ui';
import { calculatePrize, currency } from '../lib/finance';

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const prize = calculatePrize(tournament.entryFee, tournament.participants);
  const inviteUrl = `/join/${tournament.id}/LS-${tournament.id.slice(-3).toUpperCase()}`;
  const user = useStore((s) => s.user);
  const isOwner = user?.id === tournament.organizerId;

  return (
    <article className="tournament-card pro-card">
      <div className="tournament-top" style={{ background: tournament.cover }}>
        <div>
          <Badge tone={tournament.visibility === 'Public' ? 'success' : 'warning'}>{tournament.visibility}</Badge>
          <h3>{tournament.name}</h3>
          <span>Hosted by {tournament.organizer}</span>
        </div>
        <strong className="tournament-price-tag">{currency(tournament.entryFee, tournament.currency)}</strong>
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
          <p>{tournament.participants}/{tournament.maxPlayers} entries · min {tournament.minPlayers}</p>
        </div>
        <div className={`mini-grid odds-grid ${!isOwner ? 'two-col' : ''}`}>
          <span><b>{currency(prize.gross, tournament.currency)}</b> Total pot</span>
          {isOwner && <span><b>{currency(prize.fee, tournament.currency)}</b> Platform fee</span>}
          <span><b>{currency(prize.net, tournament.currency)}</b> Prize pool</span>
        </div>
        <div className="invite-box">
          <code>{window.location.origin}{inviteUrl}</code>
          <button aria-label={`Copy invite link for ${tournament.name}`} onClick={() => navigator.clipboard.writeText(window.location.origin + inviteUrl)}>Copy</button>
        </div>
        <Link to={`/tournament/${tournament.id}`} className="primary-button full-width mt-3">View tournament</Link>
      </div>
    </article>
  );
}

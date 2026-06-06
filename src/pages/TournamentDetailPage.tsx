import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Tournament, ForumPost as ForumPostType, Pick, Participant, LeaderboardEntry } from '../domain/types';
import { Badge, EmptyState, SkeletonCard } from '../components/ui';
import { useToast } from '../components/Toast';
import { calculatePrize, calculatePayouts, currency } from '../lib/finance';
import * as tournamentApi from '../lib/tournamentApi';

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [myPicks, setMyPicks] = useState<Pick[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [joining, setJoining] = useState(false);
  const user = useStore((s) => s.user);
  const joinTournament = useStore((s) => s.joinTournament);
  const addForumPost = useStore((s) => s.addForumPost);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const t = await tournamentApi.getTournamentById(id);
        if (!t) { setError('Tournament not found'); return; }
        setTournament(t);
        const [p, pk, par, lb] = await Promise.all([
          tournamentApi.getForumPosts(id),
          tournamentApi.getPicks(id),
          tournamentApi.getParticipants(id),
          tournamentApi.getTournamentLeaderboard(id),
        ]);
        setPosts(p);
        setPicks(pk);
        setParticipants(par);
        setLeaderboard(lb);
      } catch {
        setError('Failed to load tournament data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadMyPicks() {
      if (!id || !user) return;
      const p = await tournamentApi.getUserPicksForTournament(id, user.id);
      setMyPicks(p);
    }
    loadMyPicks();
  }, [id, user, joining]);

  async function handleJoin() {
    if (!id || !user) return;
    setJoining(true);
    try {
      await joinTournament(id);
      const [par, lb] = await Promise.all([
        tournamentApi.getParticipants(id),
        tournamentApi.getTournamentLeaderboard(id),
      ]);
      setParticipants(par);
      setLeaderboard(lb);
      toast('You joined the tournament!', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to join', 'danger');
    }
    setJoining(false);
  }

  async function handlePost() {
    if (!id || !postContent.trim()) return;
    try {
      await addForumPost(id, postContent);
      const p = await tournamentApi.getForumPosts(id);
      setPosts(p);
      setPostContent('');
      toast('Post submitted', 'success');
    } catch {
      toast('Failed to post', 'danger');
    }
  }

  if (loading) return (
    <section className="section">
      <div className="section-inner">
        <div className="detail-grid">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </section>
  );

  if (error || !tournament) return (
    <section className="section">
      <div className="section-inner">
        <EmptyState title="Not found" body={error ?? 'This tournament does not exist.'} />
        <Link to="/tournaments" className="secondary-button mt-4">&larr; Back to tournaments</Link>
      </div>
    </section>
  );

  const prize = calculatePrize(tournament.entryFee, tournament.participants);
  const isOwner = user?.id === tournament.organizerId;
  const isJoined = user ? participants.some((p) => p.userId === user.id) : false;
  const payouts = calculatePayouts(prize.net, tournament.prizeDistribution);
  const myRank = user ? leaderboard.find((e) => e.username === user.username)?.rank : undefined;

  return (
    <section className="section">
      <div className="section-inner">
        <Link to="/tournaments" className="back-link">&larr; Back to tournaments</Link>

        <div className="detail-grid">
          <div className="tournament-card pro-card">
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
                <Badge tone={tournament.status === 'Live' ? 'danger' : 'info'} className={tournament.status === 'Live' ? 'live' : ''}>{tournament.status}</Badge>
              </div>
              <div className="sportsbook-progress">
                <div><span style={{ width: `${Math.min(100, (tournament.participants / tournament.maxPlayers) * 100)}%` }} /></div>
                <p>{tournament.participants}/{tournament.maxPlayers} entries &middot; min {tournament.minPlayers}</p>
              </div>
              <div className={`mini-grid odds-grid${!isOwner ? ' two-col' : ''}`}>
                <span><b>{currency(prize.gross, tournament.currency)}</b> Total pot</span>
                {isOwner && <span><b>{currency(prize.fee, tournament.currency)}</b> Platform fee</span>}
                <span><b>{currency(prize.net, tournament.currency)}</b> Prize pool</span>
              </div>
              {payouts.length > 0 && (
                <div className="mt-3">
                  <h4 className="sub-heading">Payout structure</h4>
                  <div className="payout-bars compact-bars">
                    {payouts.map((p) => (
                      <div key={p.label}>
                        <span style={{ width: `${p.percent}%` }} />
                        {p.label}: {currency(p.amount, tournament.currency)} ({p.percent}%)
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="compliance-row mt-3">
                <span>18+ Age gate</span>
                <span>{tournament.geoRestricted ? 'Geo-gated' : 'Open regions'}</span>
              </div>
              <div className="info-box mt-3">
                <h4 className="info-box-label">Rules</h4>
                <p>{tournament.rules}</p>
              </div>
            </div>
          </div>

          <aside className="betslip-card" aria-label="Tournament details">
            <div className="card-header"><h3>Actions</h3></div>

            {isJoined && myRank && (
              <div className="highlight-box">
                <span className="highlight-box-label">Your rank</span>
                <strong className="highlight-box-value accent-text">#{myRank}</strong>
                <span className="highlight-box-detail">of {participants.length} players</span>
              </div>
            )}

            {user && !isJoined && tournament.status === 'Registration' && (
              <button className="primary-button large full-width" onClick={handleJoin} disabled={joining}>
                {joining ? 'Joining...' : 'Join tournament'}
              </button>
            )}
            {isJoined && <Badge tone="success" className="status-badge-block">You are entered</Badge>}
            {isOwner && <Badge tone="info" className="status-badge-block">You are the organizer</Badge>}
            {!user && (
              <div className="login-cta">
                <p>Log in to join this tournament.</p>
                <Link to="/login" className="primary-button">Log in</Link>
              </div>
            )}

            {isJoined && (
              <div className="detail-stats">
                <div className="detail-stat-cell">
                  <span className="detail-stat-cell-label">My picks</span>
                  <strong className="detail-stat-cell-value">{myPicks.length}</strong>
                </div>
                <div className="detail-stat-cell">
                  <span className="detail-stat-cell-label">My record</span>
                  <strong className="detail-stat-cell-value">
                    {myPicks.filter(p => p.status === 'Won').length}-{myPicks.filter(p => p.status === 'Lost').length}
                  </strong>
                </div>
              </div>
            )}

            <div className="date-row mt-4">
              <div className="fee-row"><span>Registration deadline</span><strong className="numeric">{tournament.registrationDeadline}</strong></div>
              <div className="fee-row"><span>Start date</span><strong className="numeric">{tournament.startDate}</strong></div>
              <div className="fee-row"><span>End date</span><strong className="numeric">{tournament.endDate}</strong></div>
            </div>
          </aside>
        </div>

        {/* Leaderboard */}
        <div className="mt-8">
          <div className="card-header">
            <h3>Leaderboard</h3>
            <Badge tone={tournament.status === 'Live' ? 'danger' : 'info'} className={tournament.status === 'Live' ? 'live' : ''}>{tournament.status === 'Live' ? 'Live' : tournament.status}</Badge>
          </div>
          {leaderboard.length === 0 ? (
            <EmptyState title="No standings yet" body="The leaderboard will populate as picks are settled." />
          ) : (
            <div className="panel wide panel-flush">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Record</th>
                    <th>Points</th>
                    <th>P/L</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => {
                    const isMe = user?.username === entry.username;
                    return (
                      <tr key={entry.username} className={isMe ? 'row-highlight' : undefined}>
                        <td className="numeric">
                          {entry.rank <= 3 ? (
                            <span className={entry.rank === 1 ? 'rank-gold' : entry.rank === 2 ? 'rank-silver' : 'rank-bronze'}>#{entry.rank}</span>
                          ) : `#${entry.rank}`}
                        </td>
                        <td className={isMe ? 'row-me' : undefined}>{entry.username}{isMe ? ' (You)' : ''}</td>
                        <td className="numeric">{entry.record}</td>
                        <td className="numeric">{entry.points}</td>
                        <td className={entry.profitLoss >= 0 ? 'positive' : 'numeric'} style={{ color: entry.profitLoss < 0 ? 'var(--danger)' : undefined }}>{currency(entry.profitLoss)}</td>
                        <td className="numeric" style={{ color: entry.roi >= 0 ? 'var(--success)' : 'var(--danger)' }}>{entry.roi}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* My Picks */}
        {isJoined && myPicks.length > 0 && (
          <div className="mt-8">
            <div className="card-header">
              <h3>My picks ({myPicks.length})</h3>
            </div>
            <div className="pick-list">
              {myPicks.map((pick) => (
                <div key={pick.id} className="list-row">
                  <div><strong>{pick.event}</strong><span>{pick.selection} at {pick.odds}</span></div>
                  <div className="inline-flex-row">
                    <span className="numeric text-muted">{currency(pick.stake)}</span>
                    <Badge tone={pick.status === 'Won' ? 'success' : pick.status === 'Lost' ? 'danger' : 'warning'}>{pick.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Picks */}
        {picks.length > 0 && (
          <div className="mt-8">
            <div className="card-header">
              <h3>All picks ({picks.length})</h3>
            </div>
            <div className="pick-list">
              {picks.slice(0, 20).map((pick) => {
                const participant = participants.find((p) => p.userId === pick.userId);
                return (
                  <div key={pick.id} className="list-row">
                    <div>
                      <strong>{pick.event}</strong>
                      <span>{participant?.username ?? 'Unknown'} &middot; {pick.selection} at {pick.odds}</span>
                    </div>
                    <Badge tone={pick.status === 'Won' ? 'success' : pick.status === 'Lost' ? 'danger' : 'warning'}>{pick.status}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="mt-8">
          <div className="card-header">
            <h3>Participants ({participants.length})</h3>
          </div>
          {participants.length === 0 ? (
            <EmptyState title="No participants yet" body="Be the first to join this tournament!" />
          ) : (
            <div className="panel panel-flush">
              <table>
                <thead>
                  <tr><th>Player</th><th>Joined</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {participants.map((p) => {
                    const isMe = user?.id === p.userId;
                    return (
                      <tr key={p.id} className={isMe ? 'row-highlight' : undefined}>
                        <td className={isMe ? 'row-me' : undefined}>{p.username}{isMe ? ' (You)' : ''}</td>
                        <td className="numeric">{p.joinedAt}</td>
                        <td><Badge tone={p.status === 'Active' ? 'success' : 'danger'}>{p.status}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Forum */}
        <div className="mt-8">
          <h3 className="mb-4">Discussion ({posts.length})</h3>
          {user && (
            <div className="forum-compose">
              <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write a post..." />
              <button className="primary-button" onClick={handlePost} disabled={!postContent.trim()}>Post</button>
            </div>
          )}
          {posts.length === 0 ? (
            <EmptyState title="No posts yet" body="Be the first to start the discussion!" />
          ) : (
            <div className="pick-list">
              {posts.map((p) => (
                <div key={p.id} className="forum-post">
                  <div className="forum-post-header">
                    <strong>{p.username}</strong>
                    <span className="numeric text-muted">{p.createdAt}</span>
                  </div>
                  <p className="forum-post-body">{p.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

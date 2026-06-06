import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Badge, MetricCard, EmptyState, Skeleton, SkeletonLine } from '../components/ui';
import { currency } from '../lib/finance';
import * as userApi from '../lib/userApi';
import { getCurrentUser } from '../lib/auth';

export function DashboardPage() {
  const loadDashboard = useStore((s) => s.loadDashboard);
  const transactions = useStore((s) => s.transactions);
  const notifications = useStore((s) => s.notifications);
  const leaderboard = useStore((s) => s.leaderboard);
  const user = useStore((s) => s.user);
  const loading = useStore((s) => s.loading);
  const [myPicks, setMyPicks] = useState<{ event: string; selection: string; odds: string; status: string }[]>([]);

  useEffect(() => {
    loadDashboard();
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      userApi.getUserPicks(sessionUser.id).then(setMyPicks);
    }
  }, [loadDashboard]);

  const showSkeleton = loading && leaderboard.length === 0;

  return (
    <section className="section" id="dashboard">
      <div className="section-inner">
        <div className="section-heading">
          <h2>Dashboard</h2>
          <Badge>{user?.role ?? 'Participant'}</Badge>
        </div>

        {showSkeleton ? (
          <div className="metrics-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <article className="metric-card" key={i}>
                <Skeleton style={{ width: 44, height: 44, borderRadius: 8 }} />
                <div className="flex-1">
                  <SkeletonLine width="short" />
                  <SkeletonLine width="medium" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="metrics-grid">
            <MetricCard icon="W" label="Win rate" value="62%" detail="18 wins in 29 settled contests" />
            <MetricCard icon="$" label="ROI" value="24.8%" detail="Net positive over last 90 days" />
            <MetricCard icon="B" label="Balance" value={`$${user?.balance.toLocaleString() ?? '0'}`} detail="Available for entry" />
            <MetricCard icon="R" label="Referrals" value="37" detail="11 converted joins this month" />
          </div>
        )}

        <div className="dashboard-grid">
          <article className="panel wide sportsbook-panel">
            <div className="card-header"><h3>Leaderboard</h3><Badge tone="danger" className="live">Live</Badge></div>
            {leaderboard.length === 0 ? (
              <EmptyState title="No leaderboard data" body="Leaderboard populates when tournaments go live." />
            ) : (
              <table>
                <thead><tr><th>Rank</th><th>User</th><th>Record</th><th>P/L</th><th>Points</th><th>ROI</th></tr></thead>
                <tbody>{leaderboard.map((entry) => (
                  <tr key={entry.username}>
                    <td className="numeric">#{entry.rank}</td><td>{entry.username}</td><td>{entry.record}</td><td className="positive">{currency(entry.profitLoss)}</td><td className="numeric">{entry.points}</td><td className="numeric">{entry.roi}%</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </article>

          <article className="panel sportsbook-panel">
            <div className="card-header"><h3>My picks</h3><Badge>Active</Badge></div>
            {myPicks.length === 0 ? (
              <EmptyState title="No picks yet" body="Join a tournament and submit your first pick." />
            ) : (
              myPicks.slice(0, 5).map((pick, idx) => (
                <div className="list-row" key={idx}>
                  <div><strong>{pick.event}</strong><span>{pick.selection}</span></div>
                  <Badge tone={pick.status === 'Won' ? 'success' : pick.status === 'Lost' ? 'danger' : 'warning'}>{pick.status}</Badge>
                </div>
              ))
            )}
          </article>

          <article className="panel sportsbook-panel">
            <div className="card-header"><h3>Wallet</h3><Badge tone="success">Stripe</Badge></div>
            {transactions.length === 0 ? (
              <EmptyState title="No transactions" body="Your payment history will appear here." />
            ) : (
              transactions.slice(0, 3).map((transaction) => (
                <div className="list-row" key={transaction.id}>
                  <div><strong>{transaction.kind}</strong><span>{transaction.tournament}</span></div>
                  <div className="inline-flex-row">
                    <b className="numeric">{currency(transaction.amount)}</b>
                    <Badge tone={transaction.status === 'Succeeded' ? 'success' : 'warning'}>{transaction.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </article>

          <article className="panel sportsbook-panel">
            <div className="card-header"><h3>Alerts</h3></div>
            {notifications.length === 0 ? (
              <EmptyState title="All caught up" body="No new notifications." />
            ) : (
              notifications.map((item) => (
                <div className="list-row" key={item.id}>
                  <div><strong>{item.title}</strong><span>{item.body}</span></div>
                  <Badge tone={item.status === 'Sent' ? 'success' : 'warning'}>{item.channel}</Badge>
                </div>
              ))
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

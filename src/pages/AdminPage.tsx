import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Badge, EmptyState } from '../components/ui';
import { useToast } from '../components/Toast';
import { currency } from '../lib/finance';
import * as adminApi from '../lib/adminApi';

export function AdminPage() {
  const transactions = useStore((s) => s.transactions);
  const [disputes, setDisputes] = useState<{ id: string; username: string; reason: string; status: string; createdAt: string; tournamentId: string }[]>([]);
  const [tournaments, setTournaments] = useState<{ id: string; name: string; organizer: string; status: string }[]>([]);
  const toast = useToast();

  useEffect(() => {
    adminApi.getAllDisputes().then(setDisputes);
    adminApi.getAllTournaments().then((t) => setTournaments(t.map((x) => ({ id: x.id, name: x.name, organizer: x.organizer, status: x.status }))));
  }, []);

  const user = useStore((s) => s.user);
  const role = user?.role ?? 'Participant';
  const isAdmin = role === 'Platform Admin';
  const maxRevenue = Math.max(...[1, ...transactions.map((t) => t.amount)]);

  function handleExport() {
    toast('CSV export initiated', 'info');
  }

  function handleControl(action: string) {
    toast(`${action} — feature coming soon`, 'info');
  }

  function handleSuspend(name: string) {
    toast(`${name} suspend — feature coming soon`, 'warning');
  }

  return (
    <section className="section" id="admin">
      <div className="section-inner">
        <div className="section-heading">
          <h2>Operations console</h2>
          <button className="secondary-button" onClick={handleExport}>Export CSV</button>
        </div>

        {!isAdmin && (
          <div className="permission-note">
            Admin actions are disabled for the current role. Switch to Platform Admin to preview controls.
          </div>
        )}

        <div className="dashboard-grid">
        <article className="panel wide chart-panel sportsbook-panel">
          <div className="card-header"><h3>Payment volume</h3><Badge tone="success">5% default</Badge></div>
          <div className="bar-chart" aria-label="Payment volume chart">
            {transactions.map((transaction) => (
              <div key={transaction.id} style={{ height: `${Math.max(16, (transaction.amount / maxRevenue) * 100)}%` }}>
                <span>{transaction.kind}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel sportsbook-panel">
          <div className="card-header"><h3>Risk controls</h3></div>
          {['Suspend tournament', 'Review disputes', 'Configure fees', 'Manage users', 'Fraud flags'].map((control) => (
            <button className="control-button" disabled={!isAdmin} key={control} onClick={() => handleControl(control)}>
              {control}
            </button>
          ))}
        </article>

        <article className="panel wide sportsbook-panel">
          <div className="card-header"><h3>Payment ledger</h3><Badge tone="success">Audit-ready</Badge></div>
          {transactions.length === 0 ? (
            <EmptyState title="No transactions" body="Payment data will appear here once tournaments process entries." />
          ) : (
            <table>
              <thead><tr><th>Type</th><th>Tournament</th><th>Amount</th><th>Platform fee</th><th>Status</th><th>Stripe ID</th></tr></thead>
              <tbody>{transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.kind}</td>
                  <td>{transaction.tournament}</td>
                  <td className="numeric">{currency(transaction.amount)}</td>
                  <td className="numeric">{currency(transaction.platformFee)}</td>
                  <td><Badge tone={transaction.status === 'Succeeded' ? 'success' : transaction.status === 'Pending' ? 'warning' : 'danger'}>{transaction.status}</Badge></td>
                  <td><code>{transaction.stripeId}</code></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </article>

        <article className="panel wide sportsbook-panel">
          <div className="card-header"><h3>Disputes</h3><Badge tone="warning">Needs attention</Badge></div>
          {disputes.length === 0 ? (
            <EmptyState title="No open disputes" body="All clear for now." />
          ) : (
            disputes.map((d) => (
              <div className="list-row" key={d.id}>
                <div><strong>{d.username}</strong><span>{d.reason}</span></div>
                <Badge tone={d.status === 'Resolved' ? 'success' : 'warning'}>{d.status}</Badge>
              </div>
            ))
          )}
        </article>

        <article className="panel wide sportsbook-panel">
          <div className="card-header"><h3>Tournaments</h3></div>
          {tournaments.length === 0 ? (
            <EmptyState title="No tournaments" body="Tournament data will load once created." />
          ) : (
            <table>
              <thead><tr><th>Name</th><th>Organizer</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{tournaments.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.organizer}</td>
                  <td><Badge tone={t.status === 'Live' ? 'danger' : t.status === 'Completed' ? 'success' : 'info'}>{t.status}</Badge></td>
                  <td><button className="ghost-button" disabled={!isAdmin} onClick={() => handleSuspend(t.name)}>Suspend</button></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </article>
        </div>
      </div>
    </section>
  );
}

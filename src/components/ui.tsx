import type { ReactNode } from 'react';

export function Icon({ label }: { label: string }) {
  return <span className="icon" aria-hidden="true">{label}</span>;
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function MetricCard({ icon, label, value, detail }: { icon: string; label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <div className="metric-icon"><Icon label={icon} /></div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

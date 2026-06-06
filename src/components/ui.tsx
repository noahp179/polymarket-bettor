import type { ReactNode, CSSProperties } from 'react';

/* Icon — renders a short glyph label inside a small styled container.
   Replace emoji usage (⚡, 🔒, etc.) with text labels that match
   the existing .feature-icon / .metric-icon style. */
export function Icon({ label }: { label: string }) {
  return <span className="icon" aria-hidden="true">{label}</span>;
}

export function Badge({ children, tone = 'default', className, style }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string; style?: CSSProperties }) {
  const cls = ['badge', tone, className].filter(Boolean).join(' ');
  return <span className={cls} style={style}>{children}</span>;
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

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style}>&nbsp;</div>;
}

export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonLine({ width }: { width?: 'short' | 'medium' | 'full' }) {
  return <div className={`skeleton skeleton-line ${width ?? ''}`}>&nbsp;</div>;
}

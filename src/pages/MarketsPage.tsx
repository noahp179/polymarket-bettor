import { useStore } from '../store/useStore';
import { LiveMarketBoard } from '../components/LiveMarketBoard';
import { Badge } from '../components/ui';

export function MarketsPage() {
  const sportsEvents = useStore((s) => s.sportsEvents);

  return (
    <>
      <section className="section section-top-pad">
        <div className="section-inner">
          <div className="section-heading">
            <div className="section-heading-group">
              <Badge tone="success">Live</Badge>
              <h2>Markets</h2>
            </div>
          </div>
        </div>
      </section>

      <LiveMarketBoard />

      <section className="section compact">
        <div className="section-inner">
          <div className="section-heading">
            <div className="section-heading-group">
              <Badge tone="info">Sports data</Badge>
              <h2>Live scores, odds, and settlement data</h2>
            </div>
          </div>
          <div className="sports-strip">
            {sportsEvents.map((event) => (
              <article key={event.event} className="event-card sportsbook-panel">
                <Badge>{event.league}</Badge>
                <h3>{event.event}</h3>
                <p>{event.line} · {event.odds}</p>
                <strong>{event.score}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

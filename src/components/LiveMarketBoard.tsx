import { Badge } from './ui';

const featuredMarkets = [
  { league: 'NFL', matchup: 'Dallas Cowboys @ Philadelphia Eagles', time: 'Sun 8:20p', spread: 'PHI -3.5', total: 'O 46.5', moneyline: 'PHI -162' },
  { league: 'NBA', matchup: 'Boston Celtics @ New York Knicks', time: 'Live Q4', spread: 'NYK +2.0', total: 'U 219.5', moneyline: 'NYK +112' },
  { league: 'MLB', matchup: 'Los Angeles Dodgers @ San Francisco Giants', time: 'Top 7', spread: 'LAD -1.5', total: 'O 8.5', moneyline: 'LAD -135' },
];

function MarketButton({ label, value }: { label: string; value: string }) {
  return (
    <button className="odds-button" type="button">
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  );
}

export function LiveMarketBoard() {
  return (
    <section className="section compact" aria-label="Featured betting markets">
      <div className="section-inner">
        <section className="market-board" id="markets">
          <div className="market-board-header">
            <div className="section-heading-group">
              <Badge tone="success">Live</Badge>
              <h2>Pick board</h2>
            </div>
            <span className="market-note">Market feed</span>
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
      </div>
    </section>
  );
}

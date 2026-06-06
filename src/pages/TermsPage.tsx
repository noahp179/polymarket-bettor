import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <section className="legal-page">
      <Link to="/" className="back-link">&larr; Back to home</Link>
      <h1>Terms of Service</h1>
      <span className="legal-updated">Last updated: June 3, 2026</span>

      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old and located in a jurisdiction where skill-based contests are legal to use Longshots. By creating an account, you represent and warrant that you meet these requirements.</p>

      <h2>2. Tournament Rules</h2>
      <p>All contests are governed by the rules published by the tournament organizer. Prize pools are calculated minus a 5% platform fee. Longshots reserves the right to cancel or modify contests that violate platform policies.</p>

      <h2>3. Payments</h2>
      <p>Entry fees are processed through Stripe Connect. Refunds are only issued if the minimum participant threshold is not met. Payouts are distributed according to the prize distribution published for each tournament.</p>

      <h2>4. Disputes</h2>
      <p>Disputes may be filed through the tournament detail page. The platform reserves the right to suspend users or tournaments for fraudulent activity. All dispute resolutions are final.</p>

      <h2>5. Account Termination</h2>
      <p>Longshots may suspend or terminate accounts that violate these terms, engage in fraudulent behavior, or are the subject of verified complaints.</p>

      <h2>6. Limitation of Liability</h2>
      <p>Longshots provides the platform for organizing and participating in pick contests. We are not responsible for the outcomes of any contest or the actions of tournament organizers beyond the scope of our platform policies.</p>

      <h2>7. Changes to Terms</h2>
      <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
    </section>
  );
}

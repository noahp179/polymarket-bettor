import { Link } from 'react-router-dom';

export function ResponsibleGamingPage() {
  return (
    <section className="legal-page">
      <Link to="/" className="back-link">&larr; Back to home</Link>
      <h1>Responsible Gaming</h1>
      <span className="legal-updated">Longshots is committed to promoting healthy and responsible gameplay.</span>

      <h2>Our Commitment</h2>
      <p>We believe gaming should always be entertainment, never a problem. Longshots provides tools and resources to help you stay in control of your play.</p>

      <h2>Self-Exclusion</h2>
      <p>If you feel that gaming is becoming a problem, you can self-exclude from the platform for a set period — 24 hours, 7 days, 30 days, or permanently. During self-exclusion, you will not be able to join tournaments or make deposits. Contact support to initiate this process.</p>

      <h2>Deposit &amp; Spending Limits</h2>
      <p>Set daily, weekly, or monthly limits on your tournament entries to stay in control. Once set, these limits cannot be increased during the active period. You can decrease limits at any time.</p>

      <h2>Cooling-Off Periods</h2>
      <p>Take a break when you need it. Cooling-off periods temporarily block you from entering new contests and making deposits. Your existing tournament entries remain active, but you cannot join new ones until the cooling-off period ends.</p>

      <h2>Reality Checks</h2>
      <p>Enable session reminders to help you track how long you've been playing. These periodic notifications help you stay aware of your gaming activity.</p>

      <h2>Recognizing Problem Gaming</h2>
      <p>Gaming may be becoming a problem if you:</p>
      <ul className="legal-list">
        <li>Spend more than you can afford</li>
        <li>Chase losses by entering more contests</li>
        <li>Neglect work, school, or personal obligations</li>
        <li>Feel anxious or irritable when not playing</li>
        <li>Hide your gaming activity from others</li>
      </ul>

      <h2>Get Help</h2>
      <p>If you or someone you know needs help with problem gaming, reach out to these confidential resources:</p>
      <ul className="legal-list">
        <li>National Problem Gambling Helpline: <strong>1-800-522-4700</strong></li>
        <li>NCPG Chat: <strong>ncpgambling.org/chat</strong></li>
        <li>Gambler's Anonymous: <strong>gamblersanonymous.org</strong></li>
      </ul>

      <h2>Contact Us</h2>
      <p>For responsible gaming support, email <strong>support@longshots.com</strong>. Our team is available to help you set limits, self-exclude, or find additional resources.</p>
    </section>
  );
}

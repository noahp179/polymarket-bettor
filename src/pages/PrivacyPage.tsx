import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <section className="legal-page">
      <Link to="/" className="back-link">&larr; Back to home</Link>
      <h1>Privacy Policy</h1>
      <span className="legal-updated">Last updated: June 3, 2026</span>

      <h2>1. Data We Collect</h2>
      <p>We collect your email, username, transaction history, and pick data to operate the platform and ensure contest integrity. Location data may be collected to verify eligibility in supported jurisdictions.</p>

      <h2>2. How We Use Data</h2>
      <p>Data is used to calculate leaderboards, process payments, prevent fraud, and improve the product. We do not use your data for purposes unrelated to the operation of Longshots without your consent.</p>

      <h2>3. Sharing</h2>
      <p>We do not sell your data. Payment data is shared with Stripe for processing. Leaderboard rankings and contest results are publicly visible as part of the platform experience.</p>

      <h2>4. Data Retention</h2>
      <p>We retain your account data for the duration of your membership. Transaction records are retained as required by law. You may request deletion of your account and associated personal data at any time.</p>

      <h2>5. Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data at any time by contacting support. Depending on your jurisdiction, you may have additional rights regarding your data.</p>

      <h2>6. Security</h2>
      <p>We implement industry-standard security measures to protect your data. All payment processing is handled through Stripe's PCI-compliant infrastructure. However, no system is completely secure and we cannot guarantee absolute security.</p>

      <h2>7. Cookies</h2>
      <p>We use essential cookies to maintain your session and preferences. Analytics cookies may be used to improve the platform experience. You can manage cookie preferences through your browser settings.</p>

      <h2>8. Contact</h2>
      <p>For privacy-related inquiries, please contact us at privacy@longshots.com.</p>
    </section>
  );
}

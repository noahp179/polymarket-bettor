import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>Longshots</strong>
          <p>The premier platform for sports pick tournaments. Create contests, compete for real prize pools, and track your ROI.</p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/markets">Markets</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/responsible-gaming">Responsible Gaming</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="mailto:support@longshots.com">Contact Us</a>
          <a href="/#faq">FAQ</a>
          <a href="/responsible-gaming">Get Help</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Longshots. All rights reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/responsible-gaming">Responsible Gaming</Link>
        </div>
      </div>
    </footer>
  );
}

import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useToast } from './Toast';
import { useState, useEffect } from 'react';

export function Header() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSport, setActiveSport] = useState<string | null>(null);

  // Close drawer on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  function handleSportClick(sport: string, e: React.MouseEvent) {
    e.preventDefault();
    setActiveSport((prev) => prev === sport ? null : sport);
    toast(`${sport} markets selected`, 'info');
  }

  function handleLogout() {
    logout();
    navigate('/');
    toast('Logged out successfully', 'info');
  }

  return (
    <header className="sportsbook-header">
      <div className="header-main">
        <Link to="/" className="sportsbook-brand">
          <div className="brand-mark">LS</div>
          <div>
            <strong>Longshots</strong>
            <span>Sportsbook</span>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavLink to="/markets">Markets</NavLink>
          <NavLink to="/tournaments">Tournaments</NavLink>
          {user && <NavLink to="/dashboard">My Hub</NavLink>}
          {user?.role === 'Platform Admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="top-actions">
          {user ? (
            <>
              <span className="badge info">{user.username}</span>
              <span className="badge">{user.role}</span>
              <button className="ghost-button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost-button">Log in</Link>
              <Link to="/register" className="primary-button">Sign up</Link>
            </>
          )}
          <button
            className="mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </div>

      <nav className="sport-nav" aria-label="Sport quick filters">
        {(['NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA'] as const).map((sport) => (
          <a
            href="/"
            key={sport}
            className={activeSport === sport ? 'active' : ''}
            onClick={(e) => handleSportClick(sport, e)}
          >
            {sport}
          </a>
        ))}
        <a href="/" onClick={(e) => { e.preventDefault(); toast('Promotions coming soon!', 'info'); }}>Promos</a>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="mobile-drawer-panel">
          <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">&times;</button>
          {user && (
            <div className="back-link">
              <span className="badge info">{user.username}</span>
              <span className="badge role-badge">{user.role}</span>
            </div>
          )}
          <Link to="/markets">Markets</Link>
          <Link to="/tournaments">Tournaments</Link>
          {user ? (
            <>
              <Link to="/dashboard">My Hub</Link>
              {user.role === 'Platform Admin' && <Link to="/admin">Admin</Link>}
              <div className="mt-4">
                <button className="ghost-button full-width" onClick={handleLogout}>Log out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
          <div className="mobile-drawer-divider">
            <p className="sub-heading">Sports</p>
            {['NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'MMA'].map((sport) => (
              <a href="/" key={sport} onClick={(e) => { e.preventDefault(); setDrawerOpen(false); handleSportClick(sport, e); }}>{sport}</a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

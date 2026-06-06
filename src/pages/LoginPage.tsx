import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui';
import { useToast } from '../components/Toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore((s) => s.login);
  const loading = useStore((s) => s.loading);
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-brand-side">
        <Badge tone="info">Sportsbook</Badge>
        <h1>Welcome back to Longshots</h1>
        <p>Log in to track your picks, view leaderboards, manage your wallet, and compete in pick tournaments.</p>
        <div className="auth-brand-stats">
          <span><b>$1M+</b><small>Prizes paid</small></span>
          <span><b>10K+</b><small>Active users</small></span>
          <span><b>99.9%</b><small>Payout rate</small></span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <div className="auth-card">
            <div className="card-header">
              <h2>Log in</h2>
            </div>
            <p className="auth-hint">Enter your credentials to continue.</p>

            {error && <div className="errors"><p>{error}</p></div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-label">
                Email
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </label>
              <label className="auth-label">
                Password
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
              </label>
              <button className="primary-button large full-width" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="auth-footer-text">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="auth-link">Sign up</Link>
            </p>

            <div className="demo-box">
              <p className="demo-box-title">Demo accounts</p>
              <p className="demo-box-accounts">
                admin@longshots.com — admin access<br />
                player@longshots.com — player access
              </p>
              <p className="demo-box-hint">Any password works for demo accounts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

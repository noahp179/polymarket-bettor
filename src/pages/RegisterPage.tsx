import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useToast } from '../components/Toast';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const register = useStore((s) => s.register);
  const loading = useStore((s) => s.loading);
  const navigate = useNavigate();
  const toast = useToast();

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColors = ['', 'var(--danger)', 'var(--warning)', 'var(--success)'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, username);
      toast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-brand-side">
        <h1>Start competing today</h1>
        <p>Create your Longshots account to join pick contests, track your performance, and win real prize pools.</p>
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
              <h2>Create account</h2>
            </div>
            <p className="auth-hint">Join Longshots and start competing.</p>

            {error && <div className="errors"><p>{error}</p></div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-label">
                Username
                <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Pick a username" autoComplete="username" />
              </label>
              <label className="auth-label">
                Email
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </label>
              <label className="auth-label">
                Password
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" />
                {passwordStrength > 0 && (
                  <div className="password-strength">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className="password-strength-bar" style={{ background: passwordStrength >= level ? strengthColors[passwordStrength] : 'var(--border)' }} />
                    ))}
                    <span className="password-strength-label" style={{ color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</span>
                  </div>
                )}
              </label>
              <button className="primary-button large full-width" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Log in</Link>
            </p>
            <p className="auth-legal-text">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="inline-link">Terms</Link>{' '}and{' '}
              <Link to="/privacy" className="inline-link">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

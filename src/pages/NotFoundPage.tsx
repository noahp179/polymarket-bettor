import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2 className="not-found-subtitle">Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className="inline-flex-row mt-2">
        <Link to="/" className="primary-button large">Go home</Link>
        <Link to="/tournaments" className="secondary-button large">Browse tournaments</Link>
      </div>
    </div>
  );
}

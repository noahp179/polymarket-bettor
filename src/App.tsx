import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthGuard } from './components/AuthGuard';
import { ToastProvider } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { TournamentDetailPage } from './pages/TournamentDetailPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ResponsibleGamingPage } from './pages/ResponsibleGamingPage';
import { NotFoundPage } from './pages/NotFoundPage';

const HIDE_NAV_PATHS = ['/login', '/register'];

export default function App() {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV_PATHS.includes(pathname);

  return (
    <ToastProvider>
      <main className="app">
        {showNav && <Header />}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tournament/:id" element={<TournamentDetailPage />} />
            <Route path="/dashboard" element={
              <AuthGuard><DashboardPage /></AuthGuard>
            } />
            <Route path="/admin" element={
              <AuthGuard requiredRole="Platform Admin"><AdminPage /></AuthGuard>
            } />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/responsible-gaming" element={<ResponsibleGamingPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
        {showNav && <Footer />}
      </main>
    </ToastProvider>
  );
}

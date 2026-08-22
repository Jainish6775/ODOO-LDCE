import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import MyTrips from './pages/trips/MyTrips';
import CreateTrip from './pages/trips/CreateTrip';
import ItineraryBuilder from './pages/trips/ItineraryBuilder';
import TripDetails from './pages/trips/TripDetails';
import TripCalendar from './pages/trips/TripCalendar';
import Explore from './pages/discovery/Explore';
import Community from './pages/discovery/Community';
import NotFound from './pages/errors/NotFound';
import './index.css';
import './styles/components.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <span style={{ fontSize: '3rem', animation: 'bounce 1.5s ease-in-out infinite' }}>🌍</span>
        <p style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>Loading GlobeTrotter...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route (redirect if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Placeholder components for routes not yet built
function PlaceholderPage({ title, emoji, description }) {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <span className="empty-state-icon">{emoji}</span>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-text">{description}</p>
      <span className="badge badge-neutral">Coming Soon</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--neutral-0)',
              color: 'var(--neutral-800)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              fontSize: 'var(--text-sm)',
            },
          }}
        />

        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><Register /></PublicRoute>
          } />

          {/* Protected routes with app shell */}
          <Route path="/" element={
            <ProtectedRoute><AppLayout /></ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="explore" element={<Explore />} />
            <Route path="my-trips" element={<MyTrips />} />
            <Route path="trips/new" element={<CreateTrip />} />
            <Route path="trips/:id/itinerary" element={<ItineraryBuilder />} />
            <Route path="trips/:id" element={<TripDetails />} />
            <Route path="calendar" element={<TripCalendar />} />
            <Route path="community" element={<Community />} />
            <Route path="saved" element={
              <PlaceholderPage title="Saved Destinations" emoji="💾" description="Your bookmarked cities and activities." />
            } />
            <Route path="profile" element={
              <PlaceholderPage title="Profile" emoji="👤" description="Manage your personal details and preferences." />
            } />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

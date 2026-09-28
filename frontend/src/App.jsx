import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/public/PublicLayout';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import MouseEffectsHandler from './components/common/MouseEffectsHandler';
import './index.css';
import './styles/components.css';

// Public marketing & landing pages
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// App workspace pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MyTrips = lazy(() => import('./pages/trips/MyTrips'));
const CreateTrip = lazy(() => import('./pages/trips/CreateTrip'));
const ItineraryBuilder = lazy(() => import('./pages/trips/ItineraryBuilder'));
const TripDetails = lazy(() => import('./pages/trips/TripDetails'));
const TripCalendar = lazy(() => import('./pages/trips/TripCalendar'));
const Explore = lazy(() => import('./pages/discovery/Explore'));
const Community = lazy(() => import('./pages/discovery/Community'));
const Saved = lazy(() => import('./pages/discovery/Saved'));
const Profile = lazy(() => import('./pages/auth/Profile'));
const NotFound = lazy(() => import('./pages/errors/NotFound'));

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Auth Route (redirect to dashboard if already authenticated)
function PublicAuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <MouseEffectsHandler />
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

          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Marketing Layout & Pages */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Public Auth routes */}
              <Route path="/login" element={
                <PublicAuthRoute><Login /></PublicAuthRoute>
              } />
              <Route path="/register" element={
                <PublicAuthRoute><Register /></PublicAuthRoute>
              } />

              {/* Protected App Workspace Routes with Sidebar & Command Header */}
              <Route element={
                <ProtectedRoute><AppLayout /></ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/my-trips" element={<MyTrips />} />
                <Route path="/trips/new" element={<CreateTrip />} />
                <Route path="/trips/:id/itinerary" element={<ItineraryBuilder />} />
                <Route path="/trips/:id" element={<TripDetails />} />
                <Route path="/calendar" element={<TripCalendar />} />
                <Route path="/community" element={<Community />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

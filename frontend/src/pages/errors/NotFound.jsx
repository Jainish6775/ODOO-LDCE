import { Link } from 'react-router-dom';
import { FiHome, FiCompass } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-emoji">🧭</span>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          Looks like you've wandered off the map! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <FiHome /> Go Home
          </Link>
          <Link to="/explore" className="btn btn-secondary">
            <FiCompass /> Explore
          </Link>
        </div>
      </div>

      <style>{`
        .not-found-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          padding: var(--space-8);
        }

        .not-found-content {
          text-align: center;
          max-width: 480px;
        }

        .not-found-emoji {
          font-size: 5rem;
          display: block;
          margin-bottom: var(--space-4);
          animation: spin-slow 4s linear infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .not-found-code {
          font-family: var(--font-display);
          font-size: 6rem;
          font-weight: var(--weight-extrabold);
          background: linear-gradient(135deg, var(--primary-400), var(--accent-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: var(--space-2);
        }

        .not-found-title {
          font-size: var(--text-2xl);
          color: var(--neutral-800);
          margin-bottom: var(--space-4);
        }

        .not-found-text {
          font-size: var(--text-base);
          color: var(--neutral-500);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-8);
        }

        .not-found-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

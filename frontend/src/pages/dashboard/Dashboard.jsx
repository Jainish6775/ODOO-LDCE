import { Link } from 'react-router-dom';
import { FiMapPin, FiTrendingUp, FiStar, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Hero Banner */}
      <section className="dash-hero">
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">Where will you go next?</h1>
          <p className="dash-hero-subtitle">
            Discover destinations, plan itineraries, and create unforgettable journeys.
          </p>
          <div className="dash-hero-actions">
            <Link to="/trips/new" className="btn btn-accent btn-lg">
              <HiOutlinePaperAirplane /> Plan a Trip
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              Explore Destinations
            </Link>
          </div>
        </div>
        <div className="dash-hero-visual">
          <span className="dash-hero-globe">🌏</span>
        </div>
      </section>

      {/* Search Bar */}
      <section className="dash-search">
        <div className="dash-search-bar">
          <FiMapPin className="dash-search-icon" />
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search cities, activities, or trips..."
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
            <FiMapPin />
          </div>
          <div>
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Trips Planned</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'var(--accent-100)', color: 'var(--accent-700)' }}>
            <FiCalendar />
          </div>
          <div>
            <div className="dash-stat-value">—</div>
            <div className="dash-stat-label">Upcoming Trip</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: 'var(--success-bg)', color: '#2b8a3e' }}>
            <FiDollarSign />
          </div>
          <div>
            <div className="dash-stat-value">$0</div>
            <div className="dash-stat-label">Total Budget</div>
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="dash-section">
        <div className="dash-section-header">
          <h2>🌍 Top Destinations</h2>
          <Link to="/explore" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="dash-card-row">
          {[
            { name: 'Paris', country: 'France', emoji: '🗼', cost: 'Moderate', days: '4–5 days' },
            { name: 'Tokyo', country: 'Japan', emoji: '⛩️', cost: 'Moderate', days: '5–7 days' },
            { name: 'Bali', country: 'Indonesia', emoji: '🏖️', cost: 'Budget', days: '5–7 days' },
            { name: 'Rome', country: 'Italy', emoji: '🏛️', cost: 'Moderate', days: '3–4 days' },
            { name: 'New York', country: 'USA', emoji: '🗽', cost: 'Luxury', days: '4–6 days' },
          ].map((city) => (
            <div key={city.name} className="dash-dest-card card">
              <div className="dash-dest-emoji">{city.emoji}</div>
              <div className="card-body">
                <h4 className="card-title">{city.name}</h4>
                <p className="card-subtitle">{city.country}</p>
                <div className="dash-dest-meta">
                  <span className="badge badge-primary">{city.cost}</span>
                  <span className="dash-dest-days">{city.days}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Activities */}
      <section className="dash-section">
        <div className="dash-section-header">
          <h2>⭐ Popular Activities</h2>
          <Link to="/explore" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="dash-card-row">
          {[
            { name: 'Eiffel Tower Visit', city: 'Paris', cat: 'Sightseeing', cost: '$25', rating: 4.8, emoji: '🗼' },
            { name: 'Sushi Making Class', city: 'Tokyo', cat: 'Food & Drink', cost: '$60', rating: 4.9, emoji: '🍣' },
            { name: 'Ubud Rice Terraces', city: 'Bali', cat: 'Nature', cost: '$10', rating: 4.7, emoji: '🌾' },
            { name: 'Colosseum Tour', city: 'Rome', cat: 'History', cost: '$20', rating: 4.8, emoji: '🏛️' },
            { name: 'Broadway Show', city: 'New York', cat: 'Entertainment', cost: '$120', rating: 4.6, emoji: '🎭' },
          ].map((act) => (
            <div key={act.name} className="dash-act-card card">
              <div className="dash-act-emoji">{act.emoji}</div>
              <div className="card-body">
                <h4 className="card-title" style={{ fontSize: 'var(--text-base)' }}>{act.name}</h4>
                <p className="card-subtitle">{act.city} · {act.cat}</p>
                <div className="dash-act-meta">
                  <span className="dash-act-cost">{act.cost}</span>
                  <span className="dash-act-rating"><FiStar /> {act.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Empty Trips State */}
      <section className="dash-section">
        <div className="dash-section-header">
          <h2>✈️ Your Trips</h2>
          <Link to="/my-trips" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="empty-state">
          <span className="empty-state-icon">🧳</span>
          <h3 className="empty-state-title">No trips yet</h3>
          <p className="empty-state-text">Start planning your first adventure! Create a trip to organize your destinations, activities, and budget.</p>
          <Link to="/trips/new" className="btn btn-primary">
            <HiOutlinePaperAirplane /> Plan Your First Trip
          </Link>
        </div>
      </section>

      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        /* Hero */
        .dash-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
          border-radius: var(--radius-xl);
          padding: var(--space-12) var(--space-10);
          position: relative;
          overflow: hidden;
        }

        .dash-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(circle, rgba(32, 201, 151, 0.08) 0%, transparent 70%);
        }

        .dash-hero-content {
          position: relative;
          z-index: 1;
          max-width: 560px;
        }

        .dash-hero-title {
          font-family: var(--font-display);
          font-size: var(--text-4xl);
          font-weight: var(--weight-extrabold);
          color: var(--neutral-900);
          margin-bottom: var(--space-4);
          line-height: 1.15;
        }

        .dash-hero-subtitle {
          font-size: var(--text-lg);
          color: var(--neutral-600);
          margin-bottom: var(--space-6);
          line-height: var(--leading-relaxed);
        }

        .dash-hero-actions {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .dash-hero-visual {
          position: relative;
          z-index: 1;
        }

        .dash-hero-globe {
          font-size: 8rem;
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* Search */
        .dash-search {
          margin-top: calc(-1 * var(--space-4));
        }

        .dash-search-bar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--neutral-0);
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-full);
          padding: var(--space-3) var(--space-6);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
          max-width: 600px;
          margin: 0 auto;
        }

        .dash-search-bar:focus-within {
          border-color: var(--primary-400);
          box-shadow: var(--shadow-lg), 0 0 0 3px rgba(32, 201, 151, 0.1);
        }

        .dash-search-icon {
          color: var(--neutral-400);
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .dash-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: var(--text-base);
          color: var(--neutral-800);
          background: transparent;
        }

        .dash-search-input::placeholder {
          color: var(--neutral-400);
        }

        /* Stats */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .dash-stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: var(--neutral-0);
          border: 1px solid var(--neutral-100);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: var(--shadow-xs);
        }

        .dash-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .dash-stat-value {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--neutral-900);
        }

        .dash-stat-label {
          font-size: var(--text-xs);
          color: var(--neutral-500);
        }

        /* Sections */
        .dash-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dash-section-header h2 {
          font-size: var(--text-xl);
        }

        /* Card Row */
        .dash-card-row {
          display: flex;
          gap: var(--space-4);
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: var(--space-2);
        }

        .dash-card-row::-webkit-scrollbar {
          display: none;
        }

        /* Destination Cards */
        .dash-dest-card {
          min-width: 200px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .dash-dest-emoji {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
        }

        .dash-dest-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--space-3);
        }

        .dash-dest-days {
          font-size: var(--text-xs);
          color: var(--neutral-500);
        }

        /* Activity Cards */
        .dash-act-card {
          min-width: 220px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .dash-act-emoji {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          background: linear-gradient(135deg, var(--accent-50), var(--primary-50));
        }

        .dash-act-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--space-3);
        }

        .dash-act-cost {
          font-weight: var(--weight-semibold);
          color: var(--primary-700);
          font-size: var(--text-sm);
        }

        .dash-act-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-sm);
          color: var(--accent-600);
        }

        @media (max-width: 768px) {
          .dash-hero {
            flex-direction: column;
            padding: var(--space-8) var(--space-6);
            text-align: center;
          }

          .dash-hero-title {
            font-size: var(--text-2xl);
          }

          .dash-hero-subtitle {
            font-size: var(--text-base);
          }

          .dash-hero-actions {
            justify-content: center;
          }

          .dash-hero-globe {
            font-size: 4rem;
          }

          .dash-dest-card {
            min-width: 160px;
          }

          .dash-act-card {
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronDown, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  
  const regions = [
    { name: 'Europe', image: '/images/region_europe_1787378498140.jpg' },
    { name: 'Asia', image: '/images/region_asia_1787378514027.jpg' },
    { name: 'Americas', image: '/images/trip_tokyo_1787378579161.jpg' },
    { name: 'Africa', image: '/images/trip_bali_1787378598373.jpg' },
    { name: 'Oceania', image: '/images/trip_paris_1787378563287.jpg' },
  ];

  const previousTrips = [
    { name: 'Paris Getaway', date: 'Oct 2025', image: '/images/trip_paris_1787378563287.jpg' },
    { name: 'Tokyo Neon Nights', date: 'May 2025', image: '/images/trip_tokyo_1787378579161.jpg' },
    { name: 'Bali Retreat', date: 'Jan 2025', image: '/images/trip_bali_1787378598373.jpg' },
  ];

  return (
    <div className="landing-page">
      
      {/* Banner Section */}
      <section className="banner-section">
        <img 
          src="/images/dashboard_banner_1787378478140.jpg" 
          alt="Travel Banner" 
          className="banner-image" 
        />
        <div className="banner-overlay">
          <h1 className="banner-title">Welcome back, {user?.firstName || 'Traveler'}</h1>
          <p className="banner-subtitle">Ready for your next adventure?</p>
        </div>
      </section>

      {/* Search & Filters Controls */}
      <section className="controls-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search destinations, trips..." 
            className="search-input"
          />
        </div>
        
        <div className="filter-actions">
          <button className="control-btn dropdown-btn">
            Group by <FiChevronDown />
          </button>
          <button className="control-btn filter-btn">
            Filter <FiFilter />
          </button>
          <button className="control-btn dropdown-btn">
            Sort by... <FiChevronDown />
          </button>
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="dashboard-section">
        <h2 className="section-title">Top Regional Selections</h2>
        <div className="region-grid">
          {regions.map((region, idx) => (
            <div key={idx} className="region-card">
              <img src={region.image} alt={region.name} className="region-img" />
              <div className="region-name-overlay">{region.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      <section className="dashboard-section">
        <h2 className="section-title">Previous Trips</h2>
        <div className="trips-grid">
          {previousTrips.map((trip, idx) => (
            <div key={idx} className="trip-card">
              <img src={trip.image} alt={trip.name} className="trip-img" />
              <div className="trip-info-overlay">
                <h3>{trip.name}</h3>
                <p>{trip.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <Link to="/trips/new" className="fab-plan-trip">
        <FiPlus /> Plan a trip
      </Link>

      <style>{`
        .landing-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          padding-bottom: var(--space-20);
          position: relative;
        }

        /* Banner */
        .banner-section {
          position: relative;
          width: 100%;
          height: 320px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: var(--space-8);
          color: white;
        }

        .banner-title {
          color: white;
          font-size: var(--text-4xl);
          margin-bottom: var(--space-2);
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .banner-subtitle {
          font-size: var(--text-lg);
          opacity: 0.9;
        }

        /* Controls */
        .controls-section {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          align-items: center;
          justify-content: space-between;
        }

        .search-wrapper {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          background: var(--neutral-0);
          border: 1px solid var(--neutral-300);
          border-radius: var(--radius-full);
          padding: var(--space-2) var(--space-4);
          transition: var(--transition-fast);
        }

        .search-wrapper:focus-within {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.15);
        }

        .search-icon {
          color: var(--neutral-500);
          margin-right: var(--space-2);
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: var(--text-sm);
          color: var(--neutral-800);
        }

        .filter-actions {
          display: flex;
          gap: var(--space-3);
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--neutral-0);
          border: 1px solid var(--neutral-300);
          border-radius: var(--radius-full);
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          color: var(--neutral-700);
          font-weight: var(--weight-medium);
          transition: var(--transition-fast);
        }

        .control-btn:hover {
          background: var(--neutral-50);
          border-color: var(--neutral-400);
        }

        /* Sections common */
        .section-title {
          font-size: var(--text-xl);
          border-bottom: 2px solid var(--neutral-200);
          padding-bottom: var(--space-2);
          margin-bottom: var(--space-5);
        }

        /* Regions */
        .region-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-4);
        }

        .region-card {
          aspect-ratio: 1/1;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-fast);
          cursor: pointer;
        }

        .region-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .region-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .region-card:hover .region-img {
          transform: scale(1.05);
        }

        .region-name-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--weight-bold);
          font-size: var(--text-lg);
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        /* Previous Trips */
        .trips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }

        .trip-card {
          aspect-ratio: 3/4;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-fast);
          cursor: pointer;
        }

        .trip-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }

        .trip-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .trip-card:hover .trip-img {
          transform: scale(1.05);
        }

        .trip-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-4);
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
        }

        .trip-info-overlay h3 {
          color: white;
          font-size: var(--text-lg);
          margin-bottom: var(--space-1);
        }

        .trip-info-overlay p {
          font-size: var(--text-sm);
          opacity: 0.8;
        }

        /* FAB */
        .fab-plan-trip {
          position: fixed;
          bottom: calc(var(--bottom-nav-height) + var(--space-6));
          right: var(--space-6);
          background: var(--primary-600);
          color: white;
          border-radius: var(--radius-full);
          padding: var(--space-3) var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--weight-bold);
          box-shadow: 0 4px 12px rgba(32, 201, 151, 0.4);
          z-index: 100;
          transition: var(--transition-spring);
        }

        .fab-plan-trip:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 16px rgba(32, 201, 151, 0.5);
          color: white;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .region-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .banner-section {
            height: 240px;
          }
          
          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-actions {
            justify-content: space-between;
          }
          
          .control-btn {
            flex: 1;
            justify-content: center;
          }

          .trips-grid {
            grid-template-columns: 1fr;
          }

          .trip-card {
            aspect-ratio: 16/9;
          }
        }
      `}</style>
    </div>
  );
}


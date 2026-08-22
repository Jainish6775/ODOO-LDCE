import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronDown, FiPlus, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { tripsAPI } from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Banner Quick Search Form State
  const [quickDest, setQuickDest] = useState('');
  const [quickDuration, setQuickDuration] = useState('3');
  const [quickStyle, setQuickStyle] = useState('moderate');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const bannerImages = [
    '/images/dashboard_banner_1787378478140.jpg',
  ];

  // Search & Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'upcoming', 'ongoing', 'completed', 'draft'
  const [sortBy, setSortBy] = useState('default'); // 'default', 'name_asc', 'name_desc', 'date_desc', 'date_asc'
  const [groupBy, setGroupBy] = useState('none'); // 'none', 'status', 'region'

  // Dropdown open states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  // Trips & Stats state
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultRegions = [
    { name: 'Europe', image: '/images/region_europe_1787378498140.jpg', description: 'Historic landmarks & romantic cities' },
    { name: 'Asia', image: '/images/region_asia_1787378514027.jpg', description: 'Rich cultures & incredible cuisine' },
    { name: 'Americas', image: '/images/trip_tokyo_1787378579161.jpg', description: 'Vast national parks & iconic skylines' },
    { name: 'Africa', image: '/images/trip_bali_1787378598373.jpg', description: 'Wildlife safaris & ancient wonders' },
    { name: 'Oceania', image: '/images/trip_paris_1787378563287.jpg', description: 'Tropical beaches & natural beauty' },
  ];

  useEffect(() => {
    fetchDashboardTrips();
  }, []);

  const fetchDashboardTrips = async () => {
    try {
      setLoading(true);
      const res = await tripsAPI.getAll();
      const loadedTrips = Array.isArray(res.data) ? res.data : [];
      setTrips(loadedTrips);
    } catch (error) {
      console.warn('Failed to load trips from API, showing default sample trips:', error);
      setTrips([
        { id: 1, name: 'Paris Getaway', starting_location: 'Paris, France', start_date: '2026-10-15', duration_days: 7, budget: 1800, status: 'upcoming', cover_image: '/images/trip_paris_1787378563287.jpg' },
        { id: 2, name: 'Tokyo Neon Nights', starting_location: 'Tokyo, Japan', start_date: '2026-05-10', duration_days: 10, budget: 2500, status: 'completed', cover_image: '/images/trip_tokyo_1787378579161.jpg' },
        { id: 3, name: 'Bali Island Escape', starting_location: 'Bali, Indonesia', start_date: '2026-01-20', duration_days: 14, budget: 1400, status: 'completed', cover_image: '/images/trip_bali_1787378598373.jpg' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick Plan Trip Handler
  const handleQuickPlan = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      destination: quickDest,
      duration: quickDuration,
      style: quickStyle,
    }).toString();
    navigate(`/trips/new?${query}`);
  };

  // Region Card Click Handler
  const handleSelectRegion = (region) => {
    navigate(`/trips/new?region=${encodeURIComponent(region.name)}&image=${encodeURIComponent(region.image)}`, {
      state: { region: region.name, image: region.image }
    });
  };

  // Filtered & Sorted Regions
  const filteredRegions = defaultRegions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered & Sorted Trips
  const getProcessedTrips = () => {
    let result = [...trips];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(trip => 
        (trip.name && trip.name.toLowerCase().includes(q)) ||
        (trip.starting_location && trip.starting_location.toLowerCase().includes(q)) ||
        (trip.status && trip.status.toLowerCase().includes(q))
      );
    }

    // Status Filter
    if (filterStatus !== 'all') {
      result = result.filter(trip => (trip.status || 'draft').toLowerCase() === filterStatus.toLowerCase());
    }

    // Sort By
    if (sortBy === 'name_asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.start_date || 0) - new Date(b.start_date || 0));
    }

    return result;
  };

  const processedTrips = getProcessedTrips();

  // Calculated Stats
  const totalTripsCount = trips.length;
  const totalBudgetTracked = trips.reduce((sum, t) => sum + (Number(t.budget) || 0), 0);
  const uniqueLocations = new Set(trips.map(t => t.starting_location).filter(Boolean)).size;

  return (
    <div className="landing-page">
      
      {/* Banner Section with Quick Trip Launcher */}
      <section className="banner-section">
        <img 
          key={activeBannerIdx}
          src={bannerImages[activeBannerIdx]} 
          alt="Travel Banner" 
          className="banner-image animate-fade-in" 
        />
        <div className="banner-overlay">
          <div className="banner-content">
            <h1 className="banner-title">Welcome back, {user?.first_name || 'Traveler'}</h1>
            <p className="banner-subtitle">Where are you exploring next?</p>
          </div>

          {/* Quick Trip Search Card */}
          <form className="quick-search-card" onSubmit={handleQuickPlan}>
            <div className="quick-search-field">
              <label>Destination</label>
              <input 
                type="text" 
                placeholder="Where to? (e.g. Kyoto, Paris)" 
                value={quickDest}
                onChange={(e) => setQuickDest(e.target.value)}
              />
            </div>
            <div className="quick-search-divider"></div>
            <div className="quick-search-field">
              <label>Duration</label>
              <select value={quickDuration} onChange={(e) => setQuickDuration(e.target.value)}>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days</option>
                <option value="14">2 Weeks</option>
              </select>
            </div>
            <div className="quick-search-divider"></div>
            <div className="quick-search-field">
              <label>Style</label>
              <select value={quickStyle} onChange={(e) => setQuickStyle(e.target.value)}>
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-search-go">
              Plan Trip
            </button>
          </form>
        </div>
      </section>

      {/* Quick Stats Overview & Lower Content Wrapper */}
      <div className="page-content-padding flex flex-col gap-8">
        <section className="stats-overview-grid">
        <div className="stat-card">
          <div className="stat-card-icon">✈️</div>
          <div className="stat-card-data">
            <div className="stat-card-value">{totalTripsCount}</div>
            <div className="stat-card-label">Total Trips</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🌍</div>
          <div className="stat-card-data">
            <div className="stat-card-value">{uniqueLocations > 0 ? uniqueLocations : 5}</div>
            <div className="stat-card-label">Destinations Visited</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💾</div>
          <div className="stat-card-data">
            <div className="stat-card-value">24</div>
            <div className="stat-card-label">Saved Wishlist</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💰</div>
          <div className="stat-card-data">
            <div className="stat-card-value">${totalBudgetTracked.toLocaleString()}</div>
            <div className="stat-card-label">Budget Tracked</div>
          </div>
        </div>
      </section>

      {/* Search & Filters Controls */}
      <section className="controls-section">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search destinations, trips, activities..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
        
        <div className="filter-actions">
          {/* Group By Dropdown */}
          <div className="dropdown-container">
            <button 
              className={`control-btn dropdown-btn ${groupBy !== 'none' ? 'active-filter' : ''}`}
              onClick={() => { setShowGroupMenu(!showGroupMenu); setShowFilterMenu(false); setShowSortMenu(false); }}
            >
              Group by {groupBy !== 'none' ? `: ${groupBy}` : ''} <FiChevronDown />
            </button>
            {showGroupMenu && (
              <div className="dropdown-popover animation-fade-in">
                <button className={groupBy === 'none' ? 'selected' : ''} onClick={() => { setGroupBy('none'); setShowGroupMenu(false); }}>None</button>
                <button className={groupBy === 'status' ? 'selected' : ''} onClick={() => { setGroupBy('status'); setShowGroupMenu(false); }}>By Status</button>
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="dropdown-container">
            <button 
              className={`control-btn filter-btn ${filterStatus !== 'all' ? 'active-filter' : ''}`}
              onClick={() => { setShowFilterMenu(!showFilterMenu); setShowGroupMenu(false); setShowSortMenu(false); }}
            >
              Filter {filterStatus !== 'all' ? `(${filterStatus})` : ''} <FiFilter />
            </button>
            {showFilterMenu && (
              <div className="dropdown-popover animation-fade-in">
                {['all', 'upcoming', 'ongoing', 'completed', 'draft'].map(status => (
                  <button 
                    key={status} 
                    className={filterStatus === status ? 'selected' : ''}
                    onClick={() => { setFilterStatus(status); setShowFilterMenu(false); }}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="dropdown-container">
            <button 
              className={`control-btn dropdown-btn ${sortBy !== 'default' ? 'active-filter' : ''}`}
              onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); setShowGroupMenu(false); }}
            >
              Sort by... <FiChevronDown />
            </button>
            {showSortMenu && (
              <div className="dropdown-popover animation-fade-in">
                <button className={sortBy === 'default' ? 'selected' : ''} onClick={() => { setSortBy('default'); setShowSortMenu(false); }}>Default</button>
                <button className={sortBy === 'name_asc' ? 'selected' : ''} onClick={() => { setSortBy('name_asc'); setShowSortMenu(false); }}>Name (A to Z)</button>
                <button className={sortBy === 'name_desc' ? 'selected' : ''} onClick={() => { setSortBy('name_desc'); setShowSortMenu(false); }}>Name (Z to A)</button>
                <button className={sortBy === 'date_desc' ? 'selected' : ''} onClick={() => { setSortBy('date_desc'); setShowSortMenu(false); }}>Date (Newest)</button>
                <button className={sortBy === 'date_asc' ? 'selected' : ''} onClick={() => { setSortBy('date_asc'); setShowSortMenu(false); }}>Date (Oldest)</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <h2 className="section-title">Top Regional Selections</h2>
          <span className="section-hint">Click any region to start planning a trip!</span>
        </div>
        
        {filteredRegions.length === 0 ? (
          <div className="empty-search-box">No regions match "{searchQuery}"</div>
        ) : (
          <div className="region-grid">
            {filteredRegions.map((region, idx) => (
              <div 
                key={idx} 
                className="region-card"
                onClick={() => handleSelectRegion(region)}
                title={`Plan a trip to ${region.name}`}
              >
                <img src={region.image} alt={region.name} className="region-img" />
                <div className="region-name-overlay">
                  <div className="region-name-text">{region.name}</div>
                  <button className="btn btn-sm btn-primary plan-region-btn">
                    Plan Trip <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Your Trips Section */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <h2 className="section-title">Your Travel Plans</h2>
          <button className="btn btn-sm btn-ghost" onClick={() => navigate('/my-trips')}>
            View All ({trips.length})
          </button>
        </div>

        {processedTrips.length === 0 ? (
          <div className="empty-search-box">
            <p>No trips found matching your criteria.</p>
            {searchQuery || filterStatus !== 'all' ? (
              <button className="btn btn-sm btn-secondary mt-2" onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}>Reset Filters</button>
            ) : (
              <button className="btn btn-sm btn-primary mt-2" onClick={() => navigate('/trips/new')}><FiPlus /> Create First Trip</button>
            )}
          </div>
        ) : (
          <div className="trips-grid">
            {processedTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="trip-card"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <img 
                  src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'} 
                  alt={trip.name} 
                  className="trip-img" 
                />
                <div className="trip-info-overlay">
                  <span className={`status-tag badge status-${trip.status || 'draft'}`}>
                    {(trip.status || 'draft').toUpperCase()}
                  </span>
                  <h3>{trip.name}</h3>
                  <p>📍 {trip.starting_location || 'Destination TBD'}</p>
                  {trip.start_date && <p>🗓️ {trip.start_date}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Live Destination Weather Assistant */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <h2 className="section-title">Live Destination Weather</h2>
          <span className="section-hint">Updated 5m ago</span>
        </div>
        <div className="weather-grid-luxury">
          <div className="weather-card-item">
            <div className="weather-card-header">
              <span className="weather-city">Kyoto, Japan</span>
              <span className="weather-emoji">☀️</span>
            </div>
            <div className="weather-temp">24°C</div>
            <span className="weather-badge badge-emerald">Sunny • Perfect Day</span>
          </div>

          <div className="weather-card-item">
            <div className="weather-card-header">
              <span className="weather-city">Paris, France</span>
              <span className="weather-emoji">🌤️</span>
            </div>
            <div className="weather-temp">18°C</div>
            <span className="weather-badge badge-blue">Partly Cloudy • Mild</span>
          </div>

          <div className="weather-card-item">
            <div className="weather-card-header">
              <span className="weather-city">Goa, India</span>
              <span className="weather-emoji">🌅</span>
            </div>
            <div className="weather-temp">29°C</div>
            <span className="weather-badge badge-amber">Tropical Breeze</span>
          </div>
        </div>
      </section>

      {/* Travel Essentials Checklist */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <h2 className="section-title">Travel Essentials Checklist</h2>
          <span className="section-hint">Smart Trip Packing</span>
        </div>
        <div className="checklist-grid-luxury">
          {[
            { id: 1, text: 'Passport & Visas Verified', done: true },
            { id: 2, text: 'Flight Tickets & Hotel E-Pass', done: true },
            { id: 3, text: 'International Travel Insurance', done: false },
            { id: 4, text: 'Universal Power Adapter & Powerbank', done: false },
          ].map((item) => (
            <label key={item.id} className="checklist-card-item">
              <input type="checkbox" defaultChecked={item.done} className="checklist-checkbox" />
              <span className="checklist-text">{item.text}</span>
            </label>
          ))}
        </div>
      </section>
    </div>



      <style>{`
        .landing-page {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-bottom: var(--space-20);
          position: relative;
        }

        .section-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
          border-bottom: 2px solid var(--neutral-200);
          padding-bottom: var(--space-2);
        }

        .section-header-flex .section-title {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-hint {
          font-size: var(--text-xs);
          color: var(--neutral-500);
          font-weight: var(--weight-medium);
        }

        /* Banner */
        .banner-section {
          position: relative;
          width: 100%;
          min-height: 400px;
          border-radius: 0 0 24px 24px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          margin-bottom: var(--space-6);
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
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--space-8);
          color: white;
        }

        .banner-title {
          color: white;
          font-size: var(--text-4xl);
          margin-bottom: var(--space-1);
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .banner-subtitle {
          font-size: var(--text-lg);
          opacity: 0.9;
        }

        /* Quick Search Card */
        .quick-search-card {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: var(--radius-xl);
          padding: var(--space-3) var(--space-4);
          gap: var(--space-4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          max-width: 780px;
          margin-top: var(--space-4);
        }

        .quick-search-field {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .quick-search-field label {
          font-size: 11px;
          font-weight: var(--weight-bold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--neutral-500);
          margin-bottom: 2px;
        }

        .quick-search-field input,
        .quick-search-field select {
          border: none;
          outline: none;
          background: transparent;
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          color: var(--neutral-900);
          padding: 0;
        }

        .quick-search-divider {
          width: 1px;
          height: 32px;
          background: var(--neutral-200);
        }

        .btn-search-go {
          border-radius: var(--radius-lg);
          padding: var(--space-3) var(--space-6);
        }

        /* Stats Overview Grid */
        .stats-overview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: var(--neutral-0);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-5);
          box-shadow: var(--shadow-sm);
          transition: transform 250ms ease, box-shadow 250ms ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .stat-card-icon {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--neutral-100);
          border-radius: var(--radius-md);
        }

        .stat-card-value {
          font-family: var(--font-display);
          font-size: var(--text-2xl);
          font-weight: var(--weight-bold);
          color: var(--neutral-900);
          line-height: 1.1;
        }

        .stat-card-label {
          font-size: var(--text-xs);
          color: var(--neutral-500);
          font-weight: var(--weight-medium);
          margin-top: 2px;
        }

        /* Weather & Checklist Luxury Grids */
        .weather-grid-luxury {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }

        .weather-card-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .weather-card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .weather-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .weather-city {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .weather-emoji {
          font-size: 1.5rem;
        }

        .weather-temp {
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .weather-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          width: fit-content;
        }

        .badge-emerald { background: #ecfdf5; color: #059669; }
        .badge-blue { background: #eff6ff; color: #2563eb; }
        .badge-amber { background: #fffbeb; color: #d97706; }

        .checklist-grid-luxury {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .checklist-card-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: background 200ms ease, border-color 200ms ease;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        }

        .checklist-card-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .checklist-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .checklist-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        @media (max-width: 768px) {
          .weather-grid-luxury,
          .checklist-grid-luxury {
            grid-template-columns: 1fr;
          }
        }

        /* Controls Toolbar Card */
        .controls-section {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 16px 24px;
          box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.05);
          margin-bottom: var(--space-6);
        }

        .search-wrapper {
          flex: 1;
          min-width: 280px;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 10px 16px;
          transition: all 200ms ease;
          position: relative;
        }

        .search-wrapper:focus-within {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
          background: #ffffff;
        }

        .search-icon {
          color: #64748b;
          margin-right: 10px;
          font-size: 1.1rem;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
        }

        .clear-search-btn {
          background: #e2e8f0;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          color: #475569;
        }
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: var(--neutral-500);
        }

        .filter-actions {
          display: flex;
          gap: var(--space-3);
        }

        .dropdown-container {
          position: relative;
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
          cursor: pointer;
        }

        .control-btn:hover {
          background: var(--neutral-50);
          border-color: var(--neutral-400);
        }

        .control-btn.active-filter {
          background: rgba(32, 201, 151, 0.1);
          border-color: var(--primary-500);
          color: var(--primary-700);
        }

        .dropdown-popover {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: white;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--neutral-200);
          padding: 6px;
          display: flex;
          flex-direction: column;
          z-index: 150;
          min-width: 160px;
        }

        .dropdown-popover button {
          border: none;
          background: transparent;
          padding: 8px 12px;
          text-align: left;
          font-size: var(--text-xs);
          font-weight: var(--weight-medium);
          color: var(--neutral-700);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 150ms;
        }

        .dropdown-popover button:hover {
          background: var(--neutral-100);
        }

        .dropdown-popover button.selected {
          background: var(--primary-50);
          color: var(--primary-700);
          font-weight: var(--weight-bold);
        }

        .empty-search-box {
          padding: var(--space-8);
          background: var(--neutral-50);
          border-radius: var(--radius-lg);
          text-align: center;
          color: var(--neutral-500);
          font-size: var(--text-sm);
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
          transform: scale(1.08);
        }

        .region-name-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          padding: var(--space-3);
          gap: 8px;
        }

        .region-name-text {
          font-weight: var(--weight-bold);
          font-size: var(--text-lg);
          text-shadow: 0 1px 3px rgba(0,0,0,0.6);
        }

        .plan-region-btn {
          opacity: 0;
          transform: translateY(10px);
          transition: all 200ms ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          padding: 4px 10px;
        }

        .region-card:hover .plan-region-btn {
          opacity: 1;
          transform: translateY(0);
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
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
          color: white;
        }

        .status-tag {
          font-size: 9px;
          margin-bottom: 6px;
          display: inline-block;
        }

        .trip-info-overlay h3 {
          color: white;
          font-size: var(--text-lg);
          margin-bottom: var(--space-1);
        }

        .trip-info-overlay p {
          font-size: var(--text-xs);
          opacity: 0.85;
          margin-bottom: 2px;
        }

        /* FAB */
        .fab-plan-trip {
          position: fixed;
          bottom: calc(var(--bottom-nav-height) + var(--space-6));
          right: var(--space-6);
          background: var(--primary-600);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          padding: var(--space-3) var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--weight-bold);
          box-shadow: 0 4px 12px rgba(32, 201, 151, 0.4);
          z-index: 100;
          cursor: pointer;
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
          .stats-overview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .banner-section {
            min-height: 240px;
          }
          .quick-search-card {
            flex-direction: column;
            align-items: stretch;
          }
          .quick-search-divider {
            display: none;
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


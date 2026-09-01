import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiArrowRight, FiMapPin, FiCalendar, FiClock, FiCompass, FiZap, FiCheckCircle, FiShare2, FiTrendingUp, FiActivity, FiLayers, FiShield, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { tripsAPI } from '../../services/api';
import { defaultRegions, sampleTrips } from '../../data/sampleTrips';
import { Skeleton } from '../../components/common/Skeleton';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick Trip Studio Form State
  const [quickDest, setQuickDest] = useState('');
  const [quickDuration, setQuickDuration] = useState('5');
  const [quickStyle, setQuickStyle] = useState('cultural');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Trips State
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Departure checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Passport validity & e-Visa clearance', done: true, tag: 'Docs' },
    { id: 2, text: 'Airline & High-speed train e-tickets', done: true, tag: 'Transit' },
    { id: 3, text: 'International travel & medical insurance', done: false, tag: 'Safety' },
    { id: 4, text: 'eSIM activation & global data package', done: false, tag: 'Telecom' },
  ]);

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const fetchDashboardTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await tripsAPI.getAll();
      const loadedTrips = Array.isArray(res.data) && res.data.length > 0 ? res.data : sampleTrips;
      setTrips(loadedTrips);
    } catch {
      setTrips(sampleTrips);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardTrips();
  }, [fetchDashboardTrips]);

  const handleQuickPlan = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      destination: quickDest,
      duration: quickDuration,
      style: quickStyle,
    }).toString();
    navigate(`/trips/new?${query}`);
  };

  const handleSelectRegion = (region) => {
    navigate(`/trips/new?region=${encodeURIComponent(region.name)}&image=${encodeURIComponent(region.image)}`, {
      state: { region: region.name, image: region.image }
    });
  };

  // Processed Trips
  const processedTrips = trips.filter(trip => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (trip.name && trip.name.toLowerCase().includes(q)) ||
      (trip.starting_location && trip.starting_location.toLowerCase().includes(q));
    
    const tripStatus = (trip.status || 'draft').toLowerCase();
    const matchesFilter = filterStatus === 'all' || tripStatus === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Spotlight active trip
  const spotlightTrip = trips.find(t => (t.status || '').toLowerCase() === 'ongoing') || trips[0] || sampleTrips[0];

  // KPI Calculations
  const totalTripsCount = trips.length;
  const activeTripsCount = trips.filter(t => (t.status || '').toLowerCase() === 'ongoing').length;
  const totalBudgetTracked = trips.reduce((sum, t) => sum + (Number(t.budget) || 0), 0);
  const checklistDoneCount = checklist.filter(c => c.done).length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="travel-command-center page-container">
      
      {/* Top Command Bar */}
      <div className="command-header-panel">
        <div className="command-title-wrap">
          <div className="command-status-badge">
            <span className="radar-pulse"></span>
            <span>SYSTEM ACTIVE • {todayFormatted}</span>
          </div>
          <h1 className="command-heading">
            Welcome, {user?.first_name || 'Commander'}
          </h1>
          <p className="command-subheading">
            Travel Operating System • Ready to dispatch itineraries, track budgets, and manage live destinations.
          </p>
        </div>

        <div className="command-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/explore')}>
            <FiGlobe /> Global Explorer
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/trips/new')}>
            <FiPlus /> New Expedition
          </button>
        </div>
      </div>

      {/* Featured Active Expedition Spotlight Boarding Pass */}
      {spotlightTrip && (
        <div className="spotlight-expedition-card mt-6">
          <div className="spotlight-bg-wrap">
            <img 
              src={spotlightTrip.cover_image || '/images/trip_paris_1787378563287.jpg'} 
              alt={spotlightTrip.name} 
              className="spotlight-bg-image" 
            />
            <div className="spotlight-gradient-overlay"></div>
          </div>

          <div className="spotlight-content-grid">
            <div className="spotlight-left-dossier">
              <div className="spotlight-tag-row">
                <span className="badge badge-primary">ACTIVE EXPEDITION</span>
                <span className="spotlight-countdown-chip">⏱️ Ongoing Schedule</span>
              </div>
              <h2 className="spotlight-trip-title">{spotlightTrip.name}</h2>
              <div className="spotlight-route-row">
                <div className="route-node">
                  <span className="node-code">ORIGIN</span>
                  <span className="node-city">{spotlightTrip.starting_location || 'Global Base'}</span>
                </div>
                <div className="route-flight-line">
                  <span className="flight-plane-icon">✈</span>
                  <span className="flight-duration-tag">{spotlightTrip.duration_days ? `${spotlightTrip.duration_days} Days` : '7 Days'}</span>
                </div>
                <div className="route-node">
                  <span className="node-code">DEST</span>
                  <span className="node-city">{spotlightTrip.starting_location || 'Destination'}</span>
                </div>
              </div>

              <div className="spotlight-meta-tags mt-4">
                <span className="meta-tag"><FiCalendar size={12} /> {spotlightTrip.start_date || 'Oct 10, 2026'} – {spotlightTrip.end_date || 'Oct 20, 2026'}</span>
                <span className="meta-tag"><FiMapPin size={12} /> 6 Scheduled Stops</span>
                <span className="meta-tag"><FiZap size={12} /> 24°C Sunny Forecast</span>
              </div>
            </div>

            <div className="spotlight-right-telemetry">
              <div className="telemetry-box">
                <div className="telemetry-header">
                  <span className="telemetry-label">BUDGET ALLOCATION</span>
                  <span className="telemetry-val-highlight">${Number(spotlightTrip.budget || 2500).toLocaleString()}</span>
                </div>
                <div className="telemetry-progress-track">
                  <div className="telemetry-progress-fill" style={{ width: '68%' }}></div>
                </div>
                <div className="telemetry-sub-row">
                  <span>Tracked Spend: $1,700</span>
                  <span className="text-success">68% Utilized</span>
                </div>
              </div>

              <div className="spotlight-action-row mt-4">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/trips/${spotlightTrip.id}`)}
                >
                  Dossier Analytics
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/trips/${spotlightTrip.id}/itinerary`)}
                >
                  Open Builder <FiArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Metrics Summary Grid */}
      <div className="command-kpi-grid mt-6">
        <div className="command-kpi-card">
          <div className="kpi-top">
            <span className="kpi-metric-title">TOTAL EXPEDITIONS</span>
            <span className="kpi-icon-badge blue"><FiActivity size={14} /></span>
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-metric-num">{totalTripsCount}</span>
            <span className="kpi-status-chip emerald">{activeTripsCount} Live</span>
          </div>
          <span className="kpi-caption">Managed travel workflows</span>
        </div>

        <div className="command-kpi-card">
          <div className="kpi-top">
            <span className="kpi-metric-title">GLOBAL DESTINATIONS</span>
            <span className="kpi-icon-badge emerald"><FiGlobe size={14} /></span>
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-metric-num">40</span>
            <span className="kpi-status-chip blue">Worldwide</span>
          </div>
          <span className="kpi-caption">Verified cities & attractions</span>
        </div>

        <div className="command-kpi-card">
          <div className="kpi-top">
            <span className="kpi-metric-title">BUDGET ENVELOPE</span>
            <span className="kpi-icon-badge amber"><FiTrendingUp size={14} /></span>
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-metric-num">${totalBudgetTracked.toLocaleString()}</span>
            <span className="kpi-status-chip amber">USD</span>
          </div>
          <span className="kpi-caption">96% On-budget track record</span>
        </div>

        <div className="command-kpi-card">
          <div className="kpi-top">
            <span className="kpi-metric-title">CHECKLIST READINESS</span>
            <span className="kpi-icon-badge purple"><FiShield size={14} /></span>
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-metric-num">{checklistDoneCount}/{checklist.length}</span>
            <span className="kpi-status-chip purple">{Math.round((checklistDoneCount/checklist.length)*100)}%</span>
          </div>
          <span className="kpi-caption">Departure clearance tasks</span>
        </div>
      </div>

      {/* Main 2-Column Command Workspace Grid */}
      <div className="command-workspace-grid mt-8">
        
        {/* Left Column (65%): Itinerary Queue */}
        <div className="command-queue-column">
          
          <div className="queue-header-bar">
            <div>
              <h2 className="queue-heading">Expedition Queue</h2>
              <span className="queue-caption">Scheduled itineraries and travel bookings</span>
            </div>

            {/* Filter Pills */}
            <div className="tab-group">
              {['all', 'ongoing', 'up-coming', 'completed'].map((status) => (
                <button
                  key={status}
                  className={`tab-item ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'All Plans' : status.replace('-', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside column */}
          <div className="queue-search-wrap mt-4 mb-4">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search expeditions by destination or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="queue-search-field"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          {/* Dossier Cards Feed */}
          {loading ? (
            <div className="command-dossier-list">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-5">
                  <Skeleton variant="title" width="50%" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="rect" height={90} className="mt-3" />
                </div>
              ))}
            </div>
          ) : processedTrips.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">✈️</span>
              <h3 className="empty-state-title">No matching expeditions</h3>
              <p className="empty-state-text">Adjust your filters or initiate a new travel itinerary.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/trips/new')}>
                <FiPlus /> New Expedition
              </button>
            </div>
          ) : (
            <div className="command-dossier-list">
              {processedTrips.slice(0, 4).map((trip, idx) => (
                <div 
                  key={trip.id} 
                  className="dossier-card"
                  onClick={() => navigate(`/trips/${trip.id}`)}
                >
                  <div className="dossier-thumbnail-wrap">
                    <img
                      src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'}
                      alt={trip.name}
                      className="dossier-thumbnail"
                    />
                    <span className="dossier-index-badge">EXP-0{idx + 1}</span>
                    <span className={`status-badge status-${(trip.status || 'draft').toLowerCase().replace(/[^a-z]/g, '')}`}>
                      {(trip.status || 'DRAFT').toUpperCase()}
                    </span>
                  </div>

                  <div className="dossier-details">
                    <div className="dossier-headline">
                      <div>
                        <h3 className="dossier-title">{trip.name}</h3>
                        <span className="dossier-destination"><FiMapPin size={12} /> {trip.starting_location || 'Global Target'}</span>
                      </div>
                      <span className="dossier-cost">${Number(trip.budget || 0).toLocaleString()}</span>
                    </div>

                    <div className="dossier-meta-strip">
                      <span className="dossier-meta-item"><FiCalendar size={12} /> {trip.start_date || 'Schedule TBD'}</span>
                      <span className="dossier-meta-item"><FiClock size={12} /> {trip.duration_days ? `${trip.duration_days} Days` : 'Flexible'}</span>
                    </div>

                    <div className="dossier-footer">
                      <div className="dossier-progress-wrap">
                        <div className="dossier-progress-bar">
                          <div 
                            className="dossier-progress-fill" 
                            style={{ width: (trip.status || '').toLowerCase() === 'completed' ? '100%' : (trip.status || '').toLowerCase() === 'ongoing' ? '65%' : '20%' }}
                          ></div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip.id}/itinerary`);
                        }}
                      >
                        Itinerary Studio <FiArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column (35%): Trip Studio & Intelligence Widgets */}
        <div className="command-intelligence-column">
          
          {/* Smart Itinerary Generator Card */}
          <div className="card studio-widget-card">
            <div className="studio-card-header">
              <div className="flex items-center gap-2">
                <FiZap className="text-primary-400" />
                <h3 className="studio-heading">Instant Trip Studio</h3>
              </div>
              <span className="badge badge-primary">Auto-Build</span>
            </div>
            
            <form onSubmit={handleQuickPlan} className="studio-form">
              <div className="form-group">
                <label className="form-label">Destination City / Country</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kyoto, Japan or Zurich, Switzerland"
                  value={quickDest}
                  onChange={(e) => setQuickDest(e.target.value)}
                />
              </div>

              <div className="grid-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select 
                    className="form-select"
                    value={quickDuration}
                    onChange={(e) => setQuickDuration(e.target.value)}
                  >
                    <option value="3">3 Days (Weekend)</option>
                    <option value="5">5 Days (Express)</option>
                    <option value="7">7 Days (Full Week)</option>
                    <option value="10">10 Days (Deep Tour)</option>
                    <option value="14">14 Days (Grand Voyage)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Travel Style</label>
                  <select 
                    className="form-select"
                    value={quickStyle}
                    onChange={(e) => setQuickStyle(e.target.value)}
                  >
                    <option value="cultural">🏛️ Cultural & Art</option>
                    <option value="luxury">💎 Luxury & Relax</option>
                    <option value="adventure">⛰️ Alpine Adventure</option>
                    <option value="backpacking">🎒 Budget Explorer</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-sm mt-2">
                <FiPlus /> Dispatch Itinerary Builder
              </button>
            </form>
          </div>

          {/* Global Weather Radar Widget */}
          <div className="card weather-radar-card mt-6">
            <div className="studio-card-header">
              <h3 className="studio-heading">Live Destination Radar</h3>
              <span className="text-xs text-muted">Real-time</span>
            </div>
            
            <div className="radar-feed-list">
              <div className="radar-feed-row">
                <div className="radar-city-info">
                  <span className="radar-city-name">Kyoto, Japan</span>
                  <span className="radar-subtext">Local Time: 15:00 JST</span>
                </div>
                <div className="radar-temp-chip">
                  <span>☀️ 24°C</span>
                </div>
              </div>

              <div className="radar-feed-row">
                <div className="radar-city-info">
                  <span className="radar-city-name">Paris, France</span>
                  <span className="radar-subtext">Local Time: 08:00 CET</span>
                </div>
                <div className="radar-temp-chip">
                  <span>🌤️ 18°C</span>
                </div>
              </div>

              <div className="radar-feed-row">
                <div className="radar-city-info">
                  <span className="radar-city-name">Zermatt, Switzerland</span>
                  <span className="radar-subtext">Local Time: 08:00 CET</span>
                </div>
                <div className="radar-temp-chip">
                  <span>❄️ 4°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Departure Checklist */}
          <div className="card checklist-radar-card mt-6">
            <div className="studio-card-header">
              <h3 className="studio-heading">Departure Checklist</h3>
              <span className="badge badge-secondary">{checklistDoneCount}/{checklist.length} Complete</span>
            </div>

            <div className="checklist-radar-items">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  className={`checklist-radar-row ${item.done ? 'done' : ''}`}
                  onClick={() => toggleChecklist(item.id)}
                >
                  <span className={`checklist-radar-check ${item.done ? 'checked' : ''}`}>
                    {item.done && <FiCheckCircle size={13} />}
                  </span>
                  <div className="checklist-text-col">
                    <span className="checklist-radar-title">{item.text}</span>
                    <span className="checklist-tag-pill">{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Curated Global Expeditions */}
      <div className="command-regions-showcase mt-10">
        <div className="showcase-header-row mb-4">
          <div>
            <h2 className="showcase-title">Curated Global Expeditions</h2>
            <span className="showcase-caption">Pre-architected destination itineraries with routes and hotels</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/explore')}>
            Global Destination Catalog <FiArrowRight size={13} />
          </button>
        </div>

        <div className="grid-4">
          {defaultRegions.map((region, idx) => (
            <div 
              key={idx} 
              className="panoramic-dossier-card"
              onClick={() => handleSelectRegion(region)}
            >
              <img src={region.image} alt={region.name} className="dossier-panoramic-img" />
              <div className="dossier-panoramic-overlay">
                <span className="dossier-panoramic-tag">Featured Region</span>
                <h3 className="dossier-panoramic-title">{region.name}</h3>
                <p className="dossier-panoramic-desc">{region.description}</p>
                <div className="dossier-panoramic-footer">
                  <span className="dossier-panoramic-cta">Clone Itinerary <FiArrowRight size={12} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

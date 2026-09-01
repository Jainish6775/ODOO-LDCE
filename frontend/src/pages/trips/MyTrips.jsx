import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiSearch, FiGrid, FiList, FiArrowRight, FiSliders, FiActivity, FiShield, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import { sampleTrips } from '../../data/sampleTrips';
import { Skeleton } from '../../components/common/Skeleton';
import './Trips.css';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Ongoing, Up-coming, Completed
  const [sortBy, setSortBy] = useState('newest'); // newest, budget-desc, budget-asc, name
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const navigate = useNavigate();

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getAll();
      let dbTrips = Array.isArray(response.data) ? response.data : [];

      const existingIds = new Set(dbTrips.map(t => t.id));
      const mergedTrips = [...dbTrips];
      sampleTrips.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          mergedTrips.push(sample);
        }
      });

      setTrips(mergedTrips);
    } catch {
      setTrips(sampleTrips);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this expedition from queue?')) {
      try {
        await tripsAPI.delete(id);
        setTrips(trips.filter(t => t.id !== id));
        toast.success('Expedition archived successfully');
      } catch {
        setTrips(trips.filter(t => t.id !== id));
        toast.success('Expedition removed.');
      }
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const cleanStr = dateStr.split('T')[0];
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Filter & Sort
  const processedTrips = trips.filter(trip => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      trip.name?.toLowerCase().includes(query) || 
      trip.starting_location?.toLowerCase().includes(query);

    const statusNorm = (trip.status || 'Draft').toLowerCase().replace(/[^a-z]/g, '');
    const filterNorm = filterStatus.toLowerCase().replace(/[^a-z]/g, '');

    const matchesFilter = filterStatus === 'All' || statusNorm === filterNorm;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'budget-desc') return (b.budget || 0) - (a.budget || 0);
    if (sortBy === 'budget-asc') return (a.budget || 0) - (b.budget || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return (b.id || 0) - (a.id || 0);
  });

  const totalBudget = trips.reduce((sum, t) => sum + (Number(t.budget) || 0), 0);
  const activeTripsCount = trips.filter(t => (t.status || '').toLowerCase().includes('ongoing')).length;

  return (
    <div className="expedition-queue-page page-container">
      
      {/* Page Header Bar */}
      <div className="queue-page-header">
        <div>
          <h1 className="queue-page-title">Expedition Queue & Dossiers</h1>
          <p className="queue-page-subtitle">Centralized itinerary dispatch, financial budget governance, and schedule matrix.</p>
        </div>

        <div className="queue-header-actions">
          <Link to="/trips/new" className="btn btn-primary btn-sm">
            <FiPlus /> New Expedition
          </Link>
        </div>
      </div>

      {/* Summary Telemetry Bar */}
      <div className="queue-telemetry-bar mt-4">
        <div className="telemetry-pill">
          <span className="telemetry-pill-dot blue"></span>
          <span className="telemetry-pill-label">Active Expeditions:</span>
          <span className="telemetry-pill-val">{trips.length} Total</span>
        </div>
        <div className="telemetry-pill">
          <span className="telemetry-pill-dot emerald"></span>
          <span className="telemetry-pill-label">Ongoing Live:</span>
          <span className="telemetry-pill-val text-success">{activeTripsCount} Active</span>
        </div>
        <div className="telemetry-pill">
          <span className="telemetry-pill-dot amber"></span>
          <span className="telemetry-pill-label">Aggregate Capital:</span>
          <span className="telemetry-pill-val">${totalBudget.toLocaleString()} USD</span>
        </div>
      </div>

      {/* Controls Toolbar: Search, Segmented Status, Sort & View Mode */}
      <div className="queue-controls-toolbar mt-6">
        
        {/* Search Field */}
        <div className="queue-search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dossiers by title, destination, or flight code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Filter Segmented Tabs */}
        <div className="tab-group">
          {['All', 'Ongoing', 'Up-coming', 'Completed'].map((status) => (
            <button
              key={status}
              className={`tab-item ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'All Expeditions' : status.replace('-', '')}
            </button>
          ))}
        </div>

        {/* Right Tools: Sort Dropdown & View Mode */}
        <div className="queue-toolbar-right">
          <div className="sort-select-wrapper">
            <FiSliders size={13} className="sort-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Newest First</option>
              <option value="budget-desc">Budget: High to Low</option>
              <option value="budget-asc">Budget: Low to High</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Boarding Pass Cards"
            >
              <FiGrid size={14} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Matrix Table"
            >
              <FiList size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Content Rendering: Grid vs Table vs Empty State */}
      {loading ? (
        <div className="grid-3 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5">
              <Skeleton variant="rect" height={160} />
              <Skeleton variant="title" width="60%" className="mt-3" />
              <Skeleton variant="text" width="80%" />
            </div>
          ))}
        </div>
      ) : processedTrips.length === 0 ? (
        <div className="empty-state mt-8">
          <span className="empty-state-icon">🗺️</span>
          <h3 className="empty-state-title">No matching dossiers found</h3>
          <p className="empty-state-text">
            {searchQuery || filterStatus !== 'All' 
              ? 'No expeditions matched your filter criteria. Try resetting the filters.'
              : 'You haven’t initialized any travel dossiers yet. Launch your first expedition!'}
          </p>
          <Link to="/trips/new" className="btn btn-primary btn-sm">
            <FiPlus /> Initialize Expedition
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Cards View */
        <div className="grid-3 mt-6">
          {processedTrips.map((trip, idx) => (
            <div 
              key={trip.id} 
              className="boarding-pass-card"
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              <div className="boarding-pass-thumb-wrap">
                <img
                  src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'}
                  alt={trip.name}
                  className="boarding-pass-img"
                />
                <span className="boarding-code-tag">EXP-0{idx + 1}</span>
                <span className={`status-badge status-${(trip.status || 'draft').toLowerCase().replace(/[^a-z]/g, '')}`}>
                  {(trip.status || 'DRAFT').toUpperCase()}
                </span>
                <button
                  className="boarding-delete-btn"
                  onClick={(e) => handleDelete(trip.id, e)}
                  title="Archive Expedition"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>

              <div className="boarding-pass-body">
                <h3 className="boarding-pass-title">{trip.name}</h3>
                
                <div className="boarding-meta-list">
                  <div className="boarding-meta-row">
                    <FiMapPin size={13} /> <span>{trip.starting_location || 'Global Target'}</span>
                  </div>
                  <div className="boarding-meta-row">
                    <FiCalendar size={13} /> <span>{formatDateDisplay(trip.start_date)} – {formatDateDisplay(trip.end_date)}</span>
                  </div>
                  <div className="boarding-meta-row">
                    <FiClock size={13} /> <span>{trip.duration_days ? `${trip.duration_days} Days Scheduled` : 'Flexible Horizon'}</span>
                  </div>
                </div>

                <div className="boarding-pass-footer">
                  <div className="boarding-budget-box">
                    <span className="budget-box-label">BUDGET ENVELOPE</span>
                    <span className="budget-box-val">${Number(trip.budget || 0).toLocaleString()}</span>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trips/${trip.id}/itinerary`);
                    }}
                  >
                    Builder <FiArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* Table Data View */
        <div className="saas-table-container mt-6">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Expedition Dossier</th>
                <th>Target Destination</th>
                <th>Date Horizon</th>
                <th>Duration</th>
                <th>Budget Allocation</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedTrips.map((trip, idx) => (
                <tr key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'}
                        alt={trip.name}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div>
                        <span className="font-bold text-primary block text-sm">{trip.name}</span>
                        <span className="text-xs text-muted font-mono">EXP-0{idx + 1}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-secondary flex items-center gap-1 text-xs">
                      <FiMapPin size={12} /> {trip.starting_location || 'Global Base'}
                    </span>
                  </td>
                  <td>
                    <span className="text-secondary text-xs font-mono">
                      {formatDateDisplay(trip.start_date)}
                    </span>
                  </td>
                  <td>
                    <span className="text-secondary text-xs">
                      {trip.duration_days ? `${trip.duration_days} Days` : 'Flexible'}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-success font-mono">
                      ${Number(trip.budget || 0).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${(trip.status || 'draft').toLowerCase().replace(/[^a-z]/g, '')}`}>
                      {(trip.status || 'DRAFT').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
                      >
                        Studio
                      </button>
                      <button
                        className="btn-icon"
                        onClick={(e) => handleDelete(trip.id, e)}
                        title="Archive"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}

    </div>
  );
}

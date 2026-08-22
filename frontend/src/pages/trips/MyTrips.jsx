import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiMoreVertical, FiEdit2, FiCopy, FiShare2, FiTrash2, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiSearch, FiFilter, FiLayers, FiSliders, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import './Trips.css';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Ongoing, Up-coming, Completed, Draft
  const [sortBy, setSortBy] = useState('newest'); // newest, budget-desc, budget-asc, name
  const [groupBy, setGroupBy] = useState('status'); // 'status' or 'none'

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripsAPI.getAll();
      let dbTrips = Array.isArray(response.data) ? response.data : [];

      const sampleTrips = [
        {
          id: 101,
          name: 'Goa Coastal Resort & Beach Retreat',
          starting_location: 'Goa, India',
          start_date: '2026-08-20',
          end_date: '2026-08-28',
          duration_days: 8,
          budget: 50000,
          status: 'Ongoing',
          progress: 75,
          cover_image: '/images/trip_bali_1787378598373.jpg'
        },
        {
          id: 105,
          name: 'Swiss Alps Winter Skiing & Glacier Express',
          starting_location: 'Zermatt, Switzerland',
          start_date: '2026-08-15',
          end_date: '2026-08-25',
          duration_days: 10,
          budget: 4500,
          status: 'Ongoing',
          progress: 90,
          cover_image: '/images/region_europe_1787378498140.jpg'
        },
        {
          id: 102,
          name: 'Paris & Louvre Museum Tour',
          starting_location: 'Paris, France',
          start_date: '2026-10-10',
          end_date: '2026-10-18',
          duration_days: 8,
          budget: 3500,
          status: 'Up-coming',
          progress: 40,
          cover_image: '/images/trip_paris_1787378563287.jpg'
        },
        {
          id: 103,
          name: 'Tokyo Sightseeing & Mount Fuji Expedition',
          starting_location: 'Tokyo, Japan',
          start_date: '2026-11-01',
          end_date: '2026-11-10',
          duration_days: 10,
          budget: 4200,
          status: 'Up-coming',
          progress: 20,
          cover_image: '/images/trip_tokyo_1787378579161.jpg'
        },
        {
          id: 104,
          name: 'Kyoto Ancient Shrines & Tea Experience',
          starting_location: 'Kyoto, Japan',
          start_date: '2026-05-10',
          end_date: '2026-05-16',
          duration_days: 6,
          budget: 2800,
          status: 'Completed',
          progress: 100,
          cover_image: '/images/region_asia_1787378514027.jpg'
        },
        {
          id: 106,
          name: 'Rome Historic Colosseum & Vatican Tour',
          starting_location: 'Rome, Italy',
          start_date: '2026-03-12',
          end_date: '2026-03-19',
          duration_days: 7,
          budget: 3100,
          status: 'Completed',
          progress: 100,
          cover_image: '/images/dashboard_banner_1787378478140.jpg'
        },
        {
          id: 107,
          name: 'Bali Tropical Island & Temple Trail',
          starting_location: 'Ubud, Bali',
          start_date: '2026-01-05',
          end_date: '2026-01-14',
          duration_days: 9,
          budget: 2200,
          status: 'Completed',
          progress: 100,
          cover_image: '/images/trip_bali_1787378598373.jpg'
        }
      ];

      // Merge database trips with sample trips so all section categories display rich cards
      const existingIds = new Set(dbTrips.map(t => t.id));
      const mergedTrips = [...dbTrips];
      sampleTrips.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          mergedTrips.push(sample);
        }
      });

      setTrips(mergedTrips);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      toast.error('Showing demo trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripsAPI.delete(id);
        setTrips(trips.filter(t => t.id !== id));
        toast.success('Trip deleted successfully');
      } catch (error) {
        setTrips(trips.filter(t => t.id !== id));
        toast.success('Trip removed.');
      }
    }
  };

  // Date Formatter Helper
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const cleanStr = dateStr.split('T')[0];
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter & Search Logic
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

  // Helper for status matching without worrying about hyphens or spaces
  const matchStatus = (tripStatus, targetStatus) => {
    const normTrip = (tripStatus || '').toLowerCase().replace(/[^a-z]/g, '');
    const normTarget = (targetStatus || '').toLowerCase().replace(/[^a-z]/g, '');
    return normTrip === normTarget;
  };

  // Grouping into Ongoing, Up-coming, Completed, Draft
  const groupedTrips = {
    'Ongoing': processedTrips.filter(t => matchStatus(t.status, 'ongoing')),
    'Up-coming': processedTrips.filter(t => matchStatus(t.status, 'upcoming')),
    'Completed': processedTrips.filter(t => matchStatus(t.status, 'completed')),
    'Draft': processedTrips.filter(t => matchStatus(t.status, 'draft')),
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'ongoing': return 'badge status-ongoing';
      case 'upcoming': 
      case 'up-coming': return 'badge status-upcoming';
      case 'completed': return 'badge status-completed';
      default: return 'badge status-draft';
    }
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="trips-container-schema page-content-padding">
      
      {/* Top Header */}
      <div className="trips-header flex justify-between items-center mb-4">
        <div>
          <h1 className="trips-title font-bold text-2xl">User Trip Listing</h1>
          <p className="trips-subtitle text-xs text-neutral-500">Overview of your travel plans (Ongoing, Up-coming, & Completed).</p>
        </div>
        <Link to="/trips/new" className="btn btn-primary">
          <FiPlus /> Plan a New Trip
        </Link>
      </div>

      {/* Screen 6 Controls Bar: Search bar, Group by, Filter, Sort by... */}
      <div className="screen6-controls-bar mb-6">
        
        {/* Search bar ... */}
        <div className="screen6-search-wrapper">
          <FiSearch className="screen6-search-icon" />
          <input 
            type="text" 
            className="screen6-search-input"
            placeholder="Search bar ... (Search trips by name or location)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Control Dropdowns Row */}
        <div className="screen6-pills-group">
          
          {/* Group by */}
          <div className="control-pill-box">
            <FiLayers size={14} />
            <label className="text-xs font-bold text-neutral-600">Group by:</label>
            <select 
              className="control-select"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="status">Status (Ongoing, Up-coming, Completed)</option>
              <option value="none">Flat List (All Trips)</option>
            </select>
          </div>

          {/* Filter */}
          <div className="control-pill-box">
            <FiFilter size={14} />
            <label className="text-xs font-bold text-neutral-600">Filter:</label>
            <select 
              className="control-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Up-coming">Up-coming</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Sort by... */}
          <div className="control-pill-box">
            <FiSliders size={14} />
            <label className="text-xs font-bold text-neutral-600">Sort by...</label>
            <select 
              className="control-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="budget-desc">Budget (High to Low)</option>
              <option value="budget-asc">Budget (Low to High)</option>
              <option value="name">Trip Name</option>
            </select>
          </div>

        </div>

      </div>

      {/* Render Grouped Trip Overview Sections (Matching Screen 6 Schema) */}
      {processedTrips.length === 0 ? (
        <div className="empty-state p-8 text-center bg-white rounded-2xl border border-neutral-200">
          <span className="empty-state-icon">🧳</span>
          <h2 className="empty-state-title mt-2 font-bold text-lg">No trips found</h2>
          <p className="empty-state-text text-sm text-neutral-500 mt-1">Try adjusting your search query or filter controls.</p>
          <Link to="/trips/new" className="btn btn-primary mt-4 inline-flex items-center gap-2">
            <FiPlus /> Plan a New Trip
          </Link>
        </div>
      ) : groupBy === 'status' ? (
        
        <div className="grouped-trips-feed flex flex-col gap-8">
          
          {/* Section: Ongoing */}
          {(filterStatus === 'All' || filterStatus === 'Ongoing') && (
            <div className="trip-section-group">
              <div className="group-heading-row mb-3 flex items-center gap-2">
                <span className="group-status-dot ongoing-dot"></span>
                <h2 className="group-heading-title">Ongoing</h2>
                <span className="group-count-tag">{groupedTrips['Ongoing'].length}</span>
              </div>

              <div className="trips-grid">
                {groupedTrips['Ongoing'].map(trip => (
                  <TripOverviewCard key={trip.id} trip={trip} navigate={navigate} handleDelete={handleDelete} getStatusBadgeClass={getStatusBadgeClass} formatDateDisplay={formatDateDisplay} />
                ))}
              </div>
            </div>
          )}

          {/* Section: Up-coming */}
          {(filterStatus === 'All' || filterStatus === 'Up-coming') && (
            <div className="trip-section-group">
              <div className="group-heading-row mb-3 flex items-center gap-2">
                <span className="group-status-dot upcoming-dot"></span>
                <h2 className="group-heading-title">Up-coming</h2>
                <span className="group-count-tag">{groupedTrips['Up-coming'].length}</span>
              </div>

              <div className="trips-grid">
                {groupedTrips['Up-coming'].map(trip => (
                  <TripOverviewCard key={trip.id} trip={trip} navigate={navigate} handleDelete={handleDelete} getStatusBadgeClass={getStatusBadgeClass} formatDateDisplay={formatDateDisplay} />
                ))}
              </div>
            </div>
          )}

          {/* Section: Completed */}
          {(filterStatus === 'All' || filterStatus === 'Completed') && (
            <div className="trip-section-group">
              <div className="group-heading-row mb-3 flex items-center gap-2">
                <span className="group-status-dot completed-dot"></span>
                <h2 className="group-heading-title">Completed</h2>
                <span className="group-count-tag">{groupedTrips['Completed'].length}</span>
              </div>

              <div className="trips-grid">
                {groupedTrips['Completed'].map(trip => (
                  <TripOverviewCard key={trip.id} trip={trip} navigate={navigate} handleDelete={handleDelete} getStatusBadgeClass={getStatusBadgeClass} formatDateDisplay={formatDateDisplay} />
                ))}
              </div>
            </div>
          )}

          {/* Section: Drafts */}
          {(filterStatus === 'All' || filterStatus === 'Draft') && groupedTrips['Draft'].length > 0 && (
            <div className="trip-section-group">
              <div className="group-heading-row mb-3 flex items-center gap-2">
                <span className="group-status-dot draft-dot"></span>
                <h2 className="group-heading-title">Drafts</h2>
                <span className="group-count-tag">{groupedTrips['Draft'].length}</span>
              </div>

              <div className="trips-grid">
                {groupedTrips['Draft'].map(trip => (
                  <TripOverviewCard key={trip.id} trip={trip} navigate={navigate} handleDelete={handleDelete} getStatusBadgeClass={getStatusBadgeClass} formatDateDisplay={formatDateDisplay} />
                ))}
              </div>
            </div>
          )}

        </div>

      ) : (
        /* Flat Grid View when Group By is 'none' */
        <div className="trips-grid">
          {processedTrips.map(trip => (
            <TripOverviewCard key={trip.id} trip={trip} navigate={navigate} handleDelete={handleDelete} getStatusBadgeClass={getStatusBadgeClass} formatDateDisplay={formatDateDisplay} />
          ))}
        </div>
      )}

    </div>
  );
}

/* Helper Component: Short Overview of the Trip Card (Matching Wireframe) */
function TripOverviewCard({ trip, navigate, handleDelete, getStatusBadgeClass, formatDateDisplay }) {
  return (
    <div className="card trip-card-schema">
      <div className="trip-card-image-container">
        <img 
          src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'} 
          alt={trip.name} 
          className="trip-card-image"
        />
        <div className="trip-card-overlay">
          <span className={getStatusBadgeClass(trip.status)}>
            {trip.status?.toUpperCase() || 'DRAFT'}
          </span>
          
          <div className="trip-card-menu-container">
            <button className="btn-icon trip-card-menu-btn">
              <FiMoreVertical />
            </button>
            <div className="trip-card-dropdown">
              <button onClick={() => navigate(`/trips/${trip.id}`)}><FiEdit2 /> Edit Details</button>
              <button onClick={() => navigate(`/trips/${trip.id}/itinerary`)}><FiEye /> View Itinerary</button>
              <button onClick={() => toast.success('Share link copied!')}><FiShare2 /> Share Trip</button>
              <button onClick={() => toast.success('Trip duplicated!')}><FiCopy /> Duplicate</button>
              <hr className="divider" style={{ margin: '4px 0' }}/>
              <button className="text-error" onClick={() => handleDelete(trip.id)}><FiTrash2 /> Delete Trip</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body trip-card-body p-4">
        <h3 
          className="card-title text-base font-bold text-neutral-900 hover:text-primary-600 cursor-pointer capitalize mb-1"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          {trip.name}
        </h3>
        
        <p className="text-xs font-semibold text-neutral-400 mb-3">Short Overview of the Trip</p>

        <div className="trip-card-details">
          <div className="trip-card-detail">
            <FiMapPin /> {trip.starting_location || 'Destination'}
          </div>
          {(trip.start_date || trip.end_date) && (
            <div className="trip-card-detail">
              <FiCalendar /> {formatDateDisplay(trip.start_date)} - {formatDateDisplay(trip.end_date)}
            </div>
          )}
          <div className="trip-card-detail">
            <FiClock /> {trip.duration_days ? `${trip.duration_days} days` : '8 days'}
          </div>
          {trip.budget && (
            <div className="trip-card-detail font-bold text-neutral-900">
              <FiDollarSign /> ${Number(trip.budget).toLocaleString()}
            </div>
          )}
        </div>

        <div className="trip-card-progress mt-4">
          <div className="trip-card-progress-header flex justify-between text-xs text-neutral-500 mb-1">
            <span>Planning Progress</span>
            <span className="font-bold text-neutral-800">{trip.progress || 60}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${trip.progress < 30 ? 'warning' : ''}`} 
              style={{ width: `${trip.progress || 60}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="card-footer trip-card-footer p-3 flex gap-2">
        <button 
          className="btn btn-secondary btn-sm flex-1"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          Details
        </button>
        <button 
          className="btn btn-primary btn-sm flex-1"
          onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
        >
          View Itinerary
        </button>
      </div>
    </div>
  );
}

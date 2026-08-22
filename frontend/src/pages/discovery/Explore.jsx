import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiHeart, FiClock, FiDollarSign, FiX, FiPlus, FiArrowRight, FiCompass, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { destinationsAPI, activitiesAPI, savedAPI } from '../../services/api';
import './Explore.css';

export default function Explore() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState('destinations'); // 'destinations' or 'activities'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected item modal state
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinationActivities, setDestinationActivities] = useState([]);
  const [loadingModalActivities, setLoadingModalActivities] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Load initial data
  useEffect(() => {
    fetchResults();
  }, [searchMode]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      if (searchMode === 'destinations') {
        const res = await destinationsAPI.search({ search: searchQuery });
        setDestinations(res.data);
      } else {
        const res = await activitiesAPI.search({ search: searchQuery });
        setActivities(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDestinationModal = async (dest) => {
    setSelectedDestination(dest);
    setDestinationActivities([]);
    setLoadingModalActivities(true);
    try {
      const res = await destinationsAPI.getActivities(dest.id);
      setDestinationActivities(res.data || []);
    } catch (err) {
      console.warn('Could not fetch activities for destination:', err);
    } finally {
      setLoadingModalActivities(false);
    }
  };

  const handleOpenActivityModal = (act) => {
    setSelectedActivity(act);
  };

  const toggleSaveDestination = async (e, dest) => {
    e.stopPropagation();
    try {
      await savedAPI.save(dest.id);
      toast.success(`${dest.name} saved to your wishlist!`);
    } catch (err) {
      toast.error('Could not save destination. It may already be saved.');
    }
  };

  const handlePlanTripToDestination = (destName, imageUrl) => {
    navigate(`/trips/new?destination=${encodeURIComponent(destName)}&image=${encodeURIComponent(imageUrl || '')}`);
  };

  const renderDestinations = () => {
    if (loading) return <div className="loading-state">Loading destinations...</div>;
    if (destinations.length === 0) {
      return (
        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
          <span className="empty-state-icon">🔍</span>
          <h3 className="empty-state-title">No destinations found</h3>
          <p className="empty-state-text">Try a different search term.</p>
        </div>
      );
    }

    return destinations.map(dest => (
      <div 
        key={dest.id} 
        className="card destination-card"
        onClick={() => handleOpenDestinationModal(dest)}
      >
        <div className="destination-image-wrapper">
          <img src={dest.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'} alt={dest.name} className="destination-image" />
          <button 
            className="btn-icon save-btn"
            onClick={(e) => toggleSaveDestination(e, dest)}
            title="Save to Wishlist"
          >
            <FiHeart />
          </button>
        </div>
        <div className="card-body">
          <div className="destination-meta">
            <span className="destination-location"><FiMapPin /> {dest.country}</span>
            <span className="destination-rating"><FiStar fill="currentColor" /> {dest.popularity_score} Pop</span>
          </div>
          <h3 className="card-title mt-2">{dest.name}</h3>
          <p className="card-text mt-1 line-clamp-2">{dest.description || 'A beautiful travel destination.'}</p>
          <div className="destination-footer mt-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span className="badge badge-primary">{dest.cost_level}</span>
            <span style={{fontSize: '0.8rem', color: 'var(--neutral-500)'}}>{dest.recommended_days} days recommended</span>
          </div>
        </div>
      </div>
    ));
  };

  const renderActivities = () => {
    if (loading) return <div className="loading-state">Loading activities...</div>;
    if (activities.length === 0) {
      return (
        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
          <span className="empty-state-icon">🎟️</span>
          <h3 className="empty-state-title">No activities found</h3>
          <p className="empty-state-text">Try a different search term.</p>
        </div>
      );
    }

    return activities.map(act => (
      <div 
        key={act.id} 
        className="card destination-card"
        onClick={() => handleOpenActivityModal(act)}
      >
        <div className="destination-image-wrapper">
          <img src={act.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'} alt={act.name} className="destination-image" />
        </div>
        <div className="card-body">
          <div className="destination-meta">
            <span className="badge badge-secondary">{act.category}</span>
            <span className="destination-rating"><FiStar fill="currentColor" /> {act.rating}</span>
          </div>
          <h3 className="card-title mt-2">{act.name}</h3>
          <p className="card-text mt-1 line-clamp-2">{act.description}</p>
          <div className="mt-4" style={{display: 'flex', gap: '1rem', color: 'var(--neutral-600)', fontSize: '0.9rem'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FiClock /> {act.duration_hours}h</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FiDollarSign /> {act.estimated_cost}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="explore-container">
      {/* Hero Search Section */}
      <div className="explore-hero">
        <h1 className="explore-hero-title">Where to next?</h1>
        <p className="explore-hero-subtitle">Discover amazing destinations and activities around the globe.</p>
        
        <div className="search-bar-container mt-6">
          <div className="input-group search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder={`Search ${searchMode}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-secondary filter-btn hide-mobile">
              <FiFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="explore-layout mt-8">
        <div className="explore-content" style={{ width: '100%' }}>
          
          <div className="tabs category-tabs mb-6">
            <button 
              className={`tab ${searchMode === 'destinations' ? 'active' : ''}`}
              onClick={() => { setSearchMode('destinations'); setSearchQuery(''); }}
            >
              Destinations
            </button>
            <button 
              className={`tab ${searchMode === 'activities' ? 'active' : ''}`}
              onClick={() => { setSearchMode('activities'); setSearchQuery(''); }}
            >
              Activities
            </button>
          </div>

          <div className="destinations-grid">
            {searchMode === 'destinations' ? renderDestinations() : renderActivities()}
          </div>
        </div>
      </div>

      {/* Destination Details Modal */}
      {selectedDestination && (
        <div className="modal-backdrop animation-fade-in" onClick={() => setSelectedDestination(null)}>
          <div className="modal-content modal-large animation-slide-up" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-hero-image" style={{ backgroundImage: `url(${selectedDestination.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'})` }}>
              <button className="btn-icon modal-close-btn" onClick={() => setSelectedDestination(null)}>
                <FiX size={20} />
              </button>
              <div className="modal-hero-overlay">
                <span className="badge badge-accent mb-2">{selectedDestination.region || selectedDestination.country}</span>
                <h2 className="modal-dest-title">{selectedDestination.name}</h2>
                <p className="modal-dest-subtitle"><FiMapPin /> {selectedDestination.country}</p>
              </div>
            </div>

            <div className="modal-body p-6">
              
              {/* Badges / Stats row */}
              <div className="modal-stats-row mb-6">
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Popularity</span>
                  <span className="modal-stat-val">⭐ {selectedDestination.popularity_score || 95} / 100</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Cost Level</span>
                  <span className="modal-stat-val text-capitalize">💵 {selectedDestination.cost_level || 'Moderate'}</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Rec. Duration</span>
                  <span className="modal-stat-val">🗓️ {selectedDestination.recommended_days || 4} Days</span>
                </div>
              </div>

              {/* Description */}
              <div className="modal-section mb-6">
                <h3 className="modal-section-title">About {selectedDestination.name}</h3>
                <p className="modal-description-text">
                  {selectedDestination.description || `${selectedDestination.name} is one of the most vibrant and captivating destinations in ${selectedDestination.country}. Known for its unique culture, scenic views, world-class gastronomy, and unforgettable experiences, it offers something special for every type of traveler.`}
                </p>
              </div>

              {/* Top Activities in this Destination */}
              <div className="modal-section mb-6">
                <h3 className="modal-section-title">Top Activities & Experiences</h3>
                {loadingModalActivities ? (
                  <div className="text-neutral-500 p-4 text-center">Loading activities for {selectedDestination.name}...</div>
                ) : destinationActivities.length === 0 ? (
                  <div className="text-neutral-500 p-4 bg-neutral-50 rounded-lg text-center">
                    Enjoy city sightseeing, local walking tours, iconic photo spots, and culinary discoveries in {selectedDestination.name}!
                  </div>
                ) : (
                  <div className="modal-activities-grid">
                    {destinationActivities.map(act => (
                      <div key={act.id} className="modal-activity-card">
                        <img src={act.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80'} alt={act.name} className="modal-act-img" />
                        <div className="modal-act-info">
                          <div className="modal-act-header">
                            <span className="font-bold text-sm">{act.name}</span>
                            <span className="badge badge-secondary text-xs">{act.category}</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">{act.description}</p>
                          <div className="modal-act-meta mt-2">
                            <span>⏱️ {act.duration_hours}h</span>
                            <span>💵 ${act.estimated_cost}</span>
                            <span>⭐ {act.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="modal-footer p-6 border-top">
              <button 
                className="btn btn-secondary"
                onClick={(e) => toggleSaveDestination(e, selectedDestination)}
              >
                <FiHeart /> Save to Wishlist
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handlePlanTripToDestination(selectedDestination.name, selectedDestination.image_url)}
              >
                Plan a Trip to {selectedDestination.name} <FiArrowRight />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="modal-backdrop animation-fade-in" onClick={() => setSelectedActivity(null)}>
          <div className="modal-content animation-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hero-image" style={{ backgroundImage: `url(${selectedActivity.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'})` }}>
              <button className="btn-icon modal-close-btn" onClick={() => setSelectedActivity(null)}>
                <FiX size={20} />
              </button>
              <div className="modal-hero-overlay">
                <span className="badge badge-secondary mb-2">{selectedActivity.category}</span>
                <h2 className="modal-dest-title">{selectedActivity.name}</h2>
              </div>
            </div>
            <div className="modal-body p-6">
              <div className="modal-stats-row mb-6">
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Rating</span>
                  <span className="modal-stat-val">⭐ {selectedActivity.rating} / 5</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Duration</span>
                  <span className="modal-stat-val">⏱️ {selectedActivity.duration_hours} Hours</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Est. Cost</span>
                  <span className="modal-stat-val">💵 ${selectedActivity.estimated_cost}</span>
                </div>
              </div>
              <p className="modal-description-text">{selectedActivity.description}</p>
            </div>
            <div className="modal-footer p-6 border-top">
              <button className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { setSelectedActivity(null); navigate('/trips/new'); }}>
                Plan Trip with this Activity <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Styles */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-4);
        }

        .modal-content {
          background: var(--neutral-0);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .modal-content.modal-large {
          max-width: 780px;
        }

        .modal-hero-image {
          position: relative;
          height: 260px;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--space-4);
        }

        .modal-close-btn {
          align-self: flex-end;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          transition: background 200ms;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.85);
        }

        .modal-hero-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
          margin: -var(--space-4);
          padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
          color: white;
        }

        .modal-dest-title {
          font-size: var(--text-3xl);
          color: white;
          font-weight: var(--weight-bold);
          margin-bottom: 2px;
        }

        .modal-dest-subtitle {
          font-size: var(--text-sm);
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .modal-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }

        .modal-stat-box {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: var(--space-3) var(--space-4);
          text-align: center;
        }

        .modal-stat-label {
          display: block;
          font-size: 11px;
          color: var(--neutral-500);
          text-transform: uppercase;
          font-weight: var(--weight-bold);
          margin-bottom: 2px;
        }

        .modal-stat-val {
          font-size: var(--text-sm);
          font-weight: var(--weight-bold);
          color: var(--neutral-900);
        }

        .text-capitalize {
          text-transform: capitalize;
        }

        .modal-section-title {
          font-size: var(--text-lg);
          font-weight: var(--weight-bold);
          margin-bottom: var(--space-3);
          border-bottom: 1px solid var(--neutral-200);
          padding-bottom: 6px;
        }

        .modal-description-text {
          font-size: var(--text-sm);
          color: var(--neutral-700);
          line-height: 1.6;
        }

        .modal-activities-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .modal-activity-card {
          display: flex;
          gap: var(--space-4);
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
        }

        .modal-act-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .modal-act-info {
          flex: 1;
        }

        .modal-act-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-act-meta {
          display: flex;
          gap: var(--space-4);
          font-size: 12px;
          color: var(--neutral-600);
          font-weight: var(--weight-medium);
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
        }

        .border-top {
          border-top: 1px solid var(--neutral-200);
        }

        @media (max-width: 640px) {
          .modal-stats-row {
            grid-template-columns: 1fr;
          }
          .modal-footer {
            flex-direction: column;
          }
          .modal-footer button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

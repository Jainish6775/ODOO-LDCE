import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiHeart, FiClock, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { destinationsAPI, activitiesAPI, savedAPI } from '../../services/api';
import './Explore.css';

export default function Explore() {
  const [searchMode, setSearchMode] = useState('destinations'); // 'destinations' or 'activities'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const toggleSaveDestination = async (e, dest) => {
    e.stopPropagation();
    try {
      // Optimistic UI update could go here
      await savedAPI.save(dest.id);
      toast.success(`${dest.name} saved to your wishlist!`);
    } catch (err) {
      toast.error('Could not save destination. It may already be saved.');
    }
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
      <div key={dest.id} className="card destination-card">
        <div className="destination-image-wrapper">
          <img src={dest.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'} alt={dest.name} className="destination-image" />
          <button 
            className="btn-icon save-btn"
            onClick={(e) => toggleSaveDestination(e, dest)}
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
      <div key={act.id} className="card destination-card">
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
    </div>
  );
}

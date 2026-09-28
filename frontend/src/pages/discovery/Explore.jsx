import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiHeart, FiClock, FiDollarSign, FiX, FiArrowRight, FiPlus, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { destinationsAPI, activitiesAPI, savedAPI } from '../../services/api';
import famousCitiesData from '../../data/famousCities';
import { Skeleton } from '../../components/common/Skeleton';
import './Explore.css';

export default function Explore() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState('destinations'); // 'destinations' or 'activities'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected item modal state
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinationActivities, setDestinationActivities] = useState([]);
  const [loadingModalActivities, setLoadingModalActivities] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      if (searchMode === 'destinations') {
        let fetchedData = [];
        try {
          const res = await destinationsAPI.search({ search: searchQuery });
          fetchedData = res.data || [];
        } catch {
          // fallback
        }

        const filterQuery = searchQuery.toLowerCase().trim();
        const mergedCities = [...(fetchedData.length > 0 ? fetchedData : famousCitiesData)];
        
        famousCitiesData.forEach(city => {
          if (!mergedCities.some(c => c.name.toLowerCase() === city.name.toLowerCase())) {
            mergedCities.push(city);
          }
        });

        let filtered = filterQuery 
          ? mergedCities.filter(c => c.name.toLowerCase().includes(filterQuery) || c.country.toLowerCase().includes(filterQuery))
          : mergedCities;

        if (selectedCategory !== 'all') {
          filtered = filtered.filter(c => (c.region || '').toLowerCase().includes(selectedCategory.toLowerCase()));
        }

        setDestinations(filtered);
      } else {
        let fetchedActs = [];
        try {
          const res = await activitiesAPI.search({ search: searchQuery });
          fetchedActs = res.data || [];
        } catch {
          // fallback
        }

        const allCityActivities = famousCitiesData.flatMap(city => 
          (city.activities || []).map(act => ({
            ...act,
            image_url: city.image_url,
            destination_name: city.name
          }))
        );

        const filterQuery = searchQuery.toLowerCase().trim();
        const mergedActs = [...fetchedActs, ...allCityActivities];
        const uniqueActs = Array.from(new Map(mergedActs.map(a => [a.name, a])).values());

        const filteredActs = filterQuery 
          ? uniqueActs.filter(a => a.name.toLowerCase().includes(filterQuery) || (a.category && a.category.toLowerCase().includes(filterQuery)))
          : uniqueActs;

        setActivities(filteredActs);
      }
    } catch {
      toast.error('Failed to load discovery results.');
    } finally {
      setLoading(false);
    }
  }, [searchMode, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleOpenDestinationModal = async (dest) => {
    setSelectedDestination(dest);
    setDestinationActivities(dest.activities || []);
    setLoadingModalActivities(true);
    try {
      const res = await destinationsAPI.getActivities(dest.id);
      if (res.data && res.data.length > 0) {
        setDestinationActivities(res.data);
      }
    } catch {
      // fallback
    } finally {
      setLoadingModalActivities(false);
    }
  };

  const toggleSaveDestination = async (e, dest) => {
    e.stopPropagation();
    try {
      await savedAPI.save(dest.id);
      toast.success(`${dest.name} vaulted to your wishlist!`);
    } catch {
      toast.error('Could not vault destination.');
    }
  };

  const handlePlanTripToDestination = (destName, imageUrl) => {
    navigate(`/trips/new?destination=${encodeURIComponent(destName)}&image=${encodeURIComponent(imageUrl || '')}`);
  };

  const categoryFilters = [
    { id: 'all', label: 'All Continents' },
    { id: 'asia', label: 'Asia & Pacific' },
    { id: 'europe', label: 'Europe & UK' },
    { id: 'america', label: 'Americas' },
    { id: 'africa', label: 'Middle East & Africa' },
  ];

  return (
    <div className="global-discovery-page page-container">
      
      {/* Page Header */}
      <div className="discovery-header-panel">
        <div>
          <h1 className="discovery-page-title">Global Destination Intelligence</h1>
          <p className="discovery-page-subtitle">Curated catalog of 40 iconic world cities, cultural landmarks, and activities.</p>
        </div>

        {/* Mode Switcher */}
        <div className="tab-group">
          <button 
            className={`tab-item ${searchMode === 'destinations' ? 'active' : ''}`}
            onClick={() => { setSearchMode('destinations'); setSearchQuery(''); }}
          >
            🌍 Destinations ({destinations.length || 40})
          </button>
          <button 
            className={`tab-item ${searchMode === 'activities' ? 'active' : ''}`}
            onClick={() => { setSearchMode('activities'); setSearchQuery(''); }}
          >
            🎒 Activities & Tours
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="discovery-toolbar mt-6">
        <div className="discovery-search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder={searchMode === 'destinations' ? "Search 40 world cities (e.g. Kyoto, Paris, Zurich, Tokyo)..." : "Search activities, tours, dining..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {searchMode === 'destinations' && (
          <div className="discovery-category-chips">
            {categoryFilters.map(c => (
              <button
                key={c.id}
                className={`category-filter-chip ${selectedCategory === c.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid Content */}
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
      ) : searchMode === 'destinations' ? (
        
        /* Destinations Grid */
        <div className="grid-3 mt-6">
          {destinations.map((dest) => (
            <div 
              key={dest.id} 
              className="city-dossier-card spotlight-card tilt-card"
              onClick={() => handleOpenDestinationModal(dest)}
            >
              <div className="city-thumb-wrap">
                <img
                  src={dest.image_url || '/images/trip_paris_1787378563287.jpg'}
                  alt={dest.name}
                  className="city-thumb-img"
                />
                <button
                  className="city-bookmark-btn"
                  onClick={(e) => toggleSaveDestination(e, dest)}
                  title="Vault Destination"
                >
                  <FiHeart size={14} />
                </button>
                <span className="city-region-badge">{dest.region || 'Global'}</span>
              </div>

              <div className="city-dossier-body">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="city-dossier-name">{dest.name}</h3>
                  <span className="city-popularity-badge">⭐ {dest.popularity_score} Pop</span>
                </div>

                <p className="city-country-tag">
                  <FiMapPin size={12} /> {dest.country}
                </p>

                <p className="city-description-text">{dest.description}</p>

                <div className="city-dossier-footer mt-auto pt-3">
                  <div className="city-intel-row text-xs text-muted">
                    <span>⏱️ {dest.recommended_days} Days</span>
                    <span>•</span>
                    <span className="badge badge-secondary text-xs">{dest.cost_level || 'Moderate'}</span>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanTripToDestination(dest.name, dest.image_url);
                    }}
                  >
                    <FiPlus /> Plan Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* Activities Grid */
        <div className="grid-3 mt-6">
          {activities.map((act) => (
            <div 
              key={act.id} 
              className="city-dossier-card"
              onClick={() => setSelectedActivity(act)}
            >
              <div className="city-thumb-wrap">
                <img
                  src={act.image_url || '/images/trip_tokyo_1787378579161.jpg'}
                  alt={act.name}
                  className="city-thumb-img"
                />
                <span className="city-region-badge">{act.category || 'Experience'}</span>
              </div>

              <div className="city-dossier-body">
                <h3 className="city-dossier-name">{act.name}</h3>
                <p className="city-country-tag">
                  <FiMapPin size={12} /> {act.destination_name || 'Global Destination'}
                </p>

                <div className="city-dossier-footer mt-auto pt-3">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span><FiClock size={12} /> {act.duration_hours || 2}h</span>
                    <span className="font-bold text-success"><FiDollarSign size={12} /> {act.estimated_cost === 0 ? 'Free' : `$${act.estimated_cost}`}</span>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/trips/new');
                    }}
                  >
                    Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      )}

      {/* Destination Details Modal Window */}
      {selectedDestination && (
        <div className="saas-modal-backdrop" onClick={() => setSelectedDestination(null)}>
          <div className="saas-modal-window modal-wide" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-hero-cover" style={{ backgroundImage: `url(${selectedDestination.image_url || '/images/trip_paris_1787378563287.jpg'})` }}>
              <button className="btn-icon modal-close-round" onClick={() => setSelectedDestination(null)}>
                <FiX size={16} />
              </button>
              <div className="modal-hero-content">
                <span className="badge badge-primary">{selectedDestination.region}</span>
                <h2 className="modal-title-bold">{selectedDestination.name}</h2>
                <span className="modal-sub-location"><FiMapPin /> {selectedDestination.country}</span>
              </div>
            </div>

            <div className="p-6">
              <div className="modal-kpi-row mb-4">
                <div className="modal-kpi-box">
                  <span className="kpi-box-label">Popularity</span>
                  <span className="kpi-box-val">⭐ {selectedDestination.popularity_score} / 100</span>
                </div>
                <div className="modal-kpi-box">
                  <span className="kpi-box-label">Cost Level</span>
                  <span className="kpi-box-val">{selectedDestination.cost_level}</span>
                </div>
                <div className="modal-kpi-box">
                  <span className="kpi-box-label">Recommended Stay</span>
                  <span className="kpi-box-val">🗓️ {selectedDestination.recommended_days} Days</span>
                </div>
              </div>

              <p className="text-xs text-secondary line-height-relaxed mb-6">
                {selectedDestination.description}
              </p>

              {/* Activities inside modal */}
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Top Experiences in {selectedDestination.name}</h4>
              <div className="modal-acts-stack">
                {loadingModalActivities ? (
                  <div className="text-center p-4"><div className="spinner"></div></div>
                ) : destinationActivities.slice(0, 3).map((act, i) => (
                  <div key={i} className="modal-act-row">
                    <div className="flex-1">
                      <span className="font-bold text-xs text-primary">{act.name}</span>
                      <span className="text-xs text-muted block">{act.category} • ⏱️ {act.duration_hours || 2}h</span>
                    </div>
                    <span className="font-bold text-xs text-success">${act.estimated_cost || 25}</span>
                  </div>
                ))}
              </div>

              <div className="modal-footer-row mt-6 pt-4 border-top">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => toggleSaveDestination(e, selectedDestination)}
                >
                  <FiHeart /> Vault Destination
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handlePlanTripToDestination(selectedDestination.name, selectedDestination.image_url)}
                >
                  Plan Expedition to {selectedDestination.name} <FiArrowRight />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="saas-modal-backdrop" onClick={() => setSelectedActivity(null)}>
          <div className="saas-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hero-cover" style={{ backgroundImage: `url(${selectedActivity.image_url || '/images/trip_tokyo_1787378579161.jpg'})`, height: 160 }}>
              <button className="btn-icon modal-close-round" onClick={() => setSelectedActivity(null)}>
                <FiX size={16} />
              </button>
              <div className="modal-hero-content">
                <h2 className="modal-title-bold">{selectedActivity.name}</h2>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-secondary mb-4">{selectedActivity.description || 'Curated travel activity.'}</p>
              <div className="flex justify-between items-center text-xs text-muted pt-3 border-top">
                <span>⏱️ {selectedActivity.duration_hours || 2}h Duration</span>
                <span className="font-bold text-success text-sm">${selectedActivity.estimated_cost || 0}</span>
              </div>
              <button 
                className="btn btn-primary btn-full btn-sm mt-4"
                onClick={() => { setSelectedActivity(null); navigate('/trips/new'); }}
              >
                Plan Expedition with this Activity <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

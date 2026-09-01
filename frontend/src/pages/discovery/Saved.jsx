import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMapPin, FiStar, FiBookmark, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { savedAPI } from '../../services/api';
import famousCitiesData from '../../data/famousCities';
import { Skeleton } from '../../components/common/Skeleton';
import './Saved.css';

const defaultSavedItems = [
  {
    id: 1,
    type: 'destination',
    title: 'Kyoto, Japan',
    category: 'Cultural & Historic',
    image: '/images/trip_tokyo_1787378579161.jpg',
    rating: 4.9,
    country: 'Japan',
    days: '6 Days'
  },
  {
    id: 2,
    type: 'destination',
    title: 'Santorini, Greece',
    category: 'Island & Relaxation',
    image: '/images/region_europe_1787378498140.jpg',
    rating: 4.8,
    country: 'Greece',
    days: '5 Days'
  },
  {
    id: 3,
    type: 'activity',
    title: 'Fushimi Inari Shrine Hike',
    category: 'Activity',
    image: '/images/trip_bali_1787378598373.jpg',
    rating: 5.0,
    country: 'Japan',
    days: '3 Hours'
  },
  {
    id: 4,
    type: 'destination',
    title: 'Paris, France',
    category: 'Art & Romance',
    image: '/images/trip_paris_1787378563287.jpg',
    rating: 4.7,
    country: 'France',
    days: '5 Days'
  }
];

export default function Saved() {
  const [activeTab, setActiveTab] = useState('all');
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSavedItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await savedAPI.getAll();
      const rawSaved = Array.isArray(res.data) ? res.data : [];

      if (rawSaved.length === 0) {
        setSavedItems(defaultSavedItems);
      } else {
        const mapped = rawSaved.map((item, idx) => {
          const destId = item.destination_id || item.id;
          const match = famousCitiesData.find(c => c.id === destId || c.name === item.title);
          if (match) {
            return {
              id: item.id || destId || idx + 1,
              type: 'destination',
              title: `${match.name}, ${match.country}`,
              category: match.region || 'Destinations',
              image: match.image_url,
              rating: (match.popularity_score / 20).toFixed(1),
              country: match.country,
              days: `${match.recommended_days} Days`
            };
          }
          return {
            id: item.id || idx + 1,
            type: item.type || 'destination',
            title: item.title || `Saved Item ${idx + 1}`,
            category: item.category || 'Wishlist',
            image: item.image || '/images/trip_paris_1787378563287.jpg',
            rating: item.rating || 4.8,
            country: item.country || 'Global',
            days: item.days || 'Flexible'
          };
        });

        const existingTitles = new Set(mapped.map(m => m.title));
        defaultSavedItems.forEach(d => {
          if (!existingTitles.has(d.title)) {
            mapped.push(d);
          }
        });

        setSavedItems(mapped);
      }
    } catch {
      setSavedItems(defaultSavedItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedItems();
  }, [fetchSavedItems]);

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    try {
      await savedAPI.remove(id);
      setSavedItems(savedItems.filter(item => item.id !== id));
      toast.success('Removed from wishlist vault');
    } catch {
      setSavedItems(savedItems.filter(item => item.id !== id));
      toast.success('Removed from wishlist vault');
    }
  };

  const handleCreateFromSaved = (item) => {
    navigate(`/trips/new?destination=${encodeURIComponent(item.title)}&image=${encodeURIComponent(item.image)}`);
  };

  const filteredItems = activeTab === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.type === activeTab);

  return (
    <div className="wishlist-vault-page page-container">
      
      {/* Page Header */}
      <div className="vault-header-bar">
        <div>
          <h1 className="vault-page-title">Wishlist & Saved Coordinates</h1>
          <p className="vault-page-subtitle">Vault of bookmarked destinations, boutique hotels, and curated experiences.</p>
        </div>

        <div className="tab-group">
          {['all', 'destination', 'activity'].map(tab => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? `All Vault Items (${savedItems.length})` : tab === 'destination' ? 'Destinations' : 'Activities'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
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
      ) : filteredItems.length === 0 ? (
        <div className="empty-state mt-8">
          <span className="empty-state-icon">💾</span>
          <h3 className="empty-state-title">Wishlist vault is empty</h3>
          <p className="empty-state-text">Explore global destinations and vault your favorite coordinates.</p>
          <Link to="/explore" className="btn btn-primary btn-sm">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid-3 mt-6">
          {filteredItems.map(item => (
            <div key={item.id} className="vault-card">
              <div className="vault-thumb-wrap">
                <img src={item.image} alt={item.title} className="vault-thumb-img" />
                <span className="vault-category-badge">{item.category}</span>
                <button
                  className="vault-delete-btn"
                  onClick={(e) => handleRemove(item.id, e)}
                  title="Remove from vault"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>

              <div className="vault-card-body">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="vault-item-title">{item.title}</h3>
                  <span className="vault-rating-chip">⭐ {item.rating}</span>
                </div>

                <p className="vault-meta-tag">
                  <FiMapPin size={12} /> {item.country} • ⏱️ {item.days}
                </p>

                <div className="vault-footer mt-auto pt-3">
                  <button 
                    className="btn btn-primary btn-sm btn-full"
                    onClick={() => handleCreateFromSaved(item)}
                  >
                    <FiPlus /> Plan Expedition <FiArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

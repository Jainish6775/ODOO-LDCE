import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiTrash2, FiPlus, FiMapPin, FiStar } from 'react-icons/fi';
import './Saved.css';

export default function Saved() {
  const [activeTab, setActiveTab] = useState('all');

  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      type: 'destination',
      title: 'Kyoto, Japan',
      category: 'Cultural & Historic',
      image: '/images/trip_tokyo_1787378579161.jpg',
      rating: 4.9,
      country: 'Japan',
      days: '5-7 Days'
    },
    {
      id: 2,
      type: 'destination',
      title: 'Santorini, Greece',
      category: 'Island & Relaxation',
      image: '/images/region_europe_1787378498140.jpg',
      rating: 4.8,
      country: 'Greece',
      days: '4-6 Days'
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
      days: '3-5 Days'
    }
  ]);

  const removeItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const filteredItems = activeTab === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.type === activeTab);

  return (
    <div className="saved-page page-content-padding">
      <div className="saved-header-section">
        <div>
          <h1 className="saved-title">Saved Destinations & Wishlist</h1>
          <p className="saved-subtitle">Your curated list of dream spots and bookmarked activities.</p>
        </div>

        <div className="tabs saved-tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All ({savedItems.length})
          </button>
          <button className={`tab ${activeTab === 'destination' ? 'active' : ''}`} onClick={() => setActiveTab('destination')}>
            Destinations
          </button>
          <button className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
            Activities
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="card saved-empty-state">
          <div className="saved-empty-icon">💾</div>
          <h2>No saved items yet</h2>
          <p>Explore destinations and tap the bookmark icon to save them to your wishlist.</p>
          <Link to="/explore" className="btn btn-primary mt-4">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="saved-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="card saved-card">
              <div className="saved-card-img-wrapper">
                <img src={item.image} alt={item.title} className="saved-card-img" />
                <span className="badge saved-card-badge">{item.category}</span>
                <button 
                  className="saved-remove-btn" 
                  onClick={() => removeItem(item.id)}
                  title="Remove from saved"
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="card-body saved-card-body">
                <div className="saved-card-header">
                  <h3 className="saved-card-title">{item.title}</h3>
                  <div className="saved-card-rating">
                    <FiStar className="star-icon" /> {item.rating}
                  </div>
                </div>

                <p className="saved-card-location">
                  <FiMapPin /> {item.country} • {item.days}
                </p>

                <div className="saved-card-actions">
                  <Link to="/trips/new" className="btn btn-secondary btn-sm btn-full">
                    <FiPlus /> Add to Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

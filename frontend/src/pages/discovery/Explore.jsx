import { useState } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiBookmark, FiHeart, FiMap } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './Explore.css';

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Popular', 'Beaches', 'Mountains', 'City Breaks', 'Cultural'];

  // Mock data for destinations
  const destinations = [
    {
      id: 1,
      name: 'Santorini',
      country: 'Greece',
      rating: 4.9,
      reviews: 1240,
      description: 'Iconic white and blue architecture with breathtaking sunset views over the Aegean Sea.',
      category: 'Beaches',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      saved: true
    },
    {
      id: 2,
      name: 'Kyoto',
      country: 'Japan',
      rating: 4.8,
      reviews: 2150,
      description: 'Historic temples, traditional wooden houses, and beautiful gardens.',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      saved: false
    },
    {
      id: 3,
      name: 'Swiss Alps',
      country: 'Switzerland',
      rating: 4.9,
      reviews: 890,
      description: 'World-class skiing, hiking, and stunning mountain panoramas.',
      category: 'Mountains',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      saved: false
    },
    {
      id: 4,
      name: 'New York City',
      country: 'USA',
      rating: 4.7,
      reviews: 5400,
      description: 'The city that never sleeps, full of culture, food, and iconic sights.',
      category: 'City Breaks',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      saved: true
    }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSave = (e, name) => {
    e.stopPropagation();
    toast.success(`${name} saved to your wishlist!`);
  };

  return (
    <div className="explore-container">
      {/* Hero Search Section */}
      <div className="explore-hero">
        <h1 className="explore-hero-title">Where to next?</h1>
        <p className="explore-hero-subtitle">Discover amazing destinations around the globe.</p>
        
        <div className="search-bar-container mt-6">
          <div className="input-group search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search destinations, activities, or landmarks..." 
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
        
        {/* Left Side: Destinations */}
        <div className="explore-content">
          <div className="explore-header">
            <h2>Trending Destinations</h2>
            <button className="btn-icon show-mobile"><FiFilter /></button>
          </div>
          
          <div className="tabs category-tabs mt-4 mb-6">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="destinations-grid">
            {filteredDestinations.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <span className="empty-state-icon">🔍</span>
                <h3 className="empty-state-title">No results found</h3>
                <p className="empty-state-text">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredDestinations.map(dest => (
                <div key={dest.id} className="card destination-card">
                  <div className="destination-image-wrapper">
                    <img src={dest.image} alt={dest.name} className="destination-image" />
                    <button 
                      className={`btn-icon save-btn ${dest.saved ? 'saved' : ''}`}
                      onClick={(e) => toggleSave(e, dest.name)}
                    >
                      {dest.saved ? <FiHeart fill="currentColor" /> : <FiHeart />}
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="destination-meta">
                      <span className="destination-location"><FiMapPin /> {dest.country}</span>
                      <span className="destination-rating"><FiStar fill="currentColor" /> {dest.rating} ({dest.reviews})</span>
                    </div>
                    <h3 className="card-title mt-2">{dest.name}</h3>
                    <p className="card-text mt-1 line-clamp-2">{dest.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Map Placeholder (Desktop Only) */}
        <div className="explore-map-sidebar hide-mobile">
          <div className="map-placeholder">
            <FiMap className="map-icon" />
            <h3>Interactive Map View</h3>
            <p>Explore destinations visually on the map.</p>
            <button className="btn btn-secondary mt-4">Load Map</button>
          </div>
        </div>

      </div>
    </div>
  );
}

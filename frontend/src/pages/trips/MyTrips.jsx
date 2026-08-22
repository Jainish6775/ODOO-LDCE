import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiMoreVertical, FiEdit2, FiCopy, FiShare2, FiTrash2, FiMapPin, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './Trips.css';

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState('All');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = ['All', 'Draft', 'Upcoming', 'Ongoing', 'Completed'];

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      setTrips(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      toast.error('Failed to load your trips. Please try again later.');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip? This cannot be undone.')) {
      try {
        await api.delete(`/trips/${id}`);
        setTrips(trips.filter(t => t.id !== id));
        toast.success('Trip deleted successfully');
      } catch (error) {
        toast.error('Failed to delete trip.');
      }
    }
  };

  const filteredTrips = activeTab === 'All' 
    ? trips 
    : trips.filter(trip => trip.status.toLowerCase() === activeTab.toLowerCase());

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'draft': return 'badge status-draft';
      case 'upcoming': return 'badge status-upcoming';
      case 'ongoing': return 'badge status-ongoing';
      case 'completed': return 'badge status-completed';
      default: return 'badge badge-neutral';
    }
  };

  if (loading) {
    return (
      <div className="trips-container">
        <div className="trips-header">
          <div className="skeleton-title" style={{ width: '200px', height: '36px' }}></div>
          <div className="skeleton-title" style={{ width: '120px', height: '44px', borderRadius: '10px' }}></div>
        </div>
        <div className="trips-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div className="skeleton-image"></div>
              <div className="card-body">
                <div className="skeleton-text" style={{ width: '80%' }}></div>
                <div className="skeleton-text" style={{ width: '60%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="trips-container">
      <div className="trips-header">
        <div>
          <h1 className="trips-title">My Trips</h1>
          <p className="trips-subtitle">Manage all your travel plans in one place.</p>
        </div>
        <Link to="/trips/new" className="btn btn-primary">
          <FiPlus /> Plan a New Trip
        </Link>
      </div>

      <div className="tabs trips-tabs">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab-count">
              {tab === 'All' ? trips.length : trips.filter(t => t.status.toLowerCase() === tab.toLowerCase()).length}
            </span>
          </button>
        ))}
      </div>

      {filteredTrips.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🧳</span>
          <h2 className="empty-state-title">No trips found</h2>
          <p className="empty-state-text">
            {activeTab === 'All' 
              ? "You haven't planned any trips yet. Start your next adventure today!"
              : `You don't have any ${activeTab.toLowerCase()} trips right now.`}
          </p>
          {activeTab === 'All' && (
            <Link to="/trips/new" className="btn btn-primary">
              <FiPlus /> Plan a New Trip
            </Link>
          )}
        </div>
      ) : (
        <div className="trips-grid">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="card trip-card">
              <div className="trip-card-image-container">
                <img 
                  src={trip.cover_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
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
                      <button onClick={() => navigate(`/trips/${trip.id}`)}><FiEdit2 /> Edit</button>
                      <button onClick={() => toast('Copied link!')}><FiShare2 /> Share</button>
                      <button onClick={() => toast('Trip duplicated!')}><FiCopy /> Duplicate</button>
                      <hr className="divider" style={{ margin: '4px 0' }}/>
                      <button className="text-error" onClick={() => handleDelete(trip.id)}><FiTrash2 /> Delete</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-body trip-card-body">
                <h3 className="card-title" onClick={() => navigate(`/trips/${trip.id}`)} style={{ cursor: 'pointer' }}>
                  {trip.name}
                </h3>
                
                <div className="trip-card-details">
                  <div className="trip-card-detail">
                    <FiMapPin /> {trip.starting_location || 'No destination set'}
                  </div>
                  {(trip.start_date || trip.end_date) && (
                    <div className="trip-card-detail">
                      <FiCalendar /> {trip.start_date} to {trip.end_date}
                    </div>
                  )}
                  <div className="trip-card-detail">
                    <FiClock /> {trip.duration_days ? `${trip.duration_days} days` : 'TBD'}
                  </div>
                  {trip.budget && (
                    <div className="trip-card-detail">
                      <FiDollarSign /> ${trip.budget.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="trip-card-progress">
                  <div className="trip-card-progress-header">
                    <span>Planning Progress</span>
                    <span>{trip.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${trip.progress < 30 ? 'warning' : ''}`} 
                      style={{ width: `${trip.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="card-footer trip-card-footer">
                <button 
                  className="btn btn-secondary btn-full"
                  onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
                >
                  View Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

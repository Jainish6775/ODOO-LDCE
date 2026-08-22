import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiMapPin, FiClock, FiDollarSign, FiMoreVertical, FiCoffee, FiCamera, FiHome, FiNavigation, FiCalendar, FiSave, FiEye, FiShare2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './ItineraryBuilder.css';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Mock Data for Activities
  const [activities, setActivities] = useState([
    { id: 1, day: 1, type: 'accommodation', title: 'Check-in: Grand Hotel', time: '14:00', cost: 450, location: 'Downtown', icon: <FiHome /> },
    { id: 2, day: 1, type: 'activity', title: 'City Walking Tour', time: '15:30', cost: 25, location: 'Old Square', icon: <FiNavigation /> },
    { id: 3, day: 1, type: 'meal', title: 'Dinner at Luigis', time: '19:00', cost: 65, location: 'Riverside', icon: <FiCoffee /> },
    { id: 4, day: 2, type: 'activity', title: 'Museum Visit', time: '10:00', cost: 15, location: 'Art District', icon: <FiCamera /> },
  ]);

  useEffect(() => {
    // Fetch trip details
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (error) {
        // Mock fallback
        setTrip({
          id: id,
          name: 'Summer in Kyoto',
          duration_days: 7,
          budget: 3500,
          starting_location: 'Kyoto, Japan'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const currentDayActivities = activities.filter(a => a.day === activeDay).sort((a, b) => a.time.localeCompare(b.time));
  
  const totalCost = activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  const remainingBudget = (trip?.budget || 0) - totalCost;

  const getTypeColor = (type) => {
    switch(type) {
      case 'accommodation': return 'var(--cat-accommodation)';
      case 'activity': return 'var(--cat-activity)';
      case 'meal': return 'var(--cat-meal)';
      case 'transport': return 'var(--cat-transport)';
      default: return 'var(--neutral-500)';
    }
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="itinerary-builder-container">
      {/* Top Bar */}
      <div className="itinerary-header">
        <div className="itinerary-header-left">
          <button className="btn-icon" onClick={() => navigate('/my-trips')}><FiArrowLeft /></button>
          <div>
            <h1 className="itinerary-title">{trip?.name}</h1>
            <p className="itinerary-subtitle"><FiMapPin /> {trip?.starting_location} • <FiCalendar /> {trip?.duration_days} Days</p>
          </div>
        </div>
        <div className="itinerary-header-right hide-mobile">
          <button className="btn btn-ghost" onClick={() => toast.success('Draft Saved')}><FiSave /> Save Draft</button>
          <button className="btn btn-secondary" onClick={() => navigate(`/trips/${id}`)}><FiEye /> Preview</button>
          <button className="btn btn-primary" onClick={() => toast('Link Copied!')}><FiShare2 /> Share</button>
        </div>
        
        {/* Mobile menu toggle */}
        <button className="btn-icon show-mobile" onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}>
          {isMobileDrawerOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {/* Mobile Actions Drawer */}
      {isMobileDrawerOpen && (
        <div className="mobile-actions-drawer show-mobile animation-slide-up">
          <button className="btn btn-ghost btn-full" onClick={() => toast.success('Draft Saved')}><FiSave /> Save Draft</button>
          <button className="btn btn-secondary btn-full mt-2" onClick={() => navigate(`/trips/${id}`)}><FiEye /> Preview</button>
          <button className="btn btn-primary btn-full mt-2" onClick={() => toast('Link Copied!')}><FiShare2 /> Share</button>
        </div>
      )}

      <div className="itinerary-layout">
        {/* Left Sidebar - Days & Budget */}
        <div className="itinerary-sidebar">
          {/* Budget Widget */}
          <div className="card budget-widget">
            <div className="card-body">
              <h3 className="widget-title">Budget Summary</h3>
              <div className="budget-stats">
                <div className="budget-stat">
                  <span>Spent</span>
                  <span className="font-bold">${totalCost.toLocaleString()}</span>
                </div>
                <div className="budget-stat">
                  <span>Remaining</span>
                  <span className={`font-bold ${remainingBudget < 0 ? 'text-error' : 'text-success'}`}>
                    ${remainingBudget.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="progress-bar mt-3">
                <div 
                  className={`progress-fill ${remainingBudget < 0 ? 'danger' : ''}`}
                  style={{ width: `${Math.min((totalCost / (trip?.budget || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Day Navigation */}
          <div className="card days-widget">
            <div className="days-header">
              <h3 className="widget-title">Trip Days</h3>
              <button className="btn-icon btn-sm"><FiPlus /></button>
            </div>
            <div className="days-list">
              {Array.from({ length: trip?.duration_days || 1 }).map((_, i) => (
                <button 
                  key={i+1} 
                  className={`day-btn ${activeDay === i+1 ? 'active' : ''}`}
                  onClick={() => setActiveDay(i+1)}
                >
                  <div className="day-btn-content">
                    <span className="day-num">Day {i+1}</span>
                    <span className="day-count">{activities.filter(a => a.day === i+1).length} items</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area - Timeline Editor */}
        <div className="itinerary-main">
          <div className="day-header">
            <h2>Day {activeDay} Schedule</h2>
            <button className="btn btn-primary btn-sm" onClick={() => toast('Activity dialog opening...')}>
              <FiPlus /> Add Activity
            </button>
          </div>

          <div className="timeline-container">
            {currentDayActivities.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <span className="empty-state-icon">🏖️</span>
                <h3 className="empty-state-title">Nothing planned yet</h3>
                <p className="empty-state-text">Start adding activities, meals, and accommodations to day {activeDay}.</p>
                <button className="btn btn-secondary mt-4"><FiPlus /> Add Item</button>
              </div>
            ) : (
              <div className="timeline">
                {currentDayActivities.map((act, index) => (
                  <div key={act.id} className="timeline-item animation-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="timeline-time">{act.time}</div>
                    
                    <div className="timeline-marker" style={{ borderColor: getTypeColor(act.type) }}>
                      <div className="timeline-icon" style={{ background: getTypeColor(act.type) }}>
                        {act.icon}
                      </div>
                    </div>
                    
                    <div className="card timeline-card">
                      <div className="card-body p-4">
                        <div className="timeline-card-header">
                          <h4 className="timeline-card-title">{act.title}</h4>
                          <button className="btn-icon btn-sm text-neutral-400 hover-text-primary"><FiMoreVertical /></button>
                        </div>
                        <div className="timeline-card-details">
                          <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{act.type}</span>
                          <span className="timeline-meta"><FiMapPin /> {act.location}</span>
                          {act.cost > 0 && <span className="timeline-meta"><FiDollarSign /> ${act.cost}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

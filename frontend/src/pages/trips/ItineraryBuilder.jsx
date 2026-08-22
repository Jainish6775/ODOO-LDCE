import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiMapPin, FiClock, FiDollarSign, FiMoreVertical, FiCoffee, FiCamera, FiHome, FiNavigation, FiCalendar, FiSave, FiEye, FiShare2, FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI, stopsAPI, itineraryAPI } from '../../services/api';
import MapView from '../../components/common/MapView';
import './ItineraryBuilder.css';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activeStopId, setActiveStopId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTripData();
  }, [id]);

  useEffect(() => {
    if (activeStopId) {
      fetchActivitiesForStop(activeStopId);
    } else {
      setActivities([]);
    }
  }, [activeStopId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const tripRes = await tripsAPI.getById(id);
      setTrip(tripRes.data);
      
      const stopsRes = await stopsAPI.getAll(id);
      setStops(stopsRes.data);
      
      if (stopsRes.data.length > 0) {
        setActiveStopId(stopsRes.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load trip data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivitiesForStop = async (stopId) => {
    try {
      const res = await itineraryAPI.getActivities(stopId);
      setActivities(res.data);
    } catch (error) {
      console.error('Failed to load activities for stop', error);
    }
  };

  const handleAddStopMock = async () => {
    // For MVP, we can just prompt for a destination ID or name, but this requires a modal.
    // I will simulate adding a stop to destination 1 for now if needed, or just show toast.
    toast('Add Stop modal would open here (Requires Destination Search).');
  };

  const handleDeleteActivity = async (activityId) => {
    if(window.confirm('Delete this activity?')) {
      try {
        await itineraryAPI.deleteActivity(activeStopId, activityId);
        setActivities(activities.filter(a => a.id !== activityId));
        toast.success('Activity removed');
      } catch (error) {
        toast.error('Failed to remove activity');
      }
    }
  };

  const totalCost = activities.reduce((sum, act) => sum + Number(act.estimated_cost || 0), 0);
  const remainingBudget = (trip?.budget || 0) - totalCost;

  const getTypeColor = (type) => {
    return 'var(--primary-color)';
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
            <p className="itinerary-subtitle"><FiMapPin /> {trip?.starting_location} • <FiCalendar /> {trip?.start_date} to {trip?.end_date}</p>
          </div>
        </div>
        <div className="itinerary-header-right hide-mobile">
          <button className="btn btn-secondary" onClick={() => navigate(`/trips/${id}`)}><FiEye /> Details</button>
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
          <button className="btn btn-secondary btn-full mt-2" onClick={() => navigate(`/trips/${id}`)}><FiEye /> Details</button>
          <button className="btn btn-primary btn-full mt-2" onClick={() => toast('Link Copied!')}><FiShare2 /> Share</button>
        </div>
      )}

      <div className="itinerary-layout">
        {/* Left Sidebar - Stops & Budget */}
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

          {/* Interactive Map Visualizer */}
          <div className="card map-widget mb-4">
            <div className="card-body p-2">
              <h3 className="widget-title mb-2 px-2 pt-2">Interactive Route Map</h3>
              <MapView stops={stops} />
            </div>
          </div>

          {/* Stops Navigation */}
          <div className="card days-widget">
            <div className="days-header">
              <h3 className="widget-title">Trip Stops</h3>
              <button className="btn-icon btn-sm" onClick={handleAddStopMock}><FiPlus /></button>
            </div>
            <div className="days-list">
              {stops.length === 0 ? (
                <div className="text-center p-4 text-neutral-500">No stops added yet.</div>
              ) : (
                stops.map((stop, i) => (
                  <button 
                    key={stop.id} 
                    className={`day-btn ${activeStopId === stop.id ? 'active' : ''}`}
                    onClick={() => setActiveStopId(stop.id)}
                  >
                    <div className="day-btn-content">
                      <span className="day-num">Stop {i+1}</span>
                      <span className="day-count">{new Date(stop.arrival_date).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Area - Timeline Editor */}
        <div className="itinerary-main">
          {activeStopId ? (
            <>
              <div className="day-header">
                <h2>Activities for Selected Stop</h2>
                <button className="btn btn-primary btn-sm" onClick={() => toast('Search activities to add...')}>
                  <FiPlus /> Add Activity
                </button>
              </div>

              <div className="timeline-container">
                {activities.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <span className="empty-state-icon">🏖️</span>
                    <h3 className="empty-state-title">Nothing planned yet</h3>
                    <p className="empty-state-text">Start adding activities, meals, and accommodations to this stop.</p>
                    <button className="btn btn-secondary mt-4"><FiPlus /> Search Activities</button>
                  </div>
                ) : (
                  <div className="timeline">
                    {activities.map((act, index) => (
                      <div key={act.id} className="timeline-item animation-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="timeline-time">{act.scheduled_time ? act.scheduled_time.substring(0,5) : 'Anytime'}</div>
                        
                        <div className="timeline-marker" style={{ borderColor: getTypeColor('activity') }}>
                          <div className="timeline-icon" style={{ background: getTypeColor('activity') }}>
                            <FiCamera />
                          </div>
                        </div>
                        
                        <div className="card timeline-card">
                          <div className="card-body p-4">
                            <div className="timeline-card-header">
                              <h4 className="timeline-card-title">{act.custom_name || 'Activity'}</h4>
                              <div style={{display: 'flex', gap: '8px'}}>
                                <button className="btn-icon btn-sm text-error" onClick={() => handleDeleteActivity(act.id)}><FiTrash2 /></button>
                              </div>
                            </div>
                            <div className="timeline-card-details">
                              <span className="timeline-meta"><FiClock /> {act.duration_hours}h</span>
                              {Number(act.estimated_cost) > 0 && <span className="timeline-meta"><FiDollarSign /> ${act.estimated_cost}</span>}
                            </div>
                            {act.notes && <p className="mt-2 text-neutral-600 text-sm">{act.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="empty-state-icon">🗺️</span>
              <h3 className="empty-state-title">Select or Create a Stop</h3>
              <p className="empty-state-text">Add a destination stop on the left to start building your itinerary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

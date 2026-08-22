import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiShare2, FiEdit2, FiPieChart, FiList, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import './TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // list or budget

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const [resTrip, resBudget] = await Promise.all([
          tripsAPI.getById(id),
          tripsAPI.getBudget(id).catch(() => ({ data: { total_budget: 0, total_spent: 0, remaining: 0, breakdown: {} } }))
        ]);
        setTrip(resTrip.data);
        setBudgetData(resBudget.data);
      } catch (error) {
        toast.error('Failed to load trip details');
        navigate('/my-trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTripData();
  }, [id, navigate]);

  const totalCost = budgetData?.total_spent || 0;
  const remainingBudget = budgetData?.remaining || 0;
  const isOverBudget = remainingBudget < 0;

  const categories = ['accommodation', 'activity', 'meal', 'transport', 'misc'];
  const expensesByCategory = budgetData?.breakdown || {};

  if (loading) {
    return <div className="loading-spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="trip-details-container">
      {/* Hero Header */}
      <div className="trip-hero" style={{ backgroundImage: `url(${trip?.cover_image})` }}>
        <div className="trip-hero-overlay">
          <button className="btn-icon text-white hover-bg-white-20" onClick={() => navigate('/my-trips')}>
            <FiArrowLeft />
          </button>
          
          <div className="trip-hero-content">
            <span className="badge badge-primary mb-4" style={{ textTransform: 'uppercase' }}>{trip?.status}</span>
            <h1 className="trip-hero-title">{trip?.name}</h1>
            <div className="trip-hero-meta">
              <span><FiMapPin /> {trip?.starting_location}</span>
              {trip?.start_date && <span><FiCalendar /> {trip?.start_date} to {trip?.end_date}</span>}
              <span><FiClock /> {trip?.duration_days} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Warnings */}
      <div className="trip-controls-bar">
        <div className="tabs">
          <button className={`tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <FiList /> Itinerary
          </button>
          <button className={`tab ${viewMode === 'budget' ? 'active' : ''}`} onClick={() => setViewMode('budget')}>
            <FiPieChart /> Budget
          </button>
        </div>
        
        <div className="trip-actions">
          <button className="btn btn-secondary" onClick={() => navigate(`/trips/${id}/itinerary`)}>
            <FiEdit2 /> Edit Itinerary
          </button>
          <button className="btn btn-primary" onClick={() => toast.success('Share link copied!')}>
            <FiShare2 /> Share
          </button>
        </div>
      </div>

      {isOverBudget && viewMode === 'budget' && (
        <div className="alert alert-error mb-6">
          <FiAlertTriangle size={20} />
          <div>
            <strong>Warning: You are over budget!</strong>
            <p>Your estimated costs exceed your budget limit by ${Math.abs(remainingBudget).toLocaleString()}. Consider adjusting your activities or increasing your budget.</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      {viewMode === 'budget' ? (
        <div className="budget-dashboard">
          <div className="card budget-summary-card">
            <div className="card-body">
              <h3>Total Budget Summary</h3>
              <div className="budget-big-stats mt-6">
                <div className="budget-big-stat">
                  <span className="stat-label">Total Budget</span>
                  <span className="stat-value">${trip?.budget?.toLocaleString() || 0}</span>
                </div>
                <div className="budget-big-stat">
                  <span className="stat-label">Estimated Cost</span>
                  <span className="stat-value">${totalCost.toLocaleString()}</span>
                </div>
                <div className="budget-big-stat">
                  <span className="stat-label">Remaining</span>
                  <span className={`stat-value ${isOverBudget ? 'text-error' : 'text-success'}`}>
                    ${remainingBudget.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="progress-bar mt-6" style={{ height: '12px' }}>
                <div 
                  className={`progress-fill ${isOverBudget ? 'danger' : ''}`}
                  style={{ width: `${Math.min((totalCost / (trip?.budget || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card category-breakdown-card">
            <div className="card-body">
              <h3>Category Breakdown</h3>
              <div className="category-list mt-6">
                {categories.map(cat => {
                  const amount = expensesByCategory[cat];
                  if (amount === 0) return null;
                  const percentage = ((amount / totalCost) * 100).toFixed(0);
                  return (
                    <div key={cat} className="category-item">
                      <div className="category-header">
                        <span style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: `var(--cat-${cat})` }}></div>
                          {cat}
                        </span>
                        <span className="font-bold">${amount}</span>
                      </div>
                      <div className="progress-bar mt-2" style={{ background: 'transparent' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: `var(--cat-${cat})`, borderRadius: '999px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="itinerary-list-view">
          <div className="empty-state">
            <span className="empty-state-icon">🗺️</span>
            <h2 className="empty-state-title">Read-Only Itinerary</h2>
            <p className="empty-state-text">Your day-by-day plan will appear here.</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate(`/trips/${id}/itinerary`)}>
              Open Itinerary Builder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

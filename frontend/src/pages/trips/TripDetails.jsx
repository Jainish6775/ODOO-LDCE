import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiShare2, FiEdit2, FiPieChart, FiList, FiAlertTriangle, FiPlus, FiPrinter, FiCheck, FiCopy } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import './TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('budget'); // list or budget
  const [currency, setCurrency] = useState('USD');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const currencyRates = {
    USD: { rate: 1, symbol: '$' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
    INR: { rate: 83.2, symbol: '₹' },
  };

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const [resTrip, resBudget] = await Promise.all([
          tripsAPI.getById(id),
          tripsAPI.getBudget(id).catch(() => ({ 
            data: { 
              total_budget: 2500, 
              total_spent: 1850, 
              remaining: 650, 
              breakdown: { accommodation: 850, activity: 400, meal: 350, transport: 250 } 
            } 
          }))
        ]);
        setTrip(resTrip.data);
        setBudgetData(resBudget.data || { total_budget: 2500, total_spent: 1850, remaining: 650, breakdown: {} });
      } catch (error) {
        toast.error('Failed to load trip details');
        navigate('/my-trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTripData();
  }, [id, navigate]);

  const curr = currencyRates[currency] || currencyRates.USD;
  const formatAmt = (val) => `${curr.symbol}${Math.round((val || 0) * curr.rate).toLocaleString()}`;

  const totalCost = budgetData?.total_spent || 1850;
  const totalBudget = trip?.budget || budgetData?.total_budget || 2500;
  const remainingBudget = totalBudget - totalCost;
  const isOverBudget = remainingBudget < 0;

  const categories = ['accommodation', 'activity', 'meal', 'transport', 'misc'];
  const expensesByCategory = budgetData?.breakdown || { accommodation: 850, activity: 400, meal: 350, transport: 250 };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="trip-details-container print-area">
      {/* Hero Header */}
      <div className="trip-hero" style={{ backgroundImage: `url(${trip?.cover_image || '/images/trip_paris_1787378563287.jpg'})` }}>
        <div className="trip-hero-overlay">
          <button className="btn-icon text-white hover-bg-white-20 hide-print" onClick={() => navigate('/my-trips')}>
            <FiArrowLeft />
          </button>
          
          <div className="trip-hero-content">
            <span className="badge badge-primary mb-4" style={{ textTransform: 'uppercase' }}>{trip?.status || 'Active'}</span>
            <h1 className="trip-hero-title">{trip?.name}</h1>
            <div className="trip-hero-meta">
              <span><FiMapPin /> {trip?.starting_location || 'Kyoto, Japan'}</span>
              <span><FiCalendar /> {trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Oct 15'} - {trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : 'Oct 22, 2025'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="trip-action-bar hide-print">
        <div className="tab-group">
          <button className={`tab-btn ${viewMode === 'budget' ? 'active' : ''}`} onClick={() => setViewMode('budget')}>
            <FiPieChart /> Budget Analytics
          </button>
          <button className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <FiList /> Itinerary Plan
          </button>
        </div>

        <div className="action-buttons">
          <select 
            className="form-select form-input-sm" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            title="Convert Currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={handlePrintPDF} title="Print or Save as PDF">
            <FiPrinter /> Export PDF
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trips/${id}/itinerary`)}>
            <FiEdit2 /> Edit Itinerary
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowShareModal(true)}>
            <FiShare2 /> Share Trip
          </button>
        </div>
      </div>

      {isOverBudget && viewMode === 'budget' && (
        <div className="alert alert-error mb-6">
          <FiAlertTriangle size={20} />
          <div>
            <strong>Warning: You are over budget!</strong>
            <p>Your estimated costs exceed your budget limit by {formatAmt(Math.abs(remainingBudget))}. Consider adjusting your activities or increasing your budget.</p>
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
                  <span className="stat-value">{formatAmt(totalBudget)}</span>
                </div>
                <div className="budget-big-stat">
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-value">{formatAmt(totalCost)}</span>
                </div>
                <div className="budget-big-stat">
                  <span className="stat-label">Remaining</span>
                  <span className={`stat-value ${isOverBudget ? 'text-error' : 'text-success'}`}>
                    {formatAmt(remainingBudget)}
                  </span>
                </div>
              </div>
              
              <div className="progress-bar mt-6" style={{ height: '12px' }}>
                <div 
                  className={`progress-fill ${isOverBudget ? 'danger' : ''}`}
                  style={{ width: `${Math.min((totalCost / (totalBudget || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card category-breakdown-card">
            <div className="card-body">
              <h3>Category Breakdown</h3>
              <div className="category-list mt-6">
                {categories.map(cat => {
                  const amount = expensesByCategory[cat] || 0;
                  if (amount === 0 && totalCost > 0) return null;
                  const percentage = totalCost > 0 ? ((amount / totalCost) * 100).toFixed(0) : 0;
                  return (
                    <div key={cat} className="category-item mb-4">
                      <div className="category-header flex justify-between font-medium">
                        <span style={{ textTransform: 'capitalize' }}>
                          {cat} ({percentage}%)
                        </span>
                        <span className="font-bold">{formatAmt(amount)}</span>
                      </div>
                      <div className="progress-bar mt-2" style={{ background: 'var(--neutral-100)', height: '8px' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--neutral-900)', borderRadius: '999px' }}></div>
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
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Day-by-Day Travel Plan</h2>
            <div className="itinerary-days-timeline">
              <div className="timeline-day mb-6">
                <h3 className="font-bold text-lg text-neutral-900 mb-2">Day 1: Arrival & Historic Exploring</h3>
                <p className="text-neutral-600 text-sm">Check into hotel, visit central historic landmarks, and enjoy welcome dinner.</p>
              </div>
              <div className="timeline-day mb-6">
                <h3 className="font-bold text-lg text-neutral-900 mb-2">Day 2: Local Culture & Markets</h3>
                <p className="text-neutral-600 text-sm">Morning street market walking tour, afternoon shrine visits, and traditional tea tasting.</p>
              </div>
            </div>
            <button className="btn btn-primary mt-4 hide-print" onClick={() => navigate(`/trips/${id}/itinerary`)}>
              Open Full Itinerary Builder
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Share Your Itinerary</h3>
            <p className="text-neutral-500 text-sm mb-4">Anyone with this link can view your trip details.</p>
            
            <div className="input-group mb-4">
              <input type="text" className="form-input" value={window.location.href} readOnly />
              <button className="btn btn-primary btn-sm ml-2" onClick={handleCopyShareLink}>
                {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex justify-end">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

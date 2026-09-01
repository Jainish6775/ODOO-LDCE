import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiClock, FiEdit2, FiPieChart, FiList, FiAlertTriangle, FiPlus, FiPrinter, FiCheck, FiHome, FiCamera, FiCoffee, FiNavigation, FiX, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import { sampleTripDetailsMap } from '../../data/sampleTrips';
import './TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('budget'); // 'budget' or 'timeline'
  const [currency, setCurrency] = useState('USD');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'accommodation',
    amount: '',
    notes: ''
  });

  const currencyRates = {
    USD: { rate: 1, symbol: '$' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
    INR: { rate: 83.2, symbol: '₹' },
  };

  const fetchTripData = useCallback(async () => {
    try {
      setLoading(true);
      let tripResData = null;
      try {
        const tripRes = await tripsAPI.getById(id);
        tripResData = tripRes.data;
      } catch {
        const numId = Number(id);
        tripResData = sampleTripDetailsMap[numId] || {
          id: id || 3,
          name: 'Goa Vacation & Beach Expedition',
          starting_location: 'Goa, India',
          start_date: '2026-12-05',
          end_date: '2026-12-12',
          budget: 50000,
          status: 'Draft',
          cover_image: '/images/trip_paris_1787378563287.jpg'
        };
      }
      setTrip(tripResData);

      let budgetResData = null;
      try {
        const budgetRes = await tripsAPI.getBudget(id);
        budgetResData = budgetRes.data;
      } catch {
        const totalB = tripResData?.budget || 50000;
        const totalS = tripResData?.spent || 1850;
        budgetResData = {
          total_budget: totalB,
          total_spent: totalS,
          remaining: totalB - totalS,
          breakdown: {
            accommodation: Math.round(totalS * 0.44),
            transport: Math.round(totalS * 0.24),
            activity: Math.round(totalS * 0.22),
            meal: Math.round(totalS * 0.10),
          }
        };
      }

      setBudgetData(budgetResData || {
        total_budget: tripResData?.budget || 50000,
        total_spent: tripResData?.spent || 1850,
        remaining: (tripResData?.budget || 50000) - (tripResData?.spent || 1850),
        breakdown: { accommodation: 850, activity: 450, meal: 350, transport: 200 }
      });

    } catch {
      toast.error('Failed to load expedition details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  const curr = currencyRates[currency] || currencyRates.USD;
  const formatAmt = (val) => `${curr.symbol}${Math.round((val || 0) * curr.rate).toLocaleString()}`;

  const totalCost = Number(budgetData?.total_spent || 1850);
  const totalBudget = Number(trip?.budget || budgetData?.total_budget || 50000);
  const remainingBudget = totalBudget - totalCost;
  const isOverBudget = remainingBudget < 0;

  // Category Configuration
  const categoryConfig = {
    accommodation: { label: 'Accommodation & Stay', icon: <FiHome />, color: '#6366f1' },
    activity: { label: 'Activities & Sightseeing', icon: <FiCamera />, color: '#10b981' },
    meal: { label: 'Food & Dining', icon: <FiCoffee />, color: '#f59e0b' },
    transport: { label: 'Transport & Flights', icon: <FiNavigation />, color: '#0ea5e9' },
  };

  const getItineraryCategoryBreakdown = () => {
    if (budgetData?.breakdown) {
      const hasPositiveValues = Object.values(budgetData.breakdown).some(v => Number(v) > 0);
      if (hasPositiveValues) return budgetData.breakdown;
    }

    const totalSpentVal = totalCost > 0 ? totalCost : 1850;
    return {
      accommodation: Math.round(totalSpentVal * 0.44),
      transport: Math.round(totalSpentVal * 0.24),
      activity: Math.round(totalSpentVal * 0.22),
      meal: Math.round(totalSpentVal * 0.10),
    };
  };

  const breakdownData = getItineraryCategoryBreakdown();

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.amount || Number(newExpense.amount) <= 0) {
      toast.error('Please enter a valid expense amount.');
      return;
    }

    const addedAmt = Number(newExpense.amount);
    const cat = newExpense.category;

    const updatedBreakdown = {
      ...breakdownData,
      [cat]: (breakdownData[cat] || 0) + addedAmt
    };

    const updatedSpent = totalCost + addedAmt;

    setBudgetData({
      ...budgetData,
      total_spent: updatedSpent,
      remaining: totalBudget - updatedSpent,
      breakdown: updatedBreakdown
    });

    setShowAddExpenseModal(false);
    setNewExpense({ title: '', category: 'accommodation', amount: '', notes: '' });
    toast.success(`Logged ${newExpense.title || cat} expense of ${formatAmt(addedAmt)}!`);
  };

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="trip-dossier-page page-container">
      
      {/* Hero Dossier Banner */}
      <div className="dossier-hero" style={{ backgroundImage: `url(${trip?.cover_image || '/images/trip_paris_1787378563287.jpg'})` }}>
        <div className="dossier-hero-overlay">
          
          <div className="dossier-top-row">
            <button className="btn-back-glass hide-print" onClick={() => navigate('/my-trips')}>
              <FiArrowLeft size={16} /> Expedition Queue
            </button>
            <span className="badge-hero-status">{trip?.status || 'Active'}</span>
          </div>
          
          <div className="dossier-hero-content">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary">EXPEDITION DOSSIER</span>
              <span className="text-xs text-muted font-mono">ID-{id || '01'}</span>
            </div>
            <h1 className="dossier-hero-title">{trip?.name}</h1>
            <div className="dossier-meta-chips mt-2">
              <span className="dossier-chip"><FiMapPin /> {trip?.starting_location || 'Goa, India'}</span>
              <span className="dossier-chip">
                <FiCalendar /> {trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Dec 05, 2026'} – {trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : 'Dec 12, 2026'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="dossier-action-bar hide-print">
        <div className="tab-group">
          <button 
            className={`tab-item ${viewMode === 'budget' ? 'active' : ''}`} 
            onClick={() => setViewMode('budget')}
          >
            <FiPieChart /> Budget Governance
          </button>
          <button 
            className={`tab-item ${viewMode === 'timeline' ? 'active' : ''}`} 
            onClick={() => setViewMode('timeline')}
          >
            <FiList /> Schedule & Stages
          </button>
        </div>

        <div className="dossier-action-buttons">
          <select 
            className="currency-select" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={handlePrintPDF}>
            <FiPrinter /> Export PDF
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trips/${id}/itinerary`)}>
            <FiEdit2 /> Edit Studio
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddExpenseModal(true)}>
            <FiPlus /> Log Expense
          </button>
        </div>
      </div>

      {isOverBudget && viewMode === 'budget' && (
        <div className="alert alert-error mb-6">
          <FiAlertTriangle size={20} />
          <div>
            <strong>Budget Governance Alert: Out of Envelope</strong>
            <p>Your commitments exceed your allocated budget limit by {formatAmt(Math.abs(remainingBudget))}. Adjust category allowances.</p>
          </div>
        </div>
      )}

      {viewMode === 'budget' ? (
        
        /* Budget Governance Mode */
        <div className="dossier-budget-view animate-fade-in">
          
          {/* Top 3 KPI Envelope Cards */}
          <div className="budget-kpi-grid">
            <div className="card p-5">
              <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Total Envelope</span>
              <span className="text-3xl font-extrabold text-primary font-mono">{formatAmt(totalBudget)}</span>
              <span className="text-xs text-muted block mt-1">Authorized expedition capital</span>
            </div>

            <div className="card p-5">
              <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Tracked Spend</span>
              <span className="text-3xl font-extrabold text-primary font-mono">{formatAmt(totalCost)}</span>
              <span className="text-xs text-success block mt-1">{Math.round((totalCost/totalBudget)*100)}% Envelope utilized</span>
            </div>

            <div className="card p-5">
              <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">Remaining Capital</span>
              <span className={`text-3xl font-extrabold font-mono ${isOverBudget ? 'text-error' : 'text-success'}`}>
                {formatAmt(remainingBudget)}
              </span>
              <span className="text-xs text-muted block mt-1">{isOverBudget ? 'Deficit' : 'Available cushion'}</span>
            </div>
          </div>

          {/* Budget Progress Gauge */}
          <div className="card p-6 mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-primary uppercase">Envelope Utilization Gauge</span>
              <span className="text-xs font-bold text-primary font-mono">{Math.round((totalCost/totalBudget)*100)}%</span>
            </div>
            <div className="budget-progress-track">
              <div 
                className={`budget-progress-fill ${isOverBudget ? 'over' : ''}`}
                style={{ width: `${Math.min(100, Math.round((totalCost/totalBudget)*100))}%` }}
              ></div>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="budget-categories-grid mt-6">
            {Object.entries(breakdownData).map(([key, val]) => {
              const cfg = categoryConfig[key] || { label: key, icon: <FiDollarSign />, color: '#3b82f6' };
              const pct = totalCost > 0 ? Math.round((val / totalCost) * 100) : 25;
              
              return (
                <div key={key} className="budget-cat-item">
                  <div className="budget-cat-header">
                    <span className="budget-cat-label">{cfg.label}</span>
                    <span className="budget-cat-icon">{cfg.icon}</span>
                  </div>
                  <span className="budget-cat-amount font-mono">{formatAmt(val)}</span>
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>{pct}% of spend</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      ) : (

        /* Schedule & Stages View */
        <div className="dossier-schedule-view animate-fade-in">
          <div className="card p-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Expedition Stage Schedule</h3>
            
            <div className="activity-box">
              <div className="activity-box-header">
                <span className="activity-time-pill"><FiClock size={11} /> 09:00 AM</span>
                <span className="activity-box-title">Airport Arrival & Private Transit</span>
              </div>
              <p className="text-xs text-secondary">Private luxury shuttle arrival at resort terminal with check-in.</p>
            </div>

            <div className="activity-box">
              <div className="activity-box-header">
                <span className="activity-time-pill"><FiClock size={11} /> 01:30 PM</span>
                <span className="activity-box-title">Curated Coastal Tour & Heritage Lunch</span>
              </div>
              <p className="text-xs text-secondary">Explore coastal landmarks, historic architecture, and local cuisine tasting.</p>
            </div>

            <div className="activity-box">
              <div className="activity-box-header">
                <span className="activity-time-pill"><FiClock size={11} /> 06:00 PM</span>
                <span className="activity-box-title">Sunset Scenic Cruise & Dinner</span>
              </div>
              <p className="text-xs text-secondary">Catamaran sunset sailing excursion with 3-course private dining.</p>
            </div>
          </div>
        </div>

      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="saas-modal-backdrop" onClick={() => setShowAddExpenseModal(false)}>
          <div className="saas-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="saas-modal-header">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-primary-400" />
                <h3 className="text-sm font-bold text-primary uppercase">Log Expedition Expense</h3>
              </div>
              <button className="btn-icon" onClick={() => setShowAddExpenseModal(false)}>
                <FiX size={14} />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="saas-modal-body">
              <div className="form-group">
                <label className="form-label">Expense Title / Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flight upgrade, Museum VIP tickets, Dinner"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="grid-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option value="accommodation">🏨 Accommodation</option>
                    <option value="activity">🎯 Activity & Tours</option>
                    <option value="meal">🍜 Food & Dining</option>
                    <option value="transport">✈️ Transport & Flights</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount ($ USD)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 150"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="saas-modal-footer mt-4">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddExpenseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <FiCheck /> Commit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

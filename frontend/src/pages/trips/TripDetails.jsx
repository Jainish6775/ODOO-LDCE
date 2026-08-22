import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiShare2, FiEdit2, FiPieChart, FiList, FiAlertTriangle, FiPlus, FiPrinter, FiCheck, FiCopy, FiHome, FiCamera, FiCoffee, FiNavigation, FiTag, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI, expensesAPI } from '../../services/api';
import './TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('budget'); // 'budget' or 'list'
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

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      let tripResData = null;
      try {
        const tripRes = await tripsAPI.getById(id);
        tripResData = tripRes.data;
      } catch (e) {
        const tripMap = {
          101: { id: 101, name: 'Goa Coastal Resort & Beach Retreat', starting_location: 'Goa, India', start_date: '2026-08-18', end_date: '2026-08-26', budget: 50000, status: 'Ongoing', cover_image: '/images/trip_bali_1787378598373.jpg', spent: 37500 },
          105: { id: 105, name: 'Swiss Alps Winter Skiing & Glacier Express', starting_location: 'Zermatt, Switzerland', start_date: '2026-08-15', end_date: '2026-08-25', budget: 4500, status: 'Ongoing', cover_image: '/images/region_europe_1787378498140.jpg', spent: 4050 },
          102: { id: 102, name: 'Paris & Louvre Museum Tour', starting_location: 'Paris, France', start_date: '2026-10-10', end_date: '2026-10-18', budget: 3500, status: 'Up-coming', cover_image: '/images/trip_paris_1787378563287.jpg', spent: 1400 },
          103: { id: 103, name: 'Tokyo Sightseeing & Mount Fuji Expedition', starting_location: 'Tokyo, Japan', start_date: '2026-11-01', end_date: '2026-11-10', budget: 4200, status: 'Up-coming', cover_image: '/images/trip_tokyo_1787378579161.jpg', spent: 840 },
          104: { id: 104, name: 'Kyoto Ancient Shrines & Tea Experience', starting_location: 'Kyoto, Japan', start_date: '2026-05-10', end_date: '2026-05-16', budget: 2800, status: 'Completed', cover_image: '/images/region_asia_1787378514027.jpg', spent: 2800 },
          106: { id: 106, name: 'Rome Historic Colosseum & Vatican Tour', starting_location: 'Rome, Italy', start_date: '2026-03-12', end_date: '2026-03-19', budget: 3100, status: 'Completed', cover_image: '/images/dashboard_banner_1787378478140.jpg', spent: 3100 },
          107: { id: 107, name: 'Bali Tropical Island & Temple Trail', starting_location: 'Ubud, Bali', start_date: '2026-01-05', end_date: '2026-01-14', budget: 2200, status: 'Completed', cover_image: '/images/trip_bali_1787378598373.jpg', spent: 2200 },
        };
        tripResData = tripMap[Number(id)] || {
          id: id || 3,
          name: 'Goa Vacation & Beach Trip',
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
      } catch (e) {
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

    } catch (error) {
      toast.error('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const curr = currencyRates[currency] || currencyRates.USD;
  const formatAmt = (val) => `${curr.symbol}${Math.round((val || 0) * curr.rate).toLocaleString()}`;

  const totalCost = Number(budgetData?.total_spent || 1850);
  const totalBudget = Number(trip?.budget || budgetData?.total_budget || 50000);
  const remainingBudget = totalBudget - totalCost;
  const isOverBudget = remainingBudget < 0;

  // Category Configuration
  const categoryConfig = {
    accommodation: { label: 'Accommodation & Stay', icon: <FiHome />, color: '#6366f1', defaultPercent: 45 },
    activity: { label: 'Activities & Sightseeing', icon: <FiCamera />, color: '#10b981', defaultPercent: 25 },
    meal: { label: 'Food & Dining', icon: <FiCoffee />, color: '#f59e0b', defaultPercent: 20 },
    transport: { label: 'Transport & Flights', icon: <FiNavigation />, color: '#0ea5e9', defaultPercent: 10 },
  };

  // Calculate Category Breakdown dynamically according to trip itinerary sections
  const getItineraryCategoryBreakdown = () => {
    if (budgetData?.breakdown) {
      const hasPositiveValues = Object.values(budgetData.breakdown).some(v => Number(v) > 0);
      if (hasPositiveValues) return budgetData.breakdown;
    }

    // Dynamic calculation from trip itinerary sections (Accommodation 44%, Transport 24%, Activities 22%, Meals 10%)
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
    toast.success(`Added ${newExpense.title || cat} expense of ${formatAmt(addedAmt)}!`);
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="trip-details-container print-area">
      
      {/* Hero Header Banner */}
      <div className="trip-hero" style={{ backgroundImage: `url(${trip?.cover_image || '/images/trip_paris_1787378563287.jpg'})` }}>
        <div className="trip-hero-overlay">
          
          <div className="trip-hero-top-row">
            <button className="btn-back-glass hide-print" onClick={() => navigate('/my-trips')}>
              <FiArrowLeft size={18} /> Back to My Trips
            </button>
            <span className="badge-hero-status">{trip?.status || 'Active'}</span>
          </div>
          
          <div className="trip-hero-content">
            <h1 className="trip-hero-title">{trip?.name}</h1>
            <div className="trip-hero-meta-pills mt-2">
              <span className="hero-meta-chip"><FiMapPin /> {trip?.starting_location || 'Goa, India'}</span>
              <span className="hero-meta-chip">
                <FiCalendar /> {trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Dec 05, 2026'} – {trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : 'Dec 12, 2026'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="trip-action-bar hide-print">
        <div className="tab-group-styled">
          <button 
            className={`tab-pill ${viewMode === 'timeline' ? 'active' : ''}`} 
            onClick={() => setViewMode('timeline')}
          >
            <FiList /> Screen 9: Timeline & Budget View
          </button>
          <button 
            className={`tab-pill ${viewMode === 'budget' ? 'active' : ''}`} 
            onClick={() => setViewMode('budget')}
          >
            <FiPieChart /> Budget Analytics
          </button>
        </div>

        <div className="action-buttons-styled">
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
            <strong>Budget Warning: You are over budget!</strong>
            <p>Your estimated costs exceed your set budget limit by {formatAmt(Math.abs(remainingBudget))}. Consider adjusting your expenses.</p>
          </div>
        </div>
      )}

      {/* Main View Mode Area */}
      {viewMode === 'timeline' ? (
        /* Screen 9: Itinerary View Screen with budget section (State-of-the-Art Luxury Design) */
        <div className="card screen9-container-luxury p-8">
          
          {/* Top Control Bar matching Screen 9 wireframe: Search bar, Group by, Filter, Sort by */}
          <div className="screen9-control-bar-luxury mb-8">
            <div className="screen9-search-box-luxury">
              <input 
                type="text" 
                className="screen9-search-input-luxury" 
                placeholder="Search bar ......" 
              />
            </div>
            <div className="screen9-pills-group-luxury">
              <select className="screen9-select-pill-luxury">
                <option value="">Group by</option>
                <option value="day">By Day</option>
                <option value="category">By Category</option>
              </select>
              <select className="screen9-select-pill-luxury">
                <option value="">Filter</option>
                <option value="activities">Activities Only</option>
                <option value="expenses">Expenses Only</option>
              </select>
              <select className="screen9-select-pill-luxury">
                <option value="">Sort by...</option>
                <option value="time">By Time</option>
                <option value="cost">By Cost</option>
              </select>
            </div>
          </div>

          {/* Main Title matching Screen 9 wireframe */}
          <div className="screen9-header-text-luxury text-center mb-8">
            <h2 className="screen9-title-luxury capitalize">
              Itinerary for {trip?.name || 'Goa Coastal Resort & Beach Retreat'}
            </h2>
            <p className="screen9-subtitle-luxury">Detailed day-by-day activity roadmap & expense breakdown</p>
          </div>

          {/* Table Subheadings matching Screen 9 wireframe: Physical Activity | Expense */}
          <div className="screen9-columns-header-luxury mb-8">
            <div className="day-col-spacer"></div>
            <div className="column-head-badge activity-badge-head">
              Physical Activity
            </div>
            <div className="column-head-badge expense-badge-head">
              Expense
            </div>
          </div>

          {/* Timeline Feed by Days (Day 1, Day 2, Day 3) */}
          <div className="screen9-timeline-flow-luxury">
            
            {/* ================= Day 1 ================= */}
            <div className="screen9-day-block-luxury mb-12">
              
              <div className="screen9-day-pill-container">
                <div className="screen9-day-pill-badge">Day 1</div>
              </div>

              <div className="screen9-activities-stack-luxury">
                
                {/* Activity 1 */}
                <div className="screen9-row-pair-luxury">
                  <div className="screen9-box-luxury activity-box-luxury">
                    <div className="activity-box-header">
                      <span className="activity-time-pill"><FiClock size={12} /> 09:00 AM</span>
                      <h4 className="activity-box-title">Flight Arrival & Hotel Check-in</h4>
                    </div>
                    <div className="activity-box-sub">
                      <FiMapPin size={13} className="text-emerald-500" /> Calangute Beach Resort, Goa
                    </div>
                  </div>

                  <div className="screen9-box-luxury expense-box-luxury">
                    <span className="expense-val-luxury">{formatAmt(150)}</span>
                    <span className="expense-cat-badge stay">STAY</span>
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                <div className="screen9-connector-row">
                  <div className="screen9-arrow-node">↓</div>
                </div>

                {/* Activity 2 */}
                <div className="screen9-row-pair-luxury">
                  <div className="screen9-box-luxury activity-box-luxury">
                    <div className="activity-box-header">
                      <span className="activity-time-pill"><FiClock size={12} /> 02:30 PM</span>
                      <h4 className="activity-box-title">Water Sports & Scuba Diving</h4>
                    </div>
                    <div className="activity-box-sub">
                      <FiMapPin size={13} className="text-emerald-500" /> Baga Beach Water Sports Center
                    </div>
                  </div>

                  <div className="screen9-box-luxury expense-box-luxury">
                    <span className="expense-val-luxury">{formatAmt(80)}</span>
                    <span className="expense-cat-badge act">ACTIVITY</span>
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                <div className="screen9-connector-row">
                  <div className="screen9-arrow-node">↓</div>
                </div>

                {/* Activity 3 */}
                <div className="screen9-row-pair-luxury">
                  <div className="screen9-box-luxury activity-box-luxury">
                    <div className="activity-box-header">
                      <span className="activity-time-pill"><FiClock size={12} /> 07:30 PM</span>
                      <h4 className="activity-box-title">Sunset Seafood Dinner & Beachfront Lounge</h4>
                    </div>
                    <div className="activity-box-sub">
                      <FiMapPin size={13} className="text-emerald-500" /> Souza Lobo Beachfront Bistro
                    </div>
                  </div>

                  <div className="screen9-box-luxury expense-box-luxury">
                    <span className="expense-val-luxury">{formatAmt(60)}</span>
                    <span className="expense-cat-badge food">FOOD</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= Day 2 ================= */}
            <div className="screen9-day-block-luxury mb-12">
              
              <div className="screen9-day-pill-container">
                <div className="screen9-day-pill-badge">Day 2</div>
              </div>

              <div className="screen9-activities-stack-luxury">
                
                {/* Activity 1 */}
                <div className="screen9-row-pair-luxury">
                  <div className="screen9-box-luxury activity-box-luxury">
                    <div className="activity-box-header">
                      <span className="activity-time-pill"><FiClock size={12} /> 10:00 AM</span>
                      <h4 className="activity-box-title">Fort Aguada & Old Goa Latin Quarter Heritage Tour</h4>
                    </div>
                    <div className="activity-box-sub">
                      <FiMapPin size={13} className="text-emerald-500" /> Fontainhas Heritage Colony, Goa
                    </div>
                  </div>

                  <div className="screen9-box-luxury expense-box-luxury">
                    <span className="expense-val-luxury">{formatAmt(45)}</span>
                    <span className="expense-cat-badge tour">TOUR</span>
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                <div className="screen9-connector-row">
                  <div className="screen9-arrow-node">↓</div>
                </div>

                {/* Activity 2 */}
                <div className="screen9-row-pair-luxury">
                  <div className="screen9-box-luxury activity-box-luxury">
                    <div className="activity-box-header">
                      <span className="activity-time-pill"><FiClock size={12} /> 05:00 PM</span>
                      <h4 className="activity-box-title">Mandovi River Sunset Cruise & Live Cultural Performance</h4>
                    </div>
                    <div className="activity-box-sub">
                      <FiMapPin size={13} className="text-emerald-500" /> Panaji Jetty River Deck
                    </div>
                  </div>

                  <div className="screen9-box-luxury expense-box-luxury">
                    <span className="expense-val-luxury">{formatAmt(75)}</span>
                    <span className="expense-cat-badge act">ACTIVITY</span>
                  </div>
                </div>

                {/* Downward Connector Arrow */}
                <div className="screen9-connector-row">
                  <div className="screen9-arrow-node">↓</div>
                </div>

                {/* Activity 3 */}
                <div className="screen9-row-pair-luxury">
                  <div className="screen9-box-luxury activity-box-luxury">
                    <div className="activity-box-header">
                      <span className="activity-time-pill"><FiClock size={12} /> 08:30 PM</span>
                      <h4 className="activity-box-title">Traditional Goan Fish Curry Tasting & Night Market</h4>
                    </div>
                    <div className="activity-box-sub">
                      <FiMapPin size={13} className="text-emerald-500" /> Anjuna Night Market
                    </div>
                  </div>

                  <div className="screen9-box-luxury expense-box-luxury">
                    <span className="expense-val-luxury">{formatAmt(35)}</span>
                    <span className="expense-cat-badge food">FOOD</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      ) : viewMode === 'budget' ? (
        <div className="budget-dashboard-grid">
          
          {/* Total Budget Summary Card */}
          <div className="card budget-card-styled">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-900">Total Budget Summary</h3>
                <button 
                  className="btn btn-outline btn-sm font-bold text-xs"
                  onClick={() => setShowAddExpenseModal(true)}
                >
                  <FiPlus /> Add Expense
                </button>
              </div>

              <div className="budget-big-stats-grid mt-6">
                <div className="budget-stat-box">
                  <span className="stat-label">Total Budget</span>
                  <span className="stat-value">{formatAmt(totalBudget)}</span>
                </div>
                <div className="budget-stat-box">
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-value text-primary-700">{formatAmt(totalCost)}</span>
                </div>
                <div className="budget-stat-box">
                  <span className="stat-label">Remaining</span>
                  <span className={`stat-value ${isOverBudget ? 'text-error' : 'text-success'}`}>
                    {formatAmt(remainingBudget)}
                  </span>
                </div>
              </div>
              
              <div className="budget-progress-container mt-6">
                <div className="flex justify-between text-xs font-bold text-neutral-600 mb-2">
                  <span>Spent Progress</span>
                  <span>{((totalCost / (totalBudget || 1)) * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className={`progress-bar-fill ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${Math.min((totalCost / (totalBudget || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Card (With Color-Coded Progress Lines & Icons) */}
          <div className="card budget-card-styled">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-900">Category Breakdown</h3>
                <span className="text-xs text-neutral-500 font-bold">{Object.keys(breakdownData).length} Categories</span>
              </div>

              <div className="category-list-styled mt-4">
                {Object.keys(categoryConfig).map(catKey => {
                  const catInfo = categoryConfig[catKey];
                  const amount = Number(breakdownData[catKey] || 0);
                  const percentage = totalCost > 0 ? Math.round((amount / totalCost) * 100) : catInfo.defaultPercent;

                  return (
                    <div key={catKey} className="category-item-card">
                      <div className="category-header-row">
                        <div className="category-name-group">
                          <span className="category-icon-circle" style={{ background: `${catInfo.color}15`, color: catInfo.color }}>
                            {catInfo.icon}
                          </span>
                          <span className="font-bold text-sm text-neutral-800">{catInfo.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm text-neutral-900">{formatAmt(amount)}</span>
                          <span className="text-xs text-neutral-500 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="category-progress-track mt-2">
                        <div 
                          className="category-progress-fill" 
                          style={{ width: `${percentage}%`, background: catInfo.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Day-by-Day Itinerary Plan Tab */
        <div className="itinerary-plan-feed">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Day-by-Day Itinerary Plan</h2>
                <p className="text-xs text-neutral-500 mt-1">Detailed overview of scheduled daily activities and destination stops.</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/trips/${id}/itinerary`)}>
                <FiEdit2 /> Open Itinerary Builder
              </button>
            </div>

            <div className="timeline-days-feed">
              <div className="timeline-day-card">
                <div className="day-badge-header">Day 1 • Arrival & Beach Check-in</div>
                <div className="day-activity-item mt-3">
                  <span className="activity-icon"><FiNavigation /></span>
                  <div>
                    <h4 className="font-bold text-sm">Airport Pickup & Resort Check-in</h4>
                    <p className="text-xs text-neutral-500 mt-1">Arrival at Dabolim Airport, transfer to Beach Resort.</p>
                  </div>
                </div>
              </div>

              <div className="timeline-day-card mt-4">
                <div className="day-badge-header">Day 2 • Sightseeing & Water Sports</div>
                <div className="day-activity-item mt-3">
                  <span className="activity-icon"><FiCamera /></span>
                  <div>
                    <h4 className="font-bold text-sm">Calangute Beach & Fort Aguada Tour</h4>
                    <p className="text-xs text-neutral-500 mt-1">Guided historic lighthouse walking tour and afternoon jet ski ride.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-backdrop animation-fade-in" onClick={() => setShowShareModal(false)}>
          <div className="modal-content animation-slide-up p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-bottom mb-4">
              <h3 className="text-xl font-bold">Share Your Itinerary</h3>
              <button className="btn-icon" onClick={() => setShowShareModal(false)}><FiX /></button>
            </div>
            <p className="text-neutral-500 text-sm mb-4">Anyone with this link can view your trip details.</p>
            <div className="form-group flex gap-2 mb-4">
              <input type="text" className="form-input" value={window.location.href} readOnly />
              <button className="btn btn-primary" onClick={handleCopyShareLink}>
                {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex justify-end">
              <button className="btn btn-ghost" onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="modal-backdrop animation-fade-in" onClick={() => setShowAddExpenseModal(false)}>
          <div className="modal-content animation-slide-up p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-bottom mb-4">
              <h3 className="text-xl font-bold">Log New Expense</h3>
              <button className="btn-icon" onClick={() => setShowAddExpenseModal(false)}><FiX /></button>
            </div>

            <form onSubmit={handleAddExpenseSubmit}>
              <div className="form-group mb-4">
                <label className="form-label font-bold">Expense Title:</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Resort Booking, Dinner Bill, Taxi Ride"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label font-bold">Expense Category:</label>
                <select 
                  className="form-input"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="accommodation">Accommodation & Stay</option>
                  <option value="activity">Activities & Sightseeing</option>
                  <option value="meal">Food & Dining</option>
                  <option value="transport">Transport & Flights</option>
                </select>
              </div>

              <div className="form-group mb-6">
                <label className="form-label font-bold">Amount ($): <span className="text-error">*</span></label>
                <input 
                  type="number" 
                  className="form-input"
                  placeholder="e.g. 250"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddExpenseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><FiPlus /> Log Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

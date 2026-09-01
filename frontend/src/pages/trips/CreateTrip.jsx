import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiCheck, FiSave, FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiCompass, FiZap, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI, destinationsAPI, activitiesAPI } from '../../services/api';
import './CreateTrip.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    startingLocation: '',
    start_date: '',
    end_date: '',
    description: '',
    budget_limit: '2500',
    traveler_count: '1',
    visibility: 'private',
    cover_image: '',
    travel_style: 'cultural',
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  // Pre-fill from URL params or location state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regionParam = params.get('region') || params.get('destination') || location.state?.region;
    const imageParam = params.get('image') || location.state?.image;
    const budgetParam = params.get('budget') || location.state?.budget;

    if (regionParam || imageParam || budgetParam) {
      setFormData(prev => ({
        ...prev,
        title: prev.title || (regionParam ? `Expedition to ${regionParam}` : ''),
        startingLocation: prev.startingLocation || regionParam || '',
        cover_image: prev.cover_image || imageParam || '',
        budget_limit: prev.budget_limit || budgetParam || '2500',
      }));
    }
  }, [location]);

  const loadSuggestions = useCallback(async () => {
    try {
      setLoadingSuggestions(true);
      const [dRes, aRes] = await Promise.all([
        destinationsAPI.search({ limit: 4 }).catch(() => ({ data: [] })),
        activitiesAPI.search({ limit: 4 }).catch(() => ({ data: [] }))
      ]);

      const places = (dRes.data || []).slice(0, 3).map(p => ({
        id: `dest-${p.id}`,
        title: p.name,
        subtitle: p.country,
        type: 'Destination',
        image: p.image_url || '/images/trip_paris_1787378563287.jpg',
        meta: `${p.recommended_days || 3} Days • ${p.cost_level || 'Moderate'}`
      }));

      const acts = (aRes.data || []).slice(0, 3).map(a => ({
        id: `act-${a.id}`,
        title: a.name,
        subtitle: a.category || 'Activity',
        type: 'Activity',
        image: a.image_url || '/images/trip_tokyo_1787378579161.jpg',
        meta: `${a.duration_hours || 2}h • $${a.estimated_cost || 0}`
      }));

      const combined = [...places, ...acts];

      if (combined.length === 0) {
        setSuggestions([
          { id: 1, title: 'Kyoto, Japan', subtitle: 'Historic Shrines & Bamboo Groves', type: 'Destination', image: '/images/region_asia_1787378514027.jpg', meta: '6 Days • Cultural' },
          { id: 2, title: 'Paris, France', subtitle: 'Art, Architecture & Gastronomy', type: 'Destination', image: '/images/trip_paris_1787378563287.jpg', meta: '5 Days • Iconic' },
          { id: 3, title: 'Swiss Alps, Switzerland', subtitle: 'Glacier Express & Mountain Passes', type: 'Destination', image: '/images/region_europe_1787378498140.jpg', meta: '7 Days • Alpine' },
          { id: 4, title: 'Bali, Indonesia', subtitle: 'Tropical Temples & Ocean Retreat', type: 'Destination', image: '/images/trip_bali_1787378598373.jpg', meta: '8 Days • Relax' },
        ]);
      } else {
        setSuggestions(combined);
      }
    } catch {
      setSuggestions([
        { id: 1, title: 'Kyoto, Japan', subtitle: 'Historic Shrines & Bamboo Groves', type: 'Destination', image: '/images/region_asia_1787378514027.jpg', meta: '6 Days • Cultural' },
        { id: 2, title: 'Paris, France', subtitle: 'Art, Architecture & Gastronomy', type: 'Destination', image: '/images/trip_paris_1787378563287.jpg', meta: '5 Days • Iconic' },
        { id: 3, title: 'Swiss Alps, Switzerland', subtitle: 'Glacier Express & Mountain Passes', type: 'Destination', image: '/images/region_europe_1787378498140.jpg', meta: '7 Days • Alpine' },
        { id: 4, title: 'Bali, Indonesia', subtitle: 'Tropical Temples & Ocean Retreat', type: 'Destination', image: '/images/trip_bali_1787378598373.jpg', meta: '8 Days • Relax' },
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectSuggestion = (item) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || `Expedition to ${item.title}`,
      startingLocation: item.title,
      cover_image: item.image || prev.cover_image
    }));
    toast.success(`Selected "${item.title}"`);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Expedition name is required';
    if (!formData.startingLocation.trim()) newErrors.startingLocation = 'Destination is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, isDraft = false) => {
    if (e) e.preventDefault();
    if (!isDraft && !validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.title,
        startingLocation: formData.startingLocation,
        startDate: formData.start_date,
        endDate: formData.end_date,
        description: formData.description,
        budget: formData.budget_limit ? Number(formData.budget_limit) : null,
        travelerCount: formData.traveler_count ? Number(formData.traveler_count) : 1,
        visibility: formData.visibility,
        coverImage: formData.cover_image || null,
        status: isDraft ? 'draft' : 'upcoming'
      };

      const res = await tripsAPI.create(payload);
      toast.success(isDraft ? 'Draft expedition saved!' : 'Expedition created successfully!');
      navigate(`/trips/${res.data.id}/itinerary`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to initialize expedition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const travelThemes = [
    { id: 'cultural', label: 'Cultural & Heritage', icon: '🏛️' },
    { id: 'luxury', label: 'Luxury & Wellness', icon: '💎' },
    { id: 'alpine', label: 'Alpine & Hiking', icon: '⛰️' },
    { id: 'coastal', label: 'Coastal & Island', icon: '🏖️' },
    { id: 'culinary', label: 'Gastronomy & Wine', icon: '🍜' },
  ];

  return (
    <div className="trip-studio-page page-container">
      
      {/* Studio Header */}
      <div className="studio-header-bar">
        <Link to="/my-trips" className="btn btn-ghost btn-sm studio-back-btn">
          <FiArrowLeft /> Back to Expedition Queue
        </Link>
        <div>
          <h1 className="studio-page-title">Expedition Architecture Studio</h1>
          <p className="studio-page-subtitle">Configure destination coordinates, scheduling timeline, and group logistics.</p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="studio-grid mt-6">
        
        {/* Left Column: Multi-Step Interactive Form */}
        <div className="card studio-builder-card">
          
          {/* Step Progress Header */}
          <div className="studio-step-tracker">
            <div className={`step-node ${currentStep >= 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
              <span className="step-num">01</span>
              <span className="step-label">Destination & Theme</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${currentStep >= 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
              <span className="step-num">02</span>
              <span className="step-label">Schedule & Duration</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${currentStep >= 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
              <span className="step-num">03</span>
              <span className="step-label">Budget & Travelers</span>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e, false)} className="studio-form-body">
            
            {/* Step 1: Destination & Theme */}
            {currentStep === 1 && (
              <div className="studio-step-content animate-fade-in">
                <h3 className="step-heading">Step 1: Destination & Expedition Name</h3>
                
                <div className="form-group mt-4">
                  <label className="form-label">
                    Expedition Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. Kyoto Cultural Trail 2026 or Swiss Alpine Expedition"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Destination City / Country <span className="required">*</span>
                  </label>
                  <div className="input-icon-wrap">
                    <input
                      type="text"
                      name="startingLocation"
                      className={`form-input ${errors.startingLocation ? 'error' : ''}`}
                      placeholder="e.g. Kyoto, Japan or Paris, France"
                      value={formData.startingLocation}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.startingLocation && <span className="form-error">{errors.startingLocation}</span>}
                </div>

                {/* Travel Theme Pills */}
                <div className="form-group mt-4">
                  <label className="form-label">Select Expedition Theme</label>
                  <div className="theme-pills-grid">
                    {travelThemes.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`theme-pill-btn ${formData.travel_style === t.id ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, travel_style: t.id })}
                      >
                        <span className="theme-pill-icon">{t.icon}</span>
                        <span className="theme-pill-text">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="step-actions-footer mt-6">
                  <div></div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setCurrentStep(2)}>
                    Continue to Schedule →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule & Duration */}
            {currentStep === 2 && (
              <div className="studio-step-content animate-fade-in">
                <h3 className="step-heading">Step 2: Scheduling & Time Horizon</h3>

                <div className="grid-2 mt-4">
                  <div className="form-group">
                    <label className="form-label">
                      Start Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      className={`form-input ${errors.start_date ? 'error' : ''}`}
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                    {errors.start_date && <span className="form-error">{errors.start_date}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      End Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      className={`form-input ${errors.end_date ? 'error' : ''}`}
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                    {errors.end_date && <span className="form-error">{errors.end_date}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL (Optional)</label>
                  <input
                    type="text"
                    name="cover_image"
                    className="form-input"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.cover_image}
                    onChange={handleChange}
                  />
                </div>

                <div className="step-actions-footer mt-6">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCurrentStep(1)}>
                    ← Back
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setCurrentStep(3)}>
                    Continue to Budget & Logistics →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Budget & Logistics */}
            {currentStep === 3 && (
              <div className="studio-step-content animate-fade-in">
                <h3 className="step-heading">Step 3: Budget Envelope & Travelers</h3>

                <div className="grid-2 mt-4">
                  <div className="form-group">
                    <label className="form-label">Target Financial Budget ($ USD)</label>
                    <input
                      type="number"
                      name="budget_limit"
                      className="form-input"
                      placeholder="e.g. 2500"
                      value={formData.budget_limit}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Traveler Count</label>
                    <input
                      type="number"
                      name="traveler_count"
                      className="form-input"
                      value={formData.traveler_count}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Expedition Visibility</label>
                  <select
                    name="visibility"
                    className="form-select"
                    value={formData.visibility}
                    onChange={handleChange}
                  >
                    <option value="private">Private Workspace (Only You)</option>
                    <option value="public">Public Community Guide</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Expedition Notes / Flight References</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    rows="3"
                    placeholder="Flight codes, hotel preferences, dietary requirements, or key attractions..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="step-actions-footer mt-6">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCurrentStep(2)}>
                    ← Back
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => handleSubmit(e, true)}
                      disabled={isSubmitting}
                    >
                      <FiSave /> Save Draft
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <div className="spinner"></div> : <><FiCheck /> Dispatch Itinerary Studio</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Right Column: Smart Suggestions & Auto-Fill */}
        <div className="studio-suggestions-sidebar">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <FiZap className="text-primary-400" />
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Curated Coordinates</h3>
            </div>
            <p className="text-xs text-muted mb-4">Click any destination below to automatically populate the trip studio.</p>

            <div className="suggestions-stack">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="studio-suggestion-tile"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <img src={item.image} alt={item.title} className="suggestion-thumb" />
                  <div className="suggestion-details">
                    <span className="suggestion-title">{item.title}</span>
                    <span className="suggestion-subtitle">{item.subtitle}</span>
                    <span className="suggestion-meta">{item.meta}</span>
                  </div>
                  <button className="btn-icon" title="Select">
                    <FiPlus size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

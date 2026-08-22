import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiCheck, FiMapPin, FiCalendar, FiCompass, FiPlus, FiDollarSign, FiUsers, FiEye, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI, destinationsAPI, activitiesAPI } from '../../services/api';
import './Trips.css';
import './CreateTrip.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    startingLocation: '',
    start_date: '',
    end_date: '',
    description: '',
    budget_limit: '',
    traveler_count: '1',
    visibility: 'private',
    cover_image: '',
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
        title: prev.title || (regionParam ? `Trip to ${regionParam}` : ''),
        startingLocation: prev.startingLocation || regionParam || '',
        cover_image: prev.cover_image || imageParam || '',
        budget_limit: prev.budget_limit || budgetParam || '',
      }));
    }
  }, [location]);

  // Load 6 suggestions for places to visit / activities
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
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
        type: 'Place to Visit',
        image: p.image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
        meta: `${p.recommended_days || 3} Days • ${p.cost_level || 'Moderate'}`
      }));

      const acts = (aRes.data || []).slice(0, 3).map(a => ({
        id: `act-${a.id}`,
        title: a.name,
        subtitle: a.category || 'Activity',
        type: 'Activity to Perform',
        image: a.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
        meta: `${a.duration_hours || 2}h • $${a.estimated_cost || 0}`
      }));

      const combined = [...places, ...acts];

      if (combined.length === 0) {
        // Fallback default 6 cards
        setSuggestions([
          { id: 1, title: 'Paris', subtitle: 'France', type: 'Place to Visit', image: '/images/trip_paris_1787378563287.jpg', meta: '4 Days • Moderate' },
          { id: 2, title: 'Tokyo', subtitle: 'Japan', type: 'Place to Visit', image: '/images/trip_tokyo_1787378579161.jpg', meta: '5 Days • Moderate' },
          { id: 3, title: 'Bali', subtitle: 'Indonesia', type: 'Place to Visit', image: '/images/trip_bali_1787378598373.jpg', meta: '7 Days • Budget' },
          { id: 4, title: 'Louvre Walking Tour', subtitle: 'Art & Culture', type: 'Activity to Perform', image: 'https://images.unsplash.com/photo-1502602898657-3e90760020c2?w=600&q=80', meta: '3h • $25' },
          { id: 5, title: 'Kyoto Tea Ceremony', subtitle: 'Cultural Experience', type: 'Activity to Perform', image: '/images/region_asia_1787378514027.jpg', meta: '2h • $45' },
          { id: 6, title: 'Grand Canal Gondola', subtitle: 'Sightseeing', type: 'Activity to Perform', image: '/images/region_europe_1787378498140.jpg', meta: '1h • $80' },
        ]);
      } else {
        setSuggestions(combined);
      }
    } catch (err) {
      console.warn('Using default suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

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
      title: prev.title || `Trip to ${item.title}`,
      startingLocation: item.title,
      cover_image: item.image || prev.cover_image
    }));
    toast.success(`Selected "${item.title}" for your trip!`);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Trip name is required';
    if (!formData.startingLocation.trim()) newErrors.startingLocation = 'Place/Destination is required';
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
      toast.success(isDraft ? 'Draft saved!' : 'Trip created successfully!');
      navigate(`/trips/${res.data.id}/itinerary`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-trip-container">
      
      {/* Top Header Controls */}
      <div className="create-trip-header">
        <button className="btn btn-ghost" onClick={() => navigate('/my-trips')}>
          <FiArrowLeft /> Back to Trips
        </button>
        <h1 className="trips-title">Plan a new trip</h1>
        <p className="trips-subtitle">Fill in the details below to create your itinerary.</p>
      </div>

      {/* Main Section 1: Plan a New Trip Form */}
      <div className="card create-trip-card mb-8">
        <div className="card-header border-bottom p-4">
          <h2 className="text-xl font-bold">Plan a new trip</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, false)} className="card-body p-6">
          <div className="form-grid-schema">
            
            {/* Trip Name */}
            <div className="form-group">
              <label className="form-label font-bold">Trip Name: <span className="text-error">*</span></label>
              <input 
                type="text" 
                name="title" 
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Summer Vacation, Kyoto Adventure"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Select a Place */}
            <div className="form-group">
              <label className="form-label font-bold">Select a Place : <span className="text-error">*</span></label>
              <input 
                type="text" 
                name="startingLocation" 
                className={`form-input ${errors.startingLocation ? 'error' : ''}`}
                placeholder="e.g. Paris, Tokyo, New York"
                value={formData.startingLocation}
                onChange={handleChange}
              />
              {errors.startingLocation && <span className="form-error">{errors.startingLocation}</span>}
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="form-label font-bold">Start Date: <span className="text-error">*</span></label>
              <input 
                type="date" 
                name="start_date" 
                className={`form-input ${errors.start_date ? 'error' : ''}`}
                value={formData.start_date}
                onChange={handleChange}
              />
              {errors.start_date && <span className="form-error">{errors.start_date}</span>}
            </div>

            {/* End Date */}
            <div className="form-group">
              <label className="form-label font-bold">End Date: <span className="text-error">*</span></label>
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

          {/* Collapsible Additional Details */}
          <details className="additional-details-accordion mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-neutral-600 hover:text-primary-600">
              + Optional Details (Budget, Travelers, Cover Image, Visibility)
            </summary>
            
            <div className="form-grid-schema mt-4 p-4 bg-neutral-50 rounded-lg">
              <div className="form-group">
                <label className="form-label">Budget Limit ($)</label>
                <input 
                  type="number" 
                  name="budget_limit" 
                  className="form-input" 
                  placeholder="e.g. 2000" 
                  value={formData.budget_limit} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Travelers</label>
                <input 
                  type="number" 
                  name="traveler_count" 
                  className="form-input" 
                  value={formData.traveler_count} 
                  onChange={handleChange} 
                  min="1" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input 
                  type="text" 
                  name="cover_image" 
                  className="form-input" 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.cover_image} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visibility</label>
                <select name="visibility" className="form-input" value={formData.visibility} onChange={handleChange}>
                  <option value="private">Private</option>
                  <option value="public">Public Community</option>
                </select>
              </div>
            </div>
          </details>

          {/* Form Submit Action Buttons */}
          <div className="form-actions-row mt-6">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
            >
              <FiSave /> Save Draft
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <div className="spinner"></div> : <><FiCheck /> Create Trip</>}
            </button>
          </div>

        </form>
      </div>

      {/* Main Section 2: Suggestion for Places to Visit / Activities to perform */}
      <div className="suggestions-container">
        <h2 className="suggestions-title border-bottom pb-3 mb-6">
          Suggestion for Places to Visit/Activities to perform
        </h2>

        {loadingSuggestions ? (
          <div className="text-center p-8 text-neutral-500">Loading suggestions...</div>
        ) : (
          <div className="suggestions-grid">
            {suggestions.map((item) => (
              <div 
                key={item.id} 
                className="card suggestion-card"
                onClick={() => handleSelectSuggestion(item)}
                title={`Select ${item.title}`}
              >
                <div className="suggestion-img-wrapper">
                  <img src={item.image} alt={item.title} className="suggestion-img" />
                  <span className="badge badge-accent suggestion-badge">{item.type}</span>
                </div>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-bold">{item.title}</h3>
                  <p className="text-xs text-neutral-500">{item.subtitle}</p>
                  <div className="suggestion-meta-row mt-3">
                    <span className="text-xs font-semibold text-neutral-600">{item.meta}</span>
                    <button className="btn btn-xs btn-primary select-btn">
                      <FiPlus /> Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .form-grid-schema {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .form-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
        }

        .suggestions-container {
          margin-top: var(--space-8);
        }

        .suggestions-title {
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          color: var(--neutral-900);
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }

        .suggestion-card {
          cursor: pointer;
          transition: transform 200ms ease, box-shadow 200ms ease;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--neutral-0);
          border: 1px solid var(--neutral-200);
        }

        .suggestion-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-400);
        }

        .suggestion-img-wrapper {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .suggestion-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 300ms ease;
        }

        .suggestion-card:hover .suggestion-img {
          transform: scale(1.06);
        }

        .suggestion-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 10px;
          text-transform: uppercase;
        }

        .suggestion-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .select-btn {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 900px) {
          .suggestions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .form-grid-schema {
            grid-template-columns: 1fr;
          }
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiSave, FiCheck, FiMap, FiCalendar, FiDollarSign, FiEye, FiUsers, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import './Trips.css';
import './CreateTrip.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Trip name is required';
      if (!formData.startingLocation.trim()) newErrors.startingLocation = 'Starting location is required';
      if (!formData.start_date) newErrors.start_date = 'Start date is required';
      if (!formData.end_date) newErrors.end_date = 'End date is required';
      if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    } else if (step === 2) {
      if (formData.budget_limit && (isNaN(formData.budget_limit) || Number(formData.budget_limit) < 0)) {
        newErrors.budget_limit = 'Budget must be a valid positive number';
      }
      if (formData.traveler_count && (isNaN(formData.traveler_count) || Number(formData.traveler_count) < 1)) {
        newErrors.traveler_count = 'Traveler count must be at least 1';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e, isDraft = false) => {
    if (e) e.preventDefault();
    if (!isDraft && !validateStep()) return;

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
      
      // Redirect to itinerary builder
      navigate(`/trips/${res.data.id}/itinerary`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-header">
        <button className="btn btn-ghost" onClick={() => navigate('/my-trips')}>
          <FiArrowLeft /> Back to Trips
        </button>
        <h1 className="trips-title">Plan a New Trip</h1>
        <p className="trips-subtitle">Follow the steps below to set up your next adventure.</p>
      </div>

      <div className="stepper">
        {[
          { num: 1, label: 'Basic Info', icon: <FiMap /> },
          { num: 2, label: 'Details', icon: <FiDollarSign /> },
          { num: 3, label: 'Review', icon: <FiCheck /> }
        ].map((s) => (
          <div key={s.num} className={`step ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
            <div className="step-circle">{s.num}</div>
            <div className="step-label">{s.label}</div>
            {s.num < 3 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      <div className="card create-trip-card">
        <div className="card-body">
          {/* Step 1: Info & Dates */}
          {step === 1 && (
            <div className="step-content animation-slide-up">
              <h2>Trip Basics</h2>
              <p className="form-hint">Where are you going and when?</p>
              
              <div className="form-group mt-6">
                <label className="form-label">Trip Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="title" 
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g., Summer in Kyoto, Eurotrip 2026..."
                  value={formData.title}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group mt-4">
                <label className="form-label">Starting Location <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="startingLocation" 
                  className={`form-input ${errors.startingLocation ? 'error' : ''}`}
                  placeholder="e.g., New York, JFK Airport"
                  value={formData.startingLocation}
                  onChange={handleChange}
                />
                {errors.startingLocation && <span className="form-error">{errors.startingLocation}</span>}
              </div>

              <div className="auth-form-row mt-4">
                <div className="form-group">
                  <label className="form-label">Start Date <span className="required">*</span></label>
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
                  <label className="form-label">End Date <span className="required">*</span></label>
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

              <div className="form-group mt-4">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  name="description" 
                  className="form-input form-textarea"
                  placeholder="What is the main goal or vibe of this trip?"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget, Travelers & Visibility */}
          {step === 2 && (
            <div className="step-content animation-slide-up">
              <h2>Additional Details</h2>
              <p className="form-hint">Set limits, companions, and decide who can see this trip.</p>
              
              <div className="auth-form-row mt-6">
                <div className="form-group">
                  <label className="form-label">Total Budget Limit (Optional)</label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      name="budget_limit" 
                      className={`form-input ${errors.budget_limit ? 'error' : ''}`}
                      placeholder="e.g., 2000"
                      value={formData.budget_limit}
                      onChange={handleChange}
                      style={{ paddingLeft: '32px' }}
                      autoFocus
                    />
                    <span style={{ position: 'absolute', left: '12px', color: 'var(--neutral-500)' }}>$</span>
                  </div>
                  {errors.budget_limit && <span className="form-error">{errors.budget_limit}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Travelers</label>
                  <div className="input-group">
                    <FiUsers style={{ position: 'absolute', left: '12px', color: 'var(--neutral-500)' }} />
                    <input 
                      type="number" 
                      name="traveler_count" 
                      className={`form-input ${errors.traveler_count ? 'error' : ''}`}
                      placeholder="e.g., 2"
                      value={formData.traveler_count}
                      onChange={handleChange}
                      style={{ paddingLeft: '32px' }}
                      min="1"
                    />
                  </div>
                  {errors.traveler_count && <span className="form-error">{errors.traveler_count}</span>}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label">Cover Image URL (Optional)</label>
                <div className="input-group">
                  <FiImage style={{ position: 'absolute', left: '12px', color: 'var(--neutral-500)' }} />
                  <input 
                    type="text" 
                    name="cover_image" 
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    value={formData.cover_image}
                    onChange={handleChange}
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>

              <div className="form-group mt-6">
                <label className="form-label">Visibility</label>
                <div className="visibility-options">
                  <label className={`visibility-card ${formData.visibility === 'private' ? 'selected' : ''}`}>
                    <input type="radio" name="visibility" value="private" checked={formData.visibility === 'private'} onChange={handleChange} />
                    <div className="visibility-icon"><FiEye strokeWidth={formData.visibility === 'private' ? 3 : 2}/></div>
                    <div className="visibility-text">
                      <h4>Private</h4>
                      <p>Only you and people you invite can see this trip.</p>
                    </div>
                  </label>
                  <label className={`visibility-card ${formData.visibility === 'public' ? 'selected' : ''}`}>
                    <input type="radio" name="visibility" value="public" checked={formData.visibility === 'public'} onChange={handleChange} />
                    <div className="visibility-icon">🌍</div>
                    <div className="visibility-text">
                      <h4>Public Community</h4>
                      <p>Share your itinerary with the GlobeTrotter community.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="step-content animation-slide-up">
              <h2>Review Your Trip</h2>
              <p className="form-hint">Make sure everything looks good before creating.</p>
              
              <div className="review-box mt-6">
                <div className="review-item">
                  <span className="review-label">Trip Name</span>
                  <span className="review-value">{formData.title}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Starting Location</span>
                  <span className="review-value">{formData.startingLocation}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Dates</span>
                  <span className="review-value">
                    {formData.start_date} to {formData.end_date}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Travelers</span>
                  <span className="review-value">{formData.traveler_count}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Budget</span>
                  <span className="review-value">
                    {formData.budget_limit ? `$${formData.budget_limit}` : 'No limit set'}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Visibility</span>
                  <span className="review-value" style={{ textTransform: 'capitalize' }}>{formData.visibility}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-footer create-trip-footer">
          <div className="footer-left">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                Back
              </button>
            )}
          </div>
          <div className="footer-right">
            <button className="btn btn-ghost" onClick={() => handleSubmit(null, true)} disabled={isSubmitting}>
              <FiSave /> Save Draft
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Continue <FiArrowRight />
              </button>
            ) : (
              <button className="btn btn-accent" onClick={() => handleSubmit(null, false)} disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner"></div> : <><FiCheck /> Create Trip</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

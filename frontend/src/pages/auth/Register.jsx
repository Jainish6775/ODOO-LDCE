import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import '../../../src/components/layout/AppLayout.css';

const TRAVEL_INTERESTS = [
  'Adventure', 'Cultural', 'Relaxation', 'Budget', 'Luxury',
  'Foodie', 'Nature', 'Nightlife', 'Photography', 'History',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    country: '',
    bio: '',
    interests: [],
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return { level: 0, text: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 2) return { level: 1, text: 'Weak', color: 'weak' };
    if (score <= 3) return { level: 2, text: 'Medium', color: 'medium' };
    return { level: 3, text: 'Strong', color: 'strong' };
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the terms';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        bio: formData.bio || undefined,
        interests: formData.interests.length > 0 ? formData.interests : undefined,
      });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-layout">
      {/* Left Hero */}
      <div className="auth-hero hide-mobile">
        <div className="auth-hero-content">
          <div className="auth-hero-badge">
            <span className="auth-hero-badge-dot"></span>
            <span>Join GlobeTrotter Today</span>
          </div>
          <h1 className="auth-hero-title mt-4">Start Your Adventure</h1>
          <p className="auth-hero-subtitle">
            Join thousands of travelers building beautiful itineraries, discovering hidden gems, and sharing journeys.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-logo">
            <img src="/logo.jpg" alt="GlobeTrotter" style={{ height: '48px', width: '48px', borderRadius: '10px', objectFit: 'cover' }} />
            <span className="auth-form-logo-text">GlobeTrotter</span>
          </div>

          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-subtitle">Fill in your details to get started</p>

          {error && (
            <div className="alert alert-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Group A: Account Information */}
            <div className="form-section">
              <h4 className="form-section-title">Account Information</h4>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {fieldErrors.email && <span className="form-error"><FiAlertCircle /> {fieldErrors.email}</span>}
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password <span className="required">*</span>
                </label>
                <div className="input-group">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button type="button" className="input-icon" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && (
                  <>
                    <div className="password-strength">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`password-strength-bar ${i <= strength.level ? strength.color : ''}`}></div>
                      ))}
                    </div>
                    <span className={`form-hint password-strength-text`}>{strength.text}</span>
                  </>
                )}
                {fieldErrors.password && <span className="form-error"><FiAlertCircle /> {fieldErrors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="input-group">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button type="button" className="input-icon" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <span className="form-error"><FiAlertCircle /> {fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            {/* Group B: Personal Information */}
            <div className="form-section">
              <h4 className="form-section-title">Personal Information</h4>
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-first">
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="reg-first"
                  type="text"
                  name="firstName"
                  className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {fieldErrors.firstName && <span className="form-error"><FiAlertCircle /> {fieldErrors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-last">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="reg-last"
                  type="text"
                  name="lastName"
                  className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {fieldErrors.lastName && <span className="form-error"><FiAlertCircle /> {fieldErrors.lastName}</span>}
              </div>
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-country">Country</label>
                <input
                  id="reg-country"
                  type="text"
                  name="country"
                  className="form-input"
                  placeholder="India"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-city">City</label>
              <input
                id="reg-city"
                type="text"
                name="city"
                className="form-input"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            {/* Group C: Travel Preferences (collapsible) */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowPreferences(!showPreferences)}
              style={{ alignSelf: 'flex-start' }}
            >
              {showPreferences ? '▾' : '▸'} Travel Preferences (Optional)
            </button>

            {showPreferences && (
              <>
                <div className="form-group">
                  <label className="form-label">Travel Interests</label>
                  <div className="interest-tags">
                    {TRAVEL_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {formData.interests.includes(interest) && <FiCheck />}
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-bio">Short Bio</label>
                  <textarea
                    id="reg-bio"
                    name="bio"
                    className="form-input form-textarea"
                    placeholder="Tell us a bit about yourself and your travel style..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Agreement */}
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="agree-terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agree-terms">
                  I agree to the <a href="#terms" className="auth-form-link">Terms of Service</a> and{' '}
                  <a href="#privacy" className="auth-form-link">Privacy Policy</a>
                </label>
              </div>
              {fieldErrors.agreeTerms && <span className="form-error"><FiAlertCircle /> {fieldErrors.agreeTerms}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .interest-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .interest-tag {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          border: 2px solid var(--neutral-200);
          border-radius: var(--radius-full);
          background: var(--neutral-0);
          color: var(--neutral-600);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .interest-tag:hover {
          border-color: var(--primary-300);
          color: var(--primary-700);
        }

        .interest-tag.selected {
          background: var(--primary-50);
          border-color: var(--primary-400);
          color: var(--primary-700);
        }
      `}</style>
    </div>
  );
}

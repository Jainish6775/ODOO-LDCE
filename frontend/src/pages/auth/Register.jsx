import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiCheck, 
  FiMail, 
  FiLock, 
  FiUser, 
  FiPhone, 
  FiGlobe, 
  FiMapPin, 
  FiArrowRight, 
  FiArrowLeft,
  FiShield,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './Auth.css';

const TRAVEL_INTERESTS = [
  { label: 'Adventure', icon: '⛰️' },
  { label: 'Cultural', icon: '🏛️' },
  { label: 'Relaxation', icon: '🧘' },
  { label: 'Budget', icon: '💰' },
  { label: 'Luxury', icon: '✨' },
  { label: 'Foodie', icon: '🍜' },
  { label: 'Nature', icon: '🌿' },
  { label: 'Nightlife', icon: '🍸' },
  { label: 'Photography', icon: '📸' },
  { label: 'History', icon: '📜' },
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
    agreeTerms: true,
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

  const toggleInterest = (interestName) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestName)
        ? prev.interests.filter((i) => i !== interestName)
        : [...prev.interests, interestName],
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
    else if (formData.password.length < 6) errors.password = 'Minimum 6 characters required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to continue';
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
      await register({
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
      toast.success('Account created! Welcome to Wayfare OS.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-page-wrapper">
      
      {/* Top Navigation */}
      <header className="auth-top-nav">
        <Link to="/" className="auth-back-link">
          <FiArrowLeft size={14} /> Back to Home
        </Link>
        <div className="auth-nav-status">
          <span className="auth-nav-dot"></span>
          <span>Wayfare OS • v2.4</span>
        </div>
      </header>

      {/* Centered Glassmorphic Card */}
      <div className="auth-centered-container register-mode">
        <div className="auth-glass-card">
          
          {/* Header */}
          <div className="auth-card-header">
            <Link to="/" className="auth-logo-badge">
              <img src="/logo.jpg" alt="Wayfare" className="auth-logo-img" />
              <div className="auth-logo-title">
                Wayfare <span className="auth-os-tag">OS</span>
              </div>
            </Link>
            <h1 className="auth-card-title">Create Account</h1>
            <p className="auth-card-subtitle">
              Join thousands of travelers planning, budgeting, and discovering world destinations.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs-row">
            <Link to="/login" className="auth-tab-btn">
              Sign In
            </Link>
            <button type="button" className="auth-tab-btn active">
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Name Row */}
            <div className="grid-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-first">
                  First Name <span className="text-error">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <FiUser className="auth-input-icon" size={15} />
                  <input
                    id="reg-first"
                    type="text"
                    name="firstName"
                    className={`auth-form-input ${fieldErrors.firstName ? 'error' : ''}`}
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.firstName && <span className="text-xs text-error mt-1">{fieldErrors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-last">
                  Last Name <span className="text-error">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <FiUser className="auth-input-icon" size={15} />
                  <input
                    id="reg-last"
                    type="text"
                    name="lastName"
                    className={`auth-form-input ${fieldErrors.lastName ? 'error' : ''}`}
                    placeholder="Morgan"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.lastName && <span className="text-xs text-error mt-1">{fieldErrors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="auth-input-wrapper">
                <FiMail className="auth-input-icon" size={15} />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  className={`auth-form-input ${fieldErrors.email ? 'error' : ''}`}
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && <span className="text-xs text-error mt-1">{fieldErrors.email}</span>}
            </div>

            {/* Password Row */}
            <div className="grid-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password <span className="text-error">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" size={15} />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`auth-form-input ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="pwd-meter-box">
                    <div className="pwd-meter-bars">
                      <div className={`pwd-bar ${strength.level >= 1 ? strength.color : ''}`}></div>
                      <div className={`pwd-bar ${strength.level >= 2 ? strength.color : ''}`}></div>
                      <div className={`pwd-bar ${strength.level >= 3 ? strength.color : ''}`}></div>
                    </div>
                    <span className={`pwd-strength-label ${strength.color}`}>{strength.text}</span>
                  </div>
                )}
                {fieldErrors.password && <span className="text-xs text-error mt-1">{fieldErrors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" size={15} />
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`auth-form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <span className="text-xs text-error mt-1">{fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            {/* Location Row */}
            <div className="grid-3 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone</label>
                <div className="auth-input-wrapper">
                  <FiPhone className="auth-input-icon" size={14} />
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    className="auth-form-input"
                    placeholder="+1 (555)..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-country">Country</label>
                <div className="auth-input-wrapper">
                  <FiGlobe className="auth-input-icon" size={14} />
                  <input
                    id="reg-country"
                    type="text"
                    name="country"
                    className="auth-form-input"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-city">City</label>
                <div className="auth-input-wrapper">
                  <FiMapPin className="auth-input-icon" size={14} />
                  <input
                    id="reg-city"
                    type="text"
                    name="city"
                    className="auth-form-input"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Travel Passions (Optional Accordion) */}
            <div>
              <button
                type="button"
                className="auth-accordion-btn"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                {showPreferences ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                <span>{showPreferences ? 'Hide Travel Preferences' : 'Add Travel Interests & Bio (Optional)'}</span>
              </button>
            </div>

            {showPreferences && (
              <div className="flex flex-col gap-3 p-3 card" style={{ background: 'rgba(7, 9, 14, 0.6)' }}>
                <div className="form-group">
                  <label className="form-label mb-2">Select Your Travel Passions</label>
                  <div className="auth-interest-chips">
                    {TRAVEL_INTERESTS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`auth-interest-chip ${formData.interests.includes(item.label) ? 'selected' : ''}`}
                        onClick={() => toggleInterest(item.label)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                        {formData.interests.includes(item.label) && <FiCheck size={11} className="text-primary-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-bio">Short Explorer Bio</label>
                  <textarea
                    id="reg-bio"
                    name="bio"
                    className="auth-form-input"
                    style={{ height: '65px', resize: 'vertical' }}
                    placeholder="Share a few words about your travel style..."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Agreement Checkbox */}
            <div className="form-group">
              <label className="checkbox-group cursor-pointer">
                <input
                  type="checkbox"
                  id="agree-terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className="text-xs text-secondary">
                  I agree to the <a href="#terms" className="text-primary-400 underline">Terms</a> and <a href="#privacy" className="text-primary-400 underline">Privacy Policy</a>
                </span>
              </label>
              {fieldErrors.agreeTerms && <span className="text-xs text-error mt-1">{fieldErrors.agreeTerms}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              style={{ marginTop: 'var(--space-1)' }}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  Create Account & Launch <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            <div className="text-xs text-muted">
              Already have an account? <Link to="/login" className="text-primary-400 font-bold hover:underline">Sign in</Link>
            </div>
            <div className="auth-security-badge">
              <FiShield size={12} className="text-primary-400" />
              <span>256-bit SSL encrypted • Private & Secure</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiMail, 
  FiLock, 
  FiArrowRight, 
  FiArrowLeft,
  FiZap, 
  FiShield, 
  FiCheck
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleDemoFill = () => {
    setFormData({
      email: 'alex@example.com',
      password: 'password123',
      rememberMe: true,
    });
    setError('');
    toast.success('Demo credentials filled!', { icon: '⚡' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to Wayfare OS!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="auth-centered-container">
        <div className="auth-glass-card">
          
          {/* Brand Header */}
          <div className="auth-card-header">
            <Link to="/" className="auth-logo-badge">
              <img src="/logo.jpg" alt="Wayfare" className="auth-logo-img" />
              <div className="auth-logo-title">
                Wayfare <span className="auth-os-tag">OS</span>
              </div>
            </Link>
            <h1 className="auth-card-title">Welcome Back</h1>
            <p className="auth-card-subtitle">
              Sign in to manage your itineraries, travel budgets, and destinations.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs-row">
            <button type="button" className="auth-tab-btn active">
              Sign In
            </button>
            <Link to="/register" className="auth-tab-btn">
              Create Account
            </Link>
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="demo-quickfill-box">
            <div className="flex items-center gap-2">
              <FiZap className="text-primary-400" size={15} />
              <span className="text-xs text-primary-200">
                Want to test fast? <strong>Auto-fill demo user</strong>
              </span>
            </div>
            <button 
              type="button" 
              className="demo-fill-btn" 
              onClick={handleDemoFill}
            >
              Fill Demo
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="auth-input-wrapper">
                <FiMail className="auth-input-icon" size={16} />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="auth-form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0" htmlFor="login-password">
                  Password <span className="text-error">*</span>
                </label>
                <button 
                  type="button" 
                  className="text-xs text-primary-400 hover:underline"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={() => toast('Password reset link sent if account exists.', { icon: '📧' })}
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <FiLock className="auth-input-icon" size={16} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-form-input"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="checkbox-group cursor-pointer">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="text-xs text-secondary">Keep me signed in</span>
              </label>
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
                  Sign In <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card-footer">
            <div className="text-xs text-muted">
              Don't have an account? <Link to="/register" className="text-primary-400 font-bold hover:underline">Sign up for free</Link>
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

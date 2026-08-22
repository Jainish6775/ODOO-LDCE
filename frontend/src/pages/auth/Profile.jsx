import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiLock, FiCheck, FiSave } from 'react-icons/fi';
import './Profile.css';

const TRAVEL_INTERESTS = [
  'Adventure', 'Cultural', 'Relaxation', 'Budget', 'Luxury',
  'Foodie', 'Nature', 'Nightlife', 'Photography', 'History',
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
    preferredCurrency: user?.preferred_currency || 'USD',
    preferredLanguage: user?.preferred_language || 'en',
    interests: user?.interests || ['Adventure', 'Cultural'],
  });

  const [pwData, setPwData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authAPI.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        bio: formData.bio,
        preferred_currency: formData.preferredCurrency,
        preferred_language: formData.preferredLanguage,
        interests: formData.interests,
      });
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="card profile-header-card">
        <div className="profile-avatar-wrapper">
          {user?.profile_image ? (
            <img src={user.profile_image} alt={user.first_name} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-initials">{getInitials()}</div>
          )}
        </div>

        <div className="profile-header-info">
          <h1 className="profile-name">{user?.first_name} {user?.last_name}</h1>
          <p className="profile-email"><FiMail /> {user?.email}</p>
          <div className="profile-badges">
            <span className="badge badge-primary">{user?.role || 'Traveler'} Member</span>
            {formData.city && <span className="badge"><FiMapPin /> {formData.city}, {formData.country}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs profile-tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <FiUser /> Personal Information
        </button>
        <button 
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <FiGlobe /> Travel Preferences
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FiLock /> Security & Password
        </button>
      </div>

      {/* Form Container */}
      <div className="card profile-form-card">
        {activeTab === 'info' && (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <h2 className="profile-section-title">Personal Details</h2>

            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  className="form-input" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  className="form-input" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-input" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input 
                  type="text" 
                  name="country" 
                  className="form-input" 
                  placeholder="e.g. France, USA" 
                  value={formData.country} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  name="city" 
                  className="form-input" 
                  placeholder="e.g. Paris, New York" 
                  value={formData.city} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Currency</label>
                <select 
                  name="preferredCurrency" 
                  className="form-input form-select" 
                  value={formData.preferredCurrency} 
                  onChange={handleChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">About Bio</label>
              <textarea 
                name="bio" 
                className="form-input form-textarea" 
                rows={3} 
                placeholder="Tell other travelers a little about yourself..."
                value={formData.bio} 
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-6" disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {activeTab === 'preferences' && (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <h2 className="profile-section-title">Travel Preferences</h2>
            <p className="text-neutral-500 mb-6">Select your favorite travel styles to receive tailored trip recommendations.</p>

            <div className="form-group">
              <label className="form-label">Interests & Styles</label>
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

            <button type="submit" className="btn btn-primary mt-8" disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="profile-form">
            <h2 className="profile-section-title">Change Password</h2>

            <div className="form-group max-w-md">
              <label className="form-label">Current Password</label>
              <input 
                type="password" 
                name="currentPassword" 
                className="form-input" 
                value={pwData.currentPassword} 
                onChange={handlePwChange} 
                required 
              />
            </div>

            <div className="form-group max-w-md">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                className="form-input" 
                placeholder="Min 6 characters"
                value={pwData.newPassword} 
                onChange={handlePwChange} 
                required 
              />
            </div>

            <div className="form-group max-w-md">
              <label className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                className="form-input" 
                value={pwData.confirmPassword} 
                onChange={handlePwChange} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary mt-6" disabled={saving}>
              <FiLock /> {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

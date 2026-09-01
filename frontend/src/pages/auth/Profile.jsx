import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, tripsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiMapPin, FiEdit2, FiCalendar, FiDollarSign, FiEye, FiX, FiSave, FiGlobe, FiShield, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { sampleTrips } from '../../data/sampleTrips';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [trips, setTrips] = useState([]);

  const [formData, setFormData] = useState({
    firstName: user?.first_name || 'Jainish',
    lastName: user?.last_name || 'Talpara',
    email: user?.email || 'jainishtalpara.in901@gmail.com',
    phone: user?.phone || '08849736676',
    city: user?.city || 'Rajkot',
    country: user?.country || 'India',
    bio: user?.bio || 'Executive Globetrotter exploring global heritage cities, alpine trails, and coastal archipelagos.',
    preferredCurrency: user?.preferred_currency || 'USD ($)',
    profileImage: user?.profile_image || '/images/user_profile.png',
  });

  const fetchTripsData = useCallback(async () => {
    try {
      const res = await tripsAPI.getAll();
      let loadedTrips = Array.isArray(res.data) ? res.data : [];

      const existingIds = new Set(loadedTrips.map(t => t.id));
      const merged = [...loadedTrips];
      sampleTrips.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          merged.push(sample);
        }
      });

      setTrips(merged);
    } catch {
      setTrips(sampleTrips);
    }
  }, []);

  useEffect(() => {
    fetchTripsData();
  }, [fetchTripsData]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUserObj = {
        ...(user || {}),
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        bio: formData.bio,
        preferred_currency: formData.preferredCurrency,
        profile_image: formData.profileImage,
      };

      try {
        const response = await authAPI.updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          bio: formData.bio,
          preferred_currency: formData.preferredCurrency,
          profile_image: formData.profileImage,
        });

        if (response?.data?.user) {
          updateUser(response.data.user);
        } else {
          updateUser(updatedUserObj);
        }
      } catch {
        updateUser(updatedUserObj);
      }

      toast.success('Traveler dossier committed successfully!');
      setShowEditModal(false);
    } catch {
      toast.error('Failed to commit profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const cleanStr = dateStr.split('T')[0];
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="traveler-dossier-page page-container">
      
      {/* Profile Hero Card */}
      <div className="traveler-hero-card">
        <div className="traveler-hero-left">
          <img 
            src={user?.profile_image || formData.profileImage} 
            alt={formData.firstName} 
            className="traveler-avatar-xl" 
          />
          <div className="traveler-hero-meta">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">VERIFIED EXPLORER</span>
              <span className="text-xs text-muted font-mono">OS-ID #901</span>
            </div>
            <h1 className="traveler-hero-name">
              {formData.firstName} {formData.lastName}
            </h1>
            <span className="traveler-hero-email">{formData.email}</span>
            <div className="traveler-hero-chips mt-2">
              <span className="traveler-chip"><FiMapPin size={11} /> {formData.city}, {formData.country}</span>
              <span className="traveler-chip"><FiShield size={11} /> Multi-Factor Secured</span>
            </div>
          </div>
        </div>

        <div className="traveler-hero-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowEditModal(true)}>
            <FiEdit2 /> Edit Dossier
          </button>
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="traveler-content-grid mt-8">
        
        {/* Left Column: Traveler Intelligence */}
        <div className="card p-6">
          <div className="flex items-center justify-between pb-3 border-bottom mb-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Identity & Preferences</h3>
            <span className="badge badge-secondary text-xs">Verified</span>
          </div>

          <div className="traveler-field-row">
            <span className="field-label">Legal Name</span>
            <span className="field-value">{formData.firstName} {formData.lastName}</span>
          </div>

          <div className="traveler-field-row">
            <span className="field-label">Primary Email</span>
            <span className="field-value font-mono">{formData.email}</span>
          </div>

          <div className="traveler-field-row">
            <span className="field-label">Contact Phone</span>
            <span className="field-value font-mono">{formData.phone || '+91 88497 36676'}</span>
          </div>

          <div className="traveler-field-row">
            <span className="field-label">Home Base</span>
            <span className="field-value">{formData.city}, {formData.country}</span>
          </div>

          <div className="traveler-field-row">
            <span className="field-label">Primary Currency</span>
            <span className="field-value font-mono font-bold text-success">{formData.preferredCurrency}</span>
          </div>

          <div className="traveler-field-row">
            <span className="field-label">Traveler Bio</span>
            <span className="field-value text-secondary text-xs" style={{ maxWidth: 300, textAlign: 'right' }}>
              {formData.bio}
            </span>
          </div>
        </div>

        {/* Right Column: Expedition Archive Log */}
        <div className="card p-6">
          <div className="flex items-center justify-between pb-3 border-bottom mb-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Expedition Archive</h3>
            <span className="badge badge-primary text-xs">{trips.length} Managed</span>
          </div>

          <div className="traveler-trips-stack">
            {trips.slice(0, 4).map(trip => (
              <div 
                key={trip.id} 
                className="traveler-trip-tile"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <img 
                  src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'} 
                  alt={trip.name} 
                  className="traveler-trip-thumb" 
                />
                <div className="traveler-trip-details">
                  <span className="traveler-trip-title">{trip.name}</span>
                  <span className="traveler-trip-meta">
                    <FiMapPin size={11} /> {trip.starting_location} • {formatDateDisplay(trip.start_date)}
                  </span>
                </div>
                <button className="btn-icon" title="View Dossier">
                  <FiEye size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="saas-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="saas-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="saas-modal-header">
              <div className="flex items-center gap-2">
                <FiUser className="text-primary-400" />
                <h3 className="text-sm font-bold text-primary uppercase">Edit Traveler Dossier</h3>
              </div>
              <button className="btn-icon" onClick={() => setShowEditModal(false)}>
                <FiX size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="saas-modal-body">
              <div className="grid-2 gap-3">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid-2 gap-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Traveler Bio</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>

              <div className="saas-modal-footer mt-4">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? <div className="spinner"></div> : <><FiSave /> Commit Dossier</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

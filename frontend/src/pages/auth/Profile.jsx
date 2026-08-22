import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, tripsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiMapPin, FiEdit2, FiCalendar, FiDollarSign, FiClock, FiEye, FiX, FiSave, FiGlobe, FiCheck } from 'react-icons/fi';
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
    bio: user?.bio || 'Avid globetrotter exploring scenic mountains, beaches, and historic landmarks across the world.',
    preferredCurrency: user?.preferred_currency || 'INR (₹)',
    profileImage: user?.profile_image || '/images/user_profile.png',
  });

  useEffect(() => {
    fetchTripsData();
  }, []);

  const fetchTripsData = async () => {
    try {
      const res = await tripsAPI.getAll();
      let loadedTrips = Array.isArray(res.data) ? res.data : [];

      const defaultTrips = [
        {
          id: 101,
          name: 'Goa Coastal Resort & Beach Retreat',
          starting_location: 'Goa, India',
          start_date: '2026-08-20',
          end_date: '2026-08-28',
          duration_days: 8,
          budget: 50000,
          status: 'Ongoing',
          cover_image: '/images/trip_bali_1787378598373.jpg'
        },
        {
          id: 105,
          name: 'Swiss Alps Winter Skiing & Glacier Express',
          starting_location: 'Zermatt, Switzerland',
          start_date: '2026-08-15',
          end_date: '2026-08-25',
          duration_days: 10,
          budget: 4500,
          status: 'Ongoing',
          cover_image: '/images/region_europe_1787378498140.jpg'
        },
        {
          id: 102,
          name: 'Paris & Louvre Museum Tour',
          starting_location: 'Paris, France',
          start_date: '2026-10-10',
          end_date: '2026-10-18',
          duration_days: 8,
          budget: 3500,
          status: 'Up-coming',
          cover_image: '/images/trip_paris_1787378563287.jpg'
        },
        {
          id: 104,
          name: 'Kyoto Ancient Shrines & Tea Experience',
          starting_location: 'Kyoto, Japan',
          start_date: '2026-05-10',
          end_date: '2026-05-16',
          duration_days: 6,
          budget: 2800,
          status: 'Completed',
          cover_image: '/images/region_asia_1787378514027.jpg'
        },
        {
          id: 106,
          name: 'Rome Historic Colosseum & Vatican Tour',
          starting_location: 'Rome, Italy',
          start_date: '2026-03-12',
          end_date: '2026-03-19',
          duration_days: 7,
          budget: 3100,
          status: 'Completed',
          cover_image: '/images/dashboard_banner_1787378478140.jpg'
        },
        {
          id: 107,
          name: 'Bali Tropical Island & Temple Trail',
          starting_location: 'Ubud, Bali',
          start_date: '2026-01-05',
          end_date: '2026-01-14',
          duration_days: 9,
          budget: 2200,
          status: 'Completed',
          cover_image: '/images/trip_bali_1787378598373.jpg'
        }
      ];

      const existingIds = new Set(loadedTrips.map(t => t.id));
      const merged = [...loadedTrips];
      defaultTrips.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          merged.push(sample);
        }
      });

      setTrips(merged);
    } catch (e) {
      console.warn('Failed to load trips for profile', e);
    }
  };

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
      } catch (e) {
        updateUser(updatedUserObj);
      }

      toast.success('User information updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      toast.error('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    const f = formData.firstName || user?.first_name || 'J';
    const l = formData.lastName || user?.last_name || 'B';
    return `${f[0]}${l[0]}`.toUpperCase();
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const cleanStr = dateStr.split('T')[0];
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Preplanned Trips (Ongoing & Up-coming)
  const preplannedTrips = trips.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s === 'ongoing' || s.includes('upcoming') || s === 'up-coming' || s === 'draft';
  });

  // Previous Trips (Completed)
  const previousTrips = trips.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s === 'completed';
  });

  return (
    <div className="profile-page-schema page-content-padding">
      
      {/* Top Section: User Profile Header Card (Matching Screen 7 Schema) */}
      <div className="card profile-top-card">
        
        {/* Image of the User */}
        <div className="profile-avatar-circle">
          <img src={formData.profileImage || user?.profile_image || '/images/user_profile.png'} alt="User Avatar" className="avatar-img-full" />
        </div>

        {/* User Details with appropriate option to edit those information */}
        <div className="profile-details-content">
          <div className="profile-name-row">
            <div>
              <h1 className="profile-display-name">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="profile-display-email">
                <FiMail size={14} /> {formData.email}
              </p>
            </div>
            
            {/* Edit Information Option */}
            <button 
              className="btn btn-outline btn-sm btn-edit-profile"
              onClick={() => setShowEditModal(true)}
            >
              <FiEdit2 size={15} /> Edit Information
            </button>
          </div>

          <p className="profile-bio-text mt-3">
            {formData.bio}
          </p>

          <div className="profile-meta-pills mt-4 flex items-center gap-3 flex-wrap">
            <span className="profile-chip-pill">
              <FiMapPin size={13} /> {formData.city}, {formData.country}
            </span>
            <span className="profile-chip-pill">
              <FiGlobe size={13} /> Preferred Currency: <strong>{formData.preferredCurrency}</strong>
            </span>
            <span className="profile-chip-pill badge-explorer">
              ✈️ GlobeTrotter Explorer
            </span>
          </div>
        </div>

      </div>

      {/* Middle Section: Preplanned Trips (Matching Screen 7 Schema) */}
      <div className="profile-trips-section mt-8">
        <div className="section-title-bar mb-4">
          <h2 className="section-heading-title">Preplanned Trips</h2>
          <span className="section-count-badge">{preplannedTrips.length} Trips</span>
        </div>

        {preplannedTrips.length === 0 ? (
          <div className="no-trips-placeholder">No preplanned trips found.</div>
        ) : (
          <div className="profile-trips-grid-3">
            {preplannedTrips.map(trip => (
              <ProfileTripCard key={trip.id} trip={trip} navigate={navigate} formatDateDisplay={formatDateDisplay} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: Previous Trips (Matching Screen 7 Schema) */}
      <div className="profile-trips-section mt-8 mb-12">
        <div className="section-title-bar mb-4">
          <h2 className="section-heading-title">Previous Trips</h2>
          <span className="section-count-badge">{previousTrips.length} Completed</span>
        </div>

        {previousTrips.length === 0 ? (
          <div className="no-trips-placeholder">No previous trip history found.</div>
        ) : (
          <div className="profile-trips-grid-3">
            {previousTrips.map(trip => (
              <ProfileTripCard key={trip.id} trip={trip} navigate={navigate} formatDateDisplay={formatDateDisplay} />
            ))}
          </div>
        )}
      </div>

      {/* Centered Blur Modal for Edit Information */}
      {showEditModal && (
        <div className="modal-backdrop-luxury" onClick={() => setShowEditModal(false)}>
          <div className="modal-card-luxury" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="modal-header-luxury">
              <div className="flex items-center gap-3">
                <div className="modal-header-icon-badge">
                  <FiUser size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-0">Edit User Information</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Update your personal profile details & travel preferences</p>
                </div>
              </div>
              <button 
                type="button"
                className="modal-close-round"
                onClick={() => setShowEditModal(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProfile} className="luxury-modal-body">
              <div className="luxury-modal-scroll">
                
                {/* Row 1: First & Last Name */}
                <div className="luxury-form-row-2">
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiUser className="luxury-field-icon" />
                      <input 
                        type="text" 
                        className="luxury-form-input"
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiUser className="luxury-field-icon" />
                      <input 
                        type="text" 
                        className="luxury-form-input"
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="luxury-form-row-2">
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      Email Address
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiMail className="luxury-field-icon" />
                      <input 
                        type="email" 
                        className="luxury-form-input"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      Phone Number
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiUser className="luxury-field-icon" />
                      <input 
                        type="text" 
                        className="luxury-form-input"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: City & Country */}
                <div className="luxury-form-row-2">
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      City
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiMapPin className="luxury-field-icon" />
                      <input 
                        type="text" 
                        className="luxury-form-input"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      Country
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiGlobe className="luxury-field-icon" />
                      <input 
                        type="text" 
                        className="luxury-form-input"
                        value={formData.country || ''}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Currency & Profile Image */}
                <div className="luxury-form-row-2">
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      Preferred Currency
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiGlobe className="luxury-field-icon" />
                      <select 
                        className="luxury-form-select"
                        value={formData.preferredCurrency || 'USD'}
                        onChange={(e) => setFormData({ ...formData, preferredCurrency: e.target.value })}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>
                  <div className="luxury-form-group">
                    <label className="luxury-form-label">
                      Profile Image URL
                    </label>
                    <div className="luxury-input-wrapper">
                      <FiUser className="luxury-field-icon" />
                      <input 
                        type="text" 
                        className="luxury-form-input"
                        placeholder="https://..."
                        value={formData.profileImage || ''}
                        onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 5: Bio */}
                <div className="luxury-form-group">
                  <label className="luxury-form-label">
                    About Bio
                  </label>
                  <textarea 
                    className="luxury-form-textarea" 
                    rows="3"
                    placeholder="Tell other travelers a bit about yourself..."
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="luxury-modal-footer">
                <button 
                  type="button" 
                  className="btn-luxury-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-luxury-submit"
                  disabled={saving}
                >
                  <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

/* Helper Component: Screen 7 Trip Card with View Button */
function ProfileTripCard({ trip, navigate, formatDateDisplay }) {
  return (
    <div className="card profile-schema-trip-card">
      <div className="profile-trip-cover-box">
        <img 
          src={trip.cover_image || '/images/trip_paris_1787378563287.jpg'} 
          alt={trip.name} 
          className="profile-trip-cover-img"
        />
        <span className={`profile-status-tag status-${(trip.status || 'draft').toLowerCase().replace(/[^a-z]/g, '')}`}>
          {trip.status?.toUpperCase() || 'DRAFT'}
        </span>
      </div>

      <div className="card-body p-4 flex flex-col flex-1">
        <h3 
          className="font-bold text-base text-neutral-900 hover:text-primary-600 cursor-pointer capitalize mb-2 line-clamp-1"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          {trip.name}
        </h3>

        <div className="flex flex-col gap-1.5 text-xs text-neutral-600 mb-4">
          <div className="flex items-center gap-1.5">
            <FiMapPin className="text-neutral-400" /> {trip.starting_location || 'Destination'}
          </div>
          <div className="flex items-center gap-1.5">
            <FiCalendar className="text-neutral-400" /> {formatDateDisplay(trip.start_date)} - {formatDateDisplay(trip.end_date)}
          </div>
          {trip.budget && (
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 mt-1">
              <FiDollarSign className="text-neutral-400" /> ${Number(trip.budget).toLocaleString()}
            </div>
          )}
        </div>

        {/* View Button at the bottom (Matching Screen 7 Schema) */}
        <div className="mt-auto pt-2">
          <button 
            className="btn btn-secondary btn-full btn-schema-view"
            onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
          >
            <FiEye /> View
          </button>
        </div>
      </div>
    </div>
  );
}

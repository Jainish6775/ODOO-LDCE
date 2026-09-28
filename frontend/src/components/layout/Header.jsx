import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiCompass, 
  FiMap, 
  FiCalendar, 
  FiUsers, 
  FiBookmark, 
  FiUser, 
  FiLogOut, 
  FiBell, 
  FiSearch, 
  FiPlus,
  FiChevronDown
} from 'react-icons/fi';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Itinerary Updated', message: 'Activity added to Kyoto plan.', time: '10m ago', unread: true },
    { id: 2, title: 'Community Interaction', message: 'Traveler liked your shared guide.', time: '1h ago', unread: true },
    { id: 3, title: 'Upcoming Trip', message: 'Journey to Tokyo starts in 3 days.', time: '5h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome size={15} /> },
    { to: '/explore', label: 'Explore', icon: <FiCompass size={15} /> },
    { to: '/my-trips', label: 'My Trips', icon: <FiMap size={15} /> },
    { to: '/calendar', label: 'Calendar', icon: <FiCalendar size={15} /> },
    { to: '/community', label: 'Community', icon: <FiUsers size={15} /> },
    { to: '/saved', label: 'Saved', icon: <FiBookmark size={15} /> },
  ];

  return (
    <header className="top-navbar">
      <div className="top-navbar-container">
        
        {/* Left: Brand Logo */}
        <div className="navbar-brand-section">
          <Link to="/dashboard" className="navbar-brand-link">
            <img src="/logo.jpg" alt="Wayfare" className="navbar-brand-img" />
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">Wayfare</span>
              <span className="navbar-brand-os">OS</span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Navigation Links */}
        <nav className="navbar-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right: Quick Actions, Notifications & Profile */}
        <div className="navbar-actions-section">
          
          {/* Quick Search */}
          <button 
            type="button" 
            className="navbar-search-btn hide-tablet"
            onClick={() => navigate('/explore')}
            title="Search destinations (⌘K)"
          >
            <FiSearch size={14} className="text-muted" />
            <span className="search-text">Search...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>

          {/* Plan Trip CTA */}
          <Link to="/trips/new" className="btn btn-primary btn-sm navbar-plan-btn hide-mobile">
            <FiPlus size={14} /> Plan Trip
          </Link>

          {/* Notifications Dropdown */}
          <div className="navbar-dropdown-wrapper" ref={notifRef}>
            <button
              className={`navbar-icon-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              title="Notifications"
            >
              <FiBell size={16} />
              {unreadCount > 0 && <span className="notif-dot"></span>}
            </button>

            {showNotifications && (
              <div className="navbar-dropdown-panel notif-dropdown animate-slide-down">
                <div className="dropdown-panel-header">
                  <span className="panel-heading">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="panel-link-action" onClick={markAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notif-list-body">
                  {notifications.map(n => (
                    <div key={n.id} className={`notif-entry ${n.unread ? 'unread' : ''}`}>
                      <div className="notif-entry-top">
                        <span className="notif-entry-title">{n.title}</span>
                        <span className="notif-entry-time">{n.time}</span>
                      </div>
                      <p className="notif-entry-msg">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="navbar-dropdown-wrapper" ref={menuRef}>
            <button
              className="navbar-user-trigger"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
            >
              <img
                src={user?.profile_image || '/images/user_profile.png'}
                alt={user?.first_name || 'User'}
                className="navbar-avatar-img"
              />
              <span className="navbar-username hide-mobile">
                {user?.first_name || 'Account'}
              </span>
              <FiChevronDown size={13} className="text-muted hide-mobile" />
            </button>

            {showUserMenu && (
              <div className="navbar-dropdown-panel user-dropdown animate-slide-down">
                <div className="user-dropdown-header">
                  <img
                    src={user?.profile_image || '/images/user_profile.png'}
                    alt={user?.first_name || 'User'}
                    className="avatar avatar-sm"
                  />
                  <div className="user-dropdown-details">
                    <span className="user-name">
                      {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Explorer' : 'Traveler'}
                    </span>
                    <span className="user-email">{user?.email || 'user@wayfare.com'}</span>
                  </div>
                </div>
                
                <div className="dropdown-separator"></div>
                
                <Link to="/profile" className="dropdown-row-link">
                  <FiUser size={14} /> Profile & Preferences
                </Link>
                <Link to="/saved" className="dropdown-row-link">
                  <FiBookmark size={14} /> Saved Destinations
                </Link>
                <Link to="/" className="dropdown-row-link">
                  <FiCompass size={14} /> Public Home
                </Link>

                <div className="dropdown-separator"></div>

                <button className="dropdown-row-link logout-link" onClick={handleLogout}>
                  <FiLogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

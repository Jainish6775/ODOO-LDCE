import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiCompass, FiMap, FiCalendar, FiUsers, FiBookmark, FiUser, FiLogOut, FiBell, FiMenu, FiX, FiSearch, FiPlus } from 'react-icons/fi';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Trip Updated', message: 'Activity added to Kyoto itinerary.', time: '10m ago', unread: true },
    { id: 2, title: 'Community Interaction', message: 'Sarah liked your travel guide.', time: '1h ago', unread: true },
    { id: 3, title: 'Upcoming Flight', message: 'Trip to Tokyo starts in 3 days.', time: '5h ago', unread: false },
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

  // Close mobile drawer on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/') return 'Overview';
    if (p.startsWith('/my-trips')) return 'My Trips';
    if (p.startsWith('/trips/new')) return 'Create Trip';
    if (p.includes('/itinerary')) return 'Itinerary Builder';
    if (p.startsWith('/trips/')) return 'Trip Details';
    if (p.startsWith('/calendar')) return 'Trip Calendar';
    if (p.startsWith('/explore')) return 'Explore Destinations';
    if (p.startsWith('/community')) return 'Community Feed';
    if (p.startsWith('/saved')) return 'Saved Wishlist';
    if (p.startsWith('/profile')) return 'Account Profile';
    return 'GlobeTrotter';
  };

  const navLinks = [
    { to: '/', label: 'Overview', icon: <FiHome /> },
    { to: '/my-trips', label: 'My Trips', icon: <FiMap /> },
    { to: '/calendar', label: 'Calendar', icon: <FiCalendar /> },
    { to: '/explore', label: 'Explore', icon: <FiCompass /> },
    { to: '/community', label: 'Community', icon: <FiUsers /> },
    { to: '/saved', label: 'Saved', icon: <FiBookmark /> },
  ];

  return (
    <header className="saas-header">
      <div className="header-inner">
        
        {/* Left: Mobile Brand & Desktop Breadcrumb Title */}
        <div className="header-left">
          {/* Mobile Logo */}
          <Link to="/" className="header-logo show-mobile">
            <img src="/logo.jpg" alt="GlobeTrotter" className="header-logo-img" />
            <span className="header-logo-text">GlobeTrotter</span>
          </Link>

          {/* Desktop Page Title / Breadcrumb */}
          <div className="header-page-title hide-mobile">
            <span className="title-section">Workspace</span>
            <span className="title-divider">/</span>
            <span className="title-active">{getPageTitle()}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="header-search-bar hide-mobile" onClick={() => navigate('/explore')}>
          <FiSearch className="header-search-icon" />
          <span className="header-search-placeholder">Search destinations, trips, activities...</span>
          <kbd className="header-search-kbd">⌘K</kbd>
        </div>

        {/* Right: Quick Actions, Notifications & Profile */}
        <div className="header-actions">
          
          {/* Notifications Dropdown */}
          <div className="header-menu-container" ref={notifRef}>
            <button
              className={`header-btn-icon ${showNotifications ? 'active' : ''}`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              title="Notifications"
            >
              <FiBell size={16} />
              {unreadCount > 0 && <span className="notification-badge-dot"></span>}
            </button>

            {showNotifications && (
              <div className="dropdown-panel notif-panel animate-slide-down">
                <div className="dropdown-panel-header">
                  <span className="panel-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="panel-action-link" onClick={markAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notif-items-list">
                  {notifications.map(n => (
                    <div key={n.id} className={`notif-item-row ${n.unread ? 'unread' : ''}`}>
                      <div className="notif-title-row">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                      <p className="notif-item-desc">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="header-menu-container" ref={menuRef}>
            <button
              className="header-user-trigger"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
            >
              <img
                src={user?.profile_image || '/images/user_profile.png'}
                alt={user?.first_name || 'User'}
                className="avatar avatar-sm"
              />
              <span className="header-user-name hide-mobile">
                {user?.first_name || 'Account'}
              </span>
            </button>

            {showUserMenu && (
              <div className="dropdown-panel user-panel animate-slide-down">
                <div className="user-panel-info">
                  <img
                    src={user?.profile_image || '/images/user_profile.png'}
                    alt={user?.first_name || 'User'}
                    className="avatar"
                  />
                  <div className="user-panel-text">
                    <span className="user-panel-name">
                      {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Traveler' : 'Guest'}
                    </span>
                    <span className="user-panel-email">{user?.email || 'traveler@globetrotter.com'}</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <Link to="/profile" className="dropdown-item">
                  <FiUser size={14} /> Profile & Settings
                </Link>
                <Link to="/saved" className="dropdown-item">
                  <FiBookmark size={14} /> Saved Wishlist
                </Link>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="header-btn-icon show-mobile"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle navigation"
          >
            {showMobileMenu ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="mobile-drawer-overlay animate-fade-in">
          <div className="mobile-drawer-content">
            <Link to="/trips/new" className="btn btn-primary btn-full mb-4">
              <FiPlus /> Plan New Trip
            </Link>
            <nav className="mobile-drawer-nav">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

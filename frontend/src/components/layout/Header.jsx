import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiCompass, FiMap, FiCalendar, FiUsers, FiBookmark, FiUser, FiLogOut, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Trip Updated', message: 'New activity added to Kyoto itinerary.', time: '10m ago', unread: true },
    { id: 2, title: 'Community Interaction', message: 'Sarah liked your Japan travel guide.', time: '1h ago', unread: true },
    { id: 3, title: 'Upcoming Flight', message: 'Flight to Tokyo departs in 3 days.', time: '5h ago', unread: true },
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

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome /> },
    { to: '/explore', label: 'Explore', icon: <FiCompass /> },
    { to: '/my-trips', label: 'My Trips', icon: <FiMap /> },
    { to: '/calendar', label: 'Calendar', icon: <FiCalendar /> },
    { to: '/community', label: 'Community', icon: <FiUsers /> },
    { to: '/saved', label: 'Saved', icon: <FiBookmark /> },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo (Visible only on mobile now) */}
        <Link to="/" className="header-logo show-mobile">
          <img src="/logo.jpg" alt="GlobeTrotter" style={{ height: '32px', width: '32px', borderRadius: '6px', objectFit: 'cover' }} />
          <span className="header-logo-text">GlobeTrotter</span>
        </Link>

        {/* Spacer to push actions to the right */}
        <div style={{ flex: 1 }}></div>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Plan a Trip CTA */}
          <Link to="/trips/new" className="btn btn-accent btn-plan hide-mobile">
            <HiOutlinePaperAirplane />
            <span>Plan a Trip</span>
          </Link>

          {/* Notifications */}
          <div className="header-notif-menu hide-mobile" ref={notifRef}>
            <button
              className="header-icon-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              data-tooltip="Notifications"
            >
              <FiBell />
              {unreadCount > 0 && <span className="notification-dot"></span>}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button className="notif-mark-btn" onClick={markAllRead}>
                      Mark read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu (Mobile Only) */}
          <div className="header-user-menu show-mobile" ref={menuRef}>
            <button
              className="header-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.profile_image ? (
                <img src={user.profile_image} alt={user.first_name} className="avatar" />
              ) : (
                <div className="avatar">{getInitials()}</div>
              )}
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="avatar-lg">
                    {user?.profile_image ? (
                      <img src={user.profile_image} alt={user.first_name} className="avatar avatar-lg" />
                    ) : (
                      <div className="avatar avatar-lg">{getInitials()}</div>
                    )}
                  </div>
                  <div>
                    <div className="user-dropdown-name">{user?.first_name} {user?.last_name}</div>
                    <div className="user-dropdown-email">{user?.email}</div>
                  </div>
                </div>
                <hr className="divider" />
                <Link to="/profile" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <FiUser /> Profile
                </Link>
                <Link to="/my-trips" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <FiMap /> My Trips
                </Link>
                <Link to="/saved" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <FiBookmark /> Saved
                </Link>
                <hr className="divider" />
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="header-icon-btn show-mobile"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <nav className="mobile-menu-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
                end={link.to === '/'}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <Link to="/trips/new" className="btn btn-accent btn-full" onClick={() => setShowMobileMenu(false)}>
            <HiOutlinePaperAirplane /> Plan a Trip
          </Link>
        </div>
      )}
    </header>
  );
}

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="header-logo-icon">🌍</span>
          <span className="header-logo-text">GlobeTrotter</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav hide-mobile">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Plan a Trip CTA */}
          <Link to="/trips/new" className="btn btn-accent btn-plan hide-mobile">
            <HiOutlinePaperAirplane />
            <span>Plan a Trip</span>
          </Link>

          {/* Notifications */}
          <button className="header-icon-btn hide-mobile" data-tooltip="Notifications">
            <FiBell />
            <span className="notification-dot"></span>
          </button>

          {/* User Menu */}
          <div className="header-user-menu" ref={menuRef}>
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

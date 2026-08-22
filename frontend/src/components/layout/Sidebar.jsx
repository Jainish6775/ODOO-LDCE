import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiCompass, FiMap, FiCalendar, FiUsers, FiBookmark, FiUser, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <aside className="sidebar hide-mobile">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <img src="/logo.jpg" alt="GlobeTrotter" style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover' }} />
          <span className="sidebar-logo-text">GlobeTrotter</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user-profile">
          <div className="sidebar-user-info">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.first_name} className="avatar" />
            ) : (
              <div className="avatar">{getInitials()}</div>
            )}
            <div className="sidebar-user-text">
              <div className="sidebar-user-name">{user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User' : 'Guest'}</div>
              <div className="sidebar-user-email">{user?.email || 'traveler@globetrotter.com'}</div>
            </div>
          </div>
          <div className="sidebar-user-actions">
            <Link to="/profile" className="sidebar-user-action-btn" title="Profile">
              <FiUser /> Profile
            </Link>
            <button className="sidebar-user-action-btn logout" onClick={handleLogout} title="Log Out">
              <FiLogOut /> Log Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

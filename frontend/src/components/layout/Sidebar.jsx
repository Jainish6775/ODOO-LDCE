import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiCompass, FiMap, FiCalendar, FiUsers, FiBookmark, FiUser, FiLogOut, FiPlus, FiChevronDown, FiShield, FiActivity } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainLinks = [
    { to: '/dashboard', label: 'Command Center', icon: <FiHome />, badge: 'LIVE' },
    { to: '/my-trips', label: 'Expedition Queue', icon: <FiMap /> },
    { to: '/calendar', label: 'Flight & Stay Matrix', icon: <FiCalendar /> },
  ];

  const discoveryLinks = [
    { to: '/explore', label: '40 World Cities', icon: <FiCompass />, count: '40' },
    { to: '/community', label: 'Intelligence Feed', icon: <FiUsers /> },
    { to: '/saved', label: 'Wishlist Vault', icon: <FiBookmark /> },
  ];

  return (
    <aside className="saas-sidebar hide-mobile">
      
      {/* Workspace Switcher Header */}
      <div className="sidebar-workspace-header">
        <Link to="/dashboard" className="workspace-selector-btn">
          <img src="/logo.jpg" alt="Wayfare" className="workspace-logo-img" />
          <div className="workspace-text-wrap">
            <span className="workspace-title">Wayfare OS</span>
            <span className="workspace-tier">EXECUTIVE PRO</span>
          </div>
          <FiChevronDown className="workspace-caret" size={14} />
        </Link>
      </div>

      {/* Plan New Expedition CTA */}
      <div className="sidebar-cta-wrap">
        <Link to="/trips/new" className="btn btn-primary btn-sm btn-full sidebar-plan-btn">
          <FiPlus /> New Expedition
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-scrollable-nav">
        <div className="nav-group-label">EXPEDITION SUITE</div>
        <nav className="sidebar-nav-list">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              end={link.to === '/dashboard'}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
              {link.badge && <span className="nav-live-badge">{link.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="nav-group-label mt-6">GLOBAL INTELLIGENCE</div>
        <nav className="sidebar-nav-list">
          {discoveryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
              {link.count && <span className="nav-count-tag">{link.count}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User & Security Footer */}
      <div className="sidebar-user-footer">
        <div className="sidebar-user-card">
          <img 
            src={user?.profile_image || '/images/user_profile.png'} 
            alt={user?.first_name || 'User'} 
            className="avatar avatar-sm" 
          />
          <div className="sidebar-user-meta">
            <span className="user-display-name">
              {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Commander' : 'Guest'}
            </span>
            <span className="user-role-badge">Verified Traveler</span>
          </div>
        </div>
        <div className="sidebar-footer-buttons">
          <Link to="/profile" className="footer-mini-btn" title="Settings">
            <FiUser size={13} />
          </Link>
          <button className="footer-mini-btn logout" onClick={handleLogout} title="Sign Out">
            <FiLogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

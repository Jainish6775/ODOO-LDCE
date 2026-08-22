import { Link, NavLink } from 'react-router-dom';
import { FiHome, FiCompass, FiMap, FiCalendar, FiUsers, FiBookmark } from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
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
          <span className="sidebar-logo-icon">🌍</span>
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
        <div className="sidebar-upgrade-card">
          <h4>Go Premium</h4>
          <p>Get unlimited trip planning</p>
          <button className="btn btn-primary btn-sm btn-full mt-2">Upgrade</button>
        </div>
      </div>
    </aside>
  );
}

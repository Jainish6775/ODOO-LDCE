import { NavLink } from 'react-router-dom';
import { FiHome, FiCompass, FiCalendar, FiMoreHorizontal } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';
import './Header.css';

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-inner">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
          <FiHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FiCompass />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/trips/new" className="bottom-nav-item plan-btn">
          <HiOutlinePaperAirplane />
          <span>Plan</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FiCalendar />
          <span>Calendar</span>
        </NavLink>
        <NavLink to="/my-trips" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FiMoreHorizontal />
          <span>More</span>
        </NavLink>
      </div>
    </div>
  );
}

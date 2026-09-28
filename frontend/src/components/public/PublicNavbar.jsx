import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiArrowRight, FiLogIn, FiUserPlus, FiLayout } from 'react-icons/fi';
import './PublicNavbar.css';

export default function PublicNavbar() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="public-navbar-container">
        
        {/* Brand Logo */}
        <Link to="/" className="public-brand">
          <div className="public-logo-wrap">
            <img src="/logo.jpg" alt="Wayfare" className="public-logo-img" />
          </div>
          <div className="public-brand-text">
            <span className="brand-name">Wayfare</span>
            <span className="brand-badge">OS</span>
          </div>
        </Link>

        {/* Center: Navigation Links (Home, About Us, Contact Us) */}
        <nav className="public-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
            >
              <span>{link.label}</span>
              <span className="nav-indicator"></span>
            </NavLink>
          ))}
        </nav>

        {/* Top Right Corner Actions (Login / Signup / Dashboard) */}
        <div className="public-nav-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm public-cta-btn">
              <FiLayout size={14} /> Dashboard <FiArrowRight size={13} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm public-login-btn">
                <FiLogIn size={14} /> Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm public-cta-btn">
                <FiUserPlus size={14} /> Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

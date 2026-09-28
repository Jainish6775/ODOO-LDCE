import { Link } from 'react-router-dom';
import { FiGlobe, FiGithub, FiTwitter, FiCompass, FiShield, FiHeart } from 'react-icons/fi';
import './PublicFooter.css';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-container">
        
        <div className="public-footer-grid">
          
          {/* Col 1: Brand info */}
          <div className="footer-brand-col">
            <Link to="/" className="public-brand mb-3">
              <div className="public-logo-wrap">
                <img src="/logo.jpg" alt="Wayfare" className="public-logo-img" />
              </div>
              <div className="public-brand-text">
                <span className="brand-name">Wayfare</span>
                <span className="brand-badge">OS</span>
              </div>
            </Link>
            <p className="footer-desc">
              The modern travel operating system. Architect multi-city itineraries, manage budgets in real time, and explore verified destinations worldwide.
            </p>
            <div className="footer-status-pill">
              <span className="footer-status-dot"></span>
              <span>All Systems Operational • v2.4</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/explore">Explore Catalog</Link></li>
            </ul>
          </div>

          {/* Col 3: Platform */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-link-list">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/dashboard">Command Center</Link></li>
              <li><Link to="/community">Community Feed</Link></li>
            </ul>
          </div>

          {/* Col 4: Trust & Security */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Security & Trust</h4>
            <p className="footer-security-text">
              Built with enterprise-grade token security, strict data privacy, and global CDN resilience.
            </p>
            <div className="footer-trust-badge">
              <FiShield size={14} className="text-primary-400" />
              <span>SSL Secured & Verified</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="public-footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} Wayfare OS. Built for global explorers.
          </span>
          <div className="footer-bottom-links">
            <Link to="/about">About</Link>
            <span>•</span>
            <Link to="/contact">Support</Link>
            <span>•</span>
            <span className="footer-love">Made with <FiHeart size={12} className="text-error" /> for travelers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

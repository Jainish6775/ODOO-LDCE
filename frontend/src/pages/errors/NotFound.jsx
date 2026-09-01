import { Link } from 'react-router-dom';
import { FiHome, FiCompass } from 'react-icons/fi';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Expedition Coordinate Not Found</h2>
        <p className="notfound-desc">
          Looks like this route has wandered off the radar map! The itinerary dossier you are requesting does not exist or has been archived.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary btn-sm">
            <FiHome /> Command Center
          </Link>
          <Link to="/explore" className="btn btn-secondary btn-sm">
            <FiCompass /> Global Explorer
          </Link>
        </div>
      </div>
    </div>
  );
}

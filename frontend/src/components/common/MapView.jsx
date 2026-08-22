import React, { useState } from 'react';
import { FiMapPin, FiCompass, FiNavigation, FiCalendar, FiDollarSign } from 'react-icons/fi';
import './MapView.css';

export default function MapView({ stops = [] }) {
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  if (!stops || stops.length === 0) {
    return (
      <div className="map-view-container empty-map-state p-6 text-center">
        <FiCompass size={32} className="text-neutral-400 mb-2" />
        <h4 className="font-bold text-sm text-neutral-700">Route & Destinations Map</h4>
        <p className="text-xs text-neutral-500 mt-1">
          No route sections added yet. Add sections to preview the map route!
        </p>
      </div>
    );
  }

  const selectedStop = stops[activeStopIndex] || stops[0];

  return (
    <div className="map-view-container">
      
      {/* Route Graphic Canvas Box */}
      <div className="route-canvas-box">
        <div className="route-canvas-header">
          <span className="route-live-badge">📍 {stops.length} Route Legs</span>
          <span className="route-subtitle font-bold text-xs">{selectedStop.title}</span>
        </div>

        {/* SVG Route Connecting Path */}
        <div className="route-svg-wrapper">
          <svg className="route-svg-line" viewBox="0 0 300 80" preserveAspectRatio="none">
            <path 
              d="M 20 40 Q 80 15, 150 40 T 280 40" 
              fill="none" 
              stroke="var(--primary-500)" 
              strokeWidth="3" 
              strokeDasharray="6 4"
            />
          </svg>

          {/* Interactive Stop Nodes */}
          <div className="route-nodes-row">
            {stops.map((stop, idx) => (
              <button 
                key={stop.id || idx}
                className={`route-node-pin ${idx === activeStopIndex ? 'active' : ''}`}
                onClick={() => setActiveStopIndex(idx)}
                title={`View ${stop.title}`}
              >
                <span className="node-number">{idx + 1}</span>
                <span className="node-pulse"></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Route Stops Cards Grid */}
      <div className="route-stops-feed mt-3">
        {stops.map((stop, idx) => (
          <div 
            key={stop.id || idx}
            className={`route-leg-card ${idx === activeStopIndex ? 'active-leg' : ''}`}
            onClick={() => setActiveStopIndex(idx)}
          >
            <div className="leg-badge">Leg {idx + 1}</div>
            <div className="leg-info">
              <h5 className="leg-title">{stop.title || `Section ${idx + 1}`}</h5>
              <div className="leg-meta-row mt-1">
                <span className="leg-meta"><FiCalendar size={11} /> {stop.startDate || 'Date TBD'}</span>
                {stop.budget > 0 && (
                  <span className="leg-meta font-bold text-emerald-600">
                    <FiDollarSign size={11} /> ${Number(stop.budget).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

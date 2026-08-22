import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix Leaflet default marker icons in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically re-center/fit bounds when markers change
function MapBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);

  return null;
}

export default function MapView({ stops = [], center = [35.0116, 135.7681], zoom = 6 }) {
  // Default mock coordinates for cities if lat/lng are missing
  const cityCoordinates = {
    'Kyoto': { lat: 35.0116, lng: 135.7681 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Osaka': { lat: 34.6937, lng: 135.5023 },
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Bali': { lat: -8.4095, lng: 115.1889 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'New York': { lat: 40.7128, lng: -74.0060 },
  };

  const markers = stops.map((stop, index) => {
    const cityName = stop.destination_name || stop.name || 'Kyoto';
    const coords = cityCoordinates[cityName] || { 
      lat: center[0] + (index * 0.1), 
      lng: center[1] + (index * 0.1) 
    };
    return {
      id: stop.id || index,
      title: cityName,
      notes: stop.notes || 'Destination Stop',
      arrival: stop.arrival_date,
      departure: stop.departure_date,
      lat: coords.lat,
      lng: coords.lng,
      order: index + 1,
    };
  });

  const polylineCoords = markers.map(m => [m.lat, m.lng]);

  const mapCenter = markers.length > 0 ? [markers[0].lat, markers[0].lng] : center;

  return (
    <div className="map-view-wrapper">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.length > 0 && <MapBounds markers={markers} />}

        {/* Route Connecting Polylines */}
        {polylineCoords.length > 1 && (
          <Polyline 
            positions={polylineCoords} 
            color="#18181b" 
            weight={3} 
            dashArray="6, 8" 
          />
        )}

        {/* Destination Markers */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup className="map-popup">
              <div className="map-popup-content">
                <span className="map-popup-order">Stop #{marker.order}</span>
                <h4>{marker.title}</h4>
                <p>{marker.notes}</p>
                {marker.arrival && (
                  <span className="map-popup-dates">
                    📅 {new Date(marker.arrival).toLocaleDateString()}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

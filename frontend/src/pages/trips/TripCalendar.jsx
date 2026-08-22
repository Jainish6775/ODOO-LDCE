import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiList, FiMapPin, FiPlus, FiClock, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { tripsAPI } from '../../services/api';
import './TripCalendar.css';

export default function TripCalendar() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026 default
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripsData();
  }, []);

  const fetchTripsData = async () => {
    try {
      setLoading(true);
      const res = await tripsAPI.getAll();
      let loadedTrips = Array.isArray(res.data) ? res.data : [];

      const sampleTrips = [
        {
          id: 101,
          name: 'Goa Coastal Resort & Beach Retreat',
          starting_location: 'Goa, India',
          start_date: '2026-08-20',
          end_date: '2026-08-28',
          duration_days: 8,
          budget: 50000,
          status: 'Ongoing',
          color: '#10b981'
        },
        {
          id: 105,
          name: 'Swiss Alps Winter Skiing',
          starting_location: 'Zermatt, Switzerland',
          start_date: '2026-08-05',
          end_date: '2026-08-15',
          duration_days: 10,
          budget: 4500,
          status: 'Ongoing',
          color: '#3b82f6'
        },
        {
          id: 102,
          name: 'Paris & Louvre Museum Tour',
          starting_location: 'Paris, France',
          start_date: '2026-09-10',
          end_date: '2026-09-18',
          duration_days: 8,
          budget: 3500,
          status: 'Up-coming',
          color: '#8b5cf6'
        },
        {
          id: 104,
          name: 'Kyoto Ancient Shrines & Tea Experience',
          starting_location: 'Kyoto, Japan',
          start_date: '2026-07-10',
          end_date: '2026-07-16',
          duration_days: 6,
          budget: 2800,
          status: 'Completed',
          color: '#64748b'
        }
      ];

      const existingIds = new Set(loadedTrips.map(t => t.id));
      const merged = [...loadedTrips];
      sampleTrips.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          merged.push(sample);
        }
      });

      setTrips(merged);
    } catch (err) {
      toast.error('Failed to load trips for calendar.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Math
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Helper to check if trip covers a specific day in active month
  const getTripsForDate = (dayNum) => {
    const targetDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const targetTime = new Date(targetDateStr).getTime();

    return trips.filter(trip => {
      if (!trip.start_date || !trip.end_date) return false;
      const startTime = new Date(trip.start_date.split('T')[0]).getTime();
      const endTime = new Date(trip.end_date.split('T')[0]).getTime();
      return targetTime >= startTime && targetTime <= endTime;
    });
  };

  const isToday = (dayNum) => {
    const today = new Date();
    return (
      today.getDate() === dayNum &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <div className="calendar-container page-content-padding">
      {/* Header Section */}
      <div className="calendar-header-section">
        <div>
          <h1 className="calendar-title">Trip Calendar</h1>
          <p className="calendar-subtitle">Get a bird's-eye view of all your planned adventures and trip dates.</p>
        </div>
        
        <div className="calendar-controls">
          <button className="btn btn-secondary btn-sm" onClick={handleToday}>
            Today
          </button>
          
          <div className="tabs view-toggle">
            <button className={`tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <FiCalendar /> Month Grid
            </button>
            <button className={`tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <FiList /> Trip Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="card calendar-card mt-6">
        <div className="card-header calendar-month-nav">
          <button className="btn-icon" onClick={handlePrevMonth} title="Previous Month">
            <FiChevronLeft />
          </button>
          <h2>{monthNames[currentMonth]} {currentYear}</h2>
          <button className="btn-icon" onClick={handleNextMonth} title="Next Month">
            <FiChevronRight />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center"><div className="spinner"></div></div>
        ) : viewMode === 'grid' ? (
          <div className="calendar-grid">
            {/* Weekday headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-weekday">{day}</div>
            ))}
            
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayTrips = getTripsForDate(dayNum);
              const todayClass = isToday(dayNum) ? 'today' : '';
              
              return (
                <div key={dayNum} className={`calendar-day ${todayClass}`}>
                  <div className="calendar-day-header">
                    <span className="calendar-day-number">{dayNum}</span>
                  </div>
                  
                  <div className="calendar-events">
                    {dayTrips.map(trip => (
                      <div 
                        key={trip.id} 
                        className="calendar-event-pill"
                        style={{ backgroundColor: trip.color || '#18181b' }}
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        title={`${trip.name} (${trip.starting_location || 'Destination'})`}
                      >
                        <span className="event-title">{trip.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="calendar-list-view">
            {trips.length === 0 ? (
              <div className="text-center p-8 text-neutral-500">No trips scheduled.</div>
            ) : (
              trips.map(trip => (
                <div key={trip.id} className="calendar-list-item" onClick={() => navigate(`/trips/${trip.id}`)}>
                  <div className="calendar-list-date">
                    <span className="calendar-list-month">
                      {trip.start_date ? monthNames[new Date(trip.start_date).getMonth()].substring(0, 3) : 'TRIP'}
                    </span>
                    <span className="calendar-list-day">
                      {trip.start_date ? new Date(trip.start_date).getDate() : '1'}
                    </span>
                  </div>
                  <div className="calendar-list-details">
                    <div className="calendar-list-marker" style={{ backgroundColor: trip.color || '#18181b' }}></div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{trip.name}</h3>
                      <p className="text-neutral-500 text-xs flex items-center gap-2 mt-1">
                        <span><FiMapPin /> {trip.starting_location || 'Destination'}</span>
                        <span>•</span>
                        <span><FiClock /> {trip.duration_days || 7} Days</span>
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm ml-auto">
                    View Trip
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

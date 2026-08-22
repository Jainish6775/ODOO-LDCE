import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiList, FiMapPin } from 'react-icons/fi';
import './TripCalendar.css';

export default function TripCalendar() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const currentDate = new Date('2026-07-01'); // Mocking current date to July 2026
  
  const daysInMonth = 31;
  const firstDayOfMonth = 3; // Wednesday (0=Sun, 1=Mon, ..., 3=Wed)

  // Mock Trips spanning dates
  const trips = [
    {
      id: 1,
      title: 'Summer in Kyoto',
      startDay: 10,
      endDay: 24,
      color: 'var(--primary-500)'
    },
    {
      id: 2,
      title: 'Weekend Getaway',
      startDay: 4,
      endDay: 6,
      color: 'var(--accent-500)'
    }
  ];

  const getTripsForDay = (day) => {
    return trips.filter(trip => day >= trip.startDay && day <= trip.endDay);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header-section">
        <div>
          <h1 className="calendar-title">Trip Calendar</h1>
          <p className="calendar-subtitle">Get a bird's-eye view of all your upcoming adventures.</p>
        </div>
        
        <div className="calendar-controls">
          <div className="tabs view-toggle">
            <button className={`tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <FiCalendar /> Grid
            </button>
            <button className={`tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <FiList /> List
            </button>
          </div>
        </div>
      </div>

      <div className="card calendar-card mt-6">
        <div className="card-header calendar-month-nav">
          <button className="btn-icon"><FiChevronLeft /></button>
          <h2>July 2026</h2>
          <button className="btn-icon"><FiChevronRight /></button>
        </div>

        {viewMode === 'grid' ? (
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
              const dayTrips = getTripsForDay(dayNum);
              return (
                <div key={dayNum} className={`calendar-day ${dayNum === 15 ? 'today' : ''}`}>
                  <div className="calendar-day-number">{dayNum}</div>
                  <div className="calendar-events">
                    {dayTrips.map(trip => {
                      const isStart = trip.startDay === dayNum;
                      const isEnd = trip.endDay === dayNum;
                      return (
                        <div 
                          key={trip.id} 
                          className={`calendar-event ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
                          style={{ backgroundColor: trip.color }}
                        >
                          {isStart ? trip.title : '\u00A0'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="calendar-list-view">
            {trips.map(trip => (
              <div key={trip.id} className="calendar-list-item">
                <div className="calendar-list-date">
                  <span className="calendar-list-month">Jul</span>
                  <span className="calendar-list-day">{trip.startDay}-{trip.endDay}</span>
                </div>
                <div className="calendar-list-details">
                  <div className="calendar-list-marker" style={{ backgroundColor: trip.color }}></div>
                  <div>
                    <h3>{trip.title}</h3>
                    <p className="text-neutral-500"><FiMapPin /> {trip.endDay - trip.startDay + 1} Days</p>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm ml-auto hide-mobile">View Trip</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

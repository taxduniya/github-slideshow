import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { mockBookings, mockGuests } from '../data/mockData';
import { CalendarEvent } from '../types';

interface CalendarProps {
  onCreateBooking?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onCreateBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Generate calendar events from bookings
  const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    mockBookings.forEach(booking => {
      const guest = mockGuests.find(g => g.id === booking.guestId);
      const guestName = guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest';
      
      // Main booking event
      events.push({
        id: `booking-${booking.id}`,
        title: `${guestName} - Room ${booking.roomNumber}`,
        start: booking.checkIn,
        end: booking.checkOut,
        type: 'booking',
        roomNumber: booking.roomNumber,
        guestName,
      });
      
      // Check-in event
      events.push({
        id: `checkin-${booking.id}`,
        title: `Check-in: ${guestName}`,
        start: booking.checkIn,
        end: booking.checkIn,
        type: 'checkin',
        roomNumber: booking.roomNumber,
        guestName,
      });
      
      // Check-out event
      events.push({
        id: `checkout-${booking.id}`,
        title: `Check-out: ${guestName}`,
        start: booking.checkOut,
        end: booking.checkOut,
        type: 'checkout',
        roomNumber: booking.roomNumber,
        guestName,
      });
    });
    
    return events;
  };

  const events = generateEvents();

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      if (event.type === 'booking') {
        return day >= event.start && day <= event.end;
      } else {
        return isSameDay(day, event.start);
      }
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const cloneDay = day;
      const dayEvents = getEventsForDay(cloneDay);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          key={day.toString()}
          className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => onCreateBooking && onCreateBooking(cloneDay)}
        >
          <span className="calendar-day-number">{format(day, 'd')}</span>
          <div style={{ flex: 1, minHeight: '80px' }}>
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`calendar-event ${event.type}`}
                title={event.title}
              >
                {event.type === 'booking' 
                  ? `Room ${event.roomNumber}` 
                  : event.type === 'checkin' 
                    ? `In: ${event.roomNumber}`
                    : `Out: ${event.roomNumber}`
                }
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="calendar-event" style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return days;
  };

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="calendar-header">
        <h2 className="section-title">{format(currentDate, dateFormat)}</h2>
        <div className="calendar-nav">
          <button className="btn btn-outline btn-sm" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
          <button className="btn btn-outline btn-sm" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onCreateBooking && onCreateBooking(new Date())}>
            <Plus className="btn-icon" />
            New Booking
          </button>
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '1px',
        backgroundColor: 'var(--gray-200)',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        overflow: 'hidden',
        marginBottom: '1px'
      }}>
        {daysOfWeek.map(day => (
          <div 
            key={day}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--gray-100)',
              textAlign: 'center',
              fontWeight: '600',
              color: 'var(--gray-700)',
              fontSize: '0.875rem'
            }}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">Booking Calendar</h1>
      
      <div className="calendar-container">
        {renderHeader()}
        
        {/* Legend */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              border: '2px solid var(--primary-blue)',
              borderRadius: 'var(--radius-sm)'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Booking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--emerald)',
              borderRadius: 'var(--radius-sm)'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Check-in</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid var(--danger)',
              borderRadius: 'var(--radius-sm)'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Check-out</span>
          </div>
        </div>

        {renderDaysOfWeek()}
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Today's Activity */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Today's Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <h4 style={{ color: 'var(--emerald)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
              Check-ins
            </h4>
            {mockBookings
              .filter(booking => isSameDay(booking.checkIn, new Date()))
              .map(booking => {
                const guest = mockGuests.find(g => g.id === booking.guestId);
                return (
                  <div key={booking.id} style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'var(--gray-50)', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontWeight: '600' }}>
                      {guest?.firstName} {guest?.lastName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Room {booking.roomNumber} • {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            {mockBookings.filter(booking => isSameDay(booking.checkIn, new Date())).length === 0 && (
              <p style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>No check-ins today</p>
            )}
          </div>

          <div>
            <h4 style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
              Check-outs
            </h4>
            {mockBookings
              .filter(booking => isSameDay(booking.checkOut, new Date()))
              .map(booking => {
                const guest = mockGuests.find(g => g.id === booking.guestId);
                return (
                  <div key={booking.id} style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'var(--gray-50)', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontWeight: '600' }}>
                      {guest?.firstName} {guest?.lastName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Room {booking.roomNumber} • ${booking.totalAmount}
                    </div>
                  </div>
                );
              })}
            {mockBookings.filter(booking => isSameDay(booking.checkOut, new Date())).length === 0 && (
              <p style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>No check-outs today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
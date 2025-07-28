import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar } from 'lucide-react';
import { mockBookings, mockGuests, rooms } from '../data/mockData';
import { Booking, Guest } from '../types';

interface BookingsProps {
  onEditBooking?: (booking: Booking) => void;
  onCreateBooking?: () => void;
}

const Bookings: React.FC<BookingsProps> = ({ onEditBooking, onCreateBooking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Get bookings with guest information
  const getBookingsWithGuests = () => {
    return mockBookings.map(booking => ({
      ...booking,
      guest: mockGuests.find(g => g.id === booking.guestId)
    }));
  };

  // Filter bookings based on search and status
  const filteredBookings = getBookingsWithGuests().filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.guest?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    if (onEditBooking) {
      onEditBooking(booking);
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      // In a real app, this would call an API
      console.log('Deleting booking:', bookingId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'var(--primary-blue)';
      case 'checked-in': return 'var(--emerald)';
      case 'checked-out': return 'var(--gray-600)';
      case 'cancelled': return 'var(--danger)';
      default: return 'var(--gray-600)';
    }
  };

  const BookingModal = () => {
    if (!selectedBooking) return null;
    
    const guest = mockGuests.find(g => g.id === selectedBooking.guestId);
    
    return (
      <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Booking Details</h2>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Guest Information</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Name:</strong> {guest?.firstName} {guest?.lastName}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> {guest?.email}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Phone:</strong> {guest?.phone}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>ID Number:</strong> {guest?.idNumber}
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Booking Details</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Room:</strong> {selectedBooking.roomNumber}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Check-in:</strong> {selectedBooking.checkIn.toLocaleDateString()}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Check-out:</strong> {selectedBooking.checkOut.toLocaleDateString()}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Guests:</strong> {selectedBooking.numberOfGuests}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Total Amount:</strong> ${selectedBooking.totalAmount}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Status:</strong> 
                  <span 
                    className={`status-badge ${selectedBooking.status}`}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedBooking.notes && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Notes</h4>
                <p style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--gray-700)'
                }}>
                  {selectedBooking.notes}
                </p>
              </div>
            )}
            
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Emergency Contact</h4>
              <div style={{ marginBottom: '0.25rem' }}>
                <strong>Name:</strong> {guest?.emergencyContact}
              </div>
              <div>
                <strong>Phone:</strong> {guest?.emergencyPhone}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowBookingModal(false);
                handleEditBooking(selectedBooking);
              }}
            >
              <Edit2 className="btn-icon" />
              Edit Booking
            </button>
            <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">Booking Management</h1>
        <button className="btn btn-primary" onClick={onCreateBooking}>
          <Plus className="btn-icon" />
          New Booking
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-input">
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)'
              }} 
            />
            <input
              type="text"
              placeholder="Search by guest name or room..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select 
          className="form-select filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {booking.guest?.firstName} {booking.guest?.lastName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {booking.guest?.email}
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>{booking.roomNumber}</td>
                <td>{booking.checkIn.toLocaleDateString()}</td>
                <td>{booking.checkOut.toLocaleDateString()}</td>
                <td>{booking.numberOfGuests}</td>
                <td style={{ fontWeight: '600' }}>${booking.totalAmount}</td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleViewBooking(booking)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditBooking(booking)}
                      title="Edit Booking"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Delete Booking"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="card text-center" style={{ marginTop: '2rem' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray-400)' }} />
          <h3 style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>No bookings found</h3>
          <p style={{ color: 'var(--gray-500)' }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first booking.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onCreateBooking}>
              <Plus className="btn-icon" />
              Create First Booking
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginTop: '2rem' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Bookings</span>
            <Calendar className="stat-icon" />
          </div>
          <div className="stat-value">{filteredBookings.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Confirmed</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--primary-blue)' }}>
            {filteredBookings.filter(b => b.status === 'confirmed').length}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Checked In</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--emerald)' }}>
            {filteredBookings.filter(b => b.status === 'checked-in').length}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--emerald)' }}>
            ${filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {showBookingModal && <BookingModal />}
    </div>
  );
};

export default Bookings;
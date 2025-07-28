import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Users, Mail, Phone, MapPin } from 'lucide-react';
import { mockGuests, mockBookings } from '../data/mockData';
import { Guest } from '../types';

interface GuestsProps {
  onEditGuest?: (guest: Guest) => void;
  onCreateGuest?: () => void;
}

const Guests: React.FC<GuestsProps> = ({ onEditGuest, onCreateGuest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Filter guests based on search
  const filteredGuests = mockGuests.filter(guest => {
    return !searchTerm || 
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm);
  });

  const handleViewGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowGuestModal(true);
  };

  const handleEditGuest = (guest: Guest) => {
    if (onEditGuest) {
      onEditGuest(guest);
    }
  };

  const handleDeleteGuest = (guestId: string) => {
    if (window.confirm('Are you sure you want to delete this guest? This action cannot be undone.')) {
      // In a real app, this would call an API
      console.log('Deleting guest:', guestId);
    }
  };

  const getGuestBookings = (guestId: string) => {
    return mockBookings.filter(booking => booking.guestId === guestId);
  };

  const GuestModal = () => {
    if (!selectedGuest) return null;
    
    const guestBookings = getGuestBookings(selectedGuest.id);
    const totalSpent = guestBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    return (
      <div className="modal-overlay" onClick={() => setShowGuestModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Guest Profile</h2>
            <button className="modal-close" onClick={() => setShowGuestModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Personal Information</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Users size={16} style={{ color: 'var(--gray-500)' }} />
                    <strong>Name:</strong>
                  </div>
                  <div style={{ paddingLeft: '1.25rem' }}>
                    {selectedGuest.firstName} {selectedGuest.lastName}
                  </div>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Mail size={16} style={{ color: 'var(--gray-500)' }} />
                    <strong>Email:</strong>
                  </div>
                  <div style={{ paddingLeft: '1.25rem' }}>
                    <a href={`mailto:${selectedGuest.email}`} style={{ color: 'var(--primary-blue)' }}>
                      {selectedGuest.email}
                    </a>
                  </div>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Phone size={16} style={{ color: 'var(--gray-500)' }} />
                    <strong>Phone:</strong>
                  </div>
                  <div style={{ paddingLeft: '1.25rem' }}>
                    <a href={`tel:${selectedGuest.phone}`} style={{ color: 'var(--primary-blue)' }}>
                      {selectedGuest.phone}
                    </a>
                  </div>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <MapPin size={16} style={{ color: 'var(--gray-500)' }} />
                    <strong>Address:</strong>
                  </div>
                  <div style={{ paddingLeft: '1.25rem' }}>
                    {selectedGuest.address}
                  </div>
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>ID Number:</strong> {selectedGuest.idNumber}
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Emergency Contact</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Name:</strong> {selectedGuest.emergencyContact}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Phone:</strong> 
                  <a href={`tel:${selectedGuest.emergencyPhone}`} style={{ color: 'var(--primary-blue)', marginLeft: '0.5rem' }}>
                    {selectedGuest.emergencyPhone}
                  </a>
                </div>
                
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Guest Statistics</h4>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Total Bookings:</strong> {guestBookings.length}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Total Spent:</strong> ${totalSpent.toLocaleString()}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Member Since:</strong> {selectedGuest.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {guestBookings.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Booking History</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {guestBookings
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .map(booking => (
                      <div key={booking.id} style={{ 
                        padding: '0.75rem', 
                        backgroundColor: 'var(--gray-50)', 
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            Room {booking.roomNumber}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '600' }}>
                            ${booking.totalAmount}
                          </div>
                          <span className={`status-badge ${booking.status}`} style={{ fontSize: '0.7rem' }}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowGuestModal(false);
                handleEditGuest(selectedGuest);
              }}
            >
              <Edit2 className="btn-icon" />
              Edit Guest
            </button>
            <button className="btn btn-secondary" onClick={() => setShowGuestModal(false)}>
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
        <h1 className="page-title">Guest Management</h1>
        <button className="btn btn-primary" onClick={onCreateGuest}>
          <Plus className="btn-icon" />
          New Guest
        </button>
      </div>

      {/* Search Bar */}
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
              placeholder="Search by name, email, or phone..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Guests Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {filteredGuests.map((guest) => {
          const guestBookings = getGuestBookings(guest.id);
          const totalSpent = guestBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
          
          return (
            <div key={guest.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ 
                    color: 'var(--gray-900)', 
                    marginBottom: '0.25rem',
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {guest.firstName} {guest.lastName}
                  </h3>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                    Member since {guest.createdAt.toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleViewGuest(guest)}
                    title="View Profile"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditGuest(guest)}
                    title="Edit Guest"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteGuest(guest.id)}
                    title="Delete Guest"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Mail size={16} style={{ color: 'var(--gray-500)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                    {guest.email}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Phone size={16} style={{ color: 'var(--gray-500)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                    {guest.phone}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: 'var(--gray-500)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                    {guest.address}
                  </span>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-blue)' }}>
                    {guestBookings.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                    Bookings
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--emerald)' }}>
                    ${totalSpent.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                    Total Spent
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGuests.length === 0 && (
        <div className="card text-center" style={{ marginTop: '2rem' }}>
          <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray-400)' }} />
          <h3 style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>No guests found</h3>
          <p style={{ color: 'var(--gray-500)' }}>
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : 'Get started by adding your first guest.'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onCreateGuest}>
              <Plus className="btn-icon" />
              Add First Guest
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Guests</span>
            <Users className="stat-icon" />
          </div>
          <div className="stat-value">{filteredGuests.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Guests</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--emerald)' }}>
            {filteredGuests.filter(guest => 
              mockBookings.some(booking => 
                booking.guestId === guest.id && booking.status === 'checked-in'
              )
            ).length}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">New This Month</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--primary-blue)' }}>
            {filteredGuests.filter(guest => {
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              return guest.createdAt >= oneMonthAgo;
            }).length}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Repeat Guests</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {filteredGuests.filter(guest => 
              getGuestBookings(guest.id).length > 1
            ).length}
          </div>
        </div>
      </div>

      {showGuestModal && <GuestModal />}
    </div>
  );
};

export default Guests;
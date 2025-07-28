import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, CreditCard, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockPayments, mockBookings, mockGuests } from '../data/mockData';
import { Payment } from '../types';

interface PaymentsProps {
  onEditPayment?: (payment: Payment) => void;
  onCreatePayment?: () => void;
}

const Payments: React.FC<PaymentsProps> = ({ onEditPayment, onCreatePayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Get payments with booking and guest information
  const getPaymentsWithDetails = () => {
    return mockPayments.map(payment => {
      const booking = mockBookings.find(b => b.id === payment.bookingId);
      const guest = booking ? mockGuests.find(g => g.id === booking.guestId) : null;
      return {
        ...payment,
        booking,
        guest
      };
    });
  };

  // Filter payments based on search and filters
  const filteredPayments = getPaymentsWithDetails().filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.guest?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.guest?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking?.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleEditPayment = (payment: Payment) => {
    if (onEditPayment) {
      onEditPayment(payment);
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      console.log('Deleting payment:', paymentId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'pending': return <Clock size={16} style={{ color: 'var(--warning)' }} />;
      case 'failed': return <XCircle size={16} style={{ color: 'var(--danger)' }} />;
      case 'refunded': return <XCircle size={16} style={{ color: 'var(--danger)' }} />;
      default: return <Clock size={16} style={{ color: 'var(--gray-400)' }} />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard size={16} style={{ color: 'var(--primary-blue)' }} />;
      case 'cash': return <DollarSign size={16} style={{ color: 'var(--emerald)' }} />;
      case 'transfer': return <CreditCard size={16} style={{ color: 'var(--warning)' }} />;
      case 'cheque': return <CreditCard size={16} style={{ color: 'var(--gray-600)' }} />;
      default: return <CreditCard size={16} style={{ color: 'var(--gray-400)' }} />;
    }
  };

  const PaymentModal = () => {
    if (!selectedPayment) return null;
    
    const paymentDetails = getPaymentsWithDetails().find(p => p.id === selectedPayment.id);
    
    return (
      <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Payment Details</h2>
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Payment Information</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Amount:</strong> 
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--emerald)', marginLeft: '0.5rem' }}>
                    ${selectedPayment.amount.toLocaleString()}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Method:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    textTransform: 'capitalize'
                  }}>
                    {getMethodIcon(selectedPayment.method)}
                    {selectedPayment.method}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedPayment.status}`} style={{ marginLeft: '0.5rem' }}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Transaction Reference:</strong> {selectedPayment.transactionReference}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Payment Date:</strong> {selectedPayment.paymentDate.toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Booking Information</h4>
                {paymentDetails?.booking && (
                  <>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Guest:</strong> {paymentDetails.guest?.firstName} {paymentDetails.guest?.lastName}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Room:</strong> {paymentDetails.booking.roomNumber}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Check-in:</strong> {paymentDetails.booking.checkIn.toLocaleDateString()}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Check-out:</strong> {paymentDetails.booking.checkOut.toLocaleDateString()}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Total Booking Amount:</strong> ${paymentDetails.booking.totalAmount}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {selectedPayment.notes && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Notes</h4>
                <p style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--gray-700)'
                }}>
                  {selectedPayment.notes}
                </p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowPaymentModal(false);
                handleEditPayment(selectedPayment);
              }}
            >
              <Edit2 className="btn-icon" />
              Edit Payment
            </button>
            <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const calculateStats = () => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const completedAmount = filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = filteredPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return { totalAmount, completedAmount, pendingAmount };
  };

  const stats = calculateStats();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">Payment Tracking</h1>
        <button className="btn btn-primary" onClick={onCreatePayment}>
          <Plus className="btn-icon" />
          Record Payment
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
              placeholder="Search by guest, room, or transaction reference..."
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
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        
        <select 
          className="form-select filter-select"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="all">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Transfer</option>
          <option value="cheque">Cheque</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card revenue">
          <div className="stat-header">
            <span className="stat-title">Total Payments</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value">${stats.totalAmount.toLocaleString()}</div>
        </div>
        
        <div className="stat-card bookings">
          <div className="stat-header">
            <span className="stat-title">Completed</span>
            <CheckCircle className="stat-icon" />
          </div>
          <div className="stat-value" style={{ color: 'var(--emerald)' }}>
            ${stats.completedAmount.toLocaleString()}
          </div>
        </div>
        
        <div className="stat-card expenses">
          <div className="stat-header">
            <span className="stat-title">Pending</span>
            <Clock className="stat-icon" />
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            ${stats.pendingAmount.toLocaleString()}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Transactions</span>
            <CreditCard className="stat-icon" />
          </div>
          <div className="stat-value">{filteredPayments.length}</div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Guest & Booking</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {payment.guest?.firstName} {payment.guest?.lastName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Room {payment.booking?.roomNumber}
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: 'var(--emerald)' }}>
                    ${payment.amount.toLocaleString()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getMethodIcon(payment.method)}
                    <span style={{ textTransform: 'capitalize' }}>{payment.method}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(payment.status)}
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </div>
                </td>
                <td>{payment.paymentDate.toLocaleDateString()}</td>
                <td>
                  <code style={{ 
                    fontSize: '0.875rem', 
                    backgroundColor: 'var(--gray-100)', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {payment.transactionReference}
                  </code>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleViewPayment(payment)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditPayment(payment)}
                      title="Edit Payment"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePayment(payment.id)}
                      title="Delete Payment"
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

      {filteredPayments.length === 0 && (
        <div className="card text-center" style={{ marginTop: '2rem' }}>
          <CreditCard size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray-400)' }} />
          <h3 style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>No payments found</h3>
          <p style={{ color: 'var(--gray-500)' }}>
            {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by recording your first payment.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && methodFilter === 'all' && (
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onCreatePayment}>
              <Plus className="btn-icon" />
              Record First Payment
            </button>
          )}
        </div>
      )}

      {/* Payment Method Breakdown */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Payment Method Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['cash', 'card', 'transfer', 'cheque'].map(method => {
            const methodPayments = filteredPayments.filter(p => p.method === method);
            const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
            
            return (
              <div key={method} style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--gray-50)', 
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  {getMethodIcon(method)}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                  ${methodTotal.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', textTransform: 'capitalize' }}>
                  {method} ({methodPayments.length})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default Payments;
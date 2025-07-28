import React from 'react';
import { 
  DollarSign, 
  Bed, 
  Receipt, 
  TrendingUp, 
  Calendar,
  Users,
  CheckIn,
  CheckOut
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockBookings, mockPayments, mockExpenses, mockGuests } from '../data/mockData';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  // Calculate dashboard stats
  const calculateStats = (): DashboardStats => {
    const totalRevenue = mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const today = new Date();
    const checkInsToday = mockBookings.filter(b => 
      b.checkIn.toDateString() === today.toDateString()
    ).length;
    
    const checkOutsToday = mockBookings.filter(b => 
      b.checkOut.toDateString() === today.toDateString()
    ).length;
    
    const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
    
    const occupiedRooms = mockBookings.filter(b => b.status === 'checked-in').length;
    const totalRooms = 15; // Assuming 15 total rooms
    const occupancyRate = (occupiedRooms / totalRooms) * 100;
    
    return {
      totalBookings: mockBookings.length,
      totalRevenue,
      totalExpenses,
      occupancyRate,
      checkInsToday,
      checkOutsToday,
      pendingPayments,
      availableRooms: totalRooms - occupiedRooms,
    };
  };

  const stats = calculateStats();

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4500, expenses: 2100 },
    { month: 'Feb', revenue: 5200, expenses: 2350 },
    { month: 'Mar', revenue: 4800, expenses: 2200 },
    { month: 'Apr', revenue: 6100, expenses: 2800 },
    { month: 'May', revenue: 5900, expenses: 2600 },
    { month: 'Jun', revenue: 6800, expenses: 3100 },
  ];

  const occupancyData = [
    { day: 'Mon', rate: 85 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 78 },
    { day: 'Thu', rate: 88 },
    { day: 'Fri', rate: 95 },
    { day: 'Sat', rate: 100 },
    { day: 'Sun', rate: 87 },
  ];

  const recentBookings = mockBookings
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const recentGuests = mockGuests
    .filter(guest => mockBookings.some(booking => booking.guestId === guest.id))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +12.5% from last month
          </div>
        </div>

        <div className="stat-card bookings">
          <div className="stat-header">
            <span className="stat-title">Total Bookings</span>
            <Bed className="stat-icon" />
          </div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +8.2% from last month
          </div>
        </div>

        <div className="stat-card expenses">
          <div className="stat-header">
            <span className="stat-title">Total Expenses</span>
            <Receipt className="stat-icon" />
          </div>
          <div className="stat-value">${stats.totalExpenses.toLocaleString()}</div>
          <div className="stat-change negative">
            <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />
            +5.1% from last month
          </div>
        </div>

        <div className="stat-card occupancy">
          <div className="stat-header">
            <span className="stat-title">Occupancy Rate</span>
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-value">{stats.occupancyRate.toFixed(1)}%</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            +3.4% from last month
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Check-ins Today</span>
            <CheckIn className="stat-icon" />
          </div>
          <div className="stat-value">{stats.checkInsToday}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Check-outs Today</span>
            <CheckOut className="stat-icon" />
          </div>
          <div className="stat-value">{stats.checkOutsToday}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Pending Payments</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value">{stats.pendingPayments}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Available Rooms</span>
            <Bed className="stat-icon" />
          </div>
          <div className="stat-value">{stats.availableRooms}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#059669" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Weekly Occupancy Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Recent Bookings</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentBookings.map((booking) => {
              const guest = mockGuests.find(g => g.id === booking.guestId);
              return (
                <div key={booking.id} style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid var(--gray-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {guest?.firstName} {guest?.lastName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Room {booking.roomNumber} • {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Recent Guests</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentGuests.map((guest) => (
              <div key={guest.id} style={{ 
                padding: '1rem', 
                borderBottom: '1px solid var(--gray-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                    {guest.firstName} {guest.lastName}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    {guest.email}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  {guest.createdAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { Download, Calendar, Filter, FileText, DollarSign, Users, Bed } from 'lucide-react';
import { mockBookings, mockPayments, mockExpenses, mockGuests } from '../data/mockData';
import { format } from 'date-fns';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [reportType, setReportType] = useState('all');

  const generateCSVContent = (data: any[], filename: string) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterByDateRange = (items: any[], dateField: string) => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date
    
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const generateBookingsReport = () => {
    const filteredBookings = filterByDateRange(mockBookings, 'createdAt');
    
    const reportData = filteredBookings.map(booking => {
      const guest = mockGuests.find(g => g.id === booking.guestId);
      return {
        'Booking ID': booking.id,
        'Guest Name': guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown',
        'Guest Email': guest?.email || '',
        'Guest Phone': guest?.phone || '',
        'Room Number': booking.roomNumber,
        'Check-in Date': booking.checkIn.toLocaleDateString(),
        'Check-out Date': booking.checkOut.toLocaleDateString(),
        'Number of Guests': booking.numberOfGuests,
        'Total Amount': booking.totalAmount,
        'Status': booking.status,
        'Notes': booking.notes,
        'Created Date': booking.createdAt.toLocaleDateString()
      };
    });

    return reportData;
  };

  const generatePaymentsReport = () => {
    const filteredPayments = filterByDateRange(mockPayments, 'paymentDate');
    
    const reportData = filteredPayments.map(payment => {
      const booking = mockBookings.find(b => b.id === payment.bookingId);
      const guest = booking ? mockGuests.find(g => g.id === booking.guestId) : null;
      
      return {
        'Payment ID': payment.id,
        'Guest Name': guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown',
        'Room Number': booking?.roomNumber || '',
        'Amount': payment.amount,
        'Payment Method': payment.method,
        'Status': payment.status,
        'Transaction Reference': payment.transactionReference,
        'Payment Date': payment.paymentDate.toLocaleDateString(),
        'Notes': payment.notes
      };
    });

    return reportData;
  };

  const generateExpensesReport = () => {
    const filteredExpenses = filterByDateRange(mockExpenses, 'date');
    
    const reportData = filteredExpenses.map(expense => ({
      'Expense ID': expense.id,
      'Category': expense.category,
      'Description': expense.description,
      'Amount': expense.amount,
      'Payment Method': expense.paymentMethod,
      'Receipt Number': expense.receipt,
      'Date': expense.date.toLocaleDateString(),
      'Notes': expense.notes
    }));

    return reportData;
  };

  const generateGuestsReport = () => {
    const filteredGuests = filterByDateRange(mockGuests, 'createdAt');
    
    const reportData = filteredGuests.map(guest => {
      const guestBookings = mockBookings.filter(b => b.guestId === guest.id);
      const totalSpent = guestBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      
      return {
        'Guest ID': guest.id,
        'First Name': guest.firstName,
        'Last Name': guest.lastName,
        'Email': guest.email,
        'Phone': guest.phone,
        'Address': guest.address,
        'ID Number': guest.idNumber,
        'Emergency Contact': guest.emergencyContact,
        'Emergency Phone': guest.emergencyPhone,
        'Total Bookings': guestBookings.length,
        'Total Spent': totalSpent,
        'Registration Date': guest.createdAt.toLocaleDateString()
      };
    });

    return reportData;
  };

  const generateFinancialSummaryReport = () => {
    const filteredBookings = filterByDateRange(mockBookings, 'createdAt');
    const filteredPayments = filterByDateRange(mockPayments, 'paymentDate');
    const filteredExpenses = filterByDateRange(mockExpenses, 'date');
    
    const totalRevenue = filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBookings = filteredBookings.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    const reportData = [{
      'Report Period': `${dateRange.startDate} to ${dateRange.endDate}`,
      'Total Bookings': totalBookings,
      'Total Revenue': totalRevenue,
      'Total Expenses': totalExpenses,
      'Net Profit': totalRevenue - totalExpenses,
      'Average Booking Value': Math.round(averageBookingValue * 100) / 100,
      'Completed Payments': filteredPayments.filter(p => p.status === 'completed').length,
      'Pending Payments': filteredPayments.filter(p => p.status === 'pending').length,
      'Generated Date': new Date().toLocaleDateString()
    }];

    return reportData;
  };

  const handleDownloadReport = (type: string) => {
    let reportData: any[] = [];
    let filename = '';

    switch (type) {
      case 'bookings':
        reportData = generateBookingsReport();
        filename = 'bookings_report';
        break;
      case 'payments':
        reportData = generatePaymentsReport();
        filename = 'payments_report';
        break;
      case 'expenses':
        reportData = generateExpensesReport();
        filename = 'expenses_report';
        break;
      case 'guests':
        reportData = generateGuestsReport();
        filename = 'guests_report';
        break;
      case 'financial':
        reportData = generateFinancialSummaryReport();
        filename = 'financial_summary_report';
        break;
      default:
        return;
    }

    if (reportData.length === 0) {
      alert('No data available for the selected date range.');
      return;
    }

    const csvContent = generateCSVContent(reportData, filename);
    downloadCSV(csvContent, filename);
  };

  const getReportStats = () => {
    const filteredBookings = filterByDateRange(mockBookings, 'createdAt');
    const filteredPayments = filterByDateRange(mockPayments, 'paymentDate');
    const filteredExpenses = filterByDateRange(mockExpenses, 'date');
    const filteredGuests = filterByDateRange(mockGuests, 'createdAt');

    return {
      bookings: filteredBookings.length,
      payments: filteredPayments.length,
      expenses: filteredExpenses.length,
      guests: filteredGuests.length,
      revenue: filteredPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      totalExpenses: filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
  };

  const stats = getReportStats();

  const reportTypes = [
    {
      id: 'bookings',
      title: 'Bookings Report',
      description: 'Complete booking details with guest information',
      icon: Bed,
      count: stats.bookings,
      color: 'var(--primary-blue)'
    },
    {
      id: 'payments',
      title: 'Payments Report',
      description: 'Payment transactions and financial records',
      icon: DollarSign,
      count: stats.payments,
      color: 'var(--emerald)'
    },
    {
      id: 'expenses',
      title: 'Expenses Report',
      description: 'Petty expenses and operational costs',
      icon: FileText,
      count: stats.expenses,
      color: 'var(--danger)'
    },
    {
      id: 'guests',
      title: 'Guests Report',
      description: 'Guest profiles and booking history',
      icon: Users,
      count: stats.guests,
      color: 'var(--warning)'
    },
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'Revenue, expenses, and profit analysis',
      icon: DollarSign,
      count: 1,
      color: 'var(--emerald)'
    }
  ];

  return (
    <div>
      <h1 className="page-title">Reports & Analytics</h1>
      
      {/* Date Range and Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Report Configuration</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          marginTop: '1rem'
        }}>
          <Calendar size={20} style={{ color: 'var(--gray-500)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
            Report period: <strong>{format(new Date(dateRange.startDate), 'MMM dd, yyyy')}</strong> to{' '}
            <strong>{format(new Date(dateRange.endDate), 'MMM dd, yyyy')}</strong>
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card revenue">
          <div className="stat-header">
            <span className="stat-title">Period Revenue</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value">${stats.revenue.toLocaleString()}</div>
        </div>
        
        <div className="stat-card expenses">
          <div className="stat-header">
            <span className="stat-title">Period Expenses</span>
            <FileText className="stat-icon" />
          </div>
          <div className="stat-value">${stats.totalExpenses.toLocaleString()}</div>
        </div>
        
        <div className="stat-card bookings">
          <div className="stat-header">
            <span className="stat-title">Net Profit</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value" style={{ color: stats.revenue - stats.totalExpenses >= 0 ? 'var(--emerald)' : 'var(--danger)' }}>
            ${(stats.revenue - stats.totalExpenses).toLocaleString()}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Records</span>
            <FileText className="stat-icon" />
          </div>
          <div className="stat-value">{stats.bookings + stats.payments + stats.expenses + stats.guests}</div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: `${report.color}15`,
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: report.color }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    color: 'var(--gray-900)', 
                    marginBottom: '0.5rem',
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {report.title}
                  </h4>
                  <p style={{ 
                    color: 'var(--gray-600)', 
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {report.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                      {report.count} record{report.count !== 1 ? 's' : ''} available
                    </span>
                    <span style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: report.color 
                    }}>
                      {report.count}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => handleDownloadReport(report.id)}
                    disabled={report.count === 0}
                  >
                    <Download className="btn-icon" />
                    Download CSV
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="card-title">Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline"
            onClick={() => {
              const today = new Date();
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
              setDateRange({
                startDate: format(firstDay, 'yyyy-MM-dd'),
                endDate: format(today, 'yyyy-MM-dd')
              });
            }}
          >
            Current Month
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
              setDateRange({
                startDate: format(lastMonth, 'yyyy-MM-dd'),
                endDate: format(lastDayOfLastMonth, 'yyyy-MM-dd')
              });
            }}
          >
            Last Month
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={() => {
              const today = new Date();
              const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
              setDateRange({
                startDate: format(threeMonthsAgo, 'yyyy-MM-dd'),
                endDate: format(today, 'yyyy-MM-dd')
              });
            }}
          >
            Last 3 Months
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={() => {
              const today = new Date();
              const yearStart = new Date(today.getFullYear(), 0, 1);
              setDateRange({
                startDate: format(yearStart, 'yyyy-MM-dd'),
                endDate: format(today, 'yyyy-MM-dd')
              });
            }}
          >
            Year to Date
          </button>
        </div>
      </div>

      {/* Report Information */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Report Information</h3>
        <div className="form-grid">
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Available Reports</h4>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--gray-600)' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Bookings Report:</strong> Comprehensive booking details including guest information, room assignments, dates, and status
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Payments Report:</strong> All payment transactions with methods, amounts, and status tracking
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Expenses Report:</strong> Detailed expense tracking by category with receipt information
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Guests Report:</strong> Guest profiles with contact details and booking history
              </li>
              <li>
                <strong>Financial Summary:</strong> High-level financial overview with revenue, expenses, and profitability
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Export Features</h4>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--gray-600)' }}>
              <li style={{ marginBottom: '0.5rem' }}>CSV format for easy import into spreadsheet applications</li>
              <li style={{ marginBottom: '0.5rem' }}>Date range filtering for specific periods</li>
              <li style={{ marginBottom: '0.5rem' }}>Complete field inclusion for comprehensive analysis</li>
              <li style={{ marginBottom: '0.5rem' }}>Automatic filename generation with export date</li>
              <li>Compatible with Excel, Google Sheets, and other data analysis tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
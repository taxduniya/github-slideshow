import React, { useState } from 'react';
import './App.css';

// Import components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Bookings from './components/Bookings';
import Guests from './components/Guests';
import Payments from './components/Payments';
import Expenses from './components/Expenses';
import Reports from './components/Reports';

// Import types
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
      case 'bookings':
        return (
          <Bookings 
            onCreateBooking={() => console.log('Create booking')}
            onEditBooking={(booking) => console.log('Edit booking:', booking)}
          />
        );
      case 'guests':
        return (
          <Guests 
            onCreateGuest={() => console.log('Create guest')}
            onEditGuest={(guest) => console.log('Edit guest:', guest)}
          />
        );
      case 'payments':
        return (
          <Payments 
            onCreatePayment={() => console.log('Create payment')}
            onEditPayment={(payment) => console.log('Edit payment:', payment)}
          />
        );
      case 'expenses':
        return (
          <Expenses 
            onCreateExpense={() => console.log('Create expense')}
            onEditExpense={(expense) => console.log('Edit expense:', expense)}
          />
        );
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;

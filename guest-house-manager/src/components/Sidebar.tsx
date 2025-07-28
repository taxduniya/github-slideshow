import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  Bed, 
  CreditCard, 
  Receipt, 
  FileText, 
  Settings 
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home },
    { id: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
    { id: 'bookings' as ViewType, label: 'Bookings', icon: Bed },
    { id: 'guests' as ViewType, label: 'Guests', icon: Users },
    { id: 'payments' as ViewType, label: 'Payments', icon: CreditCard },
    { id: 'expenses' as ViewType, label: 'Expenses', icon: Receipt },
    { id: 'reports' as ViewType, label: 'Reports', icon: FileText },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">GuestHouse Pro</h1>
        <p className="sidebar-subtitle">Management System</p>
      </div>
      
      <nav>
        <ul className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <a
                  href="#"
                  className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange(item.id);
                  }}
                >
                  <Icon className="nav-icon" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto">
        <a href="#" className="nav-link">
          <Settings className="nav-icon" />
          Settings
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
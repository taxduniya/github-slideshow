export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  guestId: string;
  guest?: Guest;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalAmount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  notes: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'cheque';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionReference: string;
  paymentDate: Date;
  notes: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque';
  receipt: string;
  notes: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalExpenses: number;
  occupancyRate: number;
  checkInsToday: number;
  checkOutsToday: number;
  pendingPayments: number;
  availableRooms: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'booking' | 'checkout' | 'checkin';
  roomNumber: string;
  guestName: string;
}

export type ViewType = 'dashboard' | 'calendar' | 'bookings' | 'guests' | 'payments' | 'expenses' | 'reports';
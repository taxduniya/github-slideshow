# 🏨 GuestHouse Pro - Comprehensive Booking Management System

A beautiful, production-ready guest house booking management system built with React, TypeScript, and modern design principles. Features a professional blue and emerald color scheme with comprehensive functionality for managing bookings, guests, payments, expenses, and generating detailed reports.

## ✨ Features

### 🎯 Core Features
- **Interactive Calendar** - Visual booking management with drag-and-drop interface
- **Guest Management** - Complete guest profiles with contact details and booking history
- **Booking System** - Full booking lifecycle management with status tracking
- **Payment Tracking** - Comprehensive payment processing and financial records
- **Expense Monitor** - Petty expense tracking with categorization and receipt management
- **Reports & Analytics** - Downloadable CSV reports with date filtering

### 🎨 Design Features
- **Modern UI/UX** - Clean, professional interface with intuitive navigation
- **Responsive Design** - Fully responsive layout for all screen sizes
- **Color Scheme** - Professional blue (#2563eb) and emerald (#059669) with neutral grays
- **Smooth Animations** - Subtle transitions and hover effects throughout
- **Accessibility** - WCAG compliant design with proper contrast ratios

### 📊 Dashboard & Analytics
- **Key Metrics** - Revenue, bookings, expenses, and occupancy rates
- **Interactive Charts** - Revenue vs expenses, occupancy trends
- **Recent Activity** - Latest bookings and guest registrations
- **Financial Overview** - Real-time profit/loss calculations

### 📅 Calendar Management
- **Monthly View** - Full calendar with booking visualization
- **Event Types** - Different colors for bookings, check-ins, and check-outs
- **Today's Activity** - Dedicated section for current day operations
- **Quick Actions** - Fast booking creation and navigation

### 👥 Guest Management
- **Detailed Profiles** - Complete guest information including emergency contacts
- **Booking History** - Track all past and future reservations
- **Contact Management** - Email and phone integration
- **Search & Filter** - Quick guest lookup functionality

### 🛏️ Booking Management
- **Full Lifecycle** - From booking creation to checkout
- **Status Tracking** - Confirmed, checked-in, checked-out, cancelled
- **Room Assignment** - Easy room selection and management
- **Guest Information** - Integrated guest details and requirements

### 💳 Payment Tracking
- **Multiple Methods** - Cash, card, transfer, and cheque support
- **Status Management** - Pending, completed, failed, refunded
- **Transaction Records** - Complete audit trail with references
- **Financial Reporting** - Revenue tracking and payment analytics

### 📋 Expense Management
- **Category Tracking** - Housekeeping, maintenance, utilities, etc.
- **Receipt Management** - Digital receipt tracking and organization
- **Visual Analytics** - Pie charts and trend analysis
- **Budget Monitoring** - Track spending by category and time period

### 📈 Reports & Export
- **CSV Export** - All data exportable to spreadsheet formats
- **Date Range Filtering** - Custom reporting periods
- **Comprehensive Data** - All fields included for analysis
- **Financial Summaries** - Revenue, expenses, and profitability reports

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd guest-house-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Build for Production
```bash
npm run build
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with functional components and hooks
- **TypeScript** - Type-safe development with full IntelliSense
- **CSS3** - Custom CSS with CSS variables and modern features
- **Lucide React** - Beautiful, consistent icons throughout the application

### Libraries & Dependencies
- **date-fns** - Comprehensive date utility library for calendar functionality
- **recharts** - Responsive chart library for data visualization
- **React Testing Library** - Comprehensive testing utilities

### Code Quality
- **TypeScript** - Static type checking for reliability
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting and consistency

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full-featured experience with sidebar navigation
- **Tablet** - Adapted layout with touch-friendly interfaces
- **Mobile** - Optimized mobile experience with collapsible navigation

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🎨 Design System

### Colors
```css
/* Primary Colors */
--primary-blue: #2563eb
--primary-blue-dark: #1d4ed8
--emerald: #059669
--emerald-dark: #047857

/* Neutral Colors */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-500: #6b7280
--gray-700: #374151
--gray-900: #111827

/* Status Colors */
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
```

### Typography
- **Primary Font**: System fonts (Apple/San Francisco, Segoe UI, Roboto)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Font Sizes**: Scaled from 0.75rem to 2rem with proper hierarchy

### Spacing
- **Base Unit**: 0.25rem (4px)
- **Scale**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)

## 📊 Data Structure

### Guest
```typescript
interface Guest {
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
```

### Booking
```typescript
interface Booking {
  id: string;
  guestId: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalAmount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  notes: string;
  createdAt: Date;
}
```

### Payment
```typescript
interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'cheque';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionReference: string;
  paymentDate: Date;
  notes: string;
}
```

### Expense
```typescript
interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque';
  receipt: string;
  notes: string;
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

### Available Scripts
- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not recommended)

## 📈 Performance Optimizations

- **Code Splitting** - Lazy loading of components
- **Memoization** - React.memo for expensive calculations
- **Optimized Images** - Responsive images and proper sizing
- **CSS Optimization** - CSS variables for consistent theming
- **Bundle Analysis** - Webpack bundle analyzer for optimization

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for user workflows

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify** - Drag and drop the build folder
- **Vercel** - Connect GitHub repository
- **AWS S3** - Static website hosting
- **Firebase Hosting** - Google cloud platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the component examples in `/src/components`

## 🎯 Future Enhancements

- **Multi-language Support** - i18n implementation
- **Dark Mode** - Theme switching capability
- **Email Integration** - Automated booking confirmations
- **SMS Notifications** - Guest communication system
- **API Integration** - Backend service connection
- **Real-time Updates** - WebSocket implementation
- **Advanced Analytics** - Business intelligence features
- **Mobile App** - React Native companion app

---

Built with ❤️ using React, TypeScript, and modern web technologies.

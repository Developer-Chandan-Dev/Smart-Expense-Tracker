# Smart Expense Tracker SaaS

A comprehensive web-based SaaS application for individuals and small businesses to track expenses, manage budgets, and generate insightful reports. Features dual tracking modes with mobile-first design and complete TypeScript integration.

## 🚀 Features

### Core Features
- **Dual Tracking Modes** - Free tracking (unlimited) + Budget tracking (with limits)
- **Mobile-First Design** - Fully responsive with touch-friendly UI
- **Complete Authentication** - JWT-based login/register with validation
- **Rich Analytics** - Interactive charts, reports, and statistics
- **Unified Dashboard** - Three modes: Overview, Free Tracking, Budget Tracking
- **Real-time Updates** - Live notifications and instant data synchronization

### User Experience
- **Modern UI/UX** - Gradient backgrounds, card layouts, animations
- **Loading States** - Comprehensive spinner components with feedback
- **Error Handling** - Auto-dismissing toast notifications
- **Mobile Navigation** - Collapsible menus and horizontal tabs
- **Accessibility** - ARIA labels and keyboard navigation support

### Admin Features
- **System Analytics** - Total users, expenses, and active users
- **User Management** - View system-wide statistics
- **Revenue Insights** - Track total expense amounts

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Real-time**: Socket.IO
- **Charts**: Recharts
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Type Safety**: TypeScript with custom interfaces
- **Styling**: Mobile-responsive with gradient designs

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-budget-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-expense-tracker
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Set up MongoDB**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Replace the MONGODB_URI in .env.local

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

### User Schema
- name, email, password
- role (user/admin)
- createdAt, lastLogin

### Expense Schema
- userId, amount, reason, category
- trackingMode (free/budget)
- budgetId (for budget tracking)
- date, createdAt

### Budget Schema
- userId, totalAmount, remainingAmount
- startDate, endDate, createdAt

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get user expenses (with filters)

### Budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - Get user budget

### Admin
- `GET /api/admin/analytics` - Get system analytics

### Real-time
- `WebSocket /api/socket` - Socket.IO endpoint for live updates

## 🎯 Usage

### Dashboard Navigation
1. **Overview Tab** - Combined statistics from both tracking modes
2. **Free Tracking Tab** - Unlimited expense tracking with analytics
3. **Budget Tracking Tab** - Budget-constrained tracking with alerts

### For Users
1. Register/Login to your account
2. Choose between Free or Budget tracking mode
3. Add expenses with categories and reasons
4. View interactive charts and analytics
5. Monitor spending patterns and budget alerts
6. Switch between tracking modes as needed

### For Admins
1. Login with admin credentials
2. Access admin dashboard at `/admin`
3. View system-wide analytics and user statistics

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

## 🏗 Architecture Highlights

### Key Components
- **LoadingSpinner** - Animated loading states
- **ErrorMessage/SuccessMessage** - Toast notifications
- **ExpenseForm** - Adaptive form for both tracking modes
- **ExpenseChart** - Pie/bar charts with Recharts
- **BudgetAlert** - Budget warning system
- **TrackingModeSelector** - Mode switching interface
- **RealtimeProvider** - Real-time data synchronization
- **RealtimeNotification** - Live update notifications
- **RealtimeStatus** - Connection status indicator

### Security & Performance
- Budget ownership verification
- Comprehensive input validation
- Proper error handling with meaningful messages
- Email format validation and password requirements
- Optimized API calls with loading states

## 📈 Future Enhancements (Phase 2)

- Recurring expenses
- Shared expenses with multiple users
- Income tracking
- Advanced budget alerts and notifications
- Enhanced analytics and reporting
- Subscription management
- Native mobile app
- Export data (PDF/CSV)
- Multi-currency support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@smartexpensetracker.com or create an issue in the repository.

---

Built with ❤️ using Next.js and MongoDB
# 💳 Expense Tracker

A comprehensive expense tracking web application built with React and JavaScript. Track your expenses, visualize spending patterns, and manage your financial data with beautiful charts and analytics.

## ✨ Features

### 📊 Dashboard
- **Overview Cards**: Total expenses, average daily spending, transaction count, and top category
- **Monthly Trend Chart**: Line chart showing spending trends over the year
- **Category Distribution**: Doughnut chart breaking down expenses by category
- **Recent Expenses**: Quick view of your latest transactions
- **Quick Actions**: Fast access to add expenses, manage categories, and view analytics

### 💰 Expense Management
- **Add Expenses**: Easy form with description, amount, category, date, and notes
- **Quick Amount Buttons**: Preset amounts for faster entry
- **Real-time Preview**: See how your expense will look before saving
- **Edit & Delete**: Inline editing and deletion of expenses
- **Advanced Filtering**: Filter by category, date range, and search text
- **Smart Sorting**: Sort by date, amount, description, or category

### 🏷️ Category Management
- **Predefined Categories**: 9 default categories with icons and colors
- **Custom Categories**: Create unlimited custom categories
- **Visual Customization**: Choose from 30+ icons and 15+ colors
- **Usage Statistics**: See transaction count, total amount, and average per category
- **Usage Visualization**: Progress bars showing category usage percentage

### 📈 Analytics & Reports
- **Multiple Chart Types**: Line, bar, doughnut, and pie charts
- **Time Period Selection**: View data by week, month, year, or all time
- **Key Insights**: Automatic calculation of spending patterns and trends
- **Daily/Weekly Patterns**: Understand when you spend the most
- **Export Options**: CSV export, print reports, and JSON summaries
- **Interactive Charts**: Hover for detailed information and percentages

### 🎯 Additional Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Local Storage**: All data persists in your browser
- **Real-time Updates**: Instant updates across all views
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Built with accessibility best practices
- **Fast Performance**: Optimized for speed and efficiency

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Building for Production

```bash
npm run build
```

This creates a `dist` folder with the production build.

## 📱 Usage Guide

### Adding Your First Expense

1. **Navigate to Dashboard** - The app opens on the dashboard
2. **Click "Add Expense"** - Use the button in the header or quick actions
3. **Fill out the form**:
   - **Description**: What did you spend on? (e.g., "Lunch at restaurant")
   - **Amount**: How much did you spend?
   - **Category**: Choose from existing categories
   - **Date**: When did this expense occur?
   - **Notes**: Any additional details (optional)
4. **Preview & Submit** - Review your expense and click "Add Expense"

### Managing Categories

1. **Go to Categories page** - Click "Categories" in the navigation
2. **Add New Category**:
   - Click "Add Category"
   - Enter a name
   - Choose an icon from the grid
   - Select a color (custom or predefined)
   - Preview and save
3. **Edit Categories**: Click the edit icon next to any category
4. **Delete Categories**: Click the delete icon (warns about associated expenses)

### Viewing Analytics

1. **Navigate to Analytics** - Click "Analytics" in the navigation
2. **Select Time Period** - Choose week, month, year, or all time
3. **Explore Charts**:
   - **Monthly Trend**: See spending over time
   - **Category Distribution**: Understand where your money goes
   - **Day of Week**: Identify spending patterns
   - **Category Comparison**: Compare spending across categories
4. **Export Data**: Use the export options at the bottom

### Managing Expenses

1. **View All Expenses** - Click "Expenses" in the navigation
2. **Filter & Search**:
   - Use the search box for descriptions or notes
   - Filter by category
   - Set date ranges
   - Clear all filters with one click
3. **Sort Data**: Click any column header to sort
4. **Edit Expenses**: Click the edit icon for inline editing
5. **Delete Expenses**: Click the delete icon with confirmation

## 🛠️ Technical Stack

- **Frontend Framework**: React 18
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Emoji icons for visual appeal
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Persistence**: Browser localStorage
- **Build Tool**: Vite
- **Development**: Hot module replacement

## 📊 Chart Types & Visualizations

### Dashboard Charts
- **Line Chart**: Monthly spending trends with filled area
- **Doughnut Chart**: Category distribution with custom colors

### Analytics Charts
- **Line Chart**: Monthly trends with smooth curves
- **Bar Chart**: Category comparisons with colored bars
- **Doughnut Chart**: Spending distribution with percentages
- **Daily Bar Chart**: Day-of-week spending patterns
- **Daily Line Chart**: Daily spending in current month

### Chart Features
- **Interactive Tooltips**: Hover for detailed information
- **Responsive Design**: Scales to container size
- **Custom Colors**: Matches category colors
- **Animation**: Smooth transitions and loading
- **Legend**: Clear labeling and positioning

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue tones for actions and highlights
- **Categories**: Custom color palette for easy identification
- **Status**: Green for positive, red for negative, gray for neutral
- **Backgrounds**: Clean whites and light grays

### Typography
- **Headers**: Bold, clear hierarchy
- **Body Text**: Readable font sizes and spacing
- **Data**: Monospace for numbers when appropriate

### Layout
- **Responsive Grid**: Adapts to screen size
- **Card-based**: Clean separation of content
- **Navigation**: Fixed header with clear sections
- **Spacing**: Consistent margins and padding

## 🔧 Configuration

### Default Categories
The app comes with 9 predefined categories:
- 🍽️ Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 📄 Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 📦 Other

### Quick Amounts
Default quick amount buttons: $5, $10, $20, $50, $100

### Data Storage
All data is stored in browser localStorage:
- `expenses`: Array of expense objects
- `categories`: Array of category objects
- `budgets`: Array of budget objects (future feature)

## 🔒 Privacy & Security

- **Local Data**: All data stays in your browser
- **No Registration**: No accounts or sign-ups required
- **Offline Ready**: Works without internet connection
- **Privacy First**: No data collection or tracking

## 🚀 Performance Optimizations

- **Code Splitting**: Efficient loading of components
- **Memoization**: Prevents unnecessary re-renders
- **Optimized Charts**: Efficient chart rendering
- **Local Storage**: Fast data access
- **Minimal Dependencies**: Only essential libraries

## 🎯 Future Enhancements

- **Budget Tracking**: Set and monitor spending limits
- **Recurring Expenses**: Automatic expense creation
- **Multiple Currencies**: Support for different currencies
- **Data Import/Export**: CSV and JSON import capabilities
- **Cloud Sync**: Optional cloud storage integration
- **Mobile App**: React Native version
- **Advanced Analytics**: Predictive spending analysis

## 🐛 Troubleshooting

### Common Issues

**Data Not Saving**
- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode

**Charts Not Loading**
- Refresh the page
- Clear browser cache
- Ensure JavaScript is enabled

**Performance Issues**
- Clear old data if you have thousands of expenses
- Use date filters to reduce data load

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Review the troubleshooting section
- Check existing documentation

---

Made with ❤️ for better financial tracking and awareness.

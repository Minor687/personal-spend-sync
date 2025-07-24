import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../contexts/ExpenseContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { expenses, categories, getTotalExpenses, getExpensesByCategory, getMonthlyExpenses } = useExpense();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate date ranges
  const now = new Date();
  const getDateRange = (period) => {
    switch (period) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return { start: weekStart.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { start: yearStart.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      default:
        return { start: null, end: null };
    }
  };

  const { start, end } = getDateRange(selectedPeriod);
  const totalExpenses = getTotalExpenses(start, end);
  const categoryData = getExpensesByCategory(start, end);
  const monthlyData = getMonthlyExpenses(now.getFullYear());

  // Recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  // Monthly chart data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lineChartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Category pie chart data
  const categoryNames = Object.keys(categoryData);
  const categoryAmounts = categoryNames.map(name => categoryData[name].total);
  const categoryColors = categoryNames.map(name => categoryData[name].color);

  const doughnutChartData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: categoryColors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Summary cards data
  const avgDailyExpense = selectedPeriod === 'month' ? totalExpenses / now.getDate() : 
                         selectedPeriod === 'week' ? totalExpenses / 7 : 
                         totalExpenses / 365;

  const mostExpensiveCategory = categoryNames.reduce((max, name) => 
    categoryData[name].total > (categoryData[max]?.total || 0) ? name : max, 
    categoryNames[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Daily</p>
              <p className="text-2xl font-bold text-gray-900">${avgDailyExpense.toFixed(2)}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{mostExpensiveCategory || 'None'}</p>
            </div>
            <div className="text-3xl">{categoryData[mostExpensiveCategory]?.icon || '📦'}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses Trend</h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="h-64 flex items-center justify-center">
            {categoryNames.length > 0 ? (
              <Doughnut data={doughnutChartData} options={chartOptions} />
            ) : (
              <p className="text-gray-500">No expenses to display</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <Link
            to="/expenses"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>
        
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 mb-4">No expenses recorded yet</p>
            <Link
              to="/add-expense"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => {
              const category = categories.find(cat => cat.id === expense.categoryId);
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{category?.icon || '📦'}</div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">{category?.name || 'Unknown'} • {expense.date}</p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/add-expense"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <span className="font-medium text-blue-700">Add Expense</span>
          </Link>
          
          <Link
            to="/categories"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <span className="text-2xl">🏷️</span>
            <span className="font-medium text-green-700">Manage Categories</span>
          </Link>
          
          <Link
            to="/analytics"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <span className="text-2xl">📈</span>
            <span className="font-medium text-purple-700">View Analytics</span>
          </Link>
          
          <Link
            to="/expenses"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <span className="font-medium text-orange-700">All Expenses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
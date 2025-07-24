import { useState } from 'react';
import { useExpense } from '../contexts/ExpenseContext';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { expenses, categories, getTotalExpenses, getExpensesByCategory, getMonthlyExpenses } = useExpense();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState('year');

  // Get available years
  const availableYears = [...new Set(expenses.map(expense => new Date(expense.date).getFullYear()))].sort((a, b) => b - a);

  // Helper function to get date range
  const getDateRangeForAnalysis = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return { start: weekStart.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case 'year':
        const yearStart = new Date(selectedYear, 0, 1);
        const yearEnd = new Date(selectedYear, 11, 31);
        return { start: yearStart.toISOString().split('T')[0], end: yearEnd.toISOString().split('T')[0] };
      default:
        return { start: null, end: null };
    }
  };

  const { start, end } = getDateRangeForAnalysis();
  const totalExpenses = getTotalExpenses(start, end);
  const categoryData = getExpensesByCategory(start, end);
  const monthlyData = getMonthlyExpenses(selectedYear);

  // Monthly trend chart
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
        fill: true,
      },
    ],
  };

  // Category distribution - Doughnut Chart
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

  // Category bar chart
  const barChartData = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Amount Spent',
        data: categoryAmounts,
        backgroundColor: categoryColors,
        borderColor: categoryColors,
        borderWidth: 1,
      },
    ],
  };

  // Weekly spending pattern
  const getWeeklyData = () => {
    const weeklyData = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (expenseDate >= startDate && expenseDate <= endDate) {
          weeklyData[expenseDate.getDay()] += parseFloat(expense.amount);
        }
      } else {
        weeklyData[expenseDate.getDay()] += parseFloat(expense.amount);
      }
    });

    return {
      labels: dayNames,
      datasets: [
        {
          label: 'Spending by Day of Week',
          data: weeklyData,
          backgroundColor: [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FECA57', '#FF9FF3', '#54A0FF'
          ],
        },
      ],
    };
  };

  // Daily spending in current month
  const getDailySpendingData = () => {
    const now = new Date();
    const year = dateRange === 'year' ? selectedYear : now.getFullYear();
    const month = dateRange === 'month' ? now.getMonth() : now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dailyData = Array(daysInMonth).fill(0);
    
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === year && expenseDate.getMonth() === month) {
        dailyData[expenseDate.getDate() - 1] += parseFloat(expense.amount);
      }
    });

    return {
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Daily Spending',
          data: dailyData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Calculate insights
  const getInsights = () => {
    if (expenses.length === 0) return [];
    
    const insights = [];
    
    // Highest category
    if (categoryNames.length > 0) {
      const highestCategory = categoryNames.reduce((max, name) => 
        categoryData[name].total > categoryData[max].total ? name : max
      );
      insights.push({
        title: 'Top Spending Category',
        value: highestCategory,
        amount: `$${categoryData[highestCategory].total.toFixed(2)}`,
        icon: categoryData[highestCategory].icon,
        color: 'text-red-600'
      });
    }

    // Average per day
    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? new Date().getDate() : 365;
    const avgPerDay = totalExpenses / days;
    insights.push({
      title: 'Average Daily Spending',
      value: `$${avgPerDay.toFixed(2)}`,
      amount: `over ${days} days`,
      icon: '📅',
      color: 'text-blue-600'
    });

    // Largest single expense
    const filteredExpenses = expenses.filter(expense => {
      if (!start || !end) return true;
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(start) && expenseDate <= new Date(end);
    });
    
    if (filteredExpenses.length > 0) {
      const largestExpense = filteredExpenses.reduce((max, expense) => 
        parseFloat(expense.amount) > parseFloat(max.amount) ? expense : max
      );
      const category = categories.find(cat => cat.id === largestExpense.categoryId);
      insights.push({
        title: 'Largest Single Expense',
        value: largestExpense.description,
        amount: `$${parseFloat(largestExpense.amount).toFixed(2)}`,
        icon: category?.icon || '💰',
        color: 'text-purple-600'
      });
    }

    // Most frequent category
    const categoryCounts = {};
    filteredExpenses.forEach(expense => {
      const categoryName = categories.find(cat => cat.id === expense.categoryId)?.name || 'Unknown';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });
    
    if (Object.keys(categoryCounts).length > 0) {
      const mostFrequent = Object.keys(categoryCounts).reduce((max, name) => 
        categoryCounts[name] > categoryCounts[max] ? name : max
      );
      const category = categories.find(cat => cat.name === mostFrequent);
      insights.push({
        title: 'Most Frequent Category',
        value: mostFrequent,
        amount: `${categoryCounts[mostFrequent]} transactions`,
        icon: category?.icon || '🔄',
        color: 'text-green-600'
      });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Insights into your spending patterns</p>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">Year</option>
            <option value="all">All Time</option>
          </select>
          
          {dateRange === 'year' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories Used</p>
              <p className="text-2xl font-bold text-gray-900">{categoryNames.length}</p>
            </div>
            <div className="text-3xl">🏷️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Transaction</p>
              <p className="text-2xl font-bold text-gray-900">
                ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="text-3xl">🧮</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{insight.icon}</span>
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                </div>
                <p className={`font-semibold ${insight.color}`}>{insight.value}</p>
                <p className="text-sm text-gray-600">{insight.amount}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      {expenses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend ({selectedYear})</h3>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            <div className="h-80">
              {categoryNames.length > 0 ? (
                <Doughnut data={doughnutChartData} options={pieOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Category Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
            <div className="h-80">
              {categoryNames.length > 0 ? (
                <Bar data={barChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Day of Week</h3>
            <div className="h-80">
              <Bar data={getWeeklyData()} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Available</h3>
          <p className="text-gray-600 mb-6">Start adding expenses to see detailed analytics and insights.</p>
          <a
            href="/add-expense"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add Your First Expense
          </a>
        </div>
      )}

      {/* Daily Spending Chart */}
      {expenses.length > 0 && dateRange === 'month' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Spending This Month</h3>
          <div className="h-80">
            <Line data={getDailySpendingData()} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Export & Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Date,Description,Amount,Category,Notes\n" +
                expenses.map(expense => {
                  const category = categories.find(cat => cat.id === expense.categoryId);
                  return `${expense.date},"${expense.description}",${expense.amount},"${category?.name || 'Unknown'}","${expense.notes || ''}"`;
                }).join("\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "expenses.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📊</span>
            <span className="font-medium">Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">🖨️</span>
            <span className="font-medium">Print Report</span>
          </button>

          <button
            onClick={() => {
              const summary = {
                period: dateRange,
                totalExpenses: totalExpenses,
                transactionCount: expenses.length,
                categoryBreakdown: categoryData,
                generatedAt: new Date().toISOString()
              };
              
              const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(summary, null, 2));
              const link = document.createElement("a");
              link.setAttribute("href", jsonContent);
              link.setAttribute("download", "expense-summary.json");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <span className="font-medium">Export Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
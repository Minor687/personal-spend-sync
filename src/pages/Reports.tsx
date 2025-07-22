import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
  date: string;
}

export default function Reports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportData, setReportData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    categoryBreakdown: {} as Record<string, number>,
    topCategories: [] as { category: string; amount: number; percentage: number }[]
  });

  useEffect(() => {
    // Mock data - replace with API call
    const mockExpenses: Expense[] = [
      { id: '1', title: 'Salary', amount: 5000, category: 'Salary', type: 'Income', date: '2024-01-01' },
      { id: '2', title: 'Groceries', amount: 150, category: 'Food', type: 'Expense', date: '2024-01-02' },
      { id: '3', title: 'Gas', amount: 80, category: 'Transportation', type: 'Expense', date: '2024-01-03' },
      { id: '4', title: 'Restaurant', amount: 120, category: 'Food', type: 'Expense', date: '2024-01-04' },
      { id: '5', title: 'Freelance', amount: 800, category: 'Freelance', type: 'Income', date: '2024-01-05' },
      { id: '6', title: 'Rent', amount: 1200, category: 'Housing', type: 'Expense', date: '2024-01-06' },
      { id: '7', title: 'Utilities', amount: 200, category: 'Utilities', type: 'Expense', date: '2024-01-07' },
      { id: '8', title: 'Shopping', amount: 300, category: 'Shopping', type: 'Expense', date: '2024-01-08' },
    ];

    setExpenses(mockExpenses);
    generateReport(mockExpenses);
  }, [selectedPeriod]);

  const generateReport = (expenseData: Expense[]) => {
    const income = expenseData.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenseData.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
    
    const categoryBreakdown = expenseData.reduce((acc, expense) => {
      if (expense.type === 'Expense') {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setReportData({
      totalIncome: income,
      totalExpenses,
      netIncome: income - totalExpenses,
      categoryBreakdown,
      topCategories
    });
  };

  const exportToCSV = () => {
    const csvHeaders = ['Date', 'Title', 'Category', 'Type', 'Amount'];
    const csvData = expenses.map(expense => [
      expense.date,
      expense.title,
      expense.category,
      expense.type,
      expense.amount.toString()
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses-report-${selectedPeriod}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast.success('Report exported successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Export and analyze your financial data</p>
          </div>
          
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Period Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Report Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${reportData.totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                For selected period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${reportData.totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                For selected period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <TrendingUp className={`h-4 w-4 ${reportData.netIncome >= 0 ? 'text-primary' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                reportData.netIncome >= 0 ? 'text-primary' : 'text-destructive'
              }`}>
                ${reportData.netIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Income minus expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Expense Categories</CardTitle>
              <CardDescription>Your highest spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${category.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
                
                {reportData.topCategories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No expense data available for the selected period.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>Complete breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(reportData.categoryBreakdown).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{category}</span>
                    <span className="text-destructive font-medium">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                
                {Object.keys(reportData.categoryBreakdown).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No categories found for the selected period.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Information</CardTitle>
            <CardDescription>Details about your CSV export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Transactions:</span>
                <span className="text-sm">{expenses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Export Format:</span>
                <span className="text-sm">CSV (Comma Separated Values)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Included Fields:</span>
                <span className="text-sm">Date, Title, Category, Type, Amount</span>
              </div>
              <div className="pt-4 border-t">
                <Button onClick={exportToCSV} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
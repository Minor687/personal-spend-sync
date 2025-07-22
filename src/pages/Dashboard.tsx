import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ExpenseChart } from '@/components/charts/ExpenseChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
  date: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryBreakdown: {} as Record<string, number>
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
    ];

    setExpenses(mockExpenses);

    // Calculate summary
    const income = mockExpenses.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
    const expense = mockExpenses.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
    
    const categoryBreakdown = mockExpenses.reduce((acc, expense) => {
      if (expense.type === 'Expense') {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    setSummary({
      totalIncome: income,
      totalExpenses: expense,
      balance: income - expense,
      categoryBreakdown
    });
  }, []);

  const incomeVsExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [summary.totalIncome, summary.totalExpenses],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--destructive))',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--destructive))',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(summary.categoryBreakdown),
    datasets: [
      {
        data: Object.values(summary.categoryBreakdown),
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--accent))',
          'hsl(var(--muted))',
          'hsl(var(--destructive))',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your income and expenses</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${summary.totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${summary.totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-primary' : 'text-destructive'
              }`}>
                ${summary.balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(summary.categoryBreakdown).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart
            type="bar"
            data={incomeVsExpenseData}
            title="Income vs Expenses"
          />
          
          <ExpenseChart
            type="doughnut"
            data={categoryData}
            title="Expenses by Category"
          />
        </div>

        {/* Recent Transactions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest income and expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">{expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      expense.type === 'Income' ? 'text-primary' : 'text-destructive'
                    }`}>
                      {expense.type === 'Income' ? '+' : '-'}${expense.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
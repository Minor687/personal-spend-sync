import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ExpenseChart } from '@/components/charts/ExpenseChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch expenses');
        return;
      }

      const formattedExpenses: Expense[] = data.map(expense => ({
        id: expense.id,
        title: expense.title,
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
        category: expense.category,
        type: expense.type as 'Income' | 'Expense',
        date: expense.date
      }));

      setExpenses(formattedExpenses);

      // Calculate summary
      const income = formattedExpenses.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
      const expense = formattedExpenses.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
      
      const categoryBreakdown = formattedExpenses.reduce((acc, expense) => {
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
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const incomeVsExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [summary.totalIncome, summary.totalExpenses],
        backgroundColor: [
          'hsl(142, 76%, 36%)', // Green for income
          'hsl(0, 84%, 60%)',   // Red for expenses
        ],
        borderColor: [
          'hsl(142, 76%, 36%)',
          'hsl(0, 84%, 60%)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryColors = {
    'Food': 'hsl(25, 95%, 53%)',
    'Transportation': 'hsl(217, 91%, 60%)', 
    'Housing': 'hsl(142, 76%, 36%)',
    'Entertainment': 'hsl(280, 100%, 70%)',
    'Healthcare': 'hsl(0, 84%, 60%)',
    'Shopping': 'hsl(45, 93%, 47%)',
    'Utilities': 'hsl(210, 40%, 50%)',
    'Education': 'hsl(160, 84%, 39%)',
    'Travel': 'hsl(335, 78%, 42%)',
    'Other': 'hsl(220, 9%, 46%)',
  };

  const categoryData = {
    labels: Object.keys(summary.categoryBreakdown),
    datasets: [
      {
        data: Object.values(summary.categoryBreakdown),
        backgroundColor: Object.keys(summary.categoryBreakdown).map(
          category => categoryColors[category as keyof typeof categoryColors] || 'hsl(var(--muted))'
        ),
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

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'hsl(142, 76%, 36%)' }}>
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
              <div className="text-2xl font-bold" style={{ color: 'hsl(0, 84%, 60%)' }}>
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
              <div className="text-2xl font-bold" style={{ 
                color: summary.balance >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'
              }}>
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
                    <p className="font-medium" style={{ 
                      color: expense.type === 'Income' ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'
                    }}>
                      {expense.type === 'Income' ? '+' : '-'}${expense.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </div>
  );
}
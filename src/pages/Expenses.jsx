import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const categories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Salary', 'Freelance', 'Investment'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'Expense',
    date: new Date().toISOString().split('T')[0]
  });
  const { user } = useAuth();

  const fetchExpenses = () => {
    if (!user) return;
    
    try {
      const userExpenses = JSON.parse(localStorage.getItem(`expenses_${user.id}`) || '[]');
      setExpenses(userExpenses);
    } catch (error) {
      console.error('Failed to load expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  useEffect(() => {
    let filtered = expenses;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(expense => expense.type === filterType);
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, filterCategory, filterType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category || !user) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        id: editingExpense ? editingExpense.id : Date.now().toString(),
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        date: formData.date,
        user_id: user.id
      };

      const existingExpenses = JSON.parse(localStorage.getItem(`expenses_${user.id}`) || '[]');

      if (editingExpense) {
        const updatedExpenses = existingExpenses.map(exp => 
          exp.id === editingExpense.id ? expenseData : exp
        );
        localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updatedExpenses));
        toast.success('Expense updated successfully!');
      } else {
        existingExpenses.push(expenseData);
        localStorage.setItem(`expenses_${user.id}`, JSON.stringify(existingExpenses));
        toast.success('Expense added successfully!');
      }

      fetchExpenses();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      type: expense.type,
      date: expense.date
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const existingExpenses = JSON.parse(localStorage.getItem(`expenses_${user.id}`) || '[]');
      const updatedExpenses = existingExpenses.filter(exp => exp.id !== id);
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updatedExpenses));

      toast.success('Expense deleted successfully!');
      fetchExpenses();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      type: 'Expense',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground">Manage your income and expenses</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? 'Edit Transaction' : 'Add New Transaction'}
                </DialogTitle>
                <DialogDescription>
                  {editingExpense ? 'Update your transaction details.' : 'Add a new income or expense entry.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Transaction title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update' : 'Add')} Transaction
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="filter-category">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="filter-type">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredExpenses.length} transaction(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{expense.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} • {expense.date}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium" style={{ 
                        color: expense.type === 'Income' ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'
                      }}>
                        {expense.type === 'Income' ? '+' : '-'}${expense.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">{expense.type}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredExpenses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found. Add your first transaction to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
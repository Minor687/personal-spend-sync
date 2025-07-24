import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      { id: 1, name: 'Food & Dining', color: '#FF6B6B', icon: '🍽️' },
      { id: 2, name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
      { id: 3, name: 'Shopping', color: '#45B7D1', icon: '🛍️' },
      { id: 4, name: 'Entertainment', color: '#96CEB4', icon: '🎬' },
      { id: 5, name: 'Bills & Utilities', color: '#FECA57', icon: '📄' },
      { id: 6, name: 'Healthcare', color: '#FF9FF3', icon: '🏥' },
      { id: 7, name: 'Education', color: '#54A0FF', icon: '📚' },
      { id: 8, name: 'Travel', color: '#5F27CD', icon: '✈️' },
      { id: 9, name: 'Other', color: '#9B9B9B', icon: '📦' }
    ];
  });

  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now() + Math.random(),
      date: expense.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now() + Math.random()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updatedCategory } : category
    ));
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now() + Math.random()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id, updatedBudget) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === id ? { ...budget, ...updatedBudget } : budget
    ));
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  // Analytics functions
  const getTotalExpenses = (startDate, endDate) => {
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return expenseDate >= start && expenseDate <= end;
      })
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const getExpensesByCategory = (startDate, endDate) => {
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      return expenseDate >= start && expenseDate <= end;
    });

    const categoryTotals = {};
    filteredExpenses.forEach(expense => {
      const categoryId = expense.categoryId;
      const category = categories.find(cat => cat.id === categoryId);
      const categoryName = category ? category.name : 'Unknown';
      
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          total: 0,
          color: category?.color || '#9B9B9B',
          icon: category?.icon || '📦'
        };
      }
      categoryTotals[categoryName].total += parseFloat(expense.amount);
    });

    return categoryTotals;
  };

  const getMonthlyExpenses = (year) => {
    const monthlyData = Array(12).fill(0);
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === (year || new Date().getFullYear())) {
        monthlyData[expenseDate.getMonth()] += parseFloat(expense.amount);
      }
    });
    return monthlyData;
  };

  const value = {
    expenses,
    categories,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    getTotalExpenses,
    getExpensesByCategory,
    getMonthlyExpenses
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
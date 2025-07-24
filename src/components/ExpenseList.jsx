import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../contexts/ExpenseContext';

const ExpenseList = () => {
  const { expenses, categories, deleteExpense, updateExpense } = useExpense();
  const [filter, setFilter] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !filter.category || expense.categoryId === parseInt(filter.category);
    const matchesSearch = !filter.search || 
      expense.description.toLowerCase().includes(filter.search.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(filter.search.toLowerCase());
    
    const expenseDate = new Date(expense.date);
    const matchesDateFrom = !filter.dateFrom || expenseDate >= new Date(filter.dateFrom);
    const matchesDateTo = !filter.dateTo || expenseDate <= new Date(filter.dateTo);
    
    return matchesCategory && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'amount':
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
      case 'category':
        const categoryA = categories.find(cat => cat.id === a.categoryId)?.name || '';
        const categoryB = categories.find(cat => cat.id === b.categoryId)?.name || '';
        comparison = categoryA.localeCompare(categoryB);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      description: expense.description,
      amount: expense.amount.toString(),
      categoryId: expense.categoryId.toString(),
      date: expense.date,
      notes: expense.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    const updatedExpense = {
      ...editData,
      amount: parseFloat(editData.amount),
      categoryId: parseInt(editData.categoryId)
    };
    updateExpense(editingId, updatedExpense);
    setEditingId(null);
    setEditData({});
  };

  const clearFilters = () => {
    setFilter({
      category: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const totalFiltered = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-gray-600">
            {filteredExpenses.length} expense(s) • Total: ${totalFiltered.toFixed(2)}
          </p>
        </div>
        <Link
          to="/add-expense"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add Expense
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search description or notes..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex space-x-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          
          {[
            { key: 'date', label: 'Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'description', label: 'Description' },
            { key: 'category', label: 'Category' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sortBy === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} {sortBy === key && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600 mb-4">
              {expenses.length === 0 
                ? "You haven't added any expenses yet." 
                : "No expenses match your current filters."
              }
            </p>
            <Link
              to="/add-expense"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Expense
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedExpenses.map((expense) => {
              const category = categories.find(cat => cat.id === expense.categoryId);
              const isEditing = editingId === expense.id;
              
              return (
                <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {isEditing ? (
                    /* Edit Mode */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={editData.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Description"
                        />
                        
                        <input
                          type="number"
                          value={editData.amount}
                          onChange={(e) => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Amount"
                          step="0.01"
                        />
                        
                        <select
                          value={editData.categoryId}
                          onChange={(e) => setEditData(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                        
                        <input
                          type="date"
                          value={editData.date}
                          onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Notes"
                        rows={2}
                      />
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-2xl">{category?.icon || '📦'}</div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4">
                            <h3 className="font-medium text-gray-900 truncate">{expense.description}</h3>
                            <span className="text-lg font-semibold text-gray-900">
                              ${parseFloat(expense.amount).toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{category?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span>{expense.date}</span>
                            {expense.notes && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-xs">{expense.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => startEdit(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {sortedExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</p>
              <p className="text-sm text-gray-600">Total Expenses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalFiltered.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                ${filteredExpenses.length > 0 ? (totalFiltered / filteredExpenses.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-600">Average Expense</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
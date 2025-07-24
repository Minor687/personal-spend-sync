import { useState } from 'react';
import { useExpense } from '../contexts/ExpenseContext';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, expenses } = useExpense();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#4F46E5',
    icon: '📦'
  });

  const predefinedIcons = [
    '🍽️', '🚗', '🛍️', '🎬', '📄', '🏥', '📚', '✈️', '🏠', '💡',
    '☕', '🎵', '💪', '🎮', '📱', '💻', '🧥', '👕', '🚲', '🌮',
    '🍕', '🍔', '🚇', '⛽', '🎯', '🎪', '🎨', '🖥️', '📷', '🎸'
  ];

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
    '#FF9FF3', '#54A0FF', '#5F27CD', '#FF3838', '#FF9500',
    '#0ACF83', '#A55EEA', '#26A69A', '#FFA726', '#42A5F5'
  ];

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    addCategory(newCategory);
    setNewCategory({ name: '', color: '#4F46E5', icon: '📦' });
    setIsAddingCategory(false);
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
  };

  const handleUpdateCategory = () => {
    if (!newCategory.name.trim()) return;
    
    updateCategory(editingId, newCategory);
    setEditingId(null);
    setNewCategory({ name: '', color: '#4F46E5', icon: '📦' });
  };

  const handleDeleteCategory = (categoryId) => {
    const expenseCount = expenses.filter(expense => expense.categoryId === categoryId).length;
    
    if (expenseCount > 0) {
      if (!window.confirm(`This category has ${expenseCount} expenses associated with it. Are you sure you want to delete it? This will also remove the category from those expenses.`)) {
        return;
      }
    } else {
      if (!window.confirm('Are you sure you want to delete this category?')) {
        return;
      }
    }
    
    deleteCategory(categoryId);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddingCategory(false);
    setNewCategory({ name: '', color: '#4F46E5', icon: '📦' });
  };

  // Calculate category usage statistics
  const getCategoryStats = (categoryId) => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === categoryId);
    const totalAmount = categoryExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const transactionCount = categoryExpenses.length;
    const avgAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;
    
    return {
      totalAmount,
      transactionCount,
      avgAmount
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Categories</h1>
          <p className="text-gray-600">Organize your expenses with custom categories</p>
        </div>
        
        <button
          onClick={() => setIsAddingCategory(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {(isAddingCategory || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Groceries"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {predefinedIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                    className={`p-2 text-xl rounded hover:bg-gray-100 transition-colors ${
                      newCategory.icon === icon ? 'bg-blue-100 border-2 border-blue-500' : ''
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="space-y-2">
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-5 gap-1">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded border-2 ${
                        newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: newCategory.color }}
              >
                {newCategory.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900">{newCategory.name || 'Category Name'}</p>
                <p className="text-sm text-gray-500">Category preview</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4">
            <button
              onClick={editingId ? handleUpdateCategory : handleAddCategory}
              disabled={!newCategory.name.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {editingId ? 'Update Category' : 'Add Category'}
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Categories ({categories.length})
          </h3>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">Create your first category to start organizing expenses</p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => {
              const stats = getCategoryStats(category.id);
              
              return (
                <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{stats.transactionCount} transactions</span>
                          <span>•</span>
                          <span>Total: ${stats.totalAmount.toFixed(2)}</span>
                          {stats.transactionCount > 0 && (
                            <>
                              <span>•</span>
                              <span>Avg: ${stats.avgAmount.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="Edit Category"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Usage Bar */}
                  {stats.transactionCount > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Usage</span>
                        <span>{((stats.transactionCount / expenses.length) * 100).toFixed(1)}% of all expenses</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            backgroundColor: category.color,
                            width: `${(stats.transactionCount / expenses.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Statistics */}
      {categories.length > 0 && expenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
              <p className="text-sm text-gray-600">Total Categories</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(cat => getCategoryStats(cat.id).transactionCount > 0).length}
              </p>
              <p className="text-sm text-gray-600">Active Categories</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {categories.length > 0 ? Math.max(...categories.map(cat => getCategoryStats(cat.id).transactionCount)) : 0}
              </p>
              <p className="text-sm text-gray-600">Most Used Category</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                ${categories.length > 0 ? Math.max(...categories.map(cat => getCategoryStats(cat.id).totalAmount)).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-600">Highest Spending</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Category Management Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Keep categories broad enough to be useful but specific enough to be meaningful</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Use colors and icons to quickly identify categories at a glance</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Consider creating categories for different types of recurring expenses</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Review and update your categories regularly as your spending habits change</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Deleting a category will remove it from all associated expenses</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;
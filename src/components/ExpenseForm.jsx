import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpense } from '../contexts/ExpenseContext';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { addExpense, categories } = useExpense();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId)
    };
    
    addExpense(expenseData);
    navigate('/expenses');
  };

  const handleQuickAmount = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
  };

  const quickAmounts = [5, 10, 20, 50, 100];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-2xl">➕</span>
          <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Lunch at restaurant"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount ($) *
            </label>
            <div className="space-y-3">
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              
              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Quick amounts:</span>
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details about this expense..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          {formData.description && formData.amount && formData.categoryId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {categories.find(cat => cat.id === parseInt(formData.categoryId))?.icon || '📦'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{formData.description}</p>
                    <p className="text-sm text-gray-500">
                      {categories.find(cat => cat.id === parseInt(formData.categoryId))?.name} • {formData.date}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${parseFloat(formData.amount || 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Expense Tracking</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Be specific with descriptions to easily identify expenses later</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Add expenses right after making them to avoid forgetting</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Use the notes field for receipt numbers or additional context</span>
          </li>
          <li className="flex items-start space-x-2">
            <span>•</span>
            <span>Choose the most appropriate category for better analytics</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExpenseForm;
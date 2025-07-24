import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './pages/Analytics';
import Categories from './pages/Categories';
import Navigation from './components/Navigation';
import { ExpenseProvider } from './contexts/ExpenseContext';
import './App.css';

const App = () => {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<ExpenseList />} />
              <Route path="/add-expense" element={<ExpenseForm />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ExpenseProvider>
  );
};

export default App;

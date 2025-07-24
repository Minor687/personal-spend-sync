import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.find(u => u.email === email);
      
      if (userExists) {
        return { error: { message: 'User already exists' } };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        display_name: displayName || email.split('@')[0],
        created_at: new Date().toISOString()
      };

      // Store user credentials
      const newUserWithPassword = { ...newUser, password };
      existingUsers.push(newUserWithPassword);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Auto-login
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign up failed' } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = existingUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { error: { message: 'Invalid credentials' } };
      }

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
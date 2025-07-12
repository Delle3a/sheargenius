"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { users } from '@/lib/data';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'barber';
}

interface AuthContextType {
  user: User | null;
  login: (role: 'customer' | 'admin' | 'barber') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBarber: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Avoid hydration mismatch by delaying auth check to client-side
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: 'customer' | 'admin' | 'barber') => {
    const userToLogin = users.find(u => u.role === role);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('user', JSON.stringify(userToLogin));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isBarber = user?.role === 'barber';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isBarber }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

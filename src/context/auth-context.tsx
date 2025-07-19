
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUsers } from '@/lib/firebase/users';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'barber';
  // NOTE: In a real app, you would never store the password, even hashed, on the client.
  // This is for demonstration purposes only.
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean | null; // null represents a loading state
  isAdmin: boolean;
  isBarber: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // null means we haven't checked yet, true/false means we have.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      // If JSON parsing fails, assume not authenticated
      console.error("Failed to parse user from localStorage", error);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const allUsers = await getUsers();
    const userToLogin = allUsers.find(u => u.email === email);

    if (userToLogin && userToLogin.password === pass) {
      const userToStore = { ...userToLogin };
      // Do not store password in state or local storage
      delete userToStore.password; 

      setUser(userToStore);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return userToStore;
    } else {
      throw new Error("Les informations d'identification sont invalides.");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

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

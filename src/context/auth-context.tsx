
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

  const login = async (email: string, pass: string): Promise<User> => {
    const allUsers = await getUsers();
    const userToLogin = allUsers.find(u => u.email === email);

    // IMPORTANT: This is a simplified password check for demo purposes.
    // In a production application, you should use a secure authentication provider
    // (like Firebase Authentication) and never handle plaintext passwords.
    if (userToLogin && userToLogin.password === pass) {
      setUser(userToLogin);
      localStorage.setItem('user', JSON.stringify(userToLogin));
      return userToLogin;
    } else {
      throw new Error("Les informations d'identification sont invalides.");
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

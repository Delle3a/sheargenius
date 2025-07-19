
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUsers, addUser, updateUser } from '@/lib/firebase/users';
import { sendConfirmationEmail } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'barber';
  isVerified: boolean;
  verificationToken?: string;
  // NOTE: In a real app, you would never store the password, even hashed, on the client.
  // This is for demonstration purposes only.
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  signup: (name: string, email: string, pass: string) => Promise<{ user: Omit<User, 'password'>, emailSent: boolean }>;
  logout: () => void;
  isAuthenticated: boolean | null; // null represents a loading state
  isAdmin: boolean;
  isBarber: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple in-memory store for demo purposes. In a real app, use a proper session management solution.
let sessionUser: User | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(sessionUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // This effect now only syncs the component state with the session state.
    if (sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
    } else {
        setIsAuthenticated(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const allUsers = await getUsers();
    const userToLogin = allUsers.find(u => u.email === email);

    if (!userToLogin || userToLogin.password !== pass) {
      throw new Error("Les informations d'identification sont invalides.");
    }

    if (!userToLogin.isVerified) {
        throw new Error("Votre compte n'est pas encore vérifié. Veuillez consulter votre e-mail.");
    }

    const userToStore = { ...userToLogin };
    delete userToStore.password; 

    setUser(userToStore);
    sessionUser = userToStore;
    setIsAuthenticated(true);
    return userToStore;
  };

  const signup = async (name: string, email: string, pass:string): Promise<{ user: Omit<User, 'password'>, emailSent: boolean }> => {
    const allUsers = await getUsers();
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
        throw new Error("Un compte existe déjà avec cette adresse e-mail.");
    }

    const verificationToken = uuidv4();
    const newUser: Omit<User, 'id'> = {
        name,
        email,
        password: pass,
        role: 'customer',
        isVerified: false,
        verificationToken,
    };

    const createdUser = await addUser(newUser);
    
    // Send the confirmation email
    const { emailSent } = await sendConfirmationEmail({ 
        to: createdUser.email, 
        name: createdUser.name, 
        token: verificationToken 
    });

    const { password, ...userToReturn } = createdUser;
    return { user: userToReturn, emailSent };
  };


  const logout = () => {
    setUser(null);
    sessionUser = null;
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';
  const isBarber = user?.role === 'barber';

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, isAdmin, isBarber }}>
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

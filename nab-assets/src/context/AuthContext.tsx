import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  sendOTP: (type: 'email' | 'phone') => Promise<void>;
  verifyOTP: (code: string, type: 'email' | 'phone') => Promise<void>;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nab_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    const mockUser: User = {
      id: '1',
      email,
      phone: '+923001234567',
      name: 'User',
      role: email.includes('admin') ? 'admin' : 'user',
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('nab_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nab_user');
  };

  const register = async (data: RegisterData) => {
    // Mock registration - replace with actual API call
    console.log('Register:', data);
  };

  const sendOTP = async (type: 'email' | 'phone') => {
    // Mock OTP send - replace with actual API call
    console.log('Sending OTP to', type);
  };

  const verifyOTP = async (code: string, type: 'email' | 'phone') => {
    // Mock OTP verification - replace with actual API call
    console.log('Verifying OTP:', code, type);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, sendOTP, verifyOTP, isLoading }}>
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

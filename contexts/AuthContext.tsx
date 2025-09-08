'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Or 'next/router' for Pages Router
import { toast } from 'react-toastify';
import { authApi } from '@/lib/api/auth';
import { User } from '@/types';

interface AuthContextType {
  user: { id: string; username: string; roles: number[] } | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; username: string; roles: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const saveToStorage = (token: string, userData: User) => {
    const storedUser = {
      id: userData._id,
      username: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      roles: userData.roles,
    };
    document.cookie = `token=${token}; path=/;`;
    document.cookie = `user=${JSON.stringify(storedUser)} ; path=/;`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(storedUser));
    setUser(storedUser);
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      const { access_token: token, user: userData } = response.data;
      saveToStorage(token, userData);
      toast.success('Logged in successfully!');
      router.push('/'); // Adjust based on role
    } catch (error: any) {
      setUser(null);
      // Specific error handling
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);
      const { access_token: token, user: userData } = response.data;
      saveToStorage(token, userData);
      toast.success('Registered successfully!');
      router.push('/');
    } catch (error: any) {
      setUser(null);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      document.cookie = "token=; Max-Age=0; path=/";
      document.cookie = "user=; Max-Age=0; path=/";
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully!');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Logout failed!');
    }
  };

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await authApi.verify();
      const { user: userData, valid } = response.data;
      if (valid && userData) {
        const token = localStorage.getItem('token') || '';
        saveToStorage(token, userData); // Full 'User' data from backend response
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      toast.error("Verification Failed")
      console.error('Token verification error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    if (token && cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUser(parsedUser);
        verifyToken(); // Validate and refresh token
      } catch (error) {
        toast.error('Failed to load user data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};
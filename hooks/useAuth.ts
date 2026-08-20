/**
 * Authentication Hook
 * Custom hook for managing authentication
 */

import { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import firebaseAuthService from '../services/firebaseAuth';
import { User } from '../types';

export const useAuth = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  // Watch for auth state changes on mount
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const authUser = await firebaseAuthService.login(email, password);
      setUser(authUser);
      return authUser;
    } catch (err: any) {
      const message = err.message || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const newUser = await firebaseAuthService.register(email, password, name);
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await firebaseAuthService.logout();
      setUser(null);
      useAppStore.getState().reset();
    } catch (err: any) {
      const message = err.message || 'Logout failed';
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await firebaseAuthService.resetPassword(email);
    } catch (err: any) {
      const message = err.message || 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  return {
    user,
    isInitializing,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    resetPassword,
  };
};

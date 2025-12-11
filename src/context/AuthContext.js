import { login, logout, requestOtp, verifyOtp } from '@/services/auth.api';
import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext(undefined);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const requestOtpHandler = async (mobile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestOtp(mobile);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (mobile, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyOtp(mobile, otp);
      if (response?.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginHandler = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      if (response?.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    requestOtp: requestOtpHandler,
    verifyOtp: verifyOtpHandler,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ CUSTOM HOOK - This is what was missing/not exported properly
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

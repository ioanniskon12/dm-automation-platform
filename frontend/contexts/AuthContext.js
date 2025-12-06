"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const AuthContext = createContext({});

// Cookie helper functions
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Skip on server-side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      // Check for token in cookies first, then localStorage
      let token = getCookie('authToken');
      let storedUser = getCookie('user');

      // Fallback to localStorage for backward compatibility
      if (!token) {
        token = localStorage.getItem('authToken');
        storedUser = localStorage.getItem('user');
      }

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify token is still valid
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`);
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            // Token invalid, clear auth
            clearAuth();
          }
        } catch {
          // Token verification failed, but keep user logged in if we have local data
          // This handles offline scenarios
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token, rememberMe = false, expiresIn = null) => {
    // Calculate expiry days (default 7 days if remember me, 1 day otherwise)
    const expiryDays = rememberMe ? 7 : 1;

    if (rememberMe) {
      // Store in cookies for persistence across browser sessions
      setCookie('authToken', token, expiryDays);
      setCookie('user', JSON.stringify(userData), expiryDays);
      setCookie('rememberMe', 'true', expiryDays);
    } else {
      // Store in localStorage for session-only persistence
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const clearAuth = () => {
    // Clear cookies
    deleteCookie('authToken');
    deleteCookie('user');
    deleteCookie('rememberMe');

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('workspaceId');

    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

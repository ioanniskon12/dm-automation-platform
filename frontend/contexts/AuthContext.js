"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext({});

// Cookie helper functions
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
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

  // Clear auth data
  const clearAuth = () => {
    deleteCookie('authToken');
    deleteCookie('user');
    deleteCookie('rememberMe');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('workspaceId');
    }
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  useEffect(() => {
    // Check auth on mount
    const checkAuth = () => {
      try {
        // Check for token in cookies first, then localStorage
        let token = getCookie('authToken');
        let storedUser = getCookie('user');

        // Fallback to localStorage
        if (!token && typeof localStorage !== 'undefined') {
          token = localStorage.getItem('authToken');
          storedUser = localStorage.getItem('user');
        }

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
          } catch (e) {
            console.error('Error parsing user data:', e);
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }

      // Always set loading to false
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token, rememberMe = false) => {
    const expiryDays = rememberMe ? 7 : 1;

    if (rememberMe) {
      setCookie('authToken', token, expiryDays);
      setCookie('user', JSON.stringify(userData), expiryDays);
      setCookie('rememberMe', 'true', expiryDays);
    } else {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
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

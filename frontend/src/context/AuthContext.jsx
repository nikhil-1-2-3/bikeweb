import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tmh_user');
    const token  = localStorage.getItem('tmh_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    const { user: u, token } = res.data.data;
    localStorage.setItem('tmh_token', token);
    localStorage.setItem('tmh_user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const { user: u, token } = res.data.data;
    localStorage.setItem('tmh_token', token);
    localStorage.setItem('tmh_user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tmh_token');
    localStorage.removeItem('tmh_user');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await authService.getProfile();
      const u   = res.data.data;
      localStorage.setItem('tmh_user', JSON.stringify(u));
      setUser(u);
    } catch { /* token expired handled globally */ }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

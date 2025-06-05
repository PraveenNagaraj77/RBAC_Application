import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Optional: set token manually, though interceptor should handle it
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const res = await api.get('/users/profile');
        setUser(res.data);
      } catch (error) {
        console.error('Fetch profile failed:', error);
        toast.error('Session expired, please login again.');
        logout();
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [token]);

  const login = (token, userData) => {
    setToken(token);
    localStorage.setItem('token', token);
    // Optional, since interceptor reads localStorage:
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    toast.success('Logged in successfully');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

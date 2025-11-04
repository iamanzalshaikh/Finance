


import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('🔧 Environment Variables:', import.meta.env);
console.log('🌐 API_BASE_URL:', API_BASE_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ Store token in state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Set up axios interceptor to add token to all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Added Authorization header to request:', config.url);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  const fetchCurrentUser = useCallback(async () => {
    console.log('🔍 Fetching current user...');
    
    // If no token, don't even try
    if (!token) {
      console.log('⚠️ No token available, skipping fetch');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      
      console.log('✅ User fetched successfully:', response.data.user);
      setUser(response.data.user);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err.response?.data || err.message);
      setUser(null);
      setToken(null); // Clear invalid token
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log('✅ Found stored token, setting it...');
      setToken(storedToken);
    } else {
      console.log('⚠️ No stored token found');
      setLoading(false);
    }
  }, []);

  // ✅ Fetch user when token changes
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  const register = useCallback(async (name, email, password, currency = 'USD') => {
    setLoading(true);
    setError(null);
    console.log('📝 Registering user:', { name, email, currency });
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        { name, email, password, currency },
        { withCredentials: true }
      );
      
      console.log('✅ Registration successful:', response.data);
      
      const { user, token } = response.data;
      
      // ✅ Store token
      setToken(token);
      localStorage.setItem('token', token);
      console.log('✅ Token stored in localStorage');
      
      setUser(user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Registration failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    console.log('🔐 Logging in user:', email);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      
      console.log('✅ Login successful:', response.data);
      
      const { user, token } = response.data;
      
      // ✅ Store token
      setToken(token);
      localStorage.setItem('token', token);
      console.log('✅ Token stored in localStorage');
      
      setUser(user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Login failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🚪 Logging out user...');
    
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('⚠️ Logout request failed:', err.message);
    } finally {
      // ✅ Clear token and user
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      console.log('✅ Token removed from localStorage');
    }
  }, []);

  // ✅ Set withCredentials globally
  useEffect(() => {
    axios.defaults.withCredentials = true;
    console.log('🔧 Axios configured with withCredentials: true');
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        loading, 
        error, 
        login, 
        register, 
        logout, 
        fetchCurrentUser,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

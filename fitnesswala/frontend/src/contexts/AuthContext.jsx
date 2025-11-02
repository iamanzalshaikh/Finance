
// import React, { createContext, useState, useCallback, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true); // ✅ Start with true to fetch user
//   const [error, setError] = useState(null);

//   // ✅ Fetch current user on mount if token exists
//   const fetchCurrentUser = useCallback(async () => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(response.data.user);
//     } catch (err) {
//       console.error('Failed to fetch user:', err);
//       // Token might be invalid, clear it
//       localStorage.removeItem('token');
//       setToken(null);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchCurrentUser();
//   }, [fetchCurrentUser]);

//   const register = useCallback(async (name, email, password, currency = 'USD') => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/register`, {
//         name,
//         email,
//         password,
//         currency,
//       });
//       setToken(response.data.token);
//       setUser(response.data.user);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || err.message;
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const login = useCallback(async (email, password) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//         email,
//         password,
//       });
//       setToken(response.data.token);
//       setUser(response.data.user);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || err.message;
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//   }, []);

//   // ✅ Set Authorization header when token changes
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, fetchCurrentUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// import React, { createContext, useState, useCallback, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// // ✅ Always include cookies in API requests
// axios.defaults.withCredentials = true;

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch current user using cookie
//   const fetchCurrentUser = useCallback(async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/auth/me`);
//       setUser(response.data.user);
//     } catch (err) {
//       console.error('Failed to fetch user:', err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCurrentUser();
//   }, [fetchCurrentUser]);

//   // ✅ Register (cookie set by backend automatically)
//   const register = useCallback(async (name, email, password, currency = 'USD') => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/register`, {
//         name,
//         email,
//         password,
//         currency,
//       });
//       setUser(response.data.user);
//       return response.data;
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || err.message;
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ✅ Login (cookie set automatically)
//   const login = useCallback(async (email, password) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//         email,
//         password,
//       });
//       setUser(response.data.user);
//       return response.data;
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || err.message;
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ✅ Logout (clear cookie server-side)
//   const logout = useCallback(async () => {
//     try {
//       await axios.post(`${API_BASE_URL}/auth/logout`);
//     } catch (err) {
//       console.error('Logout failed:', err);
//     } finally {
//       setUser(null);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         login,
//         register,
//         logout,
//         fetchCurrentUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ✅ ADD THESE DEBUG LINES
console.log('🔧 Environment Variables:', import.meta.env);
console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🌐 Full login URL would be:', `${API_BASE_URL}/auth/login`);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch current user on mount (cookie is sent automatically)
  const fetchCurrentUser = useCallback(async () => {
    console.log('🔍 Fetching current user...');
    console.log('🌐 API_BASE_URL:', API_BASE_URL);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, { // ✅ FIXED: () not backticks
        withCredentials: true,
      });
      console.log('✅ User fetched successfully:', response.data.user);
      setUser(response.data.user);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const register = useCallback(async (name, email, password, currency = 'USD') => {
    setLoading(true);
    setError(null);
    console.log('📝 Registering user:', { name, email, currency });
    console.log('🌐 API URL:', `${API_BASE_URL}/auth/register`);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        { name, email, password, currency },
        { withCredentials: true }
      );
      console.log('✅ Registration successful:', response.data.user);
      setUser(response.data.user);
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
    console.log('🌐 API URL:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log('✅ Login successful:', response.data.user);
      setUser(response.data.user);
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
      setUser(null);
    }
  }, []);

  // ✅ Set withCredentials globally for all axios requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
    console.log('🔧 Axios configured with withCredentials: true');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, fetchCurrentUser }}>
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

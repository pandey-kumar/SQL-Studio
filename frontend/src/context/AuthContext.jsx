import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => {
    // Get or create session ID for guest users
    let sid = localStorage.getItem('sessionId');
    if (!sid) {
      sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sid);
    }
    return sid;
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const register = async ({ name, email, password }) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const response = await api.patch('/auth/profile', data);
    setUser(response.data.data);
    return response.data.data;
  };

  const value = {
    user,
    loading,
    sessionId,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

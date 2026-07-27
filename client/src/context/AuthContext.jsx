import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedLoginTime = localStorage.getItem('loginTime');

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        const isNewSession = !sessionStorage.getItem('sessionActive');
        if (isNewSession) {
          // New open of the website! Directly clear session to show login page
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('loginTime');
          setLoading(false);
          return;
        }

        // Check if 1 hour has elapsed
        if (storedLoginTime && (Date.now() - Number(storedLoginTime) > 3600000)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('loginTime');
          setLoading(false);
          return;
        }
      }

      setUser(parsedUser);
      setToken(storedToken);
      sessionStorage.setItem('sessionActive', 'true');
    }
    setLoading(false);
  }, []);

  // Monitor regular user session duration for 1-hour auto-logout
  useEffect(() => {
    if (user && user.role !== 'admin') {
      const interval = setInterval(() => {
        const storedLoginTime = localStorage.getItem('loginTime');
        if (storedLoginTime && (Date.now() - Number(storedLoginTime) > 3600000)) {
          logout();
          alert('Your session has expired. Please log in again.');
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role !== 'admin') {
        localStorage.setItem('loginTime', Date.now().toString());
      }
      sessionStorage.setItem('sessionActive', 'true');
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role !== 'admin') {
        localStorage.setItem('loginTime', Date.now().toString());
      }
      sessionStorage.setItem('sessionActive', 'true');
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (googleUser) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Google Sign-in failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role !== 'admin') {
        localStorage.setItem('loginTime', Date.now().toString());
      }
      sessionStorage.setItem('sessionActive', 'true');
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    sessionStorage.removeItem('sessionActive');
    setToken(null);
    setUser(null);
  };

  const reloadProfile = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const refreshedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(refreshedUser));
        setUser(refreshedUser);
      }
    } catch (error) {
      console.error('Failed to reload profile:', error);
    }
  };

  const updateProfile = async (yearOfStudy, branch) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ yearOfStudy, branch })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, reloadProfile, updateProfile, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

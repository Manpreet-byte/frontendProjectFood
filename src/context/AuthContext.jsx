import React, { createContext, useContext, useState } from 'react';
import dataService from '../data/dataService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  });

  const persistUser = (token, userData) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
    return userWithToken;
  };

  const login = async (email, password) => {
    try {
      const { token, user: userData } = await dataService.login(email, password);
      return persistUser(token, userData);
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const loginWithFirebaseIdToken = async (idToken) => {
    // For frontend-only, simulate Firebase login
    const userData = {
      _id: 'firebase_' + Date.now(),
      name: 'Firebase User',
      email: 'firebase@user.com',
      isAdmin: false
    };
    const token = 'firebase_token_' + Date.now();
    return persistUser(token, userData);
  };

  const setUserFromToken = async (token) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { token, user: userData } = await dataService.signup(name, email, password);
      return persistUser(token, userData);
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setUserFromToken, loginWithFirebaseIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

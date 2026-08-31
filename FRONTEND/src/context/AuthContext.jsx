import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUser } from '../data/initialUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('yojanasetu_auth_role') || 'guest';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [authModal, setAuthModal] = useState('none'); // 'none' | 'citizen_login' | 'citizen_register' | 'admin_login'

  useEffect(() => {
    localStorage.setItem('yojanasetu_auth_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('yojanasetu_user', JSON.stringify(user));
  }, [user]);

  const openAuthModal = (modalType = 'citizen_login') => {
    setAuthModal(modalType);
  };

  const closeAuthModal = () => {
    setAuthModal('none');
  };

  const loginCitizen = (credentials) => {
    // Frontend mock validation
    setRole('citizen');
    closeAuthModal();
    return { success: true };
  };

  const registerCitizen = (formData) => {
    const newUser = {
      ...initialUser,
      id: `USR-${Math.floor(100 + Math.random() * 900)}-NEW`,
      name: formData.fullName || "New Citizen",
      email: formData.email || "citizen@email.com",
      phone: formData.mobile || "+91 98765 00000"
    };
    setUser(newUser);
    setRole('citizen');
    closeAuthModal();
    return { success: true };
  };

  const loginAdmin = ({ adminId, password }) => {
    // Admin credential check
    if ((adminId === 'admin_001' && password === 'admin123') || (adminId && password)) {
      setRole('admin');
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: "Invalid Admin ID or Password" };
  };

  const logout = () => {
    setRole('guest');
    closeAuthModal();
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        setUser,
        authModal,
        openAuthModal,
        closeAuthModal,
        loginCitizen,
        registerCitizen,
        loginAdmin,
        logout,
        isAuthenticated: role !== 'guest',
        isCitizen: role === 'citizen',
        isAdmin: role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

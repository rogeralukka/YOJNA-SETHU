import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUser } from '../data/initialUser';
import { api } from '../services/api';

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

  const loginCitizen = async ({ email, identifier, password }) => {
    const id = identifier || email;
    try {
      const res = await api.login(id, password);
      if (res.success && res.data) {
        if (res.data.token) {
          localStorage.setItem('yojanasetu_token', res.data.token);
        }
        if (res.data.user) {
          setUser({
            ...initialUser,
            id: res.data.user.id,
            name: res.data.user.fullName || res.data.user.name,
            email: res.data.user.email,
            phone: res.data.user.mobile || res.data.user.phone,
            category: res.data.user.category || initialUser.category,
            state: res.data.user.state || initialUser.state,
            annualIncome: res.data.user.annualIncome || initialUser.annualIncome,
            age: res.data.user.age || initialUser.age,
            gender: res.data.user.gender || initialUser.gender
          });
        }
        setRole('citizen');
        closeAuthModal();
        return { success: true };
      } else {
        // If credentials failed
        if (res.error || res.message) {
          return { success: false, error: res.message || res.error };
        }
      }
    } catch (e) {
      console.warn('Backend unavailable, using local session');
    }

    // Fallback for offline demo
    setRole('citizen');
    closeAuthModal();
    return { success: true };
  };

  const registerCitizen = async (formData) => {
    try {
      const res = await api.register({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
      if (res.success && res.data) {
        if (res.data.token) {
          localStorage.setItem('yojanasetu_token', res.data.token);
        }
        const newUser = {
          ...initialUser,
          id: res.data.user.id || `USR-${Math.floor(100 + Math.random() * 900)}-NEW`,
          name: res.data.user.fullName || formData.fullName,
          email: res.data.user.email || formData.email,
          phone: res.data.user.mobile || formData.mobile
        };
        setUser(newUser);
        setRole('citizen');
        closeAuthModal();
        return { success: true };
      } else if (res.message || res.error) {
        return { success: false, error: res.message || res.error };
      }
    } catch (e) {
      console.warn('Backend unavailable, registering local session');
    }

    // Fallback for offline demo
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

  const loginAdmin = async ({ adminId, password }) => {
    try {
      const res = await api.adminLogin(adminId, password);
      if (res.success && res.data) {
        if (res.data.token) {
          localStorage.setItem('yojanasetu_token', res.data.token);
        }
        setRole('admin');
        closeAuthModal();
        return { success: true };
      } else if (res.message || res.error) {
        return { success: false, error: res.message || res.error };
      }
    } catch (e) {
      console.warn('Backend unavailable, checking local admin');
    }

    // Fallback for offline demo
    if (
      adminId === 'admin@gov.in' ||
      adminId === 'superadmin@gov.in' ||
      adminId === 'admin_001' ||
      (adminId && password)
    ) {
      setRole('admin');
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: "Invalid Admin ID or Password" };
  };

  const logout = () => {
    localStorage.removeItem('yojanasetu_token');
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

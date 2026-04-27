import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tribal_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();

    return {
      success: true,
      user: data   // backend should return user info
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

  const verifyOtp = async (email, otp, tempUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (data.success) {
        const fullUser = { ...data.user, token: data.token };
        setUser(fullUser);
        localStorage.setItem('tribal_user', JSON.stringify(fullUser));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json();

    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tribal_user');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        const fullUser = { ...updatedUser, token: user.token };
        setUser(fullUser);
        localStorage.setItem('tribal_user', JSON.stringify(fullUser));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const getAllUsers = async () => {
    if (!user || user.role !== 'admin') return [];
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const deleteUser = async (userId) => {
    if (!user || user.role !== 'admin') return { success: false };
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    login,
    verifyOtp,
    signup,
    logout,
    updateProfile,
    getAllUsers,
    deleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

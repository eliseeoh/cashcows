import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '.authentication';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadStoredData = async () => {
        const storedAuthData = JSON.parse(localStorage.getItem('authData'));
        if (storedAuthData) {
          setAuthData(storedAuthData);
        }
        setLoading(false);
      };
  
      loadStoredData();
    }, []);
  
    const signIn = async (email, password) => {
      const _authData = await loginUser(email, password);
      setAuthData(_authData);
      localStorage.setItem('authData', JSON.stringify(_authData));
    };
  
    const signOut = () => {
      setAuthData(null);
      localStorage.removeItem('authData');
    };
  
    return (
      <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };
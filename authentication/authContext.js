import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { loginUser, registerUser } from './apiService';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        const token = await SecureStore.getItemAsync('userToken');
        userToken = token ? JSON.parse(token) : null;
      } catch (e) {
        console.log('Restoring token failed:', e);
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);
  
  const authContext = useMemo(
    () => ({
      signIn: async (email, password) => {
        try {
          const userToken = await loginUser(email, password);
          await SecureStore.setItemAsync('userToken', JSON.stringify(userToken));
          dispatch({ type: 'SIGN_IN', token: userToken });
        } catch (error) {
          console.error('Sign in failed:', error);
        }
      },
      signUp: async (email, username, password) => {
        try {
          const userToken = await registerUser(email, username, password); // Implement your registerUser function
          await SecureStore.setItemAsync('userToken', JSON.stringify(userToken));
          dispatch({ type: 'SIGN_IN', token: userToken });
        } catch (error) {
          console.error('Sign up failed:', error);
        }
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync('userToken');
        } catch (e) {
          console.error('Sign out failed:', e);
        }
        dispatch({ type: 'SIGN_OUT' });
      }
    }),
    []
  );
  
    return (
      <AuthContext.Provider value={{ state, ...authContext }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export { AuthContext, AuthProvider };
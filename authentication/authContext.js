import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from './apiService';

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
        console.log('Token retrieved from SecureStore:', userToken);
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
          const { user, token } = await loginUser(email, password); // Retrieve user and token
          console.log('signIn called with token:', token);
          await SecureStore.setItemAsync('userToken', JSON.stringify(token));
          console.log('Token set in SecureStore during signIn:', token);
          dispatch({ type: 'SIGN_IN', token });
        } catch (error) {
          console.error('Sign in failed:', error);
        }
      },
      signUp: async (token) => {
        try {
          console.log('signUp called with token:', token);
          await SecureStore.setItemAsync('userToken', JSON.stringify(token));
          console.log('Token set in SecureStore during signUp:', token);
          dispatch({ type: 'SIGN_IN', token });
        } catch (error) {
          console.error('Sign up failed:', error);
        }
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync('userToken');
          console.log('Token removed from SecureStore');
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

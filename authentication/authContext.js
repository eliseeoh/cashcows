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
            user: action.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let user;

      try {
        const token = await SecureStore.getItemAsync('userToken');
        userToken = token ? JSON.parse(token) : null;
        
        const userData = await SecureStore.getItemAsync('userData');
        user = userData ? JSON.parse(userData) : null;
      } catch (e) {
        console.log('Restoring token failed:', e);
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken, user });
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
          await SecureStore.setItemAsync('userData', JSON.stringify(user));
          console.log('user info', user);
          console.log('Token and user set in SecureStore during signIn:', token, user);
          dispatch({ type: 'SIGN_IN', token, user });
        } catch (error) {
          console.error('Sign in failed:', error);
        }
      },
      signUp: async (token, user) => {
        try {
          console.log('signUp called with token:', token);
          const stringifiedToken = JSON.stringify(token);
          const stringifiedUser = JSON.stringify(user);
          await SecureStore.setItemAsync('userToken', stringifiedToken);
          await SecureStore.setItemAsync('userData', stringifiedUser);
          console.log('Token and user set in SecureStore during signUp:', token, user);
          dispatch({ type: 'SIGN_IN', token: stringifiedToken, user: stringifiedUser });
        } catch (error) {
          console.error('Sign up failed:', error);
        }
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userData');
          console.log('Token and user removed from SecureStore');
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

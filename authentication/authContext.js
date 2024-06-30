import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser } from './apiService';
import { auth, db } from '../config/firebaseConfig';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const AuthContext = createContext();

const initialExpenses = Array.from({ length: 12 }, () => []);

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        userId: action.userId,
        isLoading: false,
        user: action.user,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        userId: action.userId,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        userId: null,
        user: null,
        expenses: initialExpenses,
      };
    case 'ADD_EXPENSE':
      const updatedExpenses = [...prevState.expenses];
      const month = new Date(action.payload.expense.date).getMonth();
      if (!updatedExpenses[month]) {
        updatedExpenses[month] = [];
      }
      updatedExpenses[month].push(action.payload.expense);
      updatedExpenses[month].sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        ...prevState,
        expenses: updatedExpenses,
      };
    case 'SET_EXPENSES':
      return {
        ...prevState,
        expenses: action.expenses,
      };
    default:
      return prevState;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    isSignout: false,
    userToken: null,
    userId: null,
    user: null,
    expenses: initialExpenses,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let userId;
      let user;

      try {
        const token = await SecureStore.getItemAsync('userToken');
        const id = await SecureStore.getItemAsync('userId');
        userToken = token ? JSON.parse(token) : null;
        userId = id ? JSON.parse(id) : null;

        if (userId) {
          user = { uid: userId }; // Assuming minimal user info for bootstrap
        }

        console.log('Bootstrap userToken:', userToken);
        console.log('Bootstrap userId:', userId);
      } catch (e) {
        console.log('Restoring token failed:', e);
      }

      if (userToken && userId) {
        fetchUserExpenses(userId);
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken, userId, user });
    };

    bootstrapAsync();
  }, []);

  const fetchUserExpenses = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users", userId, "expenses"));
      const expenses = Array.from({ length: 12 }, () => []);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const month = new Date(data.date).getMonth();
        expenses[month].push(data);
      });
      dispatch({ type: 'SET_EXPENSES', expenses });
    } catch (error) {
      console.error('Error fetching user expenses:', error);
    }
  };

  const addExpense = async (expense) => {
    const { userId } = state;
    if (!userId) {
      console.error('User ID is null, cannot add expense.');
      return;
    }
    console.log('Adding expense for user:', userId);
    console.log('Expense:', expense);
    try {
      await setDoc(doc(collection(db, "users", userId, "expenses")), expense);
      dispatch({ type: 'ADD_EXPENSE', payload: { expense } });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const authContext = useMemo(() => ({
    signIn: async (email, password) => {
      try {
        const { user, token } = await loginUser(email, password);
        await SecureStore.setItemAsync('userToken', JSON.stringify(token));
        await SecureStore.setItemAsync('userId', JSON.stringify(user.uid));
        fetchUserExpenses(user.uid);
        dispatch({ type: 'SIGN_IN', token, userId: user.uid, user });
      } catch (error) {
        console.error('Sign in failed:', error);
      }
    },
    signUp: async (email, password) => {
      try {
        const { user, token } = await registerUser(email, password); // Ensure this returns both user and token
        await SecureStore.setItemAsync('userToken', JSON.stringify(token));
        await SecureStore.setItemAsync('userId', JSON.stringify(user.uid));
        fetchUserExpenses(user.uid);
        dispatch({ type: 'SIGN_IN', token, userId: user.uid, user });
      } catch (error) {
        console.error('Sign up failed:', error);
      }
    },
    signOut: async () => {
      try {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userId');
      } catch (e) {
        console.error('Sign out failed:', e);
      }
      dispatch({ type: 'SIGN_OUT' });
    },
    addExpense,
  }), [state]);

  return (
    <AuthContext.Provider value={{ state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };


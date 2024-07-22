import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser, uploadProfilePicture, updateUserProfile } from './apiService';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

const AuthContext = createContext();

const initialExpenses = Array.from({ length: 12 }, () => []);
const initialBudgets = {}; // Initialize budgets

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
        budgets: initialBudgets,
      };
    case 'ADD_EXPENSE':
      const updatedExpenses = [...prevState.expenses];
      const addMonth = new Date(action.payload.expense.date).getMonth();
      if (!updatedExpenses[addMonth]) {
        updatedExpenses[addMonth] = [];
      }
      updatedExpenses[addMonth].push(action.payload.expense);
      updatedExpenses[addMonth].sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        ...prevState,
        expenses: updatedExpenses,
      };
    case 'EDIT_EXPENSE':
      const editExpense = action.payload.expense;
      const originalMonth = new Date(action.payload.originalDate).getMonth();
      const newMonth = new Date(editExpense.date).getMonth();
      const editedExpenses = [...prevState.expenses];

      // Remove expense from the original month
      if (originalMonth !== newMonth) {
        editedExpenses[originalMonth] = editedExpenses[originalMonth].filter(exp => exp.id !== editExpense.id);
      }

      // Add or update expense in the new month
      if (!editedExpenses[newMonth]) {
        editedExpenses[newMonth] = [];
      }
      const expenseIndex = editedExpenses[newMonth].findIndex(exp => exp.id === editExpense.id);
      if (expenseIndex !== -1) {
        editedExpenses[newMonth][expenseIndex] = editExpense;
      } else {
        editedExpenses[newMonth].push(editExpense);
      }
      editedExpenses[newMonth].sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        ...prevState,
        expenses: editedExpenses,
      };
    case 'DELETE_EXPENSE':
      const filteredExpenses = [...prevState.expenses];
      const deleteMonth = new Date(action.payload.date).getMonth();
      filteredExpenses[deleteMonth] = filteredExpenses[deleteMonth].filter(exp => exp.id !== action.payload.id);
      return {
        ...prevState,
        expenses: filteredExpenses,
      };
    case 'SET_EXPENSES':
      return {
        ...prevState,
        expenses: action.expenses,
      };
    case 'SET_BUDGETS':
      return {
        ...prevState,
        budgets: action.budgets,
      };
    case 'UPDATE_PROFILE':
      return {
        ...prevState,
        user: { ...prevState.user, ...action.payload },
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
    budgets: initialBudgets, // Initialize budgets
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
          const userDoc = await getDoc(doc(db, "users", userId));
          user = { uid: userId, ...userDoc.data() };
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
        expenses[month].push({ ...data, id: doc.id });
      });
      dispatch({ type: 'SET_EXPENSES', expenses });
    } catch (error) {
      console.error('Error fetching user expenses:', error);
    }
  };

  const setBudgets = (budgets) => {
    dispatch({ type: 'SET_BUDGETS', budgets });
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
      const docRef = await addDoc(collection(db, "users", userId, "expenses"), expense);
      dispatch({ type: 'ADD_EXPENSE', payload: { expense: { ...expense, id: docRef.id } } });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const editExpense = async (expense, originalDate) => {
    const { userId } = state;
    if (!userId) {
      console.error('User ID is null, cannot edit expense.');
      return;
    }
    console.log('Editing expense for user:', userId);
    console.log('Expense:', expense);
    try {
      await updateDoc(doc(db, "users", userId, "expenses", expense.id), expense);
      dispatch({ type: 'EDIT_EXPENSE', payload: { expense, originalDate } });
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  const deleteExpense = async (expenseId, expenseDate) => {
    const { userId } = state;
    if (!userId) {
      console.error('User ID is null, cannot delete expense.');
      return;
    }
    console.log('Deleting expense for user:', userId);
    try {
      await deleteDoc(doc(db, "users", userId, "expenses", expenseId));
      dispatch({ type: 'DELETE_EXPENSE', payload: { id: expenseId, date: expenseDate } });
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const updateUserProfile = async (userId, profile) => {
    try {
      await updateDoc(doc(db, "users", userId), profile);
      dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const authContext = useMemo(() => ({
    signIn: async (email, password) => {
      try {
        const { user, token, username } = await loginUser(email, password);
        await SecureStore.setItemAsync('userToken', JSON.stringify(token));
        await SecureStore.setItemAsync('userId', JSON.stringify(user.uid));
        fetchUserExpenses(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        dispatch({ type: 'SIGN_IN', token, userId: user.uid, user: { ...user, ...userDoc.data() } });
      } catch (error) {
        console.error('Sign in failed:', error);
      }
    },
    signUp: async (email, password, username) => {
      try {
        const { user, token } = await registerUser(email, password, username); // Ensure this returns both user and token
        await SecureStore.setItemAsync('userToken', JSON.stringify(token));
        await SecureStore.setItemAsync('userId', JSON.stringify(user.uid));
        fetchUserExpenses(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        dispatch({ type: 'SIGN_IN', token, userId: user.uid, user: { ...user, ...userDoc.data() } });
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
    editExpense,
    deleteExpense,
    setBudgets,
    uploadProfilePicture,
    updateUserProfile,
  }), [state]);

  return (
    <AuthContext.Provider value={{ state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };


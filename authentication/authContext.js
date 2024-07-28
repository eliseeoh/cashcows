import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser, uploadProfilePicture, updateUserProfile } from './apiService'; // Ensure correct import
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

const AuthContext = createContext();

const initialExpenses = {}; // Use an object to store expenses by year and month
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
      const addYear = new Date(action.payload.expense.date).getFullYear();
      const addMonth = new Date(action.payload.expense.date).getMonth();
      const updatedExpensesAdd = { ...prevState.expenses };

      if (!updatedExpensesAdd[addYear]) {
        updatedExpensesAdd[addYear] = Array.from({ length: 12 }, () => []);
      }
      if (!updatedExpensesAdd[addYear][addMonth]) {
        updatedExpensesAdd[addYear][addMonth] = [];
      }
      updatedExpensesAdd[addYear][addMonth].push(action.payload.expense);
      updatedExpensesAdd[addYear][addMonth].sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        ...prevState,
        expenses: updatedExpensesAdd,
      };

    case 'EDIT_EXPENSE':
      const editExpense = action.payload.expense;
      const originalYear = new Date(action.payload.originalDate).getFullYear();
      const originalMonth = new Date(action.payload.originalDate).getMonth();
      const newYear = new Date(editExpense.date).getFullYear();
      const newMonth = new Date(editExpense.date).getMonth();
      const updatedExpensesEdit = { ...prevState.expenses };

      // Remove expense from the original month and year
      if (originalYear !== newYear || originalMonth !== newMonth) {
        updatedExpensesEdit[originalYear][originalMonth] = updatedExpensesEdit[originalYear][originalMonth].filter(
          (exp) => exp.id !== editExpense.id
        );
      }

      // Add or update expense in the new month and year
      if (!updatedExpensesEdit[newYear]) {
        updatedExpensesEdit[newYear] = Array.from({ length: 12 }, () => []);
      }
      if (!updatedExpensesEdit[newYear][newMonth]) {
        updatedExpensesEdit[newYear][newMonth] = [];
      }
      const expenseIndex = updatedExpensesEdit[newYear][newMonth].findIndex((exp) => exp.id === editExpense.id);
      if (expenseIndex !== -1) {
        updatedExpensesEdit[newYear][newMonth][expenseIndex] = editExpense;
      } else {
        updatedExpensesEdit[newYear][newMonth].push(editExpense);
      }
      updatedExpensesEdit[newYear][newMonth].sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        ...prevState,
        expenses: updatedExpensesEdit,
      };

    case 'DELETE_EXPENSE':
      const deleteYear = new Date(action.payload.date).getFullYear();
      const deleteMonth = new Date(action.payload.date).getMonth();
      const updatedExpensesDelete = { ...prevState.expenses };

      updatedExpensesDelete[deleteYear][deleteMonth] = updatedExpensesDelete[deleteYear][deleteMonth].filter(
        (exp) => exp.id !== action.payload.id
      );

      return {
        ...prevState,
        expenses: updatedExpensesDelete,
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

const fetchUserExpenses = async (userId, dispatch) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "expenses"));
    const expenses = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const year = new Date(data.date).getFullYear();
      const month = new Date(data.date).getMonth();

      if (!expenses[year]) {
        expenses[year] = Array.from({ length: 12 }, () => []);
      }
      if (!expenses[year][month]) {
        expenses[year][month] = [];
      }
      expenses[year][month].push({ ...data, id: doc.id });
    });
    dispatch({ type: 'SET_EXPENSES', expenses });
  } catch (error) {
    console.error('Error fetching user expenses:', error);
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

          // Fetch and set budgets
          const budgets = userDoc.data().budgets || {};
          dispatch({ type: 'SET_BUDGETS', budgets });
        }

        console.log('Bootstrap userToken:', userToken);
        console.log('Bootstrap userId:', userId);
      } catch (e) {
        console.log('Restoring token failed:', e);
      }

      if (userToken && userId) {
        fetchUserExpenses(userId, dispatch);
      }

      dispatch({
        type: 'RESTORE_TOKEN', token: userToken, userId, user });
    };

    bootstrapAsync();
  }, []);

  const setBudgets = async (budgets) => {
    const { userId } = state;
    if (!userId) {
      console.error('User ID is null, cannot set budgets.');
      return;
    }
    console.log('Setting budgets for user:', userId);
    try {
      await updateDoc(doc(db, "users", userId), { budgets });
      dispatch({ type: 'SET_BUDGETS', budgets });
    } catch (error) {
      console.error('Error setting budgets:', error);
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

  const authContext = useMemo(() => ({
    signIn: async (email, password) => {
      try {
        const { user, token } = await loginUser(email, password);
        await SecureStore.setItemAsync('userToken', JSON.stringify(token));
        await SecureStore.setItemAsync('userId', JSON.stringify(user.uid));
        await fetchUserExpenses(user.uid, dispatch);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const budgets = userDoc.data().budgets || {};
        dispatch({ type: 'SIGN_IN', token, userId: user.uid, user: { ...user, ...userDoc.data() } });
        dispatch({ type: 'SET_BUDGETS', budgets });
      } catch (error) {
        console.error('Sign in failed:', error);
        throw error;
      }
    },
    signUp: async (email, password, username) => {
      try {
        const { user, token } = await registerUser(email, password, username);
        await SecureStore.setItemAsync('userToken', JSON.stringify(token));
        await SecureStore.setItemAsync('userId', JSON.stringify(user.uid));
        await fetchUserExpenses(user.uid, dispatch);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const budgets = userDoc.data().budgets || {};
        dispatch({ type: 'SIGN_IN', token, userId: user.uid, user: { ...user, ...userDoc.data() } });
        dispatch({ type: 'SET_BUDGETS', budgets });
      } catch (error) {
        console.error('Sign up failed:', error);
        throw error;
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

   

import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Retrieve the user's token
    console.log('User registered:', user);
    return { user, token }; // Return both user and token
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Retrieve the user's token
    console.log('User logged in:', user);
    return { user, token }; // Return both user and token
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};


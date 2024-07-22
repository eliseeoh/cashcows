import { auth, db } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Retrieve the user's token
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: email,
    });
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


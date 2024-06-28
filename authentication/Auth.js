import { auth } from '../config/firebaseConfig';  // Update the path as necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/compat/auth';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Additional user information can be stored in Firestore if needed
    res.status(201).json({
      message: "User successfully created",
      user: user.uid,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not successfully created",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    res.status(200).json({
      message: "User successfully logged in",
      user: user.uid,
    });
  } catch (error) {
    res.status(400).json({
      message: "Login not successful",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  // Update logic can be added here if needed for Firebase
  res.status(200).json({
    message: "Update function is not implemented for Firebase",
  });
};

export const deleteUser = asy



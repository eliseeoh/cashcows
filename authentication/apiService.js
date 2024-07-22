import { auth, db, storage } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    await setDoc(doc(db, "users", user.uid), {
      email,
      username,
      photoURL: ""
    });

    return { user, token };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    return { user: { ...user, ...userData }, token };
  } catch (error) {
    throw error;
  }
};

export const uploadProfilePicture = async (userId, imagePath) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}`);
    const response = await fetch(imagePath);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);

    const photoURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", userId), { photoURL });

    return photoURL;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, profile) => {
  try {
    await updateDoc(doc(db, "users", userId), profile);
  } catch (error) {
    throw error;
  }
};

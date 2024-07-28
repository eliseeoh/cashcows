import { auth, db, storage } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const checkUsernameExists = async (username) => {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const registerUser = async (email, password, username) => {
  try {
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      throw new Error('auth/username-already-in-use');
    }

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
    const snapshot = await uploadBytes(storageRef, blob);
    const photoURL = await getDownloadURL(snapshot.ref);
    await updateDoc(doc(db, "users", userId), { photoURL });
    return photoURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
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

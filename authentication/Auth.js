const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const bcrypt = require("bcryptjs");
require('dotenv').config({ path: '../.env' });

const auth = getAuth();

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
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

exports.update = async (req, res) => {
  // Update logic can be added here if needed for Firebase
  res.status(200).json({
    message: "Update function is not implemented for Firebase",
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await auth.getUser(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await auth.deleteUser(id);
    res.status(201).json({ message: "User successfully deleted", user });
  } catch (error) {
    res.status(400).json({ message: "An error occurred", error: error.message });
  }
};


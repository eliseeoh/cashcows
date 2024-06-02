const jwt = require('jsonwebtoken');
const User = require('../model/user');

const jwtSecret = 'your_jwt_secret';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(403).send('Access denied.');
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') {
      return res.status(403).send('Access denied.');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(403).send('Access denied.');
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).send('Access denied.');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = {
  adminAuth,
  userAuth
};

  
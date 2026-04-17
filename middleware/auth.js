const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token missing.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: 'Password changed recently. Please log in again.'
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

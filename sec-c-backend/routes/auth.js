const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, signToken } = require('../middleware/auth');

// Helper to remove password etc. from response
const buildUserResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  operatorId: user.operatorId,
  clearanceLevel: user.clearanceLevel,
  avatarUrl: user.avatarUrl,
  fullName: user.fullName,
  bio: user.bio,
  location: user.location,
  lastLogin: user.lastLogin,
  loginCount: user.loginCount
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, region } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.'
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username.'
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      region: region || '',
      fullName: username,
      lastLogin: new Date(),
      loginCount: 1
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: buildUserResponse(user)
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Try again later.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/email and password are required.'
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: buildUserResponse(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed. Try again later.'
    });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: buildUserResponse(req.user)
  });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = [
      'fullName',
      'bio',
      'location',
      'occupation',
      'website',
      'phone',
      'dob',
      'gender',
      'twitter',
      'github',
      'linkedin',
      'discord',
      'avatarUrl',
      'settings'
    ];

    const updates = {};
    for (const key of Object.keys(req.body)) {
      if (allowed.includes(key)) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated.',
      user: buildUserResponse(user)
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({
      success: false,
      message: 'Could not update profile.'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
});

module.exports = router;

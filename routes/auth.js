const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, signToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, region } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email, and password'
            });
        }
        
        // Password length validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }
        
        // Create user
        const user = await User.create({
            username,
            email,
            password,
            region: region || '',
            fullName: username,
            lastLogin: new Date(),
            loginCount: 1
        });
        
        // Generate token
        const token = signToken(user._id);
        
        // Send response
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            operatorId: user.operatorId,
            clearanceLevel: user.clearanceLevel,
            avatarUrl: user.avatarUrl,
            fullName: user.fullName,
            bio: user.bio,
            location: user.location,
            createdAt: user.createdAt
        };
        
        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to SEC-C!',
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error('Registration Error:', error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username/email and password'
            });
        }
        
        // Find user (include password for comparison)
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }] 
        }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Update last login and login count
        user.lastLogin = new Date();
        user.loginCount += 1;
        await user.save({ validateBeforeSave: false });
        
        // Generate token
        const token = signToken(user._id);
        
        // Send response
        const userResponse = {
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
        };
        
        res.status(200).json({
            success: true,
            message: 'Login successful! Welcome back to SEC-C!',
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const allowedFields = [
            'fullName', 'bio', 'location', 'occupation', 'website',
            'phone', 'dob', 'gender', 'twitter', 'github', 
            'linkedin', 'discord', 'avatarUrl', 'settings'
        ];
        
        const updates = {};
        
        // Filter only allowed fields
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user
        });
        
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
});

module.exports = router;

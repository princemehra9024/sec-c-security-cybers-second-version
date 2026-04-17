const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Get token from Authorization header or cookies
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login to access this resource.'
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.'
            });
        }
        
        // Check if user changed password after token was issued
        if (user.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'Password recently changed. Please login again.'
            });
        }
        
        // Grant access to protected route
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};

// Generate JWT Token
exports.signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

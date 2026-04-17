const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files (your HTML/CSS/JS)
app.use(express.static('public'));

// ============================================================================
// ROUTES
// ============================================================================

// API Routes
app.use('/api/auth', authRoutes);

// Serve home page as default
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Serve profile page
app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SEC-C Server Online',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║   ███████╗███████╗ ██████╗      ██████╗                      ║
    ║   ██╔════╝██╔════╝██╔════╝     ██╔════╝                      ║
    ║   ███████╗█████╗  ██║     █████╗██║                          ║
    ║   ╚════██║██╔══╝  ██║     ╚════╝██║                          ║
    ║   ███████║███████╗╚██████╗      ╚██████╗                     ║
    ║   ╚══════╝╚══════╝ ╚═════╝       ╚═════╝                     ║
    ║                                                               ║
    ║   🚀 SERVER STATUS: OPERATIONAL                              ║
    ║   📡 PORT: ${PORT}                                              ║
    ║   🌍 ENV: ${process.env.NODE_ENV || 'development'}                                       ║
    ║   💾 DATABASE: CONNECTED                                      ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
    `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err);
    process.exit(1);
});

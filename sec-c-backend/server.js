const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();

// Connect DB
connectDB();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// CORS
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Basic rate limiting on API
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

// Static files: serve your existing frontend (signup.html, profile.html, etc.)
app.use(express.static(path.join(__dirname, '../')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// API routes
app.use('/api/auth', authRoutes);

// Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../signup.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../signup.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../profile.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SEC-C Server Online',
    timestamp: new Date().toISOString()
  });
});

// 404 JSON for API
app.use('/api', (req, res) =>
  res.status(404).json({ success: false, message: 'API route not found.' })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ SEC-C backend running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

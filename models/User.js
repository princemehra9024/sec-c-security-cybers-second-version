const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic Auth
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password by default
    },
    
    // Profile Data
    fullName: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: 'Elite Cybersecurity Agent',
        maxlength: 500
    },
    avatarUrl: {
        type: String,
        default: 'https://i.pravatar.cc/200?img=12'
    },
    location: {
        type: String,
        default: 'Cyber City, Matrix'
    },
    occupation: {
        type: String,
        default: 'Security Analyst'
    },
    website: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    dob: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
        default: 'prefer_not_to_say'
    },
    
    // Social Links
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    discord: { type: String, default: '' },
    
    // SEC-C Specific
    region: {
        type: String,
        enum: ['NA_EAST_01', 'NA_WEST_02', 'EU_CENTRAL', 'ASIA_PACIFIC', ''],
        default: ''
    },
    operatorId: {
        type: String,
        unique: true
    },
    clearanceLevel: {
        type: String,
        enum: ['ALPHA', 'BETA', 'GAMMA', 'OMEGA'],
        default: 'ALPHA'
    },
    rank: {
        type: Number,
        default: 1
    },
    experience: {
        type: Number,
        default: 0
    },
    
    // Settings
    settings: {
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        weeklyDigest: { type: Boolean, default: true },
        autoSave: { type: Boolean, default: true },
        twoFactorAuth: { type: Boolean, default: false },
        sessionTimeout: { type: Boolean, default: true },
        activityLog: { type: Boolean, default: true },
        dndEnabled: { type: Boolean, default: false }
    },
    
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginCount: {
        type: Number,
        default: 0
    },
    
    // Security
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    verificationExpires: Date
    
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate Operator ID before save
userSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Generate unique operator ID: OP-XXXX-XXXX
        const randomNum = Math.floor(Math.random() * 99999999);
        this.operatorId = `OP-${randomNum.toString().padStart(8, '0')}`;
    }
    next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();
    
    // Hash password with bcrypt
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

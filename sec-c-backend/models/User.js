const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
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
      select: false
    },

    // Profile
    fullName: { type: String, default: '' },
    bio: {
      type: String,
      default: 'Elite Cybersecurity Agent specializing in threat analysis.',
      maxlength: 500
    },
    avatarUrl: {
      type: String,
      default: 'https://i.pravatar.cc/200?img=12'
    },
    location: { type: String, default: 'Cyber City, Matrix' },
    occupation: { type: String, default: 'Security Analyst' },
    website: { type: String, default: '' },
    phone: { type: String, default: '' },
    dob: { type: Date, default: null },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },

    // Social
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    discord: { type: String, default: '' },

    // Game / SEC-C
    region: {
      type: String,
      enum: ['NA_EAST_01', 'NA_WEST_02', 'EU_CENTRAL', 'ASIA_PACIFIC', ''],
      default: ''
    },
    operatorId: { type: String, unique: true },
    clearanceLevel: {
      type: String,
      enum: ['ALPHA', 'BETA', 'GAMMA', 'OMEGA'],
      default: 'ALPHA'
    },
    rank: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },

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

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    loginCount: { type: Number, default: 0 },
    passwordChangedAt: Date
  },
  {
    timestamps: true
  }
);

// Generate Operator ID for new users
userSchema.pre('save', function (next) {
  if (this.isNew && !this.operatorId) {
    const randomNum = Math.floor(Math.random() * 99999999);
    this.operatorId = `OP-${randomNum.toString().padStart(8, '0')}`;
    if (!this.fullName) this.fullName = this.username;
  }
  next();
});

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  return JWTTimestamp < changedTimestamp;
};

module.exports = mongoose.model('User', userSchema);

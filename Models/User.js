import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: false, // Not required for Google Sign-In users
    minlength: [8, 'Password must be at least 8 characters'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values for non-Google users
  },
  phoneNumber: {
    type: String,
    required: false,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
  },
  role: {
    type: String,
    enum: ['admin', 'provider', 'consumer'],
    default: 'consumer',
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  googleAccessToken: {
    type: String,
    default: null,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Users', userSchema);
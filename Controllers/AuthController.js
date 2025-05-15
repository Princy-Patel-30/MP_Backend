import User from '../Models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

const generatetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const validRoles = ['consumer', 'provider', 'admin'];
  if (role && !validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    role: role || 'consumer',
  });

  await user.save();
  const token = generatetoken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const token = generatetoken(user._id);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const code = req.body.code;

  if (!code) {
    res.status(400);
    throw new Error('Authorization code is required');
  }

  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        role: 'consumer',
        googleAccessToken: tokens.access_token,
      });
      await user.save();
    } else {
      user.googleId = googleId;
      user.googleAccessToken = tokens.access_token;
      await user.save();
    }

    const token = generatetoken(user._id);
    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      googleAccessToken: tokens.access_token,
    });
  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    res.status(401).json({
      message: 'Google authentication failed',
      error: error.response?.data?.error_description || error.message,
    });
  }
});

export const googleCallback = asyncHandler(async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.status(400);
    throw new Error('Authorization code is required');
  }

  res.redirect(`http://localhost:5173/auth/google/callback?code=${encodeURIComponent(code)}`);
});

export const getGoogleAuthUrl = asyncHandler(async (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });
  res.status(200).json({ authUrl });
});
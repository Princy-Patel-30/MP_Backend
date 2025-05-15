import User from '../Models/User.js';
import Booking from '../Models/Booking.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json(user);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, password, phoneNumber } = req.body;
  if (name) user.name = name;
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    user.email = email;
  }
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
  });
});

export const getUserDashboard = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('service provider')
    .sort({ createdAt: -1 })
    .limit(5);
  res.status(200).json({
    message: 'User dashboard accessed successfully',
    recentBookings: bookings,
  });
});
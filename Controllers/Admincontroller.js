import User from '../Models/User.js';
import Service from '../Models/Service.js';
import Booking from '../Models/Booking.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

export const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phoneNumber } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Name, email, password, and role are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    phoneNumber,
  });

  await user.save();

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  let filter = {};

  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.status(200).json(users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isBlocked, phoneNumber } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (isBlocked !== undefined) user.isBlocked = isBlocked;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();

  res.status(200).json({
    message: 'User updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isBlocked: user.isBlocked,
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ message: 'User deleted successfully' });
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let services = [];
  if (user.role === 'provider') {
    services = await Service.find({ provider: user._id }).populate('provider', 'name email');
  }

  let bookings = [];
  if (user.role === 'consumer') {
    bookings = await Booking.find({ user: user._id }).populate('service provider');
  } else if (user.role === 'provider') {
    bookings = await Booking.find({ provider: user._id }).populate('service user');
  }

  res.status(200).json({
    user,
    services,
    bookings,
  });
});

export const adminGetAllServices = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  let filter = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { serviceTitle: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];
  }

  const services = await Service.find(filter)
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(services);
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.status(200).json({ message: 'Service deleted successfully' });
});
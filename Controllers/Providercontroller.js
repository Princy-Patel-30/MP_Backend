import User from '../Models/User.js';
import Service from '../Models/Service.js';
import asyncHandler from 'express-async-handler';

export const createService = asyncHandler(async (req, res) => {
  const {
    companyName,
    serviceTitle,
    description,
    price,
    availability,
    providerContact,
    category,
    subCategory,
  } = req.body;

  if (
    !companyName ||
    !serviceTitle ||
    !description ||
    !price ||
    !availability ||
    !providerContact ||
    !category ||
    !subCategory
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const service = new Service({
    companyName,
    serviceTitle,
    description,
    price,
    availability,
    provider: req.user._id,
    providerName: req.user.name,
    providerContact,
    category,
    subCategory,
  });

  await service.save();
  res.status(201).json({
    message: 'Service created successfully',
    service: await service.populate('provider'),
  });
});

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ provider: req.user._id })
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(services);
});

export const getServicesByCompany = asyncHandler(async (req, res) => {
  const { companyName } = req.params;
  const services = await Service.find({ companyName, provider: req.user._id })
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(services);
});

export const updateServiceStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.params;

  if (!['Pending', 'Accepted', 'Rejected', 'Completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const service = await Service.findById(id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (service.provider.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this service');
  }

  service.status = status;
  await service.save();

  res.status(200).json({
    message: `Service ${status} successfully`,
    service: await service.populate('provider'),
  });
});

export const getProviderProfile = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id).select('-password');
  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }
  res.status(200).json(provider);
});

export const updateProviderProfile = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id);
  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  const { name, email, phoneNumber } = req.body;
  if (name) provider.name = name;
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: provider._id } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
    provider.email = email;
  }
  if (phoneNumber) provider.phoneNumber = phoneNumber;

  await provider.save();

  res.status(200).json({
    message: 'Profile updated successfully',
    provider: {
      id: provider._id,
      name: provider.name,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      role: provider.role,
    },
  });
});
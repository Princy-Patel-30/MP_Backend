import Service from '../Models/Service.js';
import asyncHandler from 'express-async-handler';

export const getAllServices = asyncHandler(async (req, res) => {
  const { category, subCategory, search, status } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (search) {
    filter.$or = [
      { serviceTitle: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];
  }
  if (status && req.user.role === 'admin') {
    filter.status = status; // Admins can filter by status
  }

  const services = await Service.find(filter)
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(services);
});

export const getServicesByCompany = asyncHandler(async (req, res) => {
  const { companyName } = req.params;
  const services = await Service.find({ companyName, status: 'Accepted' })
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(services);
});

export const updateServiceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Accepted', 'Rejected', 'Completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  service.status = status;
  await service.save();

  res.status(200).json({
    message: `Service ${status} successfully`,
    service: await service.populate('provider'),
  });
});
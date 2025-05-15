import Review from '../Models/Review.js';
import Service from '../Models/Service.js';
import asyncHandler from 'express-async-handler';

export const createReview = asyncHandler(async (req, res) => {
  const { serviceId, rating, comment } = req.body;

  if (!serviceId || !rating || !comment) {
    res.status(400);
    throw new Error('Service ID, rating, and comment are required');
  }

  const service = await Service.findById(serviceId).populate('provider');
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const existingReview = await Review.findOne({ service: serviceId, user: req.user._id });
  if (existingReview) {
    res.status(400);
    throw new Error('You already reviewed this service');
  }

  const review = new Review({
    user: req.user._id,
    service: serviceId,
    provider: service.provider._id,
    rating,
    comment,
  });

  await review.save();

  res.status(201).json({
    message: 'Review added',
    review: await review.populate('user', 'name'),
  });
});

export const getReviewsByService = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ service: req.params.serviceId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(reviews);
});

export const getProviderReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ provider: req.user._id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(reviews);
});
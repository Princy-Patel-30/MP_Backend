import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  serviceTitle: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  availability: {
    type: String,
    enum: ['Available', 'Not Available'],
    required: [true, 'Availability is required'],
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Provider is required'],
  },
  providerName: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true,
  },
  providerContact: {
    type: String,
    required: [true, 'Provider contact is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  subCategory: {
    type: String,
    required: [true, 'Sub-category is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Service', serviceSchema);
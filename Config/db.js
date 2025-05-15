import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  console.log(' MongoDB Connection String:', uri);

  if (!uri) {
    throw new Error('MONGODB_URI not found in environment variables');
  }

  try {
    await mongoose.connect(uri);
    console.log(' Connected to MongoDB');
  } catch (error) {
    console.error(' Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;



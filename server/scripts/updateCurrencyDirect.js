import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Setting from '../models/Setting.js';

dotenv.config();

const run = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-restaurant';
    console.log(`Connecting to database: ${connString}`);
    await mongoose.connect(connString);

    const result = await Setting.updateMany({}, {
      currency: '₹',
      priceRange: '₹₹₹₹'
    });

    console.log(`Updated settings! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

run();

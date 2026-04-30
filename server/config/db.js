const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Note: App will run but requires MongoDB for full functionality');
    // Don't exit - allow app to run for demo purposes
  }
};

module.exports = connectDB;

// =====================================================
// MONGODB CONNECTION
// =====================================================

import mongoose from "mongoose";

const connectDB = async () => {

  try {

    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGODB_URI is missing from .env"
      );
    }

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(mongoURI, {
      dbName: "e-commerce",
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      "✅ MongoDB Connected Successfully"
    );

    console.log(
      "📦 Database:",
      mongoose.connection.name
    );

    console.log(
      "🌐 Host:",
      mongoose.connection.host
    );

  } catch (error) {

    console.error(
      "❌ MongoDB Connection Failed"
    );

    console.error(error.message);

    throw error;
  }
};

export default connectDB;
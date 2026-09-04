// =====================================================
// SERVER.JS
// Bezawada Cuts - Seafood E-Commerce Backend
// =====================================================

import express from "express";
import cors from "cors";
import "dotenv/config";
// =====================================================
// CONFIG
// =====================================================

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// =====================================================
// ROUTES
// =====================================================

import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import customerRouter from "./routes/customerRoute.js";
import paymentRouter from "./routes/paymentRoute.js";

// =====================================================
// MIDDLEWARE
// =====================================================

import upload from "./middleware/multer.js";

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-6tngljf2u-e-commerce-team.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin (Postman, server-to-server, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Parse JSON
app.use(
  express.json({
    limit: "10mb",
  })
);

// Parse form data
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Static uploads
app.use("/uploads", express.static("uploads"));

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/cart", cartRouter);

app.use("/api/order", orderRouter);

app.use("/api/admin", adminRouter);

app.use("/api/customer", customerRouter);

app.use("/api/payment", paymentRouter);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bezawada Cuts API is running",
    status: "OK",
  });
});

// =====================================================
// API HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// TEST IMAGE UPLOAD
// Keep this during development
// =====================================================

app.post(
  "/test-upload",
  upload.single("image"),
  (req, res) => {
    console.log("📦 Upload request received");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      file: req.file,
      body: req.body,
    });
  }
);

// =====================================================
// API 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("❌ Server Error:", error);

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors,
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message:
      error.message || "Internal server error",
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from .env"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing from .env"
      );
    }

    await connectDB();

    await connectCloudinary();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("------------------------------------------");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("------------------------------------------");
      console.log("✅ MongoDB connected");
      console.log("✅ Cloudinary initialized");
      console.log("✅ API routes loaded");
      console.log("==========================================");
    });

  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
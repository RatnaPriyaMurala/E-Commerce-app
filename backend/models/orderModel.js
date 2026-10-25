
import mongoose from "mongoose";

/* =========================================================
   ORDER ITEM
========================================================= */

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Verified database price per kilogram.
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    weight: {
      type: Number,
      required: true,
      min: 0.1,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    preparation: {
      type: String,
      default: "",
      trim: true,
    },

    // Used for products such as prawns that have count variants.
    // Empty for ordinary products.
    variantId: {
      type: String,
      default: "",
      trim: true,
    },

    // Example: "20 count", "30 count", depending on your admin label.
    variantCount: {
      type: String,
      default: "",
      trim: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/* =========================================================
   ORDER ADDRESS
========================================================= */

const orderAddressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    deliveryPoint: {
      type: String,
      default: "",
      trim: true,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    zipcode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },
  },
  { _id: false }
);

/* =========================================================
   ORDER SCHEMA
========================================================= */

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      type: orderAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    orderStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },
        // Confirmation call: independent of delivery status.
    confirmationStatus: {
      type: String,
      enum: [
        "Call Required",
        "Confirmed",
        "No Answer - Retry",
        "Needs Clarification",
      ],
      default: "Call Required",
      index: true,
    },

    // Message shown to the customer in My Orders.
    confirmationMessage: {
      type: String,
      default:
        "Payment received. Our team will call you to confirm your delivery point and order details.",
      trim: true,
      maxlength: 500,
    },

    confirmationNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    confirmationUpdatedAt: {
      type: Date,
      default: null,
    },

    confirmationUpdatedBy: {
      type: String,
      default: "",
      trim: true,
    },

    confirmationCallAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    date: {
      type: Number,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel =
  mongoose.models.order ||
  mongoose.model("order", orderSchema);

export default orderModel;

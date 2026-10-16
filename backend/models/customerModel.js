
import mongoose from "mongoose";

const customerCartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    productName: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    weight: {
      type: Number,
      required: true,
      min: 0.1,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    preparation: {
      type: String,
      default: "",
      trim: true,
    },

    // Selected prawn variant's MongoDB subdocument ID.
    variantId: {
      type: String,
      default: "",
      trim: true,
    },

    // Display label from the admin-configured variant.
    variantCount: {
      type: String,
      default: "",
      trim: true,
    },

    // Informational snapshot; the backend must recheck the
    // authoritative price from the product document at checkout.
    pricePerKg: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },

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
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    zipcode: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalWeight: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastOrder: {
      type: Number,
      default: null,
    },

    cartItems: {
      type: [customerCartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const customerModel =
  mongoose.models.customer ||
  mongoose.model("customer", customerSchema);

export default customerModel;
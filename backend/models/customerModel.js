import mongoose from "mongoose";

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
  type: [
    {
      productId: {
        type: String,
        required: true,
      },

      productName: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      weight: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
      },

      preparation: {
        type: String,
        default: "",
      },
    },
  ],
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
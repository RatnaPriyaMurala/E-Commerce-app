import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
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
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    cartData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "product",
      default: [],
    },

    address: {
      type: addressSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const userModel =
  mongoose.models.user ||
  mongoose.model("user", userSchema);

export default userModel;

import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "unsubscribed"],
      default: "pending",
    },

    confirmationTokenHash: {
      type: String,
      default: null,
    },

    confirmationExpires: {
      type: Date,
      default: null,
    },

    unsubscribeTokenHash: {
      type: String,
      default: null,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const subscriberModel =
  mongoose.models.subscriber ||
  mongoose.model("subscriber", subscriberSchema);

export default subscriberModel;

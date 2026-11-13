
import mongoose from "mongoose";

const newsletterNotificationSchema = new mongoose.Schema(
  {
    eventKey: {
      type: String,
      required: true,
    },

    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscriber",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    error: {
      type: String,
      default: "",
    },

    sentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

newsletterNotificationSchema.index(
  { eventKey: 1, subscriberId: 1 },
  { unique: true }
);

const newsletterNotificationModel =
  mongoose.models.newsletterNotification ||
  mongoose.model(
    "newsletterNotification",
    newsletterNotificationSchema
  );

export default newsletterNotificationModel;

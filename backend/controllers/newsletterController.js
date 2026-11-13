
import subscriberModel from "../models/subscriberModel.js";

import {
  createSecureToken,
  hashToken,
  sendConfirmationEmail,
} from "../utils/emailService.js";

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "https://www.bezawadacuts.com"
).replace(/\/+$/, "");

export const subscribeNewsletter = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const name = String(req.body.name || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    let subscriber = await subscriberModel.findOne({ email });

    if (subscriber?.status === "active") {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to our newsletter.",
      });
    }

    const token = createSecureToken();

    if (!subscriber) {
      subscriber = new subscriberModel({
        email,
        name,
        status: "pending",
      });
    } else {
      subscriber.name = name || subscriber.name;
      subscriber.status = "pending";
    }

    subscriber.confirmationTokenHash = hashToken(token);
    subscriber.confirmationExpires =
      new Date(Date.now() + 24 * 60 * 60 * 1000);

    subscriber.unsubscribedAt = null;

    await subscriber.save();

    try {
      await sendConfirmationEmail(email, token);
    } catch (emailError) {
      console.error(
        "Newsletter confirmation email error:",
        emailError.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Your details were saved, but the confirmation email could not be sent. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Please check your inbox and confirm your email subscription.",
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your subscription.",
    });
  }
};

export const confirmNewsletter = async (req, res) => {
  try {
    const token = String(req.query.token || "");

    if (!token) {
      return res.redirect(
        `${FRONTEND_URL}/?newsletter=invalid`
      );
    }

    const subscriber = await subscriberModel.findOne({
      confirmationTokenHash: hashToken(token),
      confirmationExpires: { $gt: new Date() },
      status: "pending",
    });

    if (!subscriber) {
      return res.redirect(
        `${FRONTEND_URL}/?newsletter=expired`
      );
    }

    subscriber.status = "active";
    subscriber.confirmedAt = new Date();
    subscriber.confirmationTokenHash = null;
    subscriber.confirmationExpires = null;

    await subscriber.save();

    return res.redirect(
      `${FRONTEND_URL}/?newsletter=confirmed`
    );
  } catch (error) {
    console.error("Newsletter confirmation error:", error);

    return res.redirect(
      `${FRONTEND_URL}/?newsletter=error`
    );
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const token = String(req.query.token || "");

    if (!token) {
      return res.redirect(
        `${FRONTEND_URL}/?newsletter=unsubscribe-error`
      );
    }

    const subscriber = await subscriberModel.findOne({
      unsubscribeTokenHash: hashToken(token),
    });

    if (!subscriber) {
      return res.redirect(
        `${FRONTEND_URL}/?newsletter=unsubscribe-error`
      );
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();

    await subscriber.save();

    return res.redirect(
      `${FRONTEND_URL}/?newsletter=unsubscribed`
    );
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);

    return res.redirect(
      `${FRONTEND_URL}/?newsletter=unsubscribe-error`
    );
  }
};

export const getNewsletterSubscribers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const status = String(req.query.status || "").trim();
    const search = String(req.query.search || "").trim();

    const filter = {};

    if (["pending", "active", "unsubscribed"].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.email = {
        $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const [subscribers, total, active, pending, unsubscribed] =
      await Promise.all([
        subscriberModel
          .find(filter)
          .select("email name status createdAt confirmedAt unsubscribedAt")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),

        subscriberModel.countDocuments(filter),
        subscriberModel.countDocuments({ status: "active" }),
        subscriberModel.countDocuments({ status: "pending" }),
        subscriberModel.countDocuments({ status: "unsubscribed" }),
      ]);

    return res.status(200).json({
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        active,
        pending,
        unsubscribed,
      },
    });
  } catch (error) {
    console.error("Get newsletter subscribers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load newsletter subscribers.",
    });
  }
};

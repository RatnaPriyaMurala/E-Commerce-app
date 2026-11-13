
import offerModel from "../models/offerModel.js";
import { sendOfferAnnouncement } from "../utils/emailService.js";

export const publishOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      discountCode,
      imageUrl,
      expiresAt,
    } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Offer title and description are required.",
      });
    }

    let expiryDate = null;

    if (expiresAt) {
      expiryDate = new Date(expiresAt);

      if (Number.isNaN(expiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid offer expiry date.",
        });
      }
    }

    const offer = await offerModel.create({
      title: title.trim(),
      description: description.trim(),
      discountCode: String(discountCode || "").trim(),
      imageUrl: String(imageUrl || "").trim(),
      expiresAt: expiryDate,
      isPublished: true,
      publishedAt: new Date(),
    });

    let emailResult;

    try {
      emailResult = await sendOfferAnnouncement(offer);
    } catch (emailError) {
      console.error(
        "Offer email delivery error:",
        emailError.message
      );

      return res.status(201).json({
        success: true,
        offer,
        emailSent: false,
        message:
          "Offer published, but newsletter email delivery failed. The offer is saved.",
      });
    }

    return res.status(201).json({
      success: true,
      offer,
      emailSent: true,
      emailResult,
      message: "Offer published and newsletter emails processed.",
    });
  } catch (error) {
    console.error("Publish offer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to publish offer.",
    });
  }
};

export const getOffers = async (req, res) => {
  try {
    const offers = await offerModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error("Get offers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load offers.",
    });
  }
};

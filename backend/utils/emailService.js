
import crypto from "crypto";

import subscriberModel from "../models/subscriberModel.js";
import newsletterNotificationModel from "../models/newsletterNotificationModel.js";

const FRONTEND_URL = (
  process.env.FRONTEND_URL || "https://www.bezawadacuts.com"
).replace(/\/+$/, "");

const BACKEND_URL = (
  process.env.BACKEND_URL || "https://e-commerce-app-n9oq.onrender.com"
).replace(/\/+$/, "");

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

export const createSecureToken = () =>
  crypto.randomBytes(32).toString("hex");

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const sendBrevoEmail = async ({
  to,
  subject,
  htmlContent,
}) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new Error("BREVO_SENDER_EMAIL is missing");
  }

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || "Bezawada Cuts",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Brevo email failed: ${response.status}`
    );
  }

  return result;
};

export const sendConfirmationEmail = async (email, token) => {
  const confirmationLink =
    `${FRONTEND_URL}/newsletter/complete?token=${encodeURIComponent(token)}`;

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#263238">
      <h2 style="color:#087e8b">Welcome to Bezawada Cuts!</h2>

      <p>Thank you for subscribing to our seafood updates.</p>

      <p>
        Please confirm your email address and complete a few basic details
        to receive fresh product announcements and special offers.
      </p>

      <p style="margin:30px 0">
        <a href="${confirmationLink}"
           style="background:#087e8b;color:white;padding:13px 24px;text-decoration:none;border-radius:6px;display:inline-block">
          Confirm Subscription
        </a>
      </p>

      <p>This link expires in 24 hours.</p>

      <p>If you did not request this subscription, you can ignore this email.</p>

      <p>Regards,<br/>Bezawada Cuts</p>
    </div>
  `;

  return sendBrevoEmail({
    to: email,
    subject: "Confirm your Bezawada Cuts newsletter subscription",
    htmlContent,
  });
};

const getUnsubscribeLink = async (subscriber) => {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is missing");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(String(subscriber._id))
    .digest("hex");

  const tokenHash = hashToken(token);

  if (subscriber.unsubscribeTokenHash !== tokenHash) {
    subscriber.unsubscribeTokenHash = tokenHash;
    await subscriber.save();
  }

  return `${BACKEND_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
};

const claimNotification = async (eventKey, subscriberId) => {
  try {
    await newsletterNotificationModel.create({
      eventKey,
      subscriberId,
      status: "pending",
    });

    return true;
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }

    const existing = await newsletterNotificationModel.findOne({
      eventKey,
      subscriberId,
    });

    if (!existing || existing.status === "sent" || existing.status === "pending") {
      return false;
    }

    existing.status = "pending";
    existing.error = "";
    await existing.save();

    return true;
  }
};

const sendAnnouncementToSubscribers = async ({
  eventKey,
  subject,
  createHtml,
}) => {
  const subscribers = await subscriberModel.find({
    status: "active",
  }).select("_id email unsubscribeTokenHash");

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  // Send in small groups to avoid flooding the email service.
  for (let i = 0; i < subscribers.length; i += 10) {
    const batch = subscribers.slice(i, i + 10);

    const results = await Promise.allSettled(
      batch.map(async (subscriber) => {
        const shouldSend = await claimNotification(
          eventKey,
          subscriber._id
        );

        if (!shouldSend) {
          skipped += 1;
          return;
        }

        try {
          const unsubscribeLink =
            await getUnsubscribeLink(subscriber);

          const htmlContent = createHtml(unsubscribeLink);

          await sendBrevoEmail({
            to: subscriber.email,
            subject,
            htmlContent,
          });

          await newsletterNotificationModel.updateOne(
            { eventKey, subscriberId: subscriber._id },
            {
              $set: {
                status: "sent",
                sentAt: new Date(),
                error: "",
              },
            }
          );

          sent += 1;
        } catch (error) {
          await newsletterNotificationModel.updateOne(
            { eventKey, subscriberId: subscriber._id },
            {
              $set: {
                status: "failed",
                error: error.message,
              },
            }
          );

          failed += 1;
          throw error;
        }
      })
    );

    // Individual failures are recorded; continue with the next batch.
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Newsletter delivery error:",
          result.reason?.message
        );
      }
    });
  }

  return { sent, failed, skipped, total: subscribers.length };
};

export const sendNewProductAnnouncement = async (product) => {
  if (!product?._id) {
    throw new Error("A saved product is required");
  }

  const productName = escapeHtml(product.name || "New seafood product");
  const productPrice = Number(product.price || 0).toLocaleString("en-IN");
  const productImage = Array.isArray(product.image)
    ? product.image[0]
    : "";

  return sendAnnouncementToSubscribers({
    eventKey: `product:${product._id}`,
    subject: `New arrival at Bezawada Cuts: ${product.name}`,
    createHtml: (unsubscribeLink) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#263238">
        <h2 style="color:#087e8b">Fresh Arrival at Bezawada Cuts!</h2>
        <p>We have added a new product to our seafood collection.</p>
        ${productImage ? `<img src="${escapeHtml(productImage)}" alt="${productName}" style="width:100%;max-width:400px;border-radius:10px"/>` : ""}
        <h3>${productName}</h3>
        <p>Price: ₹${productPrice} per kg</p>
        <p><a href="${FRONTEND_URL}" style="background:#087e8b;color:white;padding:12px 22px;text-decoration:none;border-radius:6px">Visit our website</a></p>
        <hr/>
        <p style="font-size:12px;color:#777">You are receiving this because you subscribed to Bezawada Cuts updates.</p>
        <p style="font-size:12px"><a href="${unsubscribeLink}">Unsubscribe</a></p>
      </div>
    `,
  });
};

export const sendOfferAnnouncement = async (offer) => {
  if (!offer?._id) {
    throw new Error("A saved offer is required");
  }

  const title = escapeHtml(offer.title);
  const description = escapeHtml(offer.description);
  const code = escapeHtml(offer.discountCode || "");
  const image = escapeHtml(offer.imageUrl || "");

  return sendAnnouncementToSubscribers({
    eventKey: `offer:${offer._id}`,
    subject: `Special offer from Bezawada Cuts: ${offer.title}`,
    createHtml: (unsubscribeLink) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#263238">
        <h2 style="color:#087e8b">${title}</h2>
        ${image ? `<img src="${image}" alt="${title}" style="width:100%;max-width:400px;border-radius:10px"/>` : ""}
        <p>${description}</p>
        ${code ? `<p><strong>Offer code: ${code}</strong></p>` : ""}
        ${offer.expiresAt ? `<p>Valid until: ${new Date(offer.expiresAt).toLocaleDateString("en-IN")}</p>` : ""}
        <p><a href="${FRONTEND_URL}" style="background:#087e8b;color:white;padding:12px 22px;text-decoration:none;border-radius:6px">Shop now</a></p>
        <hr/>
        <p style="font-size:12px;color:#777">You are receiving this because you subscribed to Bezawada Cuts updates.</p>
        <p style="font-size:12px"><a href="${unsubscribeLink}">Unsubscribe</a></p>
      </div>
    `,
  });
};

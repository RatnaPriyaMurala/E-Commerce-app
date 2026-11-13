import express from "express";

import {
  subscribeNewsletter,
  confirmNewsletter,
  unsubscribeNewsletter,
  getNewsletterSubscribers,
  completeNewsletterProfile,
} from "../controllers/newsletterController.js";

import adminAuth from "../middleware/adminAuth.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribeNewsletter);

newsletterRouter.get("/confirm", confirmNewsletter);

newsletterRouter.post("/complete", completeNewsletterProfile);

newsletterRouter.get("/unsubscribe", unsubscribeNewsletter);

newsletterRouter.get(
  "/admin/subscribers",
  adminAuth,
  getNewsletterSubscribers
);

export default newsletterRouter;
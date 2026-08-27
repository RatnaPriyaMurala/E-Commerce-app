console.log("✅ PAYMENT ROUTE LOADED");

import express from "express";
import authUser from "../middleware/auth.js";

import {
  createRazorpayOrder,
  verifyPayment
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.get("/test", (req, res) => {
  res.send("Payment Route Working");
});

paymentRouter.post(
  "/create-order",
  authUser,
  createRazorpayOrder
);

paymentRouter.post(
  "/verify",
  authUser,
  verifyPayment
);

export default paymentRouter;
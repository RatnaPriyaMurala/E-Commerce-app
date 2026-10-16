
import express from "express";
import authUser from "../middleware/auth.js";

import {
  createRazorpayOrder,
  verifyPayment,
  debugRazorpayPayments,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

/* =========================================================
   PAYMENT TEST
========================================================= */

paymentRouter.get("/test", (req, res) => {
  return res.json({
    success: true,
    message: "Payment route is working",
  });
});

/* =========================================================
   RAZORPAY ORDER CREATION
========================================================= */

paymentRouter.post(
  "/create-order",
  authUser,
  createRazorpayOrder
);

/* =========================================================
   RAZORPAY PAYMENT VERIFICATION
========================================================= */

paymentRouter.post(
  "/verify",
  authUser,
  verifyPayment
);

/* =========================================================
   TEMPORARY PAYMENT DIAGNOSTIC
   Remove this route after debugging.
========================================================= */

paymentRouter.get(
  "/debug-payments/:orderId",
  authUser,
  debugRazorpayPayments
);

export default paymentRouter;

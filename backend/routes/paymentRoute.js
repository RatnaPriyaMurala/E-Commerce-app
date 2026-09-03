
import express from "express";

import authUser from "../middleware/auth.js";

import {
    createRazorpayOrder,
    verifyPayment,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

/* =========================================================
   PAYMENT TEST
   Development only
========================================================= */

paymentRouter.get(
    "/test",
    (req, res) => {
        return res.json({
            success: true,
            message:
                "Payment route is working",
        });
    }
);

/* =========================================================
   RAZORPAY
========================================================= */

/*
 * Create Razorpay order
 */
paymentRouter.post(
    "/create-order",
    authUser,
    createRazorpayOrder
);

/*
 * Verify Razorpay payment
 */
paymentRouter.post(
    "/verify",
    authUser,
    verifyPayment
);

export default paymentRouter;

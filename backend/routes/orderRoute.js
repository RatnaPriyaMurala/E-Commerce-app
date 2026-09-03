
import express from "express";

import {
    placeOrder,
    userOrders,
    allOrders,
    updateOrderStatus,
    cancelOrder,
} from "../controllers/orderController.js";

import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

/* =========================================================
   USER ROUTES
========================================================= */

/*
 * Place a new order
 */
orderRouter.post(
    "/place",
    authUser,
    placeOrder
);

/*
 * Get logged-in user's orders
 */
orderRouter.post(
    "/userorders",
    authUser,
    userOrders
);

/*
 * Cancel logged-in user's order
 */
orderRouter.post(
    "/cancel",
    authUser,
    cancelOrder
);

/* =========================================================
   ADMIN ROUTES
========================================================= */

/*
 * Get all orders
 */
orderRouter.post(
    "/admin-orders",
    adminAuth,
    allOrders
);

/*
 * Update order status
 */
orderRouter.post(
    "/update-status",
    adminAuth,
    updateOrderStatus
);

export default orderRouter;

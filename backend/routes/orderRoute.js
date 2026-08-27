import express from "express";

import {
placeOrder,
userOrders,
allOrders,
updateOrderStatus,
cancelOrder
} from "../controllers/orderController.js";

import authUser  from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";


const orderRouter = express.Router();



// USER PLACE ORDER

orderRouter.post(
"/place",
authUser,
placeOrder
);




// USER MY ORDERS

orderRouter.post(
"/userorders",
authUser,
userOrders
);




// ADMIN ALL ORDERS

orderRouter.post(
"/admin-orders",
adminAuth,
allOrders
);




// UPDATE ORDER STATUS

orderRouter.post(
"/update-status",
adminAuth,
updateOrderStatus
);


orderRouter.post(
"/cancel",
authUser,
cancelOrder
);

export default orderRouter;
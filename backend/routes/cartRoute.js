
import express from "express";

import {
    addToCart,
    updateCartWeight,
    removeFromCart,
    getUserCart,
} from "../controllers/cartController.js";

import authUser from "../middleware/auth.js";

const router = express.Router();

/*
 * All cart operations require a logged-in user.
 */

router.post(
    "/add",
    authUser,
    addToCart
);

router.post(
    "/update",
    authUser,
    updateCartWeight
);

router.post(
    "/remove",
    authUser,
    removeFromCart
);

router.post(
    "/get",
    authUser,
    getUserCart
);

export default router;
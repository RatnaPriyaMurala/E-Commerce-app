
import express from "express";

import {
    loginUser,
    registerUser,
    adminLogin,
    resetPassword,
    getProfile,
    updateProfile,
} from "../controllers/userController.js";

import authUser from "../middleware/auth.js";

const userRouter = express.Router();

/* =========================================================
   PUBLIC USER ROUTES
========================================================= */

/*
 * Register customer
 */
userRouter.post(
    "/register",
    registerUser
);

/*
 * Login customer
 */
userRouter.post(
    "/login",
    loginUser
);

/*
 * Admin login
 */
userRouter.post(
    "/admin",
    adminLogin
);

/*
 * Reset password
 *
 * IMPORTANT:
 * This endpoint currently needs OTP/email verification
 * before production deployment.
 */
userRouter.post(
    "/reset-password",
    resetPassword
);

/* =========================================================
   AUTHENTICATED USER ROUTES
========================================================= */

/*
 * Get profile
 */
userRouter.get(
    "/profile",
    authUser,
    getProfile
);

/*
 * Update profile
 */
userRouter.post(
    "/update-profile",
    authUser,
    updateProfile
);

export default userRouter;

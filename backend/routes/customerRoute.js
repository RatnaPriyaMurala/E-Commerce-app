
import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
    getCustomers,
} from "../controllers/customerController.js";

const customerRouter = express.Router();

/*
 * ADMIN ONLY
 * Customer information must not be publicly accessible.
 */
customerRouter.get(
    "/list",
    adminAuth,
    getCustomers
);

export default customerRouter;
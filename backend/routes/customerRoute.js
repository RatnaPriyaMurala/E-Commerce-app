import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { getCustomers } from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.get(
  "/list",
  adminAuth,
  getCustomers
);

export default customerRouter;
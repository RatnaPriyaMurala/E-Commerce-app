import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { dashboard } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get(
  "/dashboard",
  adminAuth,
  dashboard
);

export default adminRouter;
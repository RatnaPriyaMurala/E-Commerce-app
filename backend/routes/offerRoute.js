
import express from "express";
import adminAuth from "../middleware/adminAuth.js";

import {
  publishOffer,
  getOffers,
} from "../controllers/offerController.js";

const offerRouter = express.Router();

offerRouter.post("/publish", adminAuth, publishOffer);
offerRouter.get("/list", adminAuth, getOffers);

export default offerRouter;


import express from "express";

import {
    addProduct,
    listProducts,
    singleProduct,
    removeProduct,
    updateProduct,
    lowStockProducts,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

/* =========================================================
   PUBLIC PRODUCT ROUTES
========================================================= */

/*
 * Get all products
 */
productRouter.get(
    "/list",
    listProducts
);

/*
 * Get a single product
 */
productRouter.post(
    "/single",
    singleProduct
);

/* =========================================================
   ADMIN PRODUCT ROUTES
========================================================= */

/*
 * Add product
 */
productRouter.post(
    "/add",
    adminAuth,
    upload.single("image"),
    addProduct
);

/*
 * Remove product
 */
productRouter.post(
    "/remove",
    adminAuth,
    removeProduct
);

/*
 * Update product
 */
productRouter.post(
    "/update",
    adminAuth,
    upload.single("image"),
    updateProduct
);

/*
 * Low-stock products
 */
productRouter.get(
    "/low-stock",
    adminAuth,
    lowStockProducts
);

export default productRouter;

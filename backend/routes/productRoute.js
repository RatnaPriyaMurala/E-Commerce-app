import express from "express";
import { addProduct, listProducts, singleProduct, removeProduct, updateProduct, lowStockProducts } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// ✅ Correct order of routes
productRouter.post("/add", adminAuth,upload.single("image"), addProduct);  
productRouter.get("/list", listProducts);                       
productRouter.post("/single", singleProduct);                       
productRouter.post("/remove",adminAuth, removeProduct);    
productRouter.post("/update",adminAuth, upload.single("image"),updateProduct);  
productRouter.get(
"/low-stock",
adminAuth,
lowStockProducts
);               
export default productRouter;

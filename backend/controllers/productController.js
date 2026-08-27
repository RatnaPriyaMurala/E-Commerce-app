import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs";

/* ===============================
   ✅ ADD PRODUCT
================================ */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      overview,
      description,
      price,
      category,
      subCategory,
      bestseller,
      minWeight,
      maxWeight,
      stock,
      isAvailable,
    } = req.body;
if (!overview || overview.trim() === "") {
  return res.json({
    success: false,
    message: "Overview is required for each product",
  });
}

    // ✅ Parse nested data safely
    let parsedDescription = {};
    try {
      parsedDescription =
        typeof description === "string" ? JSON.parse(description) : description || {};
    } catch {
      parsedDescription = {};
    }

    // ✅ Handle image upload (local or cloudinary)
    const image = req.file;
    let imageUrls = [];

    if (image) {
      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageUrls = [result.secure_url];

      // Remove local temp file
      fs.unlinkSync(image.path);
    }

    // ✅ Create new product
    const newProduct = new productModel({

  name,

  overview,

  description: parsedDescription,

  price: Number(price),

  category,

  subCategory,

  bestseller:
    bestseller === true ||
    bestseller === "true",

  image: imageUrls,

  stock: Number(stock) || 10,

  isAvailable:
    Number(stock) > 0,

  minQuantity:
    Number(minWeight) || 0.5,

  maxQuantity:
    Number(maxWeight) || 10,

  quantityStep:
    Number(quantityStep) || 0.5,

  currency:
    currency || "₹",

  date: Date.now(),

});

    await newProduct.save();

    res.json({
      success: true,
      message: "✅ Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.log("❌ Error adding product:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   ✅ LIST ALL PRODUCTS
================================ */
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log("❌ Error listing products:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   ✅ GET SINGLE PRODUCT
================================ */
export const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      product, // ✅ includes overview automatically
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   ✅ REMOVE PRODUCT
================================ */
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted)
      return res.json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "🗑️ Product removed successfully" });
  } catch (error) {
    console.log("❌ Error removing product:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   ✅ UPDATE PRODUCT
================================ */

export const updateProduct = async (req, res) => {
  try {

    const {
      id,
      name,
      overview,
      description,
      price,
      category,
      subCategory,
      bestseller,
      stock,
      isAvailable,
      minWeight,
      maxWeight,
      quantityStep,
      currency,
      discount
    } = req.body;

    // Parse description
    let parsedDescription = {};

    try {
      parsedDescription =
        typeof description === "string"
          ? JSON.parse(description)
          : description;
    } catch {
      parsedDescription = {};
    }


console.log("===== UPDATE REQUEST =====");
console.log(req.body);
console.log("Stock:", req.body.stock);
console.log("Available:", req.body.isAvailable);

console.log("isAvailable from frontend:", isAvailable);

    // Update data
    const updateData = {
      name,
      overview,
      description: parsedDescription,

      price: Number(price),

      category,
      subCategory,

      bestseller:
        bestseller === true ||
        bestseller === "true",

      stock: Number(stock),

      isAvailable: Number(stock) > 0,

      minQuantity: Number(minWeight),

      maxQuantity: Number(maxWeight),

      quantityStep: Number(quantityStep) || 0.5,

      currency: currency || "₹",

      discount: Number(discount) || 0,
    };

    // Update image if new one uploaded
    if (req.file) {

      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "image",
        }
      );

      fs.unlinkSync(req.file.path);

      updateData.image = [result.secure_url];
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
  id,
  updateData,
  {
    new: true,
    runValidators: true,
  }
);
console.log(updatedProduct);

console.log("UPDATED PRODUCT:");
console.log(updatedProduct);
return res.json({
  success: true,
  message: "Product updated successfully",
  product: updatedProduct,
});
  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });

  }
};

export const lowStockProducts = async (req, res) => {

    try {

        const products = await productModel

            .find({

                stock: { $lte: 5 }

            })

            .sort({

                stock: 1

            });

        res.json({

            success: true,

            products

        });

    }

    catch (error) {

        console.log(error);

        res.json({

            success: false,

            message: error.message

        });

    }

};
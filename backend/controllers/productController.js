
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs";

/* =========================================================
   HELPERS
========================================================= */

const deleteTempFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Temporary file cleanup error:", error);
  }
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return value === true || value === "true";
};

const isPrawnCategory = (category) =>
  String(category || "").trim().toLowerCase() === "prawns";

/* =========================================================
   PARSE PREPARATION OPTIONS
========================================================= */

const parsePreparationOptions = (value, defaultPrice = 0) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  let options = value;

  try {
    if (typeof value === "string") {
      options = JSON.parse(value);
    }
  } catch {
    throw new Error("Invalid preparation options format");
  }

  if (!Array.isArray(options)) {
    throw new Error("Preparation options must be an array");
  }

  const cleanedOptions = options
    .map((option) => {
      if (typeof option === "string") {
        const name = option.trim();

        if (!name) return null;

        return {
          name,
          pricePerKg: Number(defaultPrice) >= 0
            ? Number(defaultPrice)
            : 0,
        };
      }

      if (option && typeof option === "object") {
        const name = String(option.name || "").trim();

        if (!name) return null;

        const parsedPrice = Number(option.pricePerKg);

        return {
          name,
          pricePerKg:
            Number.isFinite(parsedPrice) && parsedPrice >= 0
              ? parsedPrice
              : Number(defaultPrice) >= 0
                ? Number(defaultPrice)
                : 0,
        };
      }

      return null;
    })
    .filter(Boolean);

  const uniqueOptions = [];
  const seenNames = new Set();

  for (const option of cleanedOptions) {
    const normalizedName = option.name.toLowerCase();

    if (seenNames.has(normalizedName)) continue;

    seenNames.add(normalizedName);
    uniqueOptions.push(option);
  }

  return uniqueOptions;
};

/* =========================================================
   PARSE PRAWN COUNT VARIANTS

   Example:
   [
     {
       count: "40C",
       pricePerKg: 1300,
       stock: 5,
       isAvailable: true
     },
     {
       count: "50C",
       pricePerKg: 1000,
       stock: 12,
       isAvailable: true
     }
   ]
========================================================= */

const parsePrawnVariants = (value) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  let variants = value;

  try {
    if (typeof value === "string") {
      variants = JSON.parse(value);
    }
  } catch {
    throw new Error("Invalid prawn count variants format");
  }

  if (!Array.isArray(variants)) {
    throw new Error("Prawn count variants must be an array");
  }

  const seenCounts = new Set();

  return variants.map((variant) => {
    const count = String(variant?.count || "").trim();

    if (!count) {
      throw new Error("Every prawn variant needs a count label");
    }

    const normalizedCount = count.toLowerCase();

    if (seenCounts.has(normalizedCount)) {
      throw new Error(`Duplicate prawn count: ${count}`);
    }

    seenCounts.add(normalizedCount);

    if (
      variant.pricePerKg === "" ||
      variant.pricePerKg === undefined ||
      variant.pricePerKg === null
    ) {
      throw new Error(`Price is required for prawn count ${count}`);
    }

    const pricePerKg = Number(variant.pricePerKg);
    const stock = Number(variant.stock);

    if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      throw new Error(`Invalid price for prawn count ${count}`);
    }

    if (
      variant.stock === "" ||
      variant.stock === undefined ||
      variant.stock === null ||
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      throw new Error(`Invalid stock for prawn count ${count}`);
    }

    return {
      // Preserve the embedded variant ID when editing.
      ...(variant._id ? { _id: variant._id } : {}),
      count,
      pricePerKg,
      stock,
      isAvailable:
        parseBoolean(variant.isAvailable, true) && stock > 0,
    };
  });
};

/* =========================================================
   IMAGE UPLOAD
========================================================= */

const uploadProductImage = async (file) => {
  if (!file) return null;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });

    return result.secure_url;
  } finally {
    deleteTempFile(file.path);
  }
};

/* =========================================================
   ADD PRODUCT
========================================================= */

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
      minQuantity,
      maxQuantity,
      quantityStep,
      currency,
      stock,
      isAvailable,
      preparationOptions,
      variants,
    } = req.body;

    /* REQUIRED FIELDS */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!overview || !overview.trim()) {
      return res.status(400).json({
        success: false,
        message: "Overview is required for each product",
      });
    }

    /* PRICE AND STOCK */

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      price === undefined ||
      price === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid price",
      });
    }

    if (
      stock === undefined ||
      stock === "" ||
      !Number.isFinite(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid stock quantity",
      });
    }

    /* WEIGHT SETTINGS */

    const rawMinWeight =
      minWeight !== undefined ? minWeight : minQuantity;

    const rawMaxWeight =
      maxWeight !== undefined ? maxWeight : maxQuantity;

    const parsedMinWeight =
      Number(rawMinWeight) > 0 ? Number(rawMinWeight) : 0.5;

    const parsedMaxWeight =
      Number(rawMaxWeight) > 0 ? Number(rawMaxWeight) : 10;

    const parsedQuantityStep =
      Number(quantityStep) > 0 ? Number(quantityStep) : 0.5;

    if (parsedMaxWeight < parsedMinWeight) {
      return res.status(400).json({
        success: false,
        message: "Maximum weight cannot be less than minimum weight",
      });
    }

    /* DESCRIPTION */

    let parsedDescription = {};

    try {
      parsedDescription =
        typeof description === "string"
          ? JSON.parse(description)
          : description || {};
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid description format",
      });
    }

    /* PREPARATION OPTIONS */

    let parsedPreparationOptions = [];

    try {
      parsedPreparationOptions = parsePreparationOptions(
        preparationOptions,
        numericPrice
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    /* PRAWN VARIANTS */

    let parsedVariants = [];

    try {
      parsedVariants = isPrawnCategory(category)
        ? parsePrawnVariants(variants)
        : [];

      if (isPrawnCategory(category) && parsedVariants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Add at least one prawn count variant",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    /*
     * For prawns, product stock is the sum of the individual
     * variant stocks. This prevents the overall stock from
     * disagreeing with the count-specific stock.
     */

    const finalStock = isPrawnCategory(category)
      ? parsedVariants.reduce((total, variant) => total + variant.stock, 0)
      : numericStock;

    const requestedAvailability = parseBoolean(isAvailable, true);

    const finalAvailability = isPrawnCategory(category)
      ? requestedAvailability &&
        parsedVariants.some(
          (variant) => variant.isAvailable && variant.stock > 0
        )
      : requestedAvailability && finalStock > 0;

    /* IMAGE UPLOAD */

    let imageUrls = [];

    if (req.file) {
      const imageUrl = await uploadProductImage(req.file);
      if (imageUrl) imageUrls = [imageUrl];
    }

    /* CREATE PRODUCT */

    const newProduct = new productModel({
      name: name.trim(),
      overview: overview.trim(),
      description: parsedDescription,
      price: numericPrice,
      category: category?.trim() || "",
      subCategory: subCategory?.trim() || "",
      preparationOptions: parsedPreparationOptions,
      variants: parsedVariants,
      bestseller: parseBoolean(bestseller),
      image: imageUrls,
      stock: finalStock,
      isAvailable: finalAvailability,
      minQuantity: parsedMinWeight,
      maxQuantity: parsedMaxWeight,
      quantityStep: parsedQuantityStep,
      currency: currency?.trim() || "₹",
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to add product",
    });
  }
};

/* =========================================================
   LIST ALL PRODUCTS
========================================================= */

export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error listing products:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch products",
    });
  }
};

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch product",
    });
  }
};

/* =========================================================
   REMOVE PRODUCT
========================================================= */

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("Error removing product:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to remove product",
    });
  }
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

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
      minWeight,
      maxWeight,
      minQuantity,
      maxQuantity,
      quantityStep,
      currency,
      discount,
      isAvailable,
      preparationOptions,
      variants,
    } = req.body;

    /* PRODUCT ID */

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    /* FIND EXISTING PRODUCT */

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* REQUIRED FIELDS */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!overview || !overview.trim()) {
      return res.status(400).json({
        success: false,
        message: "Overview is required",
      });
    }

    /* PRICE AND STOCK */

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      price === undefined ||
      price === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid price",
      });
    }

    if (
      stock === undefined ||
      stock === "" ||
      !Number.isFinite(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid stock",
      });
    }

    const finalCategory =
      category !== undefined
        ? String(category).trim()
        : existingProduct.category;

    const finalSubCategory =
      subCategory !== undefined
        ? String(subCategory).trim()
        : existingProduct.subCategory;

    /* DESCRIPTION */

    let parsedDescription = existingProduct.description || {};

    if (description !== undefined) {
      try {
        parsedDescription =
          typeof description === "string"
            ? JSON.parse(description)
            : description || {};
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid description format",
        });
      }
    }

    /* PREPARATION OPTIONS */

    let parsedPreparationOptions = Array.isArray(
      existingProduct.preparationOptions
    )
      ? existingProduct.preparationOptions.map((option) => ({
          name: option?.name || "",
          pricePerKg: Number.isFinite(Number(option?.pricePerKg))
            ? Number(option.pricePerKg)
            : numericPrice,
        }))
      : [];

    if (preparationOptions !== undefined) {
      try {
        parsedPreparationOptions = parsePreparationOptions(
          preparationOptions,
          numericPrice
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    /* WEIGHT SETTINGS */

    const rawMinWeight =
      minWeight !== undefined ? minWeight : minQuantity;

    const rawMaxWeight =
      maxWeight !== undefined ? maxWeight : maxQuantity;

    const parsedMinWeight =
      rawMinWeight !== undefined && Number(rawMinWeight) > 0
        ? Number(rawMinWeight)
        : existingProduct.minQuantity || 0.5;

    const parsedMaxWeight =
      rawMaxWeight !== undefined && Number(rawMaxWeight) > 0
        ? Number(rawMaxWeight)
        : existingProduct.maxQuantity || 10;

    const parsedQuantityStep =
      Number(quantityStep) > 0
        ? Number(quantityStep)
        : existingProduct.quantityStep || 0.5;

    if (parsedMaxWeight < parsedMinWeight) {
      return res.status(400).json({
        success: false,
        message: "Maximum weight cannot be less than minimum weight",
      });
    }

    /* PRAWN VARIANTS */

    let parsedVariants = Array.isArray(existingProduct.variants)
      ? existingProduct.variants.map((variant) => ({
          ...(variant._id ? { _id: variant._id } : {}),
          count: variant.count,
          pricePerKg: variant.pricePerKg,
          stock: variant.stock,
          isAvailable: variant.isAvailable !== false,
        }))
      : [];

    if (!isPrawnCategory(finalCategory)) {
      // Switching to a non-prawn category clears prawn variants.
      parsedVariants = [];
    } else if (variants !== undefined) {
      try {
        parsedVariants = parsePrawnVariants(variants);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (isPrawnCategory(finalCategory) && parsedVariants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one prawn count variant",
      });
    }

    /*
     * Prawn stock is derived from its variant stock.
     * Other categories continue to use the normal stock field.
     */

    const finalStock = isPrawnCategory(finalCategory)
      ? parsedVariants.reduce((total, variant) => total + variant.stock, 0)
      : numericStock;

    const requestedAvailability = parseBoolean(
      isAvailable,
      existingProduct.isAvailable !== false
    );

    const finalAvailability = isPrawnCategory(finalCategory)
      ? requestedAvailability &&
        parsedVariants.some(
          (variant) => variant.isAvailable && variant.stock > 0
        )
      : requestedAvailability && finalStock > 0;

    /* UPDATE DATA */

    const updateData = {
      name: name.trim(),
      overview: overview.trim(),
      description: parsedDescription,
      price: numericPrice,
      category: finalCategory || "",
      subCategory: finalSubCategory || "",
      preparationOptions: parsedPreparationOptions,
      variants: parsedVariants,
      bestseller: parseBoolean(bestseller, existingProduct.bestseller),
      stock: finalStock,
      isAvailable: finalAvailability,
      minQuantity: parsedMinWeight,
      maxQuantity: parsedMaxWeight,
      quantityStep: parsedQuantityStep,
      currency:
        currency?.trim() || existingProduct.currency || "₹",
      discount:
        discount !== undefined &&
        discount !== "" &&
        Number.isFinite(Number(discount)) &&
        Number(discount) >= 0
          ? Number(discount)
          : existingProduct.discount || 0,
    };

    /* UPDATE IMAGE IF A NEW IMAGE WAS UPLOADED */

    if (req.file) {
      const imageUrl = await uploadProductImage(req.file);

      if (imageUrl) {
        updateData.image = [imageUrl];
      }
    }

    /* SAVE UPDATE */

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update product",
    });
  }
};

/* =========================================================
   LOW STOCK PRODUCTS
========================================================= */

export const lowStockProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({
        stock: { $lte: 5 },
      })
      .sort({
        stock: 1,
      });

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching low-stock products:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch low-stock products",
    });
  }
};

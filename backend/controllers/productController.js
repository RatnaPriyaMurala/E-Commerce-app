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
        console.error(
            "Temporary file cleanup error:",
            error
        );
    }
};

/* =========================================================
   PARSE PREPARATION OPTIONS
========================================================= */

/*
 * MongoDB expects:
 *
 * preparationOptions: [
 *   {
 *     name: "Whole & Cleaned",
 *     pricePerKg: 500
 *   }
 * ]
 *
 * This function supports both:
 *
 * 1. New format:
 *    [
 *      { name: "Whole & Cleaned", pricePerKg: 500 }
 *    ]
 *
 * 2. Old format:
 *    [
 *      "Whole & Cleaned"
 *    ]
 *
 * Old strings are automatically converted into objects.
 */

const parsePreparationOptions = (
    value,
    defaultPrice = 0
) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return [];
    }

    let options = value;

    /* ----------------------------------
       PARSE JSON STRING
    ---------------------------------- */

    try {
        if (typeof value === "string") {
            options = JSON.parse(value);
        }
    } catch {
        throw new Error(
            "Invalid preparation options format"
        );
    }

    /* ----------------------------------
       MUST BE ARRAY
    ---------------------------------- */

    if (!Array.isArray(options)) {
        throw new Error(
            "Preparation options must be an array"
        );
    }

    /* ----------------------------------
       NORMALIZE OPTIONS
    ---------------------------------- */

    const cleanedOptions = options
        .map((option) => {
            /* ----------------------------------
               OLD FORMAT:
               "Whole & Cleaned"
            ---------------------------------- */

            if (typeof option === "string") {
                const name = option.trim();

                if (!name) {
                    return null;
                }

                return {
                    name,
                    pricePerKg:
                        Number(defaultPrice) >= 0
                            ? Number(defaultPrice)
                            : 0,
                };
            }

            /* ----------------------------------
               NEW FORMAT:
               {
                 name,
                 pricePerKg
               }
            ---------------------------------- */

            if (
                option &&
                typeof option === "object"
            ) {
                const name = String(
                    option.name || ""
                ).trim();

                if (!name) {
                    return null;
                }

                const parsedPrice = Number(
                    option.pricePerKg
                );

                return {
                    name,
                    pricePerKg:
                        Number.isFinite(
                            parsedPrice
                        ) && parsedPrice >= 0
                            ? parsedPrice
                            : Number(defaultPrice) >= 0
                            ? Number(defaultPrice)
                            : 0,
                };
            }

            return null;
        })
        .filter(Boolean);

    /* ----------------------------------
       REMOVE DUPLICATES
       CASE INSENSITIVE
    ---------------------------------- */

    const uniqueOptions = [];

    const seenNames = new Set();

    for (const option of cleanedOptions) {
        const normalizedName =
            option.name.toLowerCase();

        if (seenNames.has(normalizedName)) {
            continue;
        }

        seenNames.add(normalizedName);

        uniqueOptions.push(option);
    }

    return uniqueOptions;
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
        } = req.body;

        /* ----------------------------------
           REQUIRED FIELDS
        ---------------------------------- */

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name is required",
            });
        }

        if (!overview || !overview.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Overview is required for each product",
            });
        }

        /* ----------------------------------
           PRICE + STOCK
        ---------------------------------- */

        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (
            !Number.isFinite(numericPrice) ||
            numericPrice < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid price",
            });
        }

        if (
            !Number.isFinite(numericStock) ||
            numericStock < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid stock quantity",
            });
        }

        /* ----------------------------------
           WEIGHT SETTINGS
        ---------------------------------- */

        const rawMinWeight =
            minWeight !== undefined
                ? minWeight
                : minQuantity;

        const rawMaxWeight =
            maxWeight !== undefined
                ? maxWeight
                : maxQuantity;

        const parsedMinWeight =
            Number(rawMinWeight) > 0
                ? Number(rawMinWeight)
                : 0.5;

        const parsedMaxWeight =
            Number(rawMaxWeight) > 0
                ? Number(rawMaxWeight)
                : 10;

        const parsedQuantityStep =
            Number(quantityStep) > 0
                ? Number(quantityStep)
                : 0.5;

        if (
            parsedMaxWeight <
            parsedMinWeight
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Maximum weight cannot be less than minimum weight",
            });
        }

        /* ----------------------------------
           DESCRIPTION
        ---------------------------------- */

        let parsedDescription = {};

        try {
            parsedDescription =
                typeof description === "string"
                    ? JSON.parse(description)
                    : description || {};
        } catch {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid description format",
            });
        }

        /* ----------------------------------
           PREPARATION OPTIONS
        ---------------------------------- */

        let parsedPreparationOptions = [];

        try {
            parsedPreparationOptions =
                parsePreparationOptions(
                    preparationOptions,
                    numericPrice
                );
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        /* ----------------------------------
           IMAGE UPLOAD
        ---------------------------------- */

        const image = req.file;

        let imageUrls = [];

        if (image) {
            try {
                const result =
                    await cloudinary.uploader.upload(
                        image.path,
                        {
                            resource_type: "image",
                        }
                    );

                imageUrls = [
                    result.secure_url,
                ];
            } finally {
                deleteTempFile(
                    image.path
                );
            }
        }

        /* ----------------------------------
           CREATE PRODUCT
        ---------------------------------- */

        const newProduct =
            new productModel({
                name: name.trim(),

                overview: overview.trim(),

                description:
                    parsedDescription,

                price: numericPrice,

                category:
                    category?.trim() || "",

                subCategory:
                    subCategory?.trim() || "",

                preparationOptions:
                    parsedPreparationOptions,

                bestseller:
                    bestseller === true ||
                    bestseller === "true",

                image: imageUrls,

                stock: numericStock,

                isAvailable:
                    numericStock > 0 &&
                    (
                        isAvailable ===
                            undefined ||
                        isAvailable === true ||
                        isAvailable ===
                            "true"
                    ),

                minQuantity:
                    parsedMinWeight,

                maxQuantity:
                    parsedMaxWeight,

                quantityStep:
                    parsedQuantityStep,

                currency:
                    currency?.trim() || "₹",
            });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message:
                "Product added successfully!",
            product: newProduct,
        });
    } catch (error) {
        console.error(
            "Error adding product:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to add product",
        });
    }
};

/* =========================================================
   LIST ALL PRODUCTS
========================================================= */

export const listProducts = async (
    req,
    res
) => {
    try {
        const products =
            await productModel
                .find({})
                .sort({
                    createdAt: -1,
                });

        return res.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(
            "Error listing products:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to fetch products",
        });
    }
};

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

export const singleProduct = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID is required",
            });
        }

        const product =
            await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }

        return res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error(
            "Error fetching product:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to fetch product",
        });
    }
};

/* =========================================================
   REMOVE PRODUCT
========================================================= */

export const removeProduct = async (
    req,
    res
) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID is required",
            });
        }

        const deleted =
            await productModel.findByIdAndDelete(
                id
            );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }

        return res.json({
            success: true,
            message:
                "Product removed successfully",
        });
    } catch (error) {
        console.error(
            "Error removing product:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to remove product",
        });
    }
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct = async (
    req,
    res
) => {
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
        } = req.body;

        /* ----------------------------------
           PRODUCT ID
        ---------------------------------- */

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID is required",
            });
        }

        /* ----------------------------------
           FIND EXISTING PRODUCT
        ---------------------------------- */

        const existingProduct =
            await productModel.findById(id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }

        /* ----------------------------------
           REQUIRED FIELDS
        ---------------------------------- */

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Product name is required",
            });
        }

        if (!overview || !overview.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Overview is required",
            });
        }

        /* ----------------------------------
           PRICE + STOCK
        ---------------------------------- */

        const numericPrice =
            Number(price);

        const numericStock =
            Number(stock);

        if (
            !Number.isFinite(
                numericPrice
            ) ||
            numericPrice < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid price",
            });
        }

        if (
            !Number.isFinite(
                numericStock
            ) ||
            numericStock < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid stock",
            });
        }

        /* ----------------------------------
           DESCRIPTION
        ---------------------------------- */

        let parsedDescription =
            existingProduct.description ||
            {};

        if (
            description !==
            undefined
        ) {
            try {
                parsedDescription =
                    typeof description ===
                        "string"
                        ? JSON.parse(
                              description
                          )
                        : description ||
                          {};
            } catch {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid description format",
                });
            }
        }

        /* ----------------------------------
           PREPARATION OPTIONS
        ---------------------------------- */

        let parsedPreparationOptions =
            Array.isArray(
                existingProduct.preparationOptions
            )
                ? existingProduct.preparationOptions.map(
                      (option) => ({
                          name:
                              option?.name ||
                              "",
                          pricePerKg:
                              Number.isFinite(
                                  Number(
                                      option?.pricePerKg
                                  )
                              )
                                  ? Number(
                                        option.pricePerKg
                                    )
                                  : numericPrice,
                      })
                  )
                : [];

        /*
         * If Add.jsx sends preparationOptions,
         * parse and replace them.
         */

        if (
            preparationOptions !==
            undefined
        ) {
            try {
                parsedPreparationOptions =
                    parsePreparationOptions(
                        preparationOptions,
                        numericPrice
                    );
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message:
                        error.message,
                });
            }
        }

        /* ----------------------------------
           WEIGHT SETTINGS
        ---------------------------------- */

        const rawMinWeight =
            minWeight !== undefined
                ? minWeight
                : minQuantity;

        const rawMaxWeight =
            maxWeight !== undefined
                ? maxWeight
                : maxQuantity;

        const parsedMinWeight =
            Number(rawMinWeight) > 0
                ? Number(rawMinWeight)
                : existingProduct.minQuantity ||
                  0.5;

        const parsedMaxWeight =
            Number(rawMaxWeight) > 0
                ? Number(rawMaxWeight)
                : existingProduct.maxQuantity ||
                  10;

        const parsedQuantityStep =
            Number(quantityStep) > 0
                ? Number(quantityStep)
                : existingProduct.quantityStep ||
                  0.5;

        if (
            parsedMaxWeight <
            parsedMinWeight
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Maximum weight cannot be less than minimum weight",
            });
        }

        /* ----------------------------------
           AVAILABILITY
        ---------------------------------- */

        const parsedIsAvailable =
            numericStock > 0 &&
            (
                isAvailable ===
                    undefined ||
                isAvailable === true ||
                isAvailable ===
                    "true"
            );

        /* ----------------------------------
           UPDATE DATA
        ---------------------------------- */

        const updateData = {
            name: name.trim(),

            overview: overview.trim(),

            description:
                parsedDescription,

            price: numericPrice,

            category:
                category?.trim() || "",

            subCategory:
                subCategory?.trim() || "",

            /*
             * IMPORTANT:
             * Correct embedded object format.
             */
            preparationOptions:
                parsedPreparationOptions,

            bestseller:
                bestseller === true ||
                bestseller === "true",

            stock: numericStock,

            isAvailable:
                parsedIsAvailable,

            minQuantity:
                parsedMinWeight,

            maxQuantity:
                parsedMaxWeight,

            quantityStep:
                parsedQuantityStep,

            currency:
                currency?.trim() ||
                existingProduct.currency ||
                "₹",

            discount:
                Number(discount) >= 0
                    ? Number(discount)
                    : existingProduct.discount ||
                      0,
        };

        /* ----------------------------------
           UPDATE IMAGE
        ---------------------------------- */

        if (req.file) {
            try {
                const result =
                    await cloudinary.uploader.upload(
                        req.file.path,
                        {
                            resource_type:
                                "image",
                        }
                    );

                updateData.image = [
                    result.secure_url,
                ];
            } finally {
                deleteTempFile(
                    req.file.path
                );
            }
        }

        /* ----------------------------------
           SAVE UPDATE
        ---------------------------------- */

        const updatedProduct =
            await productModel.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.json({
            success: true,
            message:
                "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error(
            "Error updating product:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to update product",
        });
    }
};

/* =========================================================
   LOW STOCK PRODUCTS
========================================================= */

export const lowStockProducts = async (
    req,
    res
) => {
    try {
        const products =
            await productModel
                .find({
                    stock: {
                        $lte: 5,
                    },
                })
                .sort({
                    stock: 1,
                });

        return res.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(
            "Error fetching low-stock products:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to fetch low-stock products",
        });
    }
};
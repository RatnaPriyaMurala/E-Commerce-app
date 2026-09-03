import Razorpay from "razorpay";
import crypto from "crypto";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

/* =========================================================
   RAZORPAY
========================================================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* =========================================================
   HELPERS
========================================================= */

const roundMoney = (value) => {
  return (
    Math.round(
      (Number(value) + Number.EPSILON) * 100
    ) / 100
  );
};

const normalizeDeliveryFee = (value) => {
  const fee = Number(value);

  if (!Number.isFinite(fee) || fee < 0) {
    return 0;
  }

  return roundMoney(fee);
};

const normalizeAddress = (address, user) => {
  const phone = String(
    address?.phone ||
      user?.phone ||
      ""
  ).trim();

  return {
    firstName: String(
      address?.firstName || ""
    ).trim(),

    lastName: String(
      address?.lastName || ""
    ).trim(),

    address: String(
      address?.address || ""
    ).trim(),

    city: String(
      address?.city || ""
    ).trim(),

    state: String(
      address?.state || ""
    ).trim(),

    zipcode: String(
      address?.zipcode || ""
    ).trim(),

    country: String(
      address?.country || "India"
    ).trim(),

    phone,
  };
};

const validateAddress = (address) => {
  const requiredFields = [
    ["firstName", "First name"],
    ["address", "Address"],
    ["city", "City"],
    ["zipcode", "Zip code"],
    ["phone", "Phone number"],
  ];

  for (const [field, label] of requiredFields) {
    if (
      !String(
        address?.[field] || ""
      ).trim()
    ) {
      return `${label} is required`;
    }
  }

  return null;
};

/* =========================================================
   VALIDATE PREPARATION
========================================================= */

const validatePreparation = (
  product,
  preparation
) => {
  const selectedPreparation = String(
    preparation || ""
  ).trim();

  if (!selectedPreparation) {
    throw new Error(
      `Please select preparation for ${product.name}`
    );
  }

  const options = Array.isArray(
    product.preparationOptions
  )
    ? product.preparationOptions
        .map((option) =>
          String(option || "").trim()
        )
        .filter(Boolean)
    : [];

  /*
   * If preparation options are configured
   * for this product, only those options are
   * accepted.
   */
  if (options.length > 0) {
    const matchedOption = options.find(
      (option) =>
        option.toLowerCase() ===
        selectedPreparation.toLowerCase()
    );

    if (!matchedOption) {
      throw new Error(
        `${product.name} does not support "${selectedPreparation}" preparation`
      );
    }

    return matchedOption;
  }

  return selectedPreparation;
};

/* =========================================================
   VALIDATE PRODUCTS
   IMPORTANT:
   Price comes from MongoDB, NOT frontend.
========================================================= */

const validateOrderItems = async (items) => {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "Order must contain at least one product"
    );
  }

  const validatedItems = [];

  let subtotal = 0;

  for (const item of items) {
    const productId =
      item?._id ||
      item?.productId;

    if (!productId) {
      throw new Error(
        "Invalid product in order"
      );
    }

    const product =
      await productModel.findById(
        productId
      );

    if (!product) {
      throw new Error(
        `${item?.name || "Product"} not found`
      );
    }

    /* -----------------------------------------------
       AVAILABILITY
    ----------------------------------------------- */

    const stock = Number(
      product.stock
    );

    if (
      !product.isAvailable ||
      !Number.isFinite(stock) ||
      stock <= 0
    ) {
      throw new Error(
        `${product.name} is currently unavailable`
      );
    }

    /* -----------------------------------------------
       PREPARATION
    ----------------------------------------------- */

    const preparation =
      validatePreparation(
        product,
        item?.preparation
      );

    /* -----------------------------------------------
       WEIGHT
    ----------------------------------------------- */

    const weight = Number(
      item.weight
    );

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      throw new Error(
        `Invalid weight for ${product.name}`
      );
    }

    /* -----------------------------------------------
       QUANTITY
    ----------------------------------------------- */

    const quantity = Number(
      item.quantity ?? 1
    );

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isInteger(quantity)
    ) {
      throw new Error(
        `Invalid quantity for ${product.name}`
      );
    }

    /* -----------------------------------------------
       WEIGHT RULES
    ----------------------------------------------- */

    const minQuantity = Number(
      product.minQuantity || 0.1
    );

    const maxQuantity = Number(
      product.maxQuantity || 10
    );

    const quantityStep = Number(
      product.quantityStep || 0.1
    );

    if (weight < minQuantity) {
      throw new Error(
        `${product.name} minimum weight is ${minQuantity} kg`
      );
    }

    if (weight > maxQuantity) {
      throw new Error(
        `${product.name} maximum weight is ${maxQuantity} kg`
      );
    }

    const steps =
      weight / quantityStep;

    if (
      Math.abs(
        steps -
          Math.round(steps)
      ) > 0.000001
    ) {
      throw new Error(
        `${product.name} weight must be in increments of ${quantityStep} kg`
      );
    }

    /* -----------------------------------------------
       STOCK
    ----------------------------------------------- */

    const totalWeight =
      weight * quantity;

    if (totalWeight > stock) {
      throw new Error(
        `${product.name} has only ${stock} kg available`
      );
    }

    /* -----------------------------------------------
       PRICE FROM DATABASE
    ----------------------------------------------- */

    const productPrice = Number(
      product.price
    );

    if (
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {
      throw new Error(
        `Invalid price for ${product.name}`
      );
    }

    /* -----------------------------------------------
       SUBTOTAL
    ----------------------------------------------- */

    const itemSubtotal =
      roundMoney(
        productPrice *
          totalWeight
      );

    subtotal += itemSubtotal;

    /* -----------------------------------------------
       VALIDATED ITEM
    ----------------------------------------------- */

    validatedItems.push({
      productId: product._id,

      name: product.name,

      image: Array.isArray(
        product.image
      )
        ? product.image[0] || ""
        : product.image || "",

      price: productPrice,

      weight,

      quantity,

      preparation,

      subtotal: itemSubtotal,
    });
  }

  return {
    validatedItems,

    subtotal: roundMoney(
      subtotal
    ),
  };
};

/* =========================================================
   REDUCE STOCK
========================================================= */

const reduceOrderStock = async (
  items
) => {
  const updatedProducts = [];

  try {
    for (const item of items) {
      const totalWeight =
        Number(item.weight) *
        Number(item.quantity);

      const updatedProduct =
        await productModel.findOneAndUpdate(
          {
            _id: item.productId,

            stock: {
              $gte: totalWeight,
            },
          },

          {
            $inc: {
              stock: -totalWeight,
            },
          },

          {
            new: true,
          }
        );

      if (!updatedProduct) {
        throw new Error(
          `${item.name} is no longer available in the requested quantity`
        );
      }

      updatedProducts.push({
        productId:
          item.productId,

        totalWeight,
      });

      await productModel.findByIdAndUpdate(
        item.productId,
        {
          isAvailable:
            Number(
              updatedProduct.stock
            ) > 0,
        }
      );
    }
  } catch (error) {
    /* -----------------------------------------------
       ROLLBACK STOCK
    ----------------------------------------------- */

    for (const previous of updatedProducts) {
      const restored =
        await productModel.findByIdAndUpdate(
          previous.productId,

          {
            $inc: {
              stock:
                previous.totalWeight,
            },
          },

          {
            new: true,
          }
        );

      if (restored) {
        await productModel.findByIdAndUpdate(
          previous.productId,
          {
            isAvailable:
              Number(
                restored.stock
              ) > 0,
          }
        );
      }
    }

    throw error;
  }
};

/* =========================================================
   RESTORE STOCK
========================================================= */

const restoreOrderStock = async (
  items
) => {
  for (const item of items) {
    const productId =
      item.productId ||
      item._id;

    if (!productId) {
      continue;
    }

    const weight = Number(
      item.weight
    );

    const quantity = Number(
      item.quantity || 1
    );

    if (
      !Number.isFinite(weight) ||
      weight <= 0 ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      continue;
    }

    const totalWeight =
      weight * quantity;

    const updatedProduct =
      await productModel.findByIdAndUpdate(
        productId,

        {
          $inc: {
            stock: totalWeight,
          },
        },

        {
          new: true,
        }
      );

    if (updatedProduct) {
      await productModel.findByIdAndUpdate(
        productId,
        {
          isAvailable:
            Number(
              updatedProduct.stock
            ) > 0,
        }
      );
    }
  }
};

/* =========================================================
   CREATE RAZORPAY ORDER
   IMPORTANT:
   Frontend NEVER decides the payment amount.

   Frontend sends:
   {
     items,
     deliveryFee
   }

   Server calculates:
   MongoDB product prices
   + delivery fee
========================================================= */

const createRazorpayOrder =
  async (req, res) => {
    try {
      const {
        items,
        deliveryFee = 0,
      } = req.body;

      /* -----------------------------------------------
         RAZORPAY CONFIG
      ----------------------------------------------- */

      if (
        !process.env
          .RAZORPAY_KEY_ID ||
        !process.env
          .RAZORPAY_SECRET
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Razorpay is not configured on the server",
        });
      }

      /* -----------------------------------------------
         ITEMS
      ----------------------------------------------- */

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order must contain at least one product",
        });
      }

      /* -----------------------------------------------
         VALIDATE PRODUCTS
      ----------------------------------------------- */

      const result =
        await validateOrderItems(
          items
        );

      const subtotal =
        result.subtotal;

      /* -----------------------------------------------
         DELIVERY
      ----------------------------------------------- */

      const normalizedDeliveryFee =
        normalizeDeliveryFee(
          deliveryFee
        );

      const calculatedAmount =
        roundMoney(
          subtotal +
            normalizedDeliveryFee
        );

      if (
        calculatedAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order amount",
        });
      }

      /* -----------------------------------------------
         CREATE RAZORPAY ORDER
      ----------------------------------------------- */

      const options = {
        amount:
          Math.round(
            calculatedAmount * 100
          ),

        currency: "INR",

        receipt:
          `receipt_${Date.now()}_${req.userId}`,
      };

      const order =
        await razorpay.orders.create(
          options
        );

      return res.json({
        success: true,

        order,

        /*
         * Useful for frontend display/debugging.
         * The Razorpay amount remains the authority.
         */
        subtotal,

        deliveryFee:
          normalizedDeliveryFee,

        amount:
          calculatedAmount,
      });
    } catch (error) {
      console.error(
        "❌ Razorpay order creation error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to create Razorpay order",
      });
    }
  };

/* =========================================================
   VERIFY PAYMENT
========================================================= */

const verifyPayment =
  async (req, res) => {
    let stockReduced = false;
    let validatedItems = [];

    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData,
      } = req.body;

      /* -----------------------------------------------
         BASIC VALIDATION
      ----------------------------------------------- */

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Incomplete Razorpay payment details",
        });
      }

      if (
        !orderData ||
        !Array.isArray(
          orderData.items
        ) ||
        orderData.items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order data",
        });
      }

      if (
        !process.env
          .RAZORPAY_SECRET
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Razorpay secret is not configured",
        });
      }

      /* -----------------------------------------------
         VERIFY RAZORPAY SIGNATURE
      ----------------------------------------------- */

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      const generatedBuffer =
        Buffer.from(
          generatedSignature,
          "utf8"
        );

      const receivedBuffer =
        Buffer.from(
          razorpay_signature,
          "utf8"
        );

      if (
        generatedBuffer.length !==
          receivedBuffer.length ||
        !crypto.timingSafeEqual(
          generatedBuffer,
          receivedBuffer
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed",
        });
      }

      /* -----------------------------------------------
         DUPLICATE PAYMENT
      ----------------------------------------------- */

      const existingOrder =
        await orderModel.findOne({
          $or: [
            {
              razorpayOrderId:
                razorpay_order_id,
            },

            {
              razorpayPaymentId:
                razorpay_payment_id,
            },
          ],
        });

      if (existingOrder) {
        return res.json({
          success: true,

          message:
            "Payment already processed",

          order:
            existingOrder,
        });
      }

      /* -----------------------------------------------
         USER
      ----------------------------------------------- */

      const user =
        await userModel.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      /* -----------------------------------------------
         ADDRESS
      ----------------------------------------------- */

      if (!orderData.address) {
        return res.status(400).json({
          success: false,
          message:
            "Delivery address is required",
        });
      }

      const normalizedAddress =
        normalizeAddress(
          orderData.address,
          user
        );

      const addressError =
        validateAddress(
          normalizedAddress
        );

      if (addressError) {
        return res.status(400).json({
          success: false,
          message:
            addressError,
        });
      }

      /* -----------------------------------------------
         PRODUCTS
         Recalculate from MongoDB.
      ----------------------------------------------- */

      const result =
        await validateOrderItems(
          orderData.items
        );

      validatedItems =
        result.validatedItems;

      const subtotal =
        result.subtotal;

      /* -----------------------------------------------
         DELIVERY
      ----------------------------------------------- */

      const deliveryFee =
        normalizeDeliveryFee(
          orderData.deliveryFee
        );

      const calculatedAmount =
        roundMoney(
          subtotal +
            deliveryFee
        );

      if (
        calculatedAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order amount",
        });
      }

      /* -----------------------------------------------
         FETCH RAZORPAY ORDER
      ----------------------------------------------- */

      let razorpayOrder;

      try {
        razorpayOrder =
          await razorpay.orders.fetch(
            razorpay_order_id
          );
      } catch (error) {
        console.error(
          "❌ Unable to fetch Razorpay order:",
          error
        );

        return res.status(400).json({
          success: false,
          message:
            "Unable to validate Razorpay order",
        });
      }

      /* -----------------------------------------------
         VERIFY RAZORPAY ORDER BELONGS TO INR
      ----------------------------------------------- */

      if (
        razorpayOrder.currency !==
        "INR"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment currency",
        });
      }

      /* -----------------------------------------------
         VERIFY PAYMENT AMOUNT
      ----------------------------------------------- */

      const razorpayAmount =
        Number(
          razorpayOrder.amount
        ) / 100;

      if (
        Math.abs(
          razorpayAmount -
            calculatedAmount
        ) > 0.01
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment amount does not match the order total",
        });
      }

      /* -----------------------------------------------
         REDUCE STOCK
      ----------------------------------------------- */

      await reduceOrderStock(
        validatedItems
      );

      stockReduced = true;

      /* -----------------------------------------------
         SAVE USER ADDRESS
      ----------------------------------------------- */

      user.phone =
        normalizedAddress.phone;

      user.address =
        normalizedAddress;

      /* -----------------------------------------------
         CREATE ORDER
      ----------------------------------------------- */

      const newOrder =
        new orderModel({
          userId:
            req.userId,

          items:
            validatedItems,

          subtotal,

          deliveryFee,

          amount:
            calculatedAmount,

          address:
            normalizedAddress,

          paymentMethod:
            "Razorpay",

          paymentStatus:
            "Paid",

          orderStatus:
            "Order Placed",

          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,

          razorpaySignature:
            razorpay_signature,

          date:
            Date.now(),
        });

      await newOrder.save();

      /* -----------------------------------------------
         CLEAR CART
      ----------------------------------------------- */

      user.cartData = {};

      await user.save();

      return res.status(201).json({
        success: true,

        message:
          "Payment verified and order placed successfully",

        order:
          newOrder,
      });
    } catch (error) {
      /* -----------------------------------------------
         ROLLBACK STOCK
      ----------------------------------------------- */

      if (
        stockReduced &&
        validatedItems.length > 0
      ) {
        try {
          await restoreOrderStock(
            validatedItems
          );
        } catch (restoreError) {
          console.error(
            "❌ Payment stock rollback failed:",
            restoreError
          );
        }
      }

      console.error(
        "❌ Payment verification error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to verify payment",
      });
    }
  };

/* =========================================================
   EXPORTS
========================================================= */

export {
  createRazorpayOrder,
  verifyPayment,
};
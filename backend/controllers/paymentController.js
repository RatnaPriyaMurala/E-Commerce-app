
import Razorpay from "razorpay";
import crypto from "crypto";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import customerModel from "../models/customerModel.js";

/* =========================================================
   RAZORPAY
========================================================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================================================
   HELPERS
========================================================= */

const PREPARATION_CHARGE_PER_KG = 40;

const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const normalizeCategory = (product) =>
  String(product?.category || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

const requiresPreparation = (product) => {
  const category = normalizeCategory(product);

  return !(
    category.includes("dry fish") ||
    category.includes("dry prawn") ||
    category.includes("pickle")
  );
};

const allowedPreparations = (product) => {
  const category = normalizeCategory(product);

  if (!requiresPreparation(product)) return [];

  if (category.includes("prawn") || category.includes("crab")) {
    return ["Whole Cleaned", "Uncleaned"];
  }

  return [
    "Whole Cleaned",
    "Uncleaned",
    "Curry Cut",
    "Fry Cut",
  ];
};

const getVariantById = (product, variantId) => {
  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

  if (!variants.length || !variantId) return null;

  return (
    variants.find(
      (variant) =>
        String(variant?._id || variant?.id || "") ===
        String(variantId)
    ) || null
  );
};

const getBasePricePerKg = (product, variant) => {
  const variantPrice = Number(
    variant?.pricePerKg ?? variant?.price
  );

  if (
    variant &&
    Number.isFinite(variantPrice) &&
    variantPrice > 0
  ) {
    return variantPrice;
  }

  const productPrice = Number(
    product?.pricePerKg ?? product?.price ?? 0
  );

  return Number.isFinite(productPrice) && productPrice > 0
    ? productPrice
    : 0;
};

/* =========================================================
   ADDRESS
========================================================= */

const normalizeAddress = (address = {}) => {
  const deliveryPoint = String(
    address.deliveryPoint || address.address || ""
  ).trim();

  const landmark = String(address.landmark || "").trim();

  return {
    firstName: String(address.firstName || "").trim(),
    lastName: String(address.lastName || "").trim(),
    phone: String(address.phone || "").trim(),
    alternatePhone: String(address.alternatePhone || "").trim(),
    deliveryPoint,
    landmark,

    address: String(
      address.address ||
        [
          deliveryPoint,
          landmark ? `Landmark: ${landmark}` : "",
        ]
          .filter(Boolean)
          .join(", ")
    ).trim(),

    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    zipcode: String(
      address.zipcode || address.pincode || ""
    ).trim(),
    country: String(address.country || "India").trim() || "India",
  };
};

const validateAddress = (address) => {
  const requiredFields = [
    "firstName",
    "phone",
    "address",
    "city",
    "zipcode",
  ];

  for (const field of requiredFields) {
    if (!address[field]) {
      return `Missing address field: ${field}`;
    }
  }

  return null;
};

/* =========================================================
   ORDER ITEM VALIDATION
   Never trust frontend prices.
========================================================= */

const validateOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const validatedItems = [];

  for (const item of items) {
    if (!item?.productId) {
      throw new Error("Product ID is missing");
    }

    const product = await productModel.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const variantId = String(item.variantId || "").trim();
    const variants = Array.isArray(product.variants)
      ? product.variants
      : [];

    let variant = null;

    if (variants.length && variantId) {
      variant = getVariantById(product, variantId);
    }

    const category = normalizeCategory(product);
    const isPrawns = category.includes("prawn");

    if (isPrawns && variants.length && !variant) {
      throw new Error(
        `Please select a valid prawn size/count for ${product.name}`
      );
    }

    if (variantId && !variant) {
      throw new Error(
        `Selected variant is not available for ${product.name}`
      );
    }

    const itemStock = variant
      ? Number(variant.stock || 0)
      : Number(product.stock || 0);

    if (
      product.isAvailable === false ||
      (variant && variant.isAvailable === false) ||
      itemStock <= 0
    ) {
      throw new Error(`${product.name} is currently unavailable`);
    }

    const weight = Number(item.weight);
    const quantity = Number(item.quantity ?? 1);

    if (!Number.isInteger(weight) || weight < 1) {
      throw new Error(
        `Weight for ${product.name} must be a whole number of at least 1 KG`
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Invalid quantity for ${product.name}`);
    }

    const maxQuantity = Number(product.maxQuantity || 0);

    if (maxQuantity > 0 && weight > maxQuantity) {
      throw new Error(
        `${product.name} maximum order weight is ${maxQuantity} KG`
      );
    }

    const requiredStock = weight * quantity;

    if (requiredStock > itemStock) {
      throw new Error(
        `Only ${itemStock} KG of ${product.name} is available for this option`
      );
    }

    const preparation = String(item.preparation || "").trim();
    const needsPreparation = requiresPreparation(product);
    const options = allowedPreparations(product);

    if (needsPreparation && !options.includes(preparation)) {
      throw new Error(
        `Please select a valid preparation for ${product.name}`
      );
    }

    if (!needsPreparation && preparation) {
      throw new Error(
        `${product.name} does not have a preparation option`
      );
    }

    const pricePerKg = getBasePricePerKg(product, variant);

    if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      throw new Error(
        `A valid price is not configured for ${product.name}`
      );
    }

    const seafoodSubtotal = roundMoney(
      pricePerKg * requiredStock
    );

    const preparationChargePerKg = needsPreparation
      ? PREPARATION_CHARGE_PER_KG
      : 0;

    const preparationSubtotal = roundMoney(
      preparationChargePerKg * requiredStock
    );

    const subtotal = roundMoney(
      seafoodSubtotal + preparationSubtotal
    );

    validatedItems.push({
      productId: product._id,
      name: product.name,

      image:
        Array.isArray(product.image) && product.image.length > 0
          ? product.image[0]
          : "",

      price: pricePerKg,
      pricePerKg,
      weight,
      quantity,
      preparation,

      variantId: variant
        ? String(variant._id || variant.id || variantId)
        : "",

      variantCount: String(
        variant?.count || variant?.label || item.variantCount || ""
      ),

      preparationChargePerKg,
      preparationSubtotal,
      seafoodSubtotal,
      subtotal,
    });
  }

  return validatedItems;
};

/* =========================================================
   STOCK REDUCTION
========================================================= */

const reduceOrderStock = async (validatedItems) => {
  for (const item of validatedItems) {
    const requiredStock =
      Number(item.weight || 0) * Number(item.quantity || 1);

    let updatedProduct;

    if (item.variantId) {
      updatedProduct = await productModel.findOneAndUpdate(
        {
          _id: item.productId,
          variants: {
            $elemMatch: {
              _id: item.variantId,
              stock: { $gte: requiredStock },
              isAvailable: { $ne: false },
            },
          },
        },
        {
          $inc: {
            "variants.$.stock": -requiredStock,
          },
        },
        { new: true }
      );
    } else {
      updatedProduct = await productModel.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: requiredStock },
          isAvailable: { $ne: false },
        },
        {
          $inc: { stock: -requiredStock },
        },
        { new: true }
      );
    }

    if (!updatedProduct) {
      throw new Error(`Insufficient stock for ${item.name}`);
    }

    if (
      !item.variantId &&
      Number(updatedProduct.stock || 0) <= 0
    ) {
      updatedProduct.isAvailable = false;
      await updatedProduct.save();
    }
  }
};

/* =========================================================
   STOCK RESTORE
========================================================= */

const restoreOrderStock = async (validatedItems) => {
  for (const item of validatedItems) {
    const restoreStock =
      Number(item.weight || 0) * Number(item.quantity || 1);

    if (item.variantId) {
      await productModel.findOneAndUpdate(
        {
          _id: item.productId,
          "variants._id": item.variantId,
        },
        {
          $inc: {
            "variants.$.stock": restoreStock,
          },
        }
      );
    } else {
      await productModel.findByIdAndUpdate(
        item.productId,
        {
          $inc: { stock: restoreStock },
          $set: { isAvailable: true },
        }
      );
    }
  }
};

/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */

const createRazorpayOrder = async (req, res) => {
  try {
    const validatedItems = await validateOrderItems(req.body?.items);

    const subtotal = roundMoney(
      validatedItems.reduce(
        (total, item) => total + Number(item.subtotal || 0),
        0
      )
    );

    // Delivery is free. Ignore any fee supplied by the frontend.
    const deliveryFee = 0;
    const amount = subtotal;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be greater than zero",
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Razorpay credentials are not configured on the server",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return res.json({
      success: true,
      order: razorpayOrder,
      subtotal,
      deliveryFee,
      preparationCharge: roundMoney(
        validatedItems.reduce(
          (total, item) =>
            total + Number(item.preparationSubtotal || 0),
          0
        )
      ),
      amount,
    });
  } catch (error) {
    console.error("CREATE RAZORPAY ORDER FAILURE:", {
      message: error?.message,
      statusCode: error?.statusCode,
      errorDescription: error?.error?.description,
      errorCode: error?.error?.code,
      errorSource: error?.error?.source,
      errorStep: error?.error?.step,
      errorReason: error?.error?.reason,
    });

    return res.status(400).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Unable to create Razorpay order",
    });
  }
};

/* =========================================================
   VERIFY RAZORPAY PAYMENT
========================================================= */

const verifyPayment = async (req, res) => {
  let stockReduced = false;
  let validatedItems = [];

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    if (!orderData) {
      return res.status(400).json({
        success: false,
        message: "Order data is missing",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret is not configured on the server",
      });
    }

    /* Verify signature */

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signatureBuffer = Buffer.from(generatedSignature);
    const suppliedSignatureBuffer = Buffer.from(razorpay_signature);

    if (
      signatureBuffer.length !== suppliedSignatureBuffer.length ||
      !crypto.timingSafeEqual(
        signatureBuffer,
        suppliedSignatureBuffer
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    /* Prevent duplicate payment processing */

    const existingOrder = await orderModel.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order: existingOrder,
      });
    }

    /* Verify logged-in user */

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* Validate address */

    const normalizedAddress = normalizeAddress(orderData.address);
    const addressError = validateAddress(normalizedAddress);

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    /* Recalculate prices from database */

    validatedItems = await validateOrderItems(orderData.items);

    const subtotal = roundMoney(
      validatedItems.reduce(
        (total, item) => total + Number(item.subtotal || 0),
        0
      )
    );

    // Delivery is always free.
    const deliveryFee = 0;
    const calculatedAmount = roundMoney(subtotal);

    /* Verify the Razorpay order amount */

    const razorpayOrder = await razorpay.orders.fetch(
      razorpay_order_id
    );

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    if (razorpayOrder.currency !== "INR") {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay currency",
      });
    }

    const razorpayAmount = Number(razorpayOrder.amount) / 100;

    if (roundMoney(razorpayAmount) !== calculatedAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order amount",
      });
    }

    /* Reduce stock */

    await reduceOrderStock(validatedItems);
    stockReduced = true;

    /* Save address to user profile */

    user.phone = normalizedAddress.phone;

    user.address = {
      firstName: normalizedAddress.firstName,
      lastName: normalizedAddress.lastName,
      phone: normalizedAddress.phone,
      alternatePhone: normalizedAddress.alternatePhone,
      deliveryPoint: normalizedAddress.deliveryPoint,
      landmark: normalizedAddress.landmark,
      address: normalizedAddress.address,
      city: normalizedAddress.city,
      state: normalizedAddress.state,
      zipcode: normalizedAddress.zipcode,
      country: normalizedAddress.country,
    };

    /* Save order */

    const newOrder = new orderModel({
      userId: req.userId,
      items: validatedItems,
      subtotal,
      deliveryFee,
      amount: calculatedAmount,
      address: normalizedAddress,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      orderStatus: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();

    /* Create or update customer record */

    try {
      let customer = await customerModel.findOne({
        userId: req.userId,
      });

      const orderWeight = validatedItems.reduce(
        (total, item) =>
          total +
          Number(item.weight || 0) * Number(item.quantity || 1),
        0
      );

      if (!customer) {
        const customerCount = await customerModel.countDocuments();
        const customerId = `CUS${String(
          customerCount + 1
        ).padStart(6, "0")}`;

        customer = await customerModel.create({
          customerId,
          userId: req.userId,
          firstName: normalizedAddress.firstName,
          lastName: normalizedAddress.lastName,
          phone: normalizedAddress.phone,
          address: normalizedAddress.address,
          city: normalizedAddress.city,
          state: normalizedAddress.state,
          zipcode: normalizedAddress.zipcode,
          country: normalizedAddress.country,
          totalOrders: 1,
          totalSpent: calculatedAmount,
          totalWeight: orderWeight,
          lastOrder: Date.now(),
        });

        console.log("New customer created:", customer.customerId);
      } else {
        customer.firstName = normalizedAddress.firstName;
        customer.lastName = normalizedAddress.lastName;
        customer.phone = normalizedAddress.phone;
        customer.address = normalizedAddress.address;
        customer.city = normalizedAddress.city;
        customer.state = normalizedAddress.state;
        customer.zipcode = normalizedAddress.zipcode;
        customer.country = normalizedAddress.country;

        customer.totalOrders =
          Number(customer.totalOrders || 0) + 1;

        customer.totalSpent =
          Number(customer.totalSpent || 0) + calculatedAmount;

        customer.totalWeight =
          Number(customer.totalWeight || 0) + orderWeight;

        customer.lastOrder = Date.now();

        await customer.save();

        console.log("Existing customer updated:", customer.customerId);
      }
    } catch (customerError) {
      // A customer-profile error must not hide an already-paid order.
      console.error("Customer save error:", customerError);
    }

    /* Clear cart and save user */

    user.cartData = {};
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    /*
      If stock was reduced but a later step failed, restore the stock.
      Use the already validated items rather than validating against
      stock that may already have been reduced.
    */

    if (stockReduced && validatedItems.length > 0) {
      try {
        await restoreOrderStock(validatedItems);
        console.log("Stock restored after order processing error");
      } catch (restoreError) {
        console.error("Failed to restore stock:", restoreError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to verify payment",
    });
  }
};

/* =========================================================
   DEBUG RAZORPAY PAYMENTS
========================================================= */

const debugRazorpayPayments = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!/^order_[A-Za-z0-9]+$/.test(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order ID",
      });
    }

    const result = await fetch(
      `https://api.razorpay.com/v1/orders/${encodeURIComponent(
        orderId
      )}/payments`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
            ).toString("base64"),
          Accept: "application/json",
        },
      }
    );

    const data = await result.json();

    console.log("RAZORPAY PAYMENT LOOKUP:", {
      httpStatus: result.status,
      error: data?.error?.description || null,
      paymentCount: data?.items?.length ?? null,
    });

    if (!result.ok) {
      return res.status(result.status).json({
        success: false,
        message:
          data?.error?.description ||
          "Razorpay payment lookup failed",
      });
    }

    return res.json({
      success: true,
      orderId,
      payments: (data.items || []).map((payment) => ({
        id: payment.id,
        status: payment.status,
        method: payment.method,
        error_code: payment.error_code,
        error_description: payment.error_description,
        error_source: payment.error_source,
        error_step: payment.error_step,
        error_reason: payment.error_reason,
      })),
    });
  } catch (error) {
    console.error("RAZORPAY LOOKUP EXCEPTION:", error.message);

    return res.status(500).json({
      success: false,
      message: "Payment lookup failed",
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

export {
  createRazorpayOrder,
  verifyPayment,
  debugRazorpayPayments,
};

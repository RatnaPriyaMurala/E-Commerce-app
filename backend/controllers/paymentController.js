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

const roundMoney = (value) => {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
};

const normalizeDeliveryFee = (value) => {
  const fee = Number(value);

  if (!Number.isFinite(fee) || fee < 0) {
    return 0;
  }

  return roundMoney(fee);
};

/* =========================================================
   PREPARATION HELPERS
========================================================= */

const getPreparationName = (option) => {
  if (typeof option === "string") {
    return option.trim();
  }

  if (option && typeof option === "object") {
    return String(option.name || "").trim();
  }

  return "";
};

const getPreparationPrice = (option, fallbackPrice = 0) => {
  if (
    option &&
    typeof option === "object" &&
    Number.isFinite(Number(option.pricePerKg))
  ) {
    return Number(option.pricePerKg);
  }

  return Number(fallbackPrice) || 0;
};

const findPreparationOption = (
  product,
  preparation
) => {
  const requestedPreparation =
    String(preparation || "").trim();

  if (!requestedPreparation) {
    return null;
  }

  const options =
    Array.isArray(product.preparationOptions)
      ? product.preparationOptions
      : [];

  return (
    options.find(
      (option) =>
        getPreparationName(option).toLowerCase() ===
        requestedPreparation.toLowerCase()
    ) || null
  );
};

/* =========================================================
   ADDRESS
========================================================= */

const normalizeAddress = (address = {}) => {
  return {
    firstName: String(address.firstName || "").trim(),
    lastName: String(address.lastName || "").trim(),
    phone: String(address.phone || "").trim(),
    address: String(address.address || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    zipcode: String(
      address.zipcode || address.pincode || ""
    ).trim(),
    country:
      String(address.country || "India").trim() ||
      "India",
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

    const product = await productModel.findById(
      item.productId
    );

    if (!product) {
      throw new Error(
        `Product not found: ${item.productId}`
      );
    }

    if (
      product.isAvailable === false ||
      Number(product.stock || 0) <= 0
    ) {
      throw new Error(
        `${product.name} is currently unavailable`
      );
    }

    const weight = Number(item.weight);

    const quantity = Number(item.quantity);

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      throw new Error(
        `Invalid weight for ${product.name}`
      );
    }

    if (
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        `Invalid quantity for ${product.name}`
      );
    }

    /* =====================================================
       WEIGHT VALIDATION
    ===================================================== */

    const minQuantity =
      Number(product.minQuantity || 0);

    const maxQuantity =
      Number(product.maxQuantity || 0);

    const quantityStep =
      Number(product.quantityStep || 0);

    if (
      minQuantity > 0 &&
      weight < minQuantity
    ) {
      throw new Error(
        `${product.name} minimum weight is ${minQuantity} KG`
      );
    }

    if (
      maxQuantity > 0 &&
      weight > maxQuantity
    ) {
      throw new Error(
        `${product.name} maximum weight is ${maxQuantity} KG`
      );
    }

    if (quantityStep > 0) {
      const steps =
        (weight - minQuantity) /
        quantityStep;

      const isValidStep =
        Math.abs(
          steps - Math.round(steps)
        ) < 0.000001;

      if (
        minQuantity > 0 &&
        !isValidStep
      ) {
        throw new Error(
          `Invalid weight for ${product.name}. Please select a valid weight.`
        );
      }
    }

    /* =====================================================
       STOCK VALIDATION
    ===================================================== */

    const requiredStock =
      weight * quantity;

    if (
      requiredStock >
      Number(product.stock || 0)
    ) {
      throw new Error(
        `Only ${Number(product.stock || 0)} KG of ${product.name} is available`
      );
    }

    /* =====================================================
       PREPARATION / PRICE
    ===================================================== */

    const preparation =
      String(item.preparation || "").trim();

    let pricePerKg =
      Number(product.price || 0);

    if (preparation) {
      const preparationOption =
        findPreparationOption(
          product,
          preparation
        );

      if (!preparationOption) {
        throw new Error(
          `${preparation} is not available for ${product.name}`
        );
      }

      pricePerKg =
        getPreparationPrice(
          preparationOption,
          product.price
        );
    }

    const subtotal = roundMoney(
      pricePerKg *
        weight *
        quantity
    );

    validatedItems.push({
      productId: product._id,
      name: product.name,
      image:
        Array.isArray(product.image) &&
        product.image.length > 0
          ? product.image[0]
          : "",
      price: pricePerKg,
      weight,
      quantity,
      preparation,
      subtotal,
    });
  }

  return validatedItems;
};

/* =========================================================
   STOCK REDUCTION
========================================================= */

const reduceOrderStock = async (
  validatedItems
) => {
  for (const item of validatedItems) {
    const requiredStock =
      Number(item.weight || 0) *
      Number(item.quantity || 1);

    const updatedProduct =
      await productModel.findOneAndUpdate(
        {
          _id: item.productId,
          stock: {
            $gte: requiredStock,
          },
        },
        {
          $inc: {
            stock: -requiredStock,
          },
        },
        {
          new: true,
        }
      );

    if (!updatedProduct) {
      throw new Error(
        `Insufficient stock for ${item.name}`
      );
    }

    if (
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

const restoreOrderStock = async (
  validatedItems
) => {
  for (const item of validatedItems) {
    const restoreStock =
      Number(item.weight || 0) *
      Number(item.quantity || 1);

    await productModel.findByIdAndUpdate(
      item.productId,
      {
        $inc: {
          stock: restoreStock,
        },
        $set: {
          isAvailable: true,
        },
      }
    );
  }
};

/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */

const createRazorpayOrder = async (
  req,
  res
) => {
  try {
    const {
      items,
      deliveryFee,
    } = req.body;

    /* =====================================================
       VALIDATE ITEMS
    ===================================================== */

    const validatedItems =
      await validateOrderItems(items);

    /* =====================================================
       CALCULATE AUTHORITATIVE SUBTOTAL
    ===================================================== */

    const subtotal = roundMoney(
      validatedItems.reduce(
        (total, item) =>
          total +
          Number(item.subtotal || 0),
        0
      )
    );

    const normalizedDeliveryFee =
      normalizeDeliveryFee(
        deliveryFee
      );

    const amount = roundMoney(
      subtotal +
        normalizedDeliveryFee
    );

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Order amount must be greater than zero",
      });
    }

    /* =====================================================
       CREATE RAZORPAY ORDER
    ===================================================== */

    const razorpayOrder =
      await razorpay.orders.create({
        amount: Math.round(
          amount * 100
        ),
        currency: "INR",
        receipt:
          `order_${Date.now()}`,
      });

    return res.json({
      success: true,

      order: razorpayOrder,

      subtotal,

      deliveryFee:
        normalizedDeliveryFee,

      amount,
    });
  } catch (error) {
    console.error(
      "Create Razorpay order error:",
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
   VERIFY RAZORPAY PAYMENT
========================================================= */

const verifyPayment = async (
  req,
  res
) => {
  let stockReduced = false;

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing Razorpay payment details",
      });
    }

    if (!orderData) {
      return res.status(400).json({
        success: false,
        message:
          "Order data is missing",
      });
    }

    /* =====================================================
       VERIFY RAZORPAY SIGNATURE
    ===================================================== */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment signature",
      });
    }

    /* =====================================================
       CHECK DUPLICATE PAYMENT
    ===================================================== */

    const existingOrder =
      await orderModel.findOne({
        razorpayPaymentId:
          razorpay_payment_id,
      });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message:
          "Payment already verified",
        order: existingOrder,
      });
    }

    /* =====================================================
       GET USER
    ===================================================== */

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

    /* =====================================================
       NORMALIZE + VALIDATE ADDRESS
    ===================================================== */

    const normalizedAddress =
      normalizeAddress(
        orderData.address
      );

    const addressError =
      validateAddress(
        normalizedAddress
      );

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    /* =====================================================
       REVALIDATE PRODUCTS + PRICES
    ===================================================== */

    const validatedItems =
      await validateOrderItems(
        orderData.items
      );

    /* =====================================================
       CALCULATE AUTHORITATIVE AMOUNTS
    ===================================================== */

    const subtotal = roundMoney(
      validatedItems.reduce(
        (total, item) =>
          total +
          Number(item.subtotal || 0),
        0
      )
    );

    const deliveryFee =
      normalizeDeliveryFee(
        orderData.deliveryFee
      );

    const calculatedAmount =
      roundMoney(
        subtotal +
          deliveryFee
      );

    /* =====================================================
       VERIFY RAZORPAY ORDER
    ===================================================== */

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order not found",
      });
    }

    if (
      razorpayOrder.currency !==
      "INR"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Razorpay currency",
      });
    }

    const razorpayAmount =
      Number(razorpayOrder.amount) /
      100;

    if (
      roundMoney(
        razorpayAmount
      ) !==
      roundMoney(
        calculatedAmount
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment amount does not match order amount",
      });
    }

    /* =====================================================
       REDUCE STOCK
    ===================================================== */

    await reduceOrderStock(
      validatedItems
    );

    stockReduced = true;

    /* =====================================================
       SAVE USER ADDRESS
    ===================================================== */

    user.phone =
      normalizedAddress.phone;

    user.address =
      normalizedAddress.address;

    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const newOrder =
      new orderModel({
        userId: req.userId,

        items: validatedItems,

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

        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,

        orderStatus:
          "Order Placed",

        date: Date.now(),
      });

    await newOrder.save();

    /* =====================================================
       CREATE / UPDATE CUSTOMER
       
       IMPORTANT:
       Same userId = same customer
       Each order still gets its own order ID.
    ===================================================== */

    try {
      let customer =
        await customerModel.findOne({
          userId: req.userId,
        });

      /* ===================================================
         CALCULATE TOTAL WEIGHT
      =================================================== */

      const orderWeight =
        validatedItems.reduce(
          (total, item) => {
            return (
              total +
              Number(item.weight || 0) *
                Number(
                  item.quantity || 1
                )
            );
          },
          0
        );

      /* ===================================================
         NEW CUSTOMER
      =================================================== */

      if (!customer) {
        const customerCount =
          await customerModel.countDocuments();

        const nextNumber =
          customerCount + 1;

        const customerId =
          `CUS${String(
            nextNumber
          ).padStart(6, "0")}`;

        customer =
          await customerModel.create({
            customerId,

            userId:
              req.userId,

            firstName:
              normalizedAddress.firstName,

            lastName:
              normalizedAddress.lastName,

            phone:
              normalizedAddress.phone,

            address:
              normalizedAddress.address,

            city:
              normalizedAddress.city,

            state:
              normalizedAddress.state,

            zipcode:
              normalizedAddress.zipcode,

            country:
              normalizedAddress.country,

            totalOrders: 1,

            totalSpent:
              newOrder.orderStatus !==
              "Cancelled"
                ? calculatedAmount
                : 0,

            totalWeight:
              orderWeight,

            lastOrder:
              Date.now(),
          });

        console.log(
          "✅ New customer created:",
          customer.customerId
        );
      }

      /* ===================================================
         EXISTING CUSTOMER
      =================================================== */

      else {
        customer.firstName =
          normalizedAddress.firstName;

        customer.lastName =
          normalizedAddress.lastName;

        customer.phone =
          normalizedAddress.phone;

        customer.address =
          normalizedAddress.address;

        customer.city =
          normalizedAddress.city;

        customer.state =
          normalizedAddress.state;

        customer.zipcode =
          normalizedAddress.zipcode;

        customer.country =
          normalizedAddress.country;

        customer.totalOrders =
          Number(
            customer.totalOrders || 0
          ) + 1;

        if (
          newOrder.orderStatus !==
          "Cancelled"
        ) {
          customer.totalSpent =
            Number(
              customer.totalSpent || 0
            ) +
            calculatedAmount;
        }

        customer.totalWeight =
          Number(
            customer.totalWeight || 0
          ) +
          orderWeight;

        customer.lastOrder =
          Date.now();

        await customer.save();

        console.log(
          "✅ Existing customer updated:",
          customer.customerId
        );
      }
    } catch (customerError) {
      /*
       * Do not fail an already-paid order because
       * customer profile saving failed.
       */
      console.error(
        "❌ Customer save error:",
        customerError
      );
    }

    /* =====================================================
       CLEAR USER CART
    ===================================================== */

    user.cartData = {};

    await user.save();

    /* =====================================================
       SUCCESS
    ===================================================== */

    return res.status(200).json({
      success: true,

      message:
        "Payment verified and order placed successfully",

      order: newOrder,
    });
  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    /* =====================================================
       RESTORE STOCK IF IT WAS REDUCED
       BUT ORDER CREATION FAILED
    ===================================================== */

    if (stockReduced) {
      try {
        const items =
          Array.isArray(
            req.body?.orderData?.items
          )
            ? req.body.orderData.items
            : [];

        const validatedItems =
          await validateOrderItems(
            items
          );

        await restoreOrderStock(
          validatedItems
        );

        console.log(
          "✅ Stock restored after payment verification error"
        );
      } catch (restoreError) {
        console.error(
          "❌ Failed to restore stock:",
          restoreError
        );
      }
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to verify payment",
    });
  }
};

/* =========================================================
   EXPORT
========================================================= */

export {
  createRazorpayOrder,
  verifyPayment,
};
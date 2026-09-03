import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

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
  const selectedPreparation =
    String(
      preparation || ""
    ).trim();

  if (!selectedPreparation) {
    throw new Error(
      `Please select a preparation option for ${product.name}`
    );
  }

  const options =
    Array.isArray(
      product.preparationOptions
    )
      ? product.preparationOptions
          .map((option) =>
            String(option || "").trim()
          )
          .filter(Boolean)
      : [];

  /*
   * If the product has preparation options,
   * the customer's selection must match one
   * of those options.
   */
  if (options.length > 0) {
    const matchedOption =
      options.find(
        (option) =>
          option.toLowerCase() ===
          selectedPreparation.toLowerCase()
      );

    if (!matchedOption) {
      throw new Error(
        `Invalid preparation option for ${product.name}`
      );
    }

    return matchedOption;
  }

  /*
   * Existing products may temporarily have
   * preparationOptions: [] until their admin
   * data is updated.
   *
   * We still require a preparation value from
   * the frontend so old products don't create
   * preparation-less orders.
   */
  return selectedPreparation;
};

/* =========================================================
   VALIDATE ORDER ITEMS
   IMPORTANT:
   Price comes from MongoDB, NOT frontend.
========================================================= */

const validateOrderItems = async (items) => {
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
       PRODUCT WEIGHT RULES
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
       PRICE
       ALWAYS USE DATABASE PRICE
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
       FINAL VALIDATED ITEM
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
        productId: item.productId,

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

    if (!productId) continue;

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
   PLACE ORDER
   IMPORTANT:
   COD IS NO LONGER AVAILABLE.

   Razorpay orders must be completed through
   paymentController.js -> create order -> verify payment.
========================================================= */

const placeOrder = async (
  req,
  res
) => {
  return res.status(400).json({
    success: false,
    message:
      "Cash on Delivery is not available. Please complete your order using online payment.",
  });
};

/* =========================================================
   USER ORDERS
========================================================= */

const userOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await orderModel
        .find({
          userId: req.userId,
        })
        .sort({
          date: -1,
        })
        .lean();

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "❌ User orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch orders",
    });
  }
};

/* =========================================================
   ADMIN - ALL ORDERS
========================================================= */

const allOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await orderModel
        .find({})
        .sort({
          date: -1,
        })
        .lean();

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "❌ All orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch orders",
    });
  }
};

/* =========================================================
   ADMIN - UPDATE ORDER STATUS
========================================================= */

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      status,
    } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID and status are required",
      });
    }

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status",
      });
    }

    const order =
      await orderModel.findById(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    if (
      order.orderStatus ===
        "Cancelled" &&
      status !== "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled order cannot be reopened",
      });
    }

    if (
      order.orderStatus ===
        "Delivered" &&
      status !== "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Delivered order cannot be changed",
      });
    }

    order.orderStatus =
      status;

    /*
     * COD is no longer supported.
     *
     * Razorpay orders are already marked
     * Paid during successful payment verification.
     */
    if (
      order.paymentMethod ===
        "COD"
    ) {
      /*
       * Keep this only for historical
       * COD orders already stored in MongoDB.
       */
      if (
        status === "Delivered"
      ) {
        order.paymentStatus =
          "Paid";
      }
    }

    await order.save();

    return res.json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "❌ Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update order status",
    });
  }
};

/* =========================================================
   CANCEL ORDER
========================================================= */

const cancelOrder = async (
  req,
  res
) => {
  try {
    const {
      orderId,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID is required",
      });
    }

    const order =
      await orderModel.findOne({
        _id: orderId,
        userId: req.userId,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    if (
      order.orderStatus ===
      "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order is already cancelled",
      });
    }

    const nonCancellableStatuses = [
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    if (
      nonCancellableStatuses.includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled at this stage",
      });
    }

    /* -----------------------------------------------
       RESTORE STOCK
    ----------------------------------------------- */

    await restoreOrderStock(
      order.items
    );

    /* -----------------------------------------------
       PAYMENT STATUS
    ----------------------------------------------- */

    /*
     * Razorpay:
     * The order may already be paid.
     *
     * We do not falsely mark it as refunded.
     * A real Razorpay refund API should be
     * used when refunds are implemented.
     */

    order.orderStatus =
      "Cancelled";

    await order.save();

    return res.json({
      success: true,

      message:
        "Order cancelled successfully",
    });
  } catch (error) {
    console.error(
      "❌ Cancel order error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to cancel order",
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

export {
  placeOrder,
  userOrders,
  allOrders,
  updateOrderStatus,
  cancelOrder,

  /*
   * These are imported by paymentController.js
   * so payment verification can use exactly
   * the same validation and stock logic.
   */
  validateOrderItems,
  reduceOrderStock,
  restoreOrderStock,
  roundMoney,
  normalizeAddress,
  validateAddress,
};
import mongoose from "mongoose";

/* =========================================================
   ORDER ITEM
========================================================= */

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  weight: {
    type: Number,
    required: true,
    min: 0.1,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  preparation: {
    type: String,
    default: "",
    trim: true,
  },

  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

/* =========================================================
   ORDER ADDRESS
========================================================= */

const orderAddressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    zipcode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ORDER SCHEMA
========================================================= */

const orderSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       USER
    ------------------------------------------------------- */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    /* -------------------------------------------------------
       PRODUCTS
    ------------------------------------------------------- */

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,

        message: "Order must contain at least one item",
      },
    },

    /* -------------------------------------------------------
       MONEY
    ------------------------------------------------------- */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    /*
     * subtotal + deliveryFee
     */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* -------------------------------------------------------
       ADDRESS SNAPSHOT
    ------------------------------------------------------- */

    address: {
      type: orderAddressSchema,
      required: true,
    },

    /* -------------------------------------------------------
       PAYMENT
    ------------------------------------------------------- */

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    /* -------------------------------------------------------
       RAZORPAY
    ------------------------------------------------------- */

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    /* -------------------------------------------------------
       ORDER STATUS
    ------------------------------------------------------- */

    orderStatus: {
      type: String,

      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],

      default: "Order Placed",
    },

    /* -------------------------------------------------------
       DATE
    ------------------------------------------------------- */

    date: {
      type: Number,
      default: Date.now,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   MODEL
========================================================= */

const orderModel =
  mongoose.models.order ||
  mongoose.model("order", orderSchema);

export default orderModel;
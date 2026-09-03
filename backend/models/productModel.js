import mongoose from "mongoose";

/* =========================================================
   DESCRIPTION SCHEMA
========================================================= */

const descriptionSchema = new mongoose.Schema(
  {
    proteins: {
      type: String,
      default: "",
    },

    calories: {
      type: String,
      default: "",
    },

    vitamins: {
      type: String,
      default: "",
    },

    minerals: {
      type: String,
      default: "",
    },

    uses: {
      type: String,
      default: "",
    },

    benefits: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

/* =========================================================
   PRODUCT SCHEMA
========================================================= */

const productSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       BASIC PRODUCT INFORMATION
    ------------------------------------------------------- */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    overview: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: descriptionSchema,
      default: () => ({}),
    },

    /* -------------------------------------------------------
       PRICE
       
       IMPORTANT:
       Price is PER KG.
    ------------------------------------------------------- */

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* -------------------------------------------------------
       PRODUCT IMAGES
    ------------------------------------------------------- */

    image: {
      type: [String],
      required: true,
      default: [],
    },

    /* -------------------------------------------------------
       CATEGORY
    ------------------------------------------------------- */

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    /* -------------------------------------------------------
       CURRENCY
    ------------------------------------------------------- */

    currency: {
      type: String,
      default: "₹",
    },

    /* -------------------------------------------------------
       STOCK
    ------------------------------------------------------- */

    stock: {
      type: Number,
      default: 10,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    /* -------------------------------------------------------
       WEIGHT SETTINGS
    ------------------------------------------------------- */

    minQuantity: {
      type: Number,
      default: 0.5,
      min: 0.1,
    },

    maxQuantity: {
      type: Number,
      default: 10,
      min: 0.1,
    },

    quantityStep: {
      type: Number,
      default: 0.5,
      min: 0.1,
    },

    /* -------------------------------------------------------
       PREPARATION OPTIONS
       
       Examples:

       Fish:
       [
         "Whole & Cleaned",
         "Curry Cut",
         "Fry Cut"
       ]

       Prawns:
       [
         "Cleaned",
         "Cleaned & Deveined"
       ]

       Crabs:
       [
         "Whole Cleaned",
         "Cut & Cleaned"
       ]
       
       The frontend will display only the options
       configured for that particular product.
    ------------------------------------------------------- */

   preparationOptions: {
  type: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      pricePerKg: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  default: [],
},
    /* -------------------------------------------------------
       BESTSELLER
    ------------------------------------------------------- */

    bestseller: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   MODEL
========================================================= */

const productModel =
  mongoose.models.product ||
  mongoose.model(
    "product",
    productSchema
  );

export default productModel;
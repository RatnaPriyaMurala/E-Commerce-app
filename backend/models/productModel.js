import mongoose from "mongoose";

const descriptionSchema = new mongoose.Schema({
  proteins: String,
  calories: String,
  vitamins: String,
  minerals: String,
  uses: String,
  benefits: [String],
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overview: { type: String, required: true },
  description: { type: descriptionSchema, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: false },
  // ✅ Changed from [Number] → Number
  //weight: { type: [Number], required: true },
  currency: { type: String, default: "₹" },
  stock: { type: Number, default: 10 },
  isAvailable: { type: Boolean, default: true },
  minQuantity: { type: Number, default: 0.5 },
  maxQuantity: { type: Number, default: 10 },
  quantityStep: { type: Number, default: 0.5 },
  date: { type: Number, required: true },
  bestseller: { type: Boolean, default: false },
  paymentMethod: {
    type: String,
    default: "COD"
},

paymentStatus: {
    type: String,
    default: "Pending"
},

paymentId: {
    type: String,
    default: ""
},

razorpayOrderId: {
    type: String,
    default: ""
},

razorpaySignature: {
    type: String,
    default: ""
},
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;

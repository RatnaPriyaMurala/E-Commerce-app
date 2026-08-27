import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaFish,
  FaWeightHanging,
  FaShoppingCart,
  FaStar,
  FaLeaf,
  FaHeartbeat,
  FaCheckCircle,
  FaTruck,
  FaSnowflake,
  FaCreditCard,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();

  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [weight, setWeight] = useState(0.5);

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    if (!products.length) return;

    const foundProduct = products.find(
      (item) => item._id === productId
    );

    if (foundProduct) {
      setProductData(foundProduct);

      if (Number(foundProduct.stock) <= 0) {
        setWeight(0);
      } else {
        setWeight(
          Math.min(
            foundProduct.minQuantity ?? 0.5,
            Number(foundProduct.stock)
          )
        );
      }
    }
  }, [productId, products]);

  // ============================================================
  // LOADING
  // ============================================================

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyan-50 flex items-center justify-center animate-pulse">
            <FaFish className="text-4xl text-cyan-600" />
          </div>

          <p className="mt-5 text-gray-500 font-medium">
            Loading Fresh Product...
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Please wait while we fetch the seafood details.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // PRODUCT VALUES
  // ============================================================

  const min = Number(productData.minQuantity ?? 0.5);

  const max = Number(productData.maxQuantity ?? 10);

  const step = Number(productData.quantityStep ?? 0.5);

  const availableStock = Number(productData.stock ?? 0);

  const availableMax = Math.min(max, availableStock);

  const isOutOfStock =
    !productData.isAvailable || availableStock <= 0;

  // ============================================================
  // WEIGHT HANDLER
  // ============================================================

  const handleWeightChange = (value) => {
    const numericValue = Number(value);

    if (isNaN(numericValue)) return;

    if (availableStock <= 0) {
      setWeight(0);
      return;
    }

    if (numericValue < min) {
      setWeight(min);
    } else if (numericValue > availableMax) {
      setWeight(availableMax);
    } else {
      setWeight(Number(numericValue.toFixed(1)));
    }
  };

  // ============================================================
  // CATEGORY DESCRIPTION
  // ============================================================

  const categoryDescriptions = {
    "live fish":
      "Freshly harvested and kept alive until delivery.",

    "fresh water fish":
      "Freshwater fish rich in protein and nutrients.",

    "sea fish":
      "Premium sea fish with rich Omega-3 content.",

    "kolkata fish":
      "Authentic Kolkata market speciality.",

    prawns:
      "Fresh premium prawns with delicious taste.",

    crabs:
      "Live crabs selected daily for freshness.",
  };

  const commonDescription =
    categoryDescriptions[
      productData.category?.toLowerCase()
    ];

  // ============================================================
  // CATEGORY
  // ============================================================

  const categoryName =
    productData.category || "Fresh Seafood";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20 overflow-hidden">
      {/* ========================================================
          DECORATIVE BACKGROUND
      ======================================================== */}

      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-[35rem] -left-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================
          BREADCRUMB
      ======================================================== */}

      <div className="relative z-10 flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-7">
        <Link
          to="/"
          className="hover:text-cyan-600 transition-colors"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          to="/menu"
          className="hover:text-cyan-600 transition-colors"
        >
          Menu
        </Link>

        <span>/</span>

        <span className="text-cyan-700 font-medium">
          {categoryName}
        </span>
      </div>

      {/* ========================================================
          MAIN PRODUCT SECTION
      ======================================================== */}

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* ======================================================
            LEFT — PRODUCT IMAGE
        ====================================================== */}

        <div className="lg:sticky lg:top-24">
          <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
            {/* Bestseller */}
            {productData.bestseller && (
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xl">
                <FaStar className="text-yellow-100" />
                Bestseller
              </div>
            )}

            {/* Fresh badge */}
            <div className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md text-cyan-700 px-3 py-2 rounded-full text-xs font-semibold shadow-lg border border-gray-100">
              <FaCheckCircle className="text-green-500" />
              Fresh Catch
            </div>

            {/* Image */}
            <div className="overflow-hidden bg-gray-50">
              <img
                src={productData.image?.[0]}
                alt={productData.name}
                className="w-full h-[340px] sm:h-[460px] lg:h-[540px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Image bottom information */}
            <div className="bg-white px-5 sm:px-7 py-5 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaSnowflake className="text-cyan-600" />
                  Hygienically Packed
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaTruck className="text-cyan-600" />
                  Fresh Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            RIGHT — PRODUCT INFORMATION
        ====================================================== */}

        <div className="flex flex-col">
          {/* Category */}
          <div>
            <span className="inline-flex items-center gap-2 text-cyan-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
              <FaFish />
              {categoryName}
            </span>

            {/* Product name */}
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight leading-tight">
              {productData.name}
            </h1>

            {/* Overview */}
            <p className="mt-5 text-gray-600 leading-7 text-sm sm:text-base">
              {productData.overview ||
                commonDescription ||
                "Premium quality seafood, freshly sourced and carefully packed for your family."}
            </p>
          </div>

          {/* ====================================================
              PRICE
          ==================================================== */}

          <div className="relative mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 text-white shadow-xl">
            <div className="absolute -right-16 -top-16 w-40 h-40 bg-white/10 rounded-full blur-xl" />

            <div className="relative p-6 sm:p-7">
              <p className="text-cyan-100 text-xs uppercase tracking-wider font-semibold">
                Price per kilogram
              </p>

              <div className="flex items-end gap-2 mt-2">
                <h2 className="text-4xl sm:text-5xl font-extrabold">
                  {currency}
                  {productData.price}
                </h2>

                <span className="text-cyan-100 text-base sm:text-lg mb-1">
                  / KG
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-cyan-100">
                <FaCheckCircle className="text-green-300" />
                Freshness and quality checked
              </div>
            </div>
          </div>

          {/* ====================================================
              STOCK INFORMATION
          ==================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            {/* Available */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs sm:text-sm text-gray-500">
                Available
              </p>

              <h3 className="mt-1 text-lg sm:text-xl font-bold text-green-700">
                {availableStock.toFixed(1)} KG
              </h3>
            </div>

            {/* Minimum */}
            <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
              <p className="text-xs sm:text-sm text-gray-500">
                Min Order
              </p>

              <h3 className="mt-1 text-lg sm:text-xl font-bold text-cyan-700">
                {min} KG
              </h3>
            </div>

            {/* Maximum */}
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <p className="text-xs sm:text-sm text-gray-500">
                Max Order
              </p>

              <h3 className="mt-1 text-lg sm:text-xl font-bold text-orange-600">
                {Math.max(0, availableMax)} KG
              </h3>
            </div>
          </div>

          {/* ====================================================
              QUANTITY
          ==================================================== */}

          <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                <FaWeightHanging className="text-cyan-700" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Select Quantity
                </h3>

                <p className="text-xs text-gray-500">
                  Choose how much you'd like to order
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Minus */}
              <button
                type="button"
                onClick={() =>
                  handleWeightChange(weight - step)
                }
                disabled={
                  isOutOfStock ||
                  weight <= min
                }
                aria-label="Decrease quantity"
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-xl font-bold text-gray-700 transition"
              >
                −
              </button>

              {/* Input */}
              <div className="relative">
                <input
                  type="number"
                  min={min}
                  max={availableMax}
                  step={step}
                  value={weight}
                  disabled={isOutOfStock}
                  onChange={(e) => {
                    const value = parseFloat(
                      e.target.value
                    );

                    if (!isNaN(value)) {
                      handleWeightChange(value);
                    }
                  }}
                  className="w-28 sm:w-32 text-center border border-gray-200 rounded-2xl py-3 px-2 text-lg font-bold text-gray-800 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                  KG
                </span>
              </div>

              {/* Plus */}
              <button
                type="button"
                onClick={() =>
                  handleWeightChange(weight + step)
                }
                disabled={
                  isOutOfStock ||
                  weight >= availableMax
                }
                aria-label="Increase quantity"
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-xl font-bold text-gray-700 transition"
              >
                +
              </button>
            </div>

            {/* Quantity status */}
            {!isOutOfStock ? (
              <div className="mt-5 flex items-center gap-2 text-sm text-green-600 font-medium">
                <FaCheckCircle />
                Ready to order {weight} KG
              </div>
            ) : (
              <div className="mt-5 text-sm text-red-500 font-medium">
                This product is currently unavailable.
              </div>
            )}
          </div>

          {/* ====================================================
              ADD TO CART
          ==================================================== */}

          <div className="mt-7">
            {!isOutOfStock ? (
              <button
                type="button"
                disabled={
                  availableStock <= 0 ||
                  weight <= 0 ||
                  weight > availableStock
                }
                onClick={() =>
                  addToCart(productData._id, weight)
                }
                className="group w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg shadow-xl shadow-cyan-600/20 hover:shadow-2xl hover:shadow-cyan-600/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaShoppingCart className="transition-transform duration-300 group-hover:scale-110" />

                ADD TO CART
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-4 sm:py-5 rounded-2xl bg-gray-400 text-white font-bold text-base sm:text-lg cursor-not-allowed"
              >
                OUT OF STOCK
              </button>
            )}
          </div>

          {/* Small purchase assurance */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-500" />
              Secure Order
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-600" />
              Quality Checked
            </div>

            <div className="flex items-center gap-2">
              <FaTruck className="text-blue-600" />
              Fresh Delivery
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PRODUCT FEATURES
      ======================================================== */}

      <div className="relative z-10 grid md:grid-cols-3 gap-5 mt-12">
        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center">
            <FaSnowflake className="text-cyan-700 text-xl" />
          </div>

          <h3 className="font-bold text-lg mt-5 text-gray-800">
            Fresh Guarantee
          </h3>

          <p className="mt-3 text-gray-500 leading-7 text-sm">
            Freshly caught and hygienically packed before dispatch to help
            preserve premium quality.
          </p>
        </div>

        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
            <FaTruck className="text-blue-700 text-xl" />
          </div>

          <h3 className="font-bold text-lg mt-5 text-gray-800">
            Fast Delivery
          </h3>

          <p className="mt-3 text-gray-500 leading-7 text-sm">
            Same-day delivery in selected locations with suitable packaging
            for freshness.
          </p>
        </div>

        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
            <FaCreditCard className="text-green-700 text-xl" />
          </div>

          <h3 className="font-bold text-lg mt-5 text-gray-800">
            Safe Payments
          </h3>

          <p className="mt-3 text-gray-500 leading-7 text-sm">
            Secure online payment options and Cash on Delivery for eligible
            locations.
          </p>
        </div>
      </div>

      {/* ========================================================
          NUTRITIONAL INFORMATION
      ======================================================== */}

      <div className="relative z-10 mt-16 sm:mt-20">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            <FaLeaf />
            Nutrition
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-800">
            Nutritional Information
          </h2>

          <p className="mt-3 text-gray-500 text-sm sm:text-base">
            Key nutritional information available for this seafood.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Protein */}
          <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-100">
            <p className="text-gray-500 text-sm">
              Protein
            </p>

            <h3 className="font-bold text-xl mt-2 text-cyan-700">
              {productData.description?.proteins || "-"}
            </h3>
          </div>

          {/* Calories */}
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
            <p className="text-gray-500 text-sm">
              Calories
            </p>

            <h3 className="font-bold text-xl mt-2 text-red-600">
              {productData.description?.calories || "-"}
            </h3>
          </div>

          {/* Vitamins */}
          <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100">
            <p className="text-gray-500 text-sm">
              Vitamins
            </p>

            <h3 className="font-bold text-xl mt-2 text-yellow-700">
              {productData.description?.vitamins || "-"}
            </h3>
          </div>

          {/* Minerals */}
          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <p className="text-gray-500 text-sm">
              Minerals
            </p>

            <h3 className="font-bold text-xl mt-2 text-green-700">
              {productData.description?.minerals || "-"}
            </h3>
          </div>

          {/* Uses */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <p className="text-gray-500 text-sm">
              Uses
            </p>

            <h3 className="font-bold text-lg mt-2 text-blue-700">
              {productData.description?.uses || "-"}
            </h3>
          </div>
        </div>
      </div>

      {/* ========================================================
          HEALTH BENEFITS
      ======================================================== */}

      <div className="relative z-10 mt-16 sm:mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <FaHeartbeat className="text-red-500 text-xl" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Health Benefits
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Benefits listed for this product
            </p>
          </div>
        </div>

        {productData.description?.benefits?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {productData.description.benefits.map(
              (benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-green-50 rounded-2xl p-5 border border-green-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-9 h-9 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <FaCheckCircle className="text-green-500" />
                  </div>

                  <p className="text-gray-700 leading-7">
                    {benefit}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-500 text-sm">
            Health benefit information is currently unavailable for this
            product.
          </div>
        )}
      </div>

      {/* ========================================================
          DESCRIPTION / REVIEWS
      ======================================================== */}

      <div className="relative z-10 mt-16 sm:mt-20">
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            type="button"
            className="font-bold text-cyan-700 border-b-2 border-cyan-600 pb-4"
          >
            Description
          </button>

          <button
            type="button"
            className="text-gray-400 pb-4 cursor-default"
          >
            Customer Reviews
          </button>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10 leading-8 text-gray-600">
          <p>
            {commonDescription ||
              "Our seafood is sourced from trusted fishermen and carefully inspected before delivery."}
          </p>

          <p className="mt-5">
            Every order is cleaned, packed hygienically, and transported using
            suitable packaging to help maintain freshness.
          </p>

          <p className="mt-5">
            Fish may naturally vary slightly in size and weight because they
            are fresh products and are not standardized processed items.
          </p>
        </div>
      </div>

      {/* ========================================================
          CUSTOMER REVIEWS
      ======================================================== */}

      <div className="relative z-10 mt-16 sm:mt-20">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
            <FaStar />
            Customer Feedback
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-800">
            What Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Review 1 */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex gap-1 text-yellow-400">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="mt-4 text-gray-600 leading-7">
              Fresh fish arrived within two hours. Very clean packaging and
              excellent taste.
            </p>

            <h4 className="mt-5 font-semibold text-gray-800">
              — Rajesh Kumar
            </h4>
          </div>

          {/* Review 2 */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex gap-1 text-yellow-400">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="mt-4 text-gray-600 leading-7">
              Good quality seafood. Prices are reasonable and delivery was
              very fast.
            </p>

            <h4 className="mt-5 font-semibold text-gray-800">
              — Priya Sharma
            </h4>
          </div>

          {/* Review 3 */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex gap-1 text-yellow-400">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="mt-4 text-gray-600 leading-7">
              Excellent customer service. Fish was extremely fresh and worth
              every rupee.
            </p>

            <h4 className="mt-5 font-semibold text-gray-800">
              — Akash Reddy
            </h4>
          </div>
        </div>
      </div>

      {/* ========================================================
          WHY CHOOSE PRIYA LIVE FISH
      ======================================================== */}

      <div className="relative z-10 mt-16 sm:mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 text-white shadow-2xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-7 sm:p-10 lg:p-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold text-cyan-100">
              <FaFish />
              Priya Live Fish
            </span>

            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold">
              Why Choose Us?
            </h2>

            <p className="mt-3 text-cyan-100 leading-7 text-sm sm:text-base">
              From careful sourcing to hygienic packing, we focus on bringing
              quality seafood closer to your family table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <FaFish />
              </div>

              <h3 className="font-bold text-lg mt-4">
                Fresh Catch
              </h3>

              <p className="mt-2 text-sm text-cyan-100 leading-6">
                Directly sourced from trusted fishermen.
              </p>
            </div>

            <div>
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <FaTruck />
              </div>

              <h3 className="font-bold text-lg mt-4">
                Fast Delivery
              </h3>

              <p className="mt-2 text-sm text-cyan-100 leading-6">
                Quick doorstep delivery in selected locations.
              </p>
            </div>

            <div>
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <FaCreditCard />
              </div>

              <h3 className="font-bold text-lg mt-4">
                Safe Payments
              </h3>

              <p className="mt-2 text-sm text-cyan-100 leading-6">
                Secure payment options with eligible COD support.
              </p>
            </div>

            <div>
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <FaCheckCircle />
              </div>

              <h3 className="font-bold text-lg mt-4">
                Quality Assured
              </h3>

              <p className="mt-2 text-sm text-cyan-100 leading-6">
                Carefully handled and hygienically packed seafood.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          RELATED PRODUCTS
      ======================================================== */}

      <div className="relative z-10 mt-20 sm:mt-24">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>

      {/* ========================================================
          BACK TO MENU
      ======================================================== */}

      <div className="relative z-10 flex justify-center mt-12">
        <Link
          to="/menu"
          className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold shadow-sm hover:shadow-lg hover:-translate-y-1 hover:text-cyan-700 transition-all duration-300"
        >
          <FaArrowLeft className="text-sm" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Product;
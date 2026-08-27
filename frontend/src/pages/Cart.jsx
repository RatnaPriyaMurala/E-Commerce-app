import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

import {
  FaShoppingCart,
  FaTrash,
  FaWeightHanging,
  FaArrowRight,
  FaTruck,
  FaSnowflake,
  FaShieldAlt,
  FaFish,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

const Cart = () => {
  const {
    products = [],
    currency,
    cartItems = {},
    updateWeight,
    removeFromCart,
    navigate,
  } = useContext(ShopContext);

  // ============================================================
  // BUILD CART DATA
  // ============================================================

  const cartData = useMemo(() => {
    if (
      !cartItems ||
      typeof cartItems !== "object" ||
      Object.keys(cartItems).length === 0
    ) {
      return [];
    }

    const list = [];

    Object.entries(cartItems).forEach(([itemId, weightsObj]) => {
      const product = products.find((item) => item._id === itemId);

      if (!product || !weightsObj) return;

      Object.keys(weightsObj).forEach((weight) => {
        const numericWeight = Number(weight);

        if (!Number.isFinite(numericWeight) || numericWeight <= 0) {
          return;
        }

        list.push({
          id: itemId,
          weight: numericWeight,
          product,
        });
      });
    });

    return list;
  }, [cartItems, products]);

  // ============================================================
  // QUANTITY CHANGE
  // ============================================================

  const handleWeightChange = (
    product,
    currentWeight,
    newWeight
  ) => {
    const min = Number(product.minQuantity ?? 0.5);
    const max = Number(product.maxQuantity ?? 10);
    const stock = Number(product.stock ?? 0);

    if (stock <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    const availableMax = Math.min(max, stock);

    if (newWeight < min) {
      toast.info(`Minimum order quantity is ${min} KG.`);
      return;
    }

    if (newWeight > availableMax) {
      toast.error(`Maximum available quantity is ${availableMax} KG.`);
      return;
    }

    const roundedWeight = Number(newWeight.toFixed(1));

    if (roundedWeight === currentWeight) return;

    updateWeight(
      product._id,
      currentWeight,
      roundedWeight
    );
  };

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.success("Item removed from cart.");
  };

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (cartData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-2xl shadow-lg">
            <FaShoppingCart />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-1">
              Review your selected seafood before checkout.
            </p>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 px-6 py-16 sm:px-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
            <FaShoppingCart className="text-4xl text-cyan-600" />
          </div>

          <h2 className="mt-7 text-2xl sm:text-3xl font-extrabold text-gray-800">
            Your Cart is Empty
          </h2>

          <p className="mt-3 max-w-md mx-auto text-gray-500 leading-7">
            Looks like you haven't added any fresh seafood yet.
            Explore our collection and find something delicious.
          </p>

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="mt-8 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaFish />
            Continue Shopping
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN CART
  // ============================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-2xl shadow-lg">
            <FaShoppingCart />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-1">
              Review your selected seafood before checkout.
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold">
          {cartData.length}{" "}
          {cartData.length === 1 ? "Item" : "Items"}
        </div>
      </div>

      {/* ========================================================
          PRODUCT LIST
      ======================================================== */}

      <div className="space-y-6">
        {cartData.map(({ id, weight, product }) => {
          const min = Number(product.minQuantity ?? 0.5);
          const max = Number(product.maxQuantity ?? 10);
          const step = Number(product.quantityStep ?? 0.5);
          const stock = Number(product.stock ?? 0);

          const availableMax = Math.min(max, stock);

          const canDecrease =
            stock > 0 && weight > min;

          const canIncrease =
            stock > 0 && weight < availableMax;

          const isOutOfStock =
            !product.isAvailable || stock <= 0;

          return (
            <div
              key={`${id}-${weight}`}
              className="bg-white rounded-[2rem] shadow-lg hover:shadow-xl border border-gray-100 p-5 sm:p-6 transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* ==================================================
                    PRODUCT IMAGE
                ================================================== */}

                <div className="relative shrink-0">
                  <div className="w-full sm:w-56 h-56 rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {product.bestseller && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                      ⭐ Bestseller
                    </div>
                  )}

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/35 rounded-2xl flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    PRODUCT DETAILS
                ================================================== */}

                <div className="flex-1 min-w-0">
                  {/* Product title + price */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-cyan-600">
                        {product.category || "Fresh Seafood"}
                      </p>

                      <h2 className="mt-1 text-2xl font-extrabold text-gray-800">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        Fresh • Hygienically Packed • Premium Quality
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Price / KG
                      </p>

                      <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-cyan-700">
                        {currency}
                        {product.price}
                      </h3>
                    </div>
                  </div>

                  {/* ==================================================
                      STOCK STATUS
                  ================================================== */}

                  <div className="flex flex-wrap gap-3 mt-5">
                    {stock > 5 && !isOutOfStock && (
                      <span className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        ✓ In Stock
                        <span className="text-green-600">
                          ({stock.toFixed(1)} KG)
                        </span>
                      </span>
                    )}

                    {stock > 0 &&
                      stock <= 5 &&
                      !isOutOfStock && (
                        <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                          ⚠ Only {stock.toFixed(1)} KG left
                        </span>
                      )}

                    {isOutOfStock && (
                      <span className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                        ✕ Currently unavailable
                      </span>
                    )}
                  </div>

                  {/* ==================================================
                      QUANTITY
                  ================================================== */}

                  <div className="mt-7">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Quantity
                        </p>

                        <div className="inline-flex items-center bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                          <button
                            type="button"
                            onClick={() =>
                              handleWeightChange(
                                product,
                                weight,
                                weight - step
                              )
                            }
                            disabled={!canDecrease}
                            aria-label={`Decrease ${product.name} quantity`}
                            className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            <FaMinus className="text-xs" />
                          </button>

                          <div className="min-w-[100px] px-3 text-center font-bold text-gray-800">
                            {weight.toFixed(1)} KG
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleWeightChange(
                                product,
                                weight,
                                weight + step
                              )
                            }
                            disabled={!canIncrease}
                            aria-label={`Increase ${product.name} quantity`}
                            className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaWeightHanging className="text-cyan-600" />

                        <span>
                          Maximum:{" "}
                          <strong className="text-gray-700">
                            {Math.max(0, availableMax).toFixed(1)} KG
                          </strong>
                        </span>
                      </div>
                    </div>

                    {!isOutOfStock && (
                      <p className="mt-3 text-xs text-gray-400">
                        Minimum order: {min} KG • Step: {step} KG
                      </p>
                    )}
                  </div>

                  {/* ==================================================
                      REMOVE
                  ================================================== */}

                  <div className="mt-7 pt-5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleRemove(id)}
                      className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold text-sm transition"
                    >
                      <FaTrash />
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          SUMMARY + CHECKOUT
      ======================================================== */}

      <div className="mt-14 grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Total */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center">
              <FaShoppingCart className="text-cyan-700" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">
                Cart Summary
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Check your order total before proceeding.
              </p>
            </div>
          </div>

          <CartTotal />
        </div>

        {/* Checkout Card */}
        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 text-white rounded-[2rem] shadow-xl p-7 sm:p-8">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-100">
                <FaFish />
                Fresh Seafood
              </span>

              <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold">
                Ready to Checkout?
              </h2>

              <p className="mt-3 text-cyan-100 leading-7 text-sm">
                Your seafood will be freshly packed after your
                order is confirmed.
              </p>

              {/* Benefits */}
              <div className="mt-7 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                    <FaTruck />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Fast Delivery
                    </p>

                    <p className="text-xs text-cyan-100 mt-1">
                      Delivery within available service areas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                    <FaSnowflake />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Freshness Guaranteed
                    </p>

                    <p className="text-xs text-cyan-100 mt-1">
                      Hygienically packed to help preserve freshness.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Secure Checkout
                    </p>

                    <p className="text-xs text-cyan-100 mt-1">
                      Safe payment and protected order processing.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/place-order")}
                className="w-full mt-9 bg-white text-cyan-700 font-extrabold py-4 rounded-2xl hover:bg-cyan-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Proceed to Checkout
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DELIVERY INFORMATION
      ======================================================== */}

      <div className="mt-12 bg-gray-50 border border-gray-100 rounded-[2rem] p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            Delivery Information
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            We focus on keeping your seafood fresh from packing
            to delivery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Fast Delivery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-xl">
              <FaTruck />
            </div>

            <h3 className="font-bold text-lg mt-5">
              Fast Delivery
            </h3>

            <p className="text-gray-500 text-sm leading-6 mt-2">
              Quick and reliable doorstep delivery within
              available service areas.
            </p>
          </div>

          {/* Cold Packed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 text-xl">
              <FaSnowflake />
            </div>

            <h3 className="font-bold text-lg mt-5">
              Freshly Packed
            </h3>

            <p className="text-gray-500 text-sm leading-6 mt-2">
              Seafood is hygienically packed to help maintain
              freshness during transport.
            </p>
          </div>

          {/* Customer Support */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 text-xl">
              <FaShieldAlt />
            </div>

            <h3 className="font-bold text-lg mt-5">
              Customer Support
            </h3>

            <p className="text-gray-500 text-sm leading-6 mt-2">
              Our support team is available to help with your
              order-related questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
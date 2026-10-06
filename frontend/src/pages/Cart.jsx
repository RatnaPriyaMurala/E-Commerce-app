import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaArrowRight,
  FaTruck,
  FaLeaf,
  FaShieldAlt,
  FaCut,
} from "react-icons/fa";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateWeight,
    removeFromCart,
    navigate,
    getPreparationPrice,
  } = useContext(ShopContext);

  const cartData = useMemo(() => {
    const items = [];

    Object.entries(cartItems || {}).forEach(([id, lines]) => {
      const product = products.find((p) => p._id === id);

      if (!product || !lines) return;

      Object.entries(lines).forEach(([lineKey, lineData]) => {
        let weight = 0;
        let quantity = 1;
        let preparation = "";

        // New cart format
        if (lineData && typeof lineData === "object") {
          weight = Number(lineData.weight || 0);
          quantity = Number(lineData.quantity || 1);
          preparation = lineData.preparation || "";
        }

        // Old cart format
        else {
          weight = Number(lineKey || 0);
          quantity = Number(lineData || 1);
        }

        if (weight > 0 && quantity > 0) {
          items.push({
            id,
            product,
            lineKey,
            weight,
            quantity,
            preparation,
          });
        }
      });
    });

    return items;
  }, [cartItems, products]);

  const hasMissingPreparation = cartData.some(
    ({ product, preparation }) => {
      const noPreparationCategories = [
        "Dry Fish",
        "Dry Prawns",
        "Pickles",
      ];

      if (noPreparationCategories.includes(product.category)) {
        return false;
      }

      return (
        Array.isArray(product.preparationOptions) &&
        product.preparationOptions.length > 0 &&
        !preparation
      );
    }
  );

  const handleEditPreparation = (item) => {
    navigate(`/product/${item.id}`, {
      state: {
        editCart: true,
        lineKey: item.lineKey,
        weight: item.weight,
        quantity: item.quantity,
        preparation: item.preparation,
      },
    });
  };

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleWeightChange = (item, newWeight) => {
    const product = item.product;

    const min = Number(product.minQuantity ?? 0.5);
    const maxQuantity = Number(product.maxQuantity ?? 10);
    const stock = Number(product.stock ?? 0);
    const max = Math.min(maxQuantity, stock);

    const step = Number(product.quantityStep ?? 0.5);

    let weight = Number(newWeight);

    if (!Number.isFinite(weight)) return;

    weight = Math.max(min, Math.min(max, weight));

    const steps = Math.round((weight - min) / step);
    weight = min + steps * step;

    weight = Math.max(min, Math.min(max, weight));

    if (weight > stock) {
      toast.error(`Only ${stock} KG available`);
      return;
    }

    updateWeight(item.id, item.lineKey, weight);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.lineKey);
  };

  const handleCheckout = () => {
    if (hasMissingPreparation) {
      toast.error(
        "Please select preparation for all applicable products before checkout."
      );
      return;
    }

    navigate("/place-order");
  };

  if (cartData.length === 0) {
    return (
      <div className="border-t">
        <section className="py-5 text-center sm:py-7">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 sm:h-20 sm:w-20">
            <FaShoppingCart className="text-2xl text-cyan-600 sm:text-3xl" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-gray-800 sm:text-3xl">
            Your Cart is Empty
          </h2>

          <p className="mt-1.5 text-sm text-gray-500">
            Add some fresh seafood to your cart and continue shopping.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 font-semibold text-white transition hover:bg-cyan-700"
          >
            Browse Seafood
            <FaArrowRight className="text-xs" />
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="border-t">
      <section className="py-5 sm:py-7">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Your Shopping Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review your seafood items before placing your order.
          </p>
        </div>

        {/* =====================================================
            PREPARATION WARNING
        ===================================================== */}

        {hasMissingPreparation && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <FaCut className="mt-1 shrink-0 text-amber-600" />

            <div>
              <p className="font-semibold text-amber-800">
                Preparation selection required
              </p>

              <p className="mt-0.5 text-sm text-amber-700">
                Please select preparation for all applicable seafood
                products before checkout.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            CART CONTENT
        ===================================================== */}

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_340px] lg:gap-6">

          {/* ===================================================
              CART ITEMS
          =================================================== */}

          <div className="space-y-3.5">

            {cartData.map((item) => {
              const { product } = item;

              const noPreparationCategories = [
                "Dry Fish",
                "Dry Prawns",
                "Pickles",
              ];

              const hasPreparation =
                !noPreparationCategories.includes(product.category) &&
                Array.isArray(product.preparationOptions) &&
                product.preparationOptions.length > 0;

              const currentPreparationPrice =
                item.lineData?.pricePerKg ||
                getPreparationPrice(product, item.preparation);

              const pricePerKg = Number(
                currentPreparationPrice || product.price || 0
              );

              const lineTotal =
                pricePerKg * item.weight * item.quantity;

              const min = Number(product.minQuantity ?? 0.5);
              const maxQuantity = Number(product.maxQuantity ?? 10);
              const stock = Number(product.stock ?? 0);
              const max = Math.min(maxQuantity, stock);
              const step = Number(product.quantityStep ?? 0.5);

              return (
                <div
                  key={`${item.id}-${item.lineKey}`}
                  className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-4"
                >
                  <div className="flex flex-col gap-3.5 sm:flex-row">

                    {/* PRODUCT IMAGE */}

                    <div
                      className="relative w-full shrink-0 cursor-pointer sm:w-40"
                      onClick={() => handleViewProduct(item.id)}
                    >
                      <img
                        src={
                          Array.isArray(product.image)
                            ? product.image[0]
                            : product.image
                        }
                        alt={product.name}
                        className="h-44 w-full rounded-xl object-cover sm:h-48"
                      />

                      {product.bestseller && (
                        <span className="absolute left-2 top-2 rounded-full bg-cyan-600 px-2 py-1 text-[9px] font-bold text-white">
                          Bestseller
                        </span>
                      )}

                      {stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/55">
                          <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-600">
                            {product.category}
                          </p>

                          <h2
                            className="mt-0.5 cursor-pointer text-lg font-bold text-gray-800 transition hover:text-cyan-700 sm:text-xl"
                            onClick={() => handleViewProduct(item.id)}
                          >
                            {product.name}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100"
                          title="Remove item"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>

                      {/* PREPARATION */}

                      {hasPreparation && (
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center gap-2">
                            <FaCut className="text-xs text-cyan-600" />

                            <span className="text-xs font-semibold text-gray-600">
                              Preparation
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEditPreparation(item)}
                            className={`w-full rounded-xl border px-3 py-2 text-left transition sm:w-auto ${
                              item.preparation
                                ? "border-cyan-200 bg-cyan-50"
                                : "border-amber-300 bg-amber-50"
                            }`}
                          >
                            <span
                              className={`text-xs font-semibold ${
                                item.preparation
                                  ? "text-cyan-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {item.preparation || "Select preparation"}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* QUANTITY / STOCK / TOTAL */}

                      <div className="mt-3 flex flex-wrap items-center gap-2.5">

                        <div>
                          <p className="text-[10px] text-gray-400">
                            Quantity
                          </p>

                          <div className="mt-1 flex items-center overflow-hidden rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() =>
                                handleWeightChange(
                                  item,
                                  item.weight - step
                                )
                              }
                              disabled={item.weight <= min}
                              className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                              <FaMinus className="text-[9px]" />
                            </button>

                            <span className="min-w-14 text-center text-sm font-semibold text-gray-700">
                              {item.weight} KG
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleWeightChange(
                                  item,
                                  item.weight + step
                                )
                              }
                              disabled={item.weight >= max}
                              className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                              <FaPlus className="text-[9px]" />
                            </button>
                          </div>
                        </div>

                        <div className="min-w-[140px] flex-1">
                          <p className="text-[10px] text-gray-400">
                            Stock Status
                          </p>

                          <p
                            className={`mt-1 text-xs font-semibold ${
                              stock > 0
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {stock > 0
                              ? `${stock} KG available`
                              : "Out of stock"}
                          </p>
                        </div>

                        <div className="ml-auto text-right">
                          <p className="text-[10px] text-gray-400">
                            Item Total
                          </p>

                          <p className="mt-1 text-lg font-extrabold text-cyan-700">
                            {currency}
                            {lineTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* BOTTOM INFO */}

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2.5 text-[10px] text-gray-500">
                        <span>
                          {currency}
                          {pricePerKg.toLocaleString("en-IN")} / KG
                        </span>

                        {item.quantity > 1 && (
                          <span>{item.quantity} items</span>
                        )}

                        {hasPreparation && (
                          <button
                            type="button"
                            onClick={() => handleEditPreparation(item)}
                            className="font-semibold text-cyan-700 hover:underline"
                          >
                            Edit Preparation
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <div className="space-y-4">

            {/* TOTAL */}

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <CartTotal />

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={hasMissingPreparation}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${
                    hasMissingPreparation
                      ? "cursor-not-allowed bg-gray-200 text-gray-400"
                      : "bg-cyan-600 text-white hover:bg-cyan-700"
                  }`}
                >
                  {hasMissingPreparation
                    ? "Select Preparation"
                    : "Proceed to Checkout"}

                  {!hasMissingPreparation && (
                    <FaArrowRight className="text-xs" />
                  )}
                </button>
              </div>
            </div>

            {/* SECURITY / FRESHNESS */}

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-cyan-600" />

                <h3 className="font-bold text-gray-800">
                  Secure & Fresh Checkout
                </h3>
              </div>

              <div className="mt-3 space-y-2.5">

                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                    <FaTruck className="text-sm text-cyan-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Delivery
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Fresh seafood delivered carefully to your doorstep.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                    <FaLeaf className="text-sm text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Freshness Focused
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Quality checked before packing and dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                    <FaShieldAlt className="text-sm text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Secure Checkout
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Your order information is handled securely.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BENEFITS
        ===================================================== */}

        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">

            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                <FaTruck className="text-cyan-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Fresh Delivery
                </h3>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  Carefully packed for freshness.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                <FaLeaf className="text-green-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Quality Checked
                </h3>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  Selected with care before dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                <FaShieldAlt className="text-blue-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Safe Ordering
                </h3>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  Secure and simple checkout experience.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
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

  const hasMissingPreparation = cartData.some(({ product, preparation }) => {
    const noPreparationCategories = ["Dry Fish", "Dry Prawns", "Pickles"];

    if (noPreparationCategories.includes(product.category)) {
      return false;
    }

    return (
      Array.isArray(product.preparationOptions) &&
      product.preparationOptions.length > 0 &&
      !preparation
    );
  });

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
        <section className="py-7 sm:py-9 text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-50 flex items-center justify-center">
            <FaShoppingCart className="text-2xl sm:text-3xl text-cyan-600" />
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add some fresh seafood to your cart and continue shopping.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="mt-5 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
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
      <section className="py-7 sm:py-9">
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Your Shopping Cart
          </h1>

          <p className="mt-1.5 text-sm text-gray-500">
            Review your seafood items before placing your order.
          </p>
        </div>

        {hasMissingPreparation && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <FaCut className="text-amber-600 mt-1 shrink-0" />

            <div>
              <p className="font-semibold text-amber-800">
                Preparation selection required
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Please select preparation for all applicable seafood products
                before checkout.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          <div className="space-y-4">
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

              const pricePerKg = Number(currentPreparationPrice || product.price || 0);

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
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div
                      className="relative w-full sm:w-44 shrink-0 cursor-pointer"
                      onClick={() => handleViewProduct(item.id)}
                    >
                      <img
                        src={
                          Array.isArray(product.image)
                            ? product.image[0]
                            : product.image
                        }
                        alt={product.name}
                        className="w-full h-48 sm:h-52 object-cover rounded-xl"
                      />

                      {product.bestseller && (
                        <span className="absolute top-2 left-2 bg-cyan-600 text-white text-[9px] font-bold px-2 py-1 rounded-full">
                          Bestseller
                        </span>
                      )}

                      {stock <= 0 && (
                        <div className="absolute inset-0 rounded-xl bg-black/55 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-cyan-600 font-semibold">
                            {product.category}
                          </p>

                          <h2
                            className="mt-1 text-lg sm:text-xl font-bold text-gray-800 cursor-pointer hover:text-cyan-700 transition"
                            onClick={() => handleViewProduct(item.id)}
                          >
                            {product.name}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition shrink-0"
                          title="Remove item"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>

                      {hasPreparation && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCut className="text-cyan-600 text-xs" />
                            <span className="text-xs font-semibold text-gray-600">
                              Preparation
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEditPreparation(item)}
                            className={`w-full sm:w-auto text-left border rounded-xl px-3 py-2 transition ${
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

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400">
                            Quantity
                          </p>

                          <div className="mt-1 flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                handleWeightChange(
                                  item,
                                  item.weight - step
                                )
                              }
                              disabled={item.weight <= min}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
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
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                              <FaPlus className="text-[9px]" />
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 min-w-[150px]">
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

                      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500">
                        <span>
                          {currency}
                          {pricePerKg.toLocaleString("en-IN")} / KG
                        </span>

                        {item.quantity > 1 && (
                          <span>
                            {item.quantity} items
                          </span>
                        )}

                        {hasPreparation && (
                          <button
                            type="button"
                            onClick={() => handleEditPreparation(item)}
                            className="text-cyan-700 font-semibold hover:underline"
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

          <div className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
              <CartTotal />

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={hasMissingPreparation}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition ${
                    hasMissingPreparation
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
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

            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-cyan-600" />
                <h3 className="font-bold text-gray-800">
                  Secure & Fresh Checkout
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <FaTruck className="text-cyan-600 text-sm" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Delivery
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fresh seafood delivered carefully to your doorstep.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <FaLeaf className="text-green-600 text-sm" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Freshness Focused
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Quality checked before packing and dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <FaShieldAlt className="text-blue-600 text-sm" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Secure Checkout
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Your order information is handled securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-5 sm:p-6">
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <FaTruck className="text-cyan-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Fresh Delivery
                </h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Carefully packed for freshness.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <FaLeaf className="text-green-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Quality Checked
                </h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Selected with care before dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <FaShieldAlt className="text-blue-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Safe Ordering
                </h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">
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
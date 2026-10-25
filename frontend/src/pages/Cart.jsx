import React, { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTrash,
  FaEdit,
  FaFish,
} from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    products = [],
    cartItems = {},
    currency = "₹",
    updateWeight,
    removeFromCart,
    getCartAmount,
  } = useContext(ShopContext);

  const items = useMemo(() => {
    const result = [];
    if (!cartItems || typeof cartItems !== "object") return result;

    Object.entries(cartItems).forEach(([productId, productCart]) => {
      const product = products.find((p) => String(p._id) === String(productId));
      if (!product || !productCart || typeof productCart !== "object") return;

      Object.entries(productCart).forEach(([storedKey, rawLine]) => {
        let line;
        if (rawLine && typeof rawLine === "object" && !Array.isArray(rawLine)) {
          line = { ...rawLine };
        } else {
          const oldWeight = Number(storedKey);
          const oldQuantity = Number(rawLine || 0);
          if (!Number.isFinite(oldWeight) || oldWeight <= 0 || oldQuantity <= 0) return;
          line = { weight: oldWeight, quantity: oldQuantity, preparation: "" };
        }

        const weight = Number(line.weight ?? 0);
        const quantity = Number(line.quantity ?? 1);
        if (!Number.isInteger(weight) || weight < 1 || !Number.isInteger(quantity) || quantity < 1) return;

        const variantId = String(line.variantId || "");
        const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
        const countOptional = /\b(lobster|scampi)\b/i.test(String(product.name || ""));
        const selectedVariant = hasVariants && variantId
          ? product.variants.find((v) => String(v._id || v.id || "") === variantId) || null
          : null;
        const preparation = String(line.preparation || "").trim();
        // Seafood base price is kept separate from the fixed preparation charge.
        // Prawn count variants always take priority over the product's default price.
        const pricePerKg = Number(
          selectedVariant?.pricePerKg ?? line.pricePerKg ?? product.price ?? 0
        );
        const category = String(product.category || "").trim().toLowerCase();
        const requiresPreparation =
          !["boneless", "dry fish", "dry prawns", "pickles"].includes(category) &&
          !String(product.name || "").toLowerCase().includes("boneless");
        const preparationCharge = requiresPreparation ? 40 * weight * quantity : 0;
        const seafoodTotal = (Number.isFinite(pricePerKg) ? pricePerKg : 0) * weight * quantity;
        const lineKey = storedKey || `${weight}-${preparation.toLowerCase().replace(/\s+/g, "-")}`;

        result.push({
          id: product._id,
          product,
          lineKey,
          lineData: line,
          weight,
          quantity,
          preparation,
          variantId,
          variantCount: String(line.variantCount ?? selectedVariant?.count ?? ""),
          selectedVariant,
          hasVariants: hasVariants && !(countOptional && !variantId),
          stock: selectedVariant
            ? Number(selectedVariant.stock ?? 0)
            : Number(product.stock ?? 0),
          pricePerKg: Number.isFinite(pricePerKg) ? pricePerKg : 0,
          requiresPreparation,
          preparationCharge,
          seafoodTotal,
          lineTotal: seafoodTotal + preparationCharge,
        });
      });
    });
    return result;
  }, [cartItems, products]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.seafoodTotal, 0),
    [items]
  );
  const preparationCharge = useMemo(
    () => items.reduce((sum, item) => sum + item.preparationCharge, 0),
    [items]
  );
  const total = subtotal + preparationCharge;

  const changeWeight = async (item, requestedWeight) => {
    const maxWholeKg = Math.floor(Math.min(Number(item.product.maxQuantity ?? 10), item.stock));
    if (maxWholeKg < 1) {
      toast.error("At least 1 KG must be available to order.");
      return;
    }
    const numeric = Number(requestedWeight);
    if (!Number.isFinite(numeric)) return;
    const wholeKg = Math.min(maxWholeKg, Math.max(1, Math.round(numeric)));
    try {
      // The sixth argument is the selected variant ID. ShopContext should accept it
      // and preserve variantId/variantCount when updating a cart line.
      await updateWeight?.(
        item.id,
        item.weight,
        wholeKg,
        item.lineKey,
        item.preparation,
        item.variantId
      );
    } catch (error) {
      console.error("Cart quantity update failed:", error);
      toast.error("Could not update the quantity. Please try again.");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart?.(item.id, item.lineKey, item.preparation, item.variantId);
    } catch (error) {
      console.error("Remove cart item failed:", error);
      toast.error("Could not remove this item. Please try again.");
    }
  };

  const editItem = (item) => {
    navigate(`/product/${item.id}`, {
      state: {
        editCart: true,
        lineKey: item.lineKey,
        weight: item.weight,
        preparation: item.preparation,
        variantId: item.variantId,
        variantCount: item.variantCount,
      },
    });
  };

  if (!items.length) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
          <FaShoppingCart className="text-3xl" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-gray-800">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">Explore our fresh seafood and add your favourite items to your cart.</p>
        <Link to="/menu" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-800">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-5 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Priya Live Fish</p>
          <h1 className="mt-1 text-2xl font-extrabold text-gray-800 sm:text-3xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-gray-500">All orders are in whole kilograms: 1 KG, 2 KG, 3 KG...</p>
        </div>
        <Link to="/menu" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-cyan-300 hover:text-cyan-700">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {items.map((item) => {
            const maxWholeKg = Math.floor(Math.min(Number(item.product.maxQuantity ?? 10), item.stock));
            const image = Array.isArray(item.product.image) ? item.product.image[0] : item.product.image;
            return (
              <article key={`${item.id}-${item.lineKey}-${item.variantId}`} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-28 sm:w-28">
                    {image ? <img src={image} alt={item.product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-cyan-300"><FaFish className="text-3xl" /></div>}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-base font-extrabold text-gray-800 sm:text-lg">{item.product.name}</h2>
                        {item.variantCount && <p className="mt-1 text-xs font-semibold text-orange-700">Prawn Count: {item.variantCount}</p>}
                        {item.preparation && <p className="mt-1 text-xs text-gray-600">Preparation: <span className="font-semibold">{item.preparation}</span></p>}
                        <p className="mt-1 text-xs text-gray-500">{currency}{item.pricePerKg.toLocaleString("en-IN")} / KG</p>
                      </div>
                      <button type="button" onClick={() => handleRemove(item)} aria-label={`Remove ${item.product.name}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><FaTrash /></button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 p-1">
                        <button type="button" onClick={() => changeWeight(item, item.weight - 1)} disabled={item.weight <= 1 || maxWholeKg < 1} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40"><FaMinus className="text-xs" /></button>
                        <span className="min-w-16 text-center text-sm font-extrabold text-gray-800">{item.weight} KG</span>
                        <button type="button" onClick={() => changeWeight(item, item.weight + 1)} disabled={item.weight >= maxWholeKg || maxWholeKg < 1} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-40"><FaPlus className="text-xs" /></button>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-gray-500">Item total{item.requiresPreparation ? " (incl. preparation)" : ""}</p>
                        <p className="text-lg font-extrabold text-cyan-800">{currency}{item.lineTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => editItem(item)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-900"><FaEdit /> Edit preparation / variant</button>
                    {maxWholeKg < 1 && <p className="mt-2 text-xs font-semibold text-red-600">This item currently has less than 1 KG available. Remove it or contact us.</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold text-gray-800">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-800">{currency}{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
            <div className="flex items-center justify-between gap-3 text-gray-600"><span>Preparation &amp; Cleaning Charge</span><span className="font-semibold text-gray-800">{currency}{preparationCharge.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
            <div className="border-t border-dashed border-gray-200 pt-3"><div className="flex items-center justify-between gap-3"><span className="font-bold text-gray-800">Total</span><span className="text-xl font-extrabold text-cyan-800">{currency}{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div></div>
          </div>
          <p className="mt-3 rounded-lg bg-cyan-50 p-3 text-xs leading-5 text-cyan-800">Preparation &amp; Cleaning is ₹40 per KG for eligible fresh seafood. Dry fish, dry prawns, and pickles are excluded. Quantities are whole kilograms only; final prices and stock are verified at checkout.</p>
          <button type="button" onClick={() => navigate("/place-order")} disabled={subtotal <= 0} className="mt-4 w-full rounded-lg bg-cyan-700 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50">PROCEED TO CHECKOUT</button>
          <button type="button" onClick={() => navigate("/menu")} className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Continue Shopping</button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;

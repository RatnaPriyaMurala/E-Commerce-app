import React from "react";
import {
  FaWeightHanging,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const ProductWeightSelector = ({ product, selectedWeight }) => {
  if (!product) return null;

  const min = Number(product.minQuantity ?? 0.5);
  const maxQuantity = Number(product.maxQuantity ?? 10);
  const stock = Number(product.stock ?? 0);

  const max = Math.min(maxQuantity, stock);

  // ============================================================
  // NO WEIGHT SELECTED
  // ============================================================

  if (
    selectedWeight === undefined ||
    selectedWeight === null ||
    selectedWeight === ""
  ) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 p-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
          <FaWeightHanging className="text-sm text-cyan-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">
            Select your quantity
          </p>

          <p className="mt-0.5 text-[11px] text-gray-500">
            Choose between {min} KG and {max} KG
          </p>
        </div>
      </div>
    );
  }

  const weight = Number(selectedWeight);

  // ============================================================
  // OUT OF STOCK
  // ============================================================

  if (stock <= 0) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
          <FaExclamationTriangle className="text-sm text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            Product unavailable
          </p>

          <p className="mt-0.5 text-[11px] text-red-500">
            This product is currently out of stock.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // BELOW MINIMUM
  // ============================================================

  if (weight < min) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
          <FaExclamationTriangle className="text-sm text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            Minimum order is {min} KG
          </p>

          <p className="mt-0.5 text-[11px] text-red-500">
            Please increase the quantity before adding to cart.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ABOVE AVAILABLE STOCK
  // ============================================================

  if (weight > max) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
          <FaExclamationTriangle className="text-sm text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            Maximum available is {max} KG
          </p>

          <p className="mt-0.5 text-[11px] text-red-500">
            Please reduce the quantity to continue.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // VALID WEIGHT
  // ============================================================

  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
        <FaCheckCircle className="text-sm text-green-500" />
      </div>

      <div>
        <p className="text-sm font-semibold text-green-700">
          {weight} KG is available
        </p>

        <p className="mt-0.5 text-[11px] text-green-600">
          Ready to add to your cart.
        </p>
      </div>
    </div>
  );
};

export default ProductWeightSelector;
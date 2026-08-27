import React from "react";
import {
  FaWeightHanging,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const ProductWeightSelector = ({
  product,
  selectedWeight,
}) => {
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
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-cyan-50 border border-cyan-100 p-4">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <FaWeightHanging className="text-cyan-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">
            Select your quantity
          </p>

          <p className="text-xs text-gray-500 mt-1">
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
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <FaExclamationTriangle className="text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            Product unavailable
          </p>

          <p className="text-xs text-red-500 mt-1">
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
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <FaExclamationTriangle className="text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            Minimum order is {min} KG
          </p>

          <p className="text-xs text-red-500 mt-1">
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
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <FaExclamationTriangle className="text-red-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            Maximum available is {max} KG
          </p>

          <p className="text-xs text-red-500 mt-1">
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
    <div className="mt-3 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
        <FaCheckCircle className="text-green-500" />
      </div>

      <div>
        <p className="text-sm font-semibold text-green-700">
          {weight} KG is available
        </p>

        <p className="text-xs text-green-600 mt-1">
          Ready to add to your cart.
        </p>
      </div>
    </div>
  );
};

export default ProductWeightSelector;
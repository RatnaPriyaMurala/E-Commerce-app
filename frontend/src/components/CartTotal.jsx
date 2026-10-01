import React, { useContext } from "react";
import {
  FaReceipt,
  FaTruck,
  FaWallet,
  FaCheckCircle,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const {
    currency = "₹",
    delivery_fee = 0,
    getCartAmount,
  } = useContext(ShopContext);

  const subtotal = Number(getCartAmount?.() || 0);
  const delivery = Number(delivery_fee || 0);

  const total = subtotal > 0 ? subtotal + delivery : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
      {/* =====================================================
          TITLE
      ===================================================== */}

      <Title
        text1="ORDER"
        text2="SUMMARY"
      />

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mt-5 space-y-4">
        {/* SUBTOTAL */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-gray-600">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center">
              <FaReceipt className="text-cyan-600 text-sm" />
            </div>

            <span className="font-medium text-sm">
              Subtotal
            </span>
          </div>

          <span className="font-semibold text-sm text-gray-800">
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* DELIVERY */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-gray-600">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <FaTruck className="text-blue-600 text-sm" />
            </div>

            <div>
              <span className="font-medium block text-sm">
                Delivery
              </span>

              {subtotal > 0 && (
                <span className="text-[11px] text-gray-400">
                  Fresh seafood delivery
                </span>
              )}
            </div>
          </div>

          <span className="font-semibold text-sm text-gray-800">
            {currency}
            {delivery.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* TOTAL */}

        <div className="rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center">
                <FaWallet className="text-white text-sm" />
              </div>

              <div>
                <p className="font-bold text-sm text-gray-800">
                  Total Amount
                </p>

                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-green-600">
                  <FaCheckCircle />
                  Secure checkout
                </div>
              </div>
            </div>

            <span className="text-lg sm:text-xl font-extrabold text-cyan-700">
              {currency}
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          NOTE
      ===================================================== */}

      {subtotal > 0 && (
        <p className="mt-4 text-[11px] sm:text-xs text-gray-400 text-center leading-5">
          Final delivery charges may vary depending on your
          delivery location.
        </p>
      )}
    </div>
  );
};

export default CartTotal;
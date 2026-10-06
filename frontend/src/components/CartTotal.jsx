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
    <div className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
      {/* =====================================================
          TITLE
      ===================================================== */}

      <Title text1="ORDER" text2="SUMMARY" />

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mt-4 space-y-3">
        {/* SUBTOTAL */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-gray-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
              <FaReceipt className="text-xs text-cyan-600" />
            </div>

            <span className="text-sm font-medium">
              Subtotal
            </span>
          </div>

          <span className="text-sm font-semibold text-gray-800">
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* DELIVERY */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-gray-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <FaTruck className="text-xs text-blue-600" />
            </div>

            <div>
              <span className="block text-sm font-medium">
                Delivery
              </span>

              {subtotal > 0 && (
                <span className="text-[10px] text-gray-400">
                  Fresh seafood delivery
                </span>
              )}
            </div>
          </div>

          <span className="text-sm font-semibold text-gray-800">
            {currency}
            {delivery.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* TOTAL */}

        <div className="rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600">
                <FaWallet className="text-xs text-white" />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">
                  Total Amount
                </p>

                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-green-600">
                  <FaCheckCircle />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>

            <span className="text-lg font-extrabold text-cyan-700 sm:text-xl">
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
        <p className="mt-3 text-center text-[10px] leading-4 text-gray-400 sm:text-[11px]">
          Final delivery charges may vary depending on your
          delivery location.
        </p>
      )}
    </div>
  );
};

export default CartTotal;
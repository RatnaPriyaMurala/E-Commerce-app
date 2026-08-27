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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
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

      <div className="mt-8 space-y-5">
        {/* SUBTOTAL */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <FaReceipt className="text-cyan-600" />
            </div>

            <span className="font-medium">
              Subtotal
            </span>
          </div>

          <span className="font-semibold text-gray-800">
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* DELIVERY */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FaTruck className="text-blue-600" />
            </div>

            <div>
              <span className="font-medium block">
                Delivery
              </span>

              {subtotal > 0 && (
                <span className="text-xs text-gray-400">
                  Fresh seafood delivery
                </span>
              )}
            </div>
          </div>

          <span className="font-semibold text-gray-800">
            {currency}
            {delivery.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* TOTAL */}

        <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-600 flex items-center justify-center">
                <FaWallet className="text-white" />
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  Total Amount
                </p>

                <div className="flex items-center gap-1.5 mt-1 text-xs text-green-600">
                  <FaCheckCircle />
                  Secure checkout
                </div>
              </div>
            </div>

            <span className="text-xl sm:text-2xl font-extrabold text-cyan-700">
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
        <p className="mt-6 text-xs sm:text-sm text-gray-400 text-center leading-5">
          Final delivery charges may vary depending on your
          delivery location.
        </p>
      )}
    </div>
  );
};

export default CartTotal;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-7 text-center shadow-lg sm:p-9">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 sm:h-20 sm:w-20">
          <FaCheckCircle className="text-5xl text-green-600 sm:text-6xl" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-800 sm:text-3xl">
          Payment Successful
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          Thank you for shopping with us. Your order has been placed
          successfully.
        </p>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mx-auto mt-6 flex items-center gap-2.5 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105 hover:bg-green-700"
        >
          <FaShoppingBag />
          View Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

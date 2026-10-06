
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle, FaRedo } from "react-icons/fa";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-lg sm:p-9">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 sm:h-20 sm:w-20">
          <FaTimesCircle className="text-5xl text-red-600 sm:text-6xl" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-800 sm:text-3xl">
          Payment Failed
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          Something went wrong while processing your payment. Please try again.
        </p>

        <button
          type="button"
          onClick={() => navigate("/place-order")}
          className="mx-auto mt-6 flex items-center gap-2.5 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105 hover:bg-red-700"
        >
          <FaRedo />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;


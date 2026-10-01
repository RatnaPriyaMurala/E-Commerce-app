import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimesCircle,
  FaRedo,
} from "react-icons/fa";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-7 sm:p-9 max-w-md w-full text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <FaTimesCircle className="text-5xl sm:text-6xl text-red-600" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mt-5 text-gray-800">
          Payment Failed
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-3 leading-6">
          Something went wrong while processing your payment.
          Please try again.
        </p>

        <button
          onClick={() => navigate("/place-order")}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2.5 mx-auto text-sm font-semibold transition hover:scale-105"
        >
          <FaRedo />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
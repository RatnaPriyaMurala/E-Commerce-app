import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimesCircle,
  FaRedo,
} from "react-icons/fa";

const PaymentFailed = () => {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-100 via-white to-orange-100 px-6">

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">

        <FaTimesCircle className="mx-auto text-7xl text-red-600" />

        <h1 className="text-4xl font-bold mt-6">
          Payment Failed
        </h1>

        <p className="text-gray-500 mt-5 leading-7">
          Something went wrong while processing your payment.
          Please try again.
        </p>

        <button
          onClick={() => navigate("/place-order")}
          className="mt-10 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto"
        >
          <FaRedo />
          Try Again
        </button>

      </div>

    </div>

  );
};

export default PaymentFailed;
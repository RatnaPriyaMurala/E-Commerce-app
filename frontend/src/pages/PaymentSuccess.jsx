import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaShoppingBag,
} from "react-icons/fa";

const PaymentSuccess = () => {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 via-white to-emerald-100 px-6">

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">

        <FaCheckCircle className="mx-auto text-7xl text-green-600" />

        <h1 className="text-4xl font-bold mt-6">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-5 leading-7">
          Thank you for shopping with us.
          Your order has been placed successfully.
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-10 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto"
        >
          <FaShoppingBag />
          View Orders
        </button>

      </div>

    </div>

  );

};

export default PaymentSuccess;
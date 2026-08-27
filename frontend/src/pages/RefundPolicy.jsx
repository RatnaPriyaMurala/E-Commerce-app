import React from "react";
import {
  FaUndo,
  FaMoneyBillWave,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import Title from "../components/Title";

const RefundPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-5 py-14">

      <div className="text-center mb-12">

        <Title text1="REFUND" text2="POLICY" />

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Customer satisfaction is important to us. Please read our refund
          policy carefully.
        </p>

      </div>

      <div className="space-y-8">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaUndo className="text-5xl text-teal-600 mb-4" />

          <h3 className="text-xl font-bold mb-3">
            Refund Eligibility
          </h3>

          <p className="text-gray-600">
            Refunds may be provided if the product delivered is damaged,
            spoiled, or significantly different from your order.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaMoneyBillWave className="text-5xl text-green-600 mb-4" />

          <h3 className="text-xl font-bold mb-3">
            Refund Processing
          </h3>

          <p className="text-gray-600">
            Approved refunds are processed back to the original payment method
            within a few business days.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaExclamationCircle className="text-5xl text-red-500 mb-4" />

          <h3 className="text-xl font-bold mb-3">
            Non-Refundable Cases
          </h3>

          <p className="text-gray-600">
            Refunds are not applicable for incorrect customer information,
            unavailable recipients, or misuse of products after delivery.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaCheckCircle className="text-5xl text-blue-600 mb-4" />

          <h3 className="text-xl font-bold mb-3">
            Need Help?
          </h3>

          <p className="text-gray-600">
            Contact our customer support with your order ID if you experience
            any issues.
          </p>

        </div>

      </div>

    </div>
  );
};

export default RefundPolicy;
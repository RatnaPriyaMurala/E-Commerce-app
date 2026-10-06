
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
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-7 sm:py-9">
      <div className="text-center mb-6 sm:mb-7">
        <Title text1="REFUND" text2="POLICY" />
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-xs sm:text-sm leading-5">
          Customer satisfaction is important to us. Please read our refund
          policy carefully.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaUndo className="text-3xl sm:text-4xl text-teal-600 mb-3" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Refund Eligibility
          </h3>
          <p className="text-gray-600 text-sm leading-6">
            Refunds may be provided if the product delivered is damaged,
            spoiled, or significantly different from your order.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaMoneyBillWave className="text-3xl sm:text-4xl text-green-600 mb-3" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Refund Processing
          </h3>
          <p className="text-gray-600 text-sm leading-6">
            Approved refunds are processed back to the original payment method
            within a few business days.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaExclamationCircle className="text-3xl sm:text-4xl text-red-500 mb-3" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Non-Refundable Cases
          </h3>
          <p className="text-gray-600 text-sm leading-6">
            Refunds are not applicable for incorrect customer information,
            unavailable recipients, or misuse of products after delivery.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaCheckCircle className="text-3xl sm:text-4xl text-blue-600 mb-3" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 text-sm leading-6">
            Contact our customer support with your order ID if you experience
            any issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

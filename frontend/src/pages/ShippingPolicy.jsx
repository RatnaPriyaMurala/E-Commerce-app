import React from "react";
import {
  FaShippingFast,
  FaClock,
  FaMapMarkedAlt,
  FaBoxOpen,
} from "react-icons/fa";
import Title from "../components/Title";

const ShippingPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-7 sm:py-9">

      <div className="text-center mb-6 sm:mb-7">
        <Title text1="SHIPPING" text2="POLICY" />

        <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-xs sm:text-sm leading-5">
          We deliver fresh seafood with maximum care to ensure it reaches you
          in perfect condition.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-5">

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaShippingFast className="text-3xl sm:text-4xl text-teal-600 mb-3" />

          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Fast Delivery
          </h3>

          <p className="text-gray-600 text-sm leading-6">
            Orders are dispatched as quickly as possible after confirmation.
            Delivery timing depends on your location.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaClock className="text-3xl sm:text-4xl text-cyan-600 mb-3" />

          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Delivery Time
          </h3>

          <p className="text-gray-600 text-sm leading-6">
            Most orders are delivered within the estimated delivery window
            shown during checkout.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaMapMarkedAlt className="text-3xl sm:text-4xl text-blue-600 mb-3" />

          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Service Locations
          </h3>

          <p className="text-gray-600 text-sm leading-6">
            Delivery availability depends on your area. We continuously expand
            our service locations.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <FaBoxOpen className="text-3xl sm:text-4xl text-green-600 mb-3" />

          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Packaging
          </h3>

          <p className="text-gray-600 text-sm leading-6">
            Fresh seafood is packed hygienically using insulated packaging to
            maintain freshness throughout transit.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ShippingPolicy;
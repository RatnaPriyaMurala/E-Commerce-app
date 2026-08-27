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
    <div className="max-w-6xl mx-auto px-5 py-14">

      <div className="text-center mb-12">

        <Title text1="SHIPPING" text2="POLICY" />

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          We deliver fresh seafood with maximum care to ensure it reaches you
          in perfect condition.
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaShippingFast className="text-5xl text-teal-600 mb-5" />

          <h3 className="text-xl font-bold mb-4">
            Fast Delivery
          </h3>

          <p className="text-gray-600">
            Orders are dispatched as quickly as possible after confirmation.
            Delivery timing depends on your location.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaClock className="text-5xl text-cyan-600 mb-5" />

          <h3 className="text-xl font-bold mb-4">
            Delivery Time
          </h3>

          <p className="text-gray-600">
            Most orders are delivered within the estimated delivery window
            shown during checkout.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaMapMarkedAlt className="text-5xl text-blue-600 mb-5" />

          <h3 className="text-xl font-bold mb-4">
            Service Locations
          </h3>

          <p className="text-gray-600">
            Delivery availability depends on your area. We continuously expand
            our service locations.
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <FaBoxOpen className="text-5xl text-green-600 mb-5" />

          <h3 className="text-xl font-bold mb-4">
            Packaging
          </h3>

          <p className="text-gray-600">
            Fresh seafood is packed hygienically using insulated packaging to
            maintain freshness throughout transit.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ShippingPolicy;
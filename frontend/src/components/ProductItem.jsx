import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaFish,
  FaCheckCircle,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  const displayImage = Array.isArray(image) ? image[0] : image;

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    >
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={name || "Fresh seafood"}
          loading="lazy"
          className="w-full h-56 sm:h-60 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Fresh Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-cyan-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          <FaFish className="text-cyan-600" />
          Fresh
        </div>

        {/* Quality Badge */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md">
          <FaCheckCircle className="text-green-500" />
        </div>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="p-5">
        {/* Product Name */}
        <h3
          className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-cyan-700 transition-colors duration-300"
          title={name}
        >
          {name}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-sm text-gray-500">
          Premium quality seafood
        </p>

        {/* Price + Arrow */}
        <div className="flex items-end justify-between gap-3 mt-5">
          <div>
            <p className="text-xs text-gray-400 font-medium">
              Starting from
            </p>

            <p className="mt-1 text-2xl font-extrabold text-cyan-700">
              {currency}
              {price}
              <span className="text-xs font-medium text-gray-400 ml-1">
                / KG
              </span>
            </p>
          </div>

          {/* View Product */}
          <div className="shrink-0 w-11 h-11 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-md group-hover:bg-blue-700 group-hover:scale-110 transition-all duration-300">
            <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Information */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <FaCheckCircle className="text-green-500" />
            Quality Checked
          </span>

          <span className="text-cyan-700 font-semibold group-hover:underline">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
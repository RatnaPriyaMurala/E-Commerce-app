import React, { useContext } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaFish,
  FaCheckCircle,
  FaCut,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";

const ProductItem = ({
  id,
  image,
  name,
  price,
  preparationOptions = [],
}) => {
  const { currency } =
    useContext(ShopContext);

  const displayImage = Array.isArray(image)
    ? image[0]
    : image;

  const getPreparationName = (option) => {
    if (typeof option === "string") {
      return option;
    }

    if (
      option &&
      typeof option === "object"
    ) {
      return option.name || "";
    }

    return "";
  };

  const validPreparationNames =
    Array.isArray(preparationOptions)
      ? preparationOptions
          .map(getPreparationName)
          .filter(Boolean)
      : [];

  const hasPreparationOptions =
    validPreparationNames.length > 0;

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* IMAGE */}

      <div className="relative overflow-hidden bg-gray-100">

        {displayImage ? (
          <img
            src={displayImage}
            alt={
              name || "Fresh seafood"
            }
            loading="lazy"
            className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-44 sm:h-52 flex items-center justify-center bg-cyan-50">
            <FaFish className="text-5xl text-cyan-300" />
          </div>
        )}

        {/* Fresh badge */}

        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-white/95 text-cyan-700 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow">
          <FaFish />
          Fresh
        </div>

        {/* Quality */}

        <div
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow"
          title="Quality Checked"
        >
          <FaCheckCircle className="text-green-500 text-xs" />
        </div>

        {/* Preparation */}

        {hasPreparationOptions && (
          <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-black/65 text-white text-[9px] font-semibold px-2 py-1 rounded-full">
            <FaCut className="text-cyan-300" />
            Preparation Available
          </div>
        )}
      </div>

      {/* INFORMATION */}

      <div className="p-3.5">

        <h3
          className="font-bold text-base text-gray-800 line-clamp-1 group-hover:text-cyan-700 transition"
          title={name}
        >
          {name || "Seafood Product"}
        </h3>

        <p className="mt-1 text-[11px] text-gray-500 line-clamp-1">
          Quality seafood, carefully selected for your order
        </p>

        {hasPreparationOptions && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500">
            <FaCut className="text-cyan-600 shrink-0" />

            <span className="line-clamp-1">
              {validPreparationNames
                .slice(0, 2)
                .join(" • ")}

              {validPreparationNames.length >
                2 && " • More"}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between gap-2 mt-3">

          <div>
            <p className="text-[9px] text-gray-400">
              Starting from
            </p>

            <p className="mt-0.5 text-xl font-extrabold text-cyan-700">
              {currency}
              {Number(
                price || 0
              ).toLocaleString("en-IN")}

              <span className="text-[10px] font-medium text-gray-400 ml-1">
                / KG
              </span>
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition">
            <FaArrowRight className="text-xs" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-500">
          <span className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500" />
            Quality Checked
          </span>

          <span className="text-cyan-700 font-semibold">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
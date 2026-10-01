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
  const { currency } = useContext(ShopContext);

  /* ============================================================
     IMAGE
  ============================================================ */

  const displayImage = Array.isArray(image)
    ? image[0]
    : image;

  /* ============================================================
     PREPARATION OPTIONS
  ============================================================ */

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

  /* ============================================================
     PRODUCT CARD
  ============================================================ */

  return (
    <Link
      to={`/product/${id}`}
      className="
        group
        block
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative overflow-hidden bg-gray-100">

        {displayImage ? (
          <img
            src={displayImage}
            alt={name || "Fresh seafood"}
            loading="lazy"
            className="
              h-32
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
              sm:h-44
            "
          />
        ) : (
          <div
            className="
              flex
              h-32
              w-full
              items-center
              justify-center
              bg-cyan-50
              sm:h-44
            "
          >
            <FaFish className="text-5xl text-cyan-300" />
          </div>
        )}

        {/* ==================================================
            FRESH BADGE
        ================================================== */}

        <div
          className="
            absolute
            left-2
            top-2
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-white/95
            px-2
            py-1
            text-[8px]
            font-bold
            text-cyan-700
            shadow
            sm:left-2.5
            sm:top-2.5
            sm:text-[10px]
          "
        >
          <FaFish />

          <span>
            Fresh
          </span>
        </div>

        {/* ==================================================
            QUALITY CHECKED
        ================================================== */}

        <div
          className="
            absolute
            right-2
            top-2
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white/95
            shadow
            sm:right-2.5
            sm:top-2.5
            sm:h-7
            sm:w-7
          "
          title="Quality Checked"
        >
          <FaCheckCircle className="text-[10px] text-green-500 sm:text-xs" />
        </div>

        {/* ==================================================
            PREPARATION AVAILABLE
        ================================================== */}

        {hasPreparationOptions && (
          <div
            className="
              absolute
              bottom-2
              left-2
              inline-flex
              max-w-[calc(100%-1rem)]
              items-center
              gap-1
              rounded-full
              bg-black/65
              px-2
              py-1
              text-[8px]
              font-semibold
              text-white
              backdrop-blur-sm
              sm:bottom-2.5
              sm:left-2.5
              sm:text-[9px]
            "
          >
            <FaCut className="shrink-0 text-[9px] text-cyan-300" />

            <span className="truncate">
              Preparation Available
            </span>
          </div>
        )}
      </div>

      {/* ======================================================
          PRODUCT INFORMATION
      ====================================================== */}

      <div className="p-2.5 sm:p-3">

        {/* PRODUCT NAME */}

        <h3
          className="
            line-clamp-1
            text-sm
            font-bold
            text-gray-800
            transition
            group-hover:text-cyan-700
            sm:text-base
          "
          title={name}
        >
          {name || "Seafood Product"}
        </h3>

        {/* ====================================================
            PREPARATION OPTIONS

            Useful information, but kept compact.
        ==================================================== */}

        {hasPreparationOptions && (
          <div className="mt-1.5 flex items-center gap-1 text-[9px] text-gray-500 sm:mt-2 sm:text-[10px]">
            <FaCut className="shrink-0 text-cyan-600" />

            <span className="line-clamp-1">
              {validPreparationNames
                .slice(0, 2)
                .join(" • ")}

              {validPreparationNames.length > 2 &&
                " • More"}
            </span>
          </div>
        )}

        {/* ====================================================
            PRICE + VIEW BUTTON
        ==================================================== */}

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            gap-2
            sm:mt-2.5
          "
        >
          {/* PRICE */}

          <div className="min-w-0">

            <p className="text-[8px] text-gray-400 sm:text-[9px]">
              Starting from
            </p>

            <p
              className="
                mt-0.5
                whitespace-nowrap
                text-lg
                font-extrabold
                text-cyan-700
                sm:text-xl
              "
            >
              {currency}
              {Number(price || 0).toLocaleString("en-IN")}

              <span
                className="
                  ml-1
                  text-[9px]
                  font-medium
                  text-gray-400
                  sm:text-[10px]
                "
              >
                / KG
              </span>
            </p>
          </div>

          {/* VIEW BUTTON */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-cyan-600
              text-white
              transition
              group-hover:bg-blue-700
              sm:h-9
              sm:w-9
            "
          >
            <FaArrowRight className="text-[10px] sm:text-xs" />
          </div>
        </div>

        {/* ====================================================
            DESKTOP-ONLY SUPPORTING INFORMATION

            Hidden on mobile to keep cards compact.
        ==================================================== */}

        <div
          className="
            mt-2.5
            hidden
            items-center
            justify-between
            border-t
            border-gray-100
            pt-2
            text-[9px]
            text-gray-500
            sm:flex
          "
        >
          <span className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500" />

            Quality Checked
          </span>

          <span className="font-semibold text-cyan-700">
            View Details
          </span>
        </div>

      </div>
    </Link>
  );
};

export default ProductItem;
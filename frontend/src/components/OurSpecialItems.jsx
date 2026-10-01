import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import {
  FaFish,
  FaStar,
  FaAward,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const OurSpecialItems = () => {
  const { products } = useContext(ShopContext);

  const [specialItem, setSpecialItem] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const foundItem = products.find((item) =>
        item.name?.toLowerCase().includes("elesha")
      );

      setSpecialItem(foundItem || null);
    }
  }, [products]);

  // Don't render anything while products are still loading
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-6 sm:mt-8 py-8 sm:py-10 px-3 sm:px-5 lg:px-6 overflow-hidden">

      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="absolute top-10 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 -right-24 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 text-center mb-6 sm:mb-7">

        {/* Badge */}

        <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3.5 py-1.5 rounded-full border border-cyan-200 shadow-sm">

          <FaAward className="text-cyan-600 text-sm" />

          <span className="font-semibold text-xs sm:text-sm">
            Chef's Recommendation
          </span>

          <FaStar className="text-yellow-400 text-xs" />

        </div>

        {/* Heading */}

        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">

          Our Signature{" "}

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Seafood
          </span>

        </h2>

        {/* Description */}

        <p className="mt-2 max-w-2xl mx-auto text-xs sm:text-sm text-gray-500 leading-5 px-2">
          A premium selection loved by seafood enthusiasts. Freshly sourced,
          naturally delicious and carefully packed to preserve its authentic
          taste.
        </p>

      </div>

      {/* =========================================================
          SPECIAL PRODUCT
      ========================================================= */}

      {specialItem ? (

        <div className="relative z-10 max-w-7xl mx-auto bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 rounded-2xl overflow-hidden shadow-2xl">

          {/* Decorative circles */}

          <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 items-center">

            {/* =====================================================
                LEFT CONTENT
            ===================================================== */}

            <div className="p-5 sm:p-7 lg:p-10 text-white">

              {/* Premium label */}

              <div className="inline-flex items-center gap-2.5 mb-4">

                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <FaFish className="text-lg text-cyan-200" />
                </div>

                <div>

                  <p className="text-cyan-200 text-[10px] uppercase tracking-wider font-semibold">
                    Premium Selection
                  </p>

                  <p className="text-xs sm:text-sm font-semibold">
                    Fresh Catch of the Day
                  </p>

                </div>

              </div>

              {/* Product name */}

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                {specialItem.name}
              </h2>

              {/* Short divider */}

              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mt-4" />

              {/* Description */}

              <p className="mt-4 text-cyan-100 text-xs sm:text-sm leading-6 max-w-xl">
                {specialItem.overview ||
                  "Rich in Omega-3, packed with protein and perfect for delicious family meals. Carefully selected every morning from trusted fishermen."}
              </p>

              {/* =================================================
                  PRICE + RATING
              ================================================= */}

              <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-6">

                {/* Price */}

                <div>

                  <p className="text-cyan-200 text-[10px] uppercase tracking-wider mb-1">
                    Starting Price
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-extrabold">
                    ₹{specialItem.price}
                  </h3>

                </div>

                {/* Rating Divider */}

                <div className="h-10 w-px bg-white/20 hidden sm:block" />

                {/* Rating */}

                <div>

                  <p className="text-cyan-200 text-[10px] uppercase tracking-wider mb-1">
                    Customer Rating
                  </p>

                  <div className="flex items-center gap-2">

                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      4.9
                    </h3>

                    <FaStar className="text-yellow-400 text-lg" />

                  </div>

                </div>

              </div>

              {/* =================================================
                  FEATURES
              ================================================= */}

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Fresh Catch</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Hygienically Packed</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Quality Assured</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Same Day Delivery</span>
                </div>

              </div>

              {/* Bottom message */}

              <div className="mt-6 inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-100">

                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                Fresh seafood selected for your family

              </div>

            </div>

            {/* =====================================================
                RIGHT PRODUCT CARD
            ===================================================== */}

            <div className="p-4 sm:p-6 lg:p-9">

              <div className="relative max-w-md mx-auto">

                {/* Featured badge */}

                <div className="absolute top-3 left-3 z-20">

                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full shadow-xl shadow-yellow-900/20">

                    <FaStar className="text-yellow-100" />

                    Featured Product

                  </div>

                </div>

                {/* Product card */}

                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">

                  <ProductItem
                    id={specialItem._id}
                    image={specialItem.image}
                    name={specialItem.name}
                    price={specialItem.price}
                  />

                </div>

                {/* Premium floating label */}

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap">

                  <FaAward className="text-cyan-600" />

                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700">
                    Chef's Special Choice
                  </span>

                </div>

              </div>

            </div>

          </div>
        </div>

      ) : (

        /* =========================================================
           NO SPECIAL ITEM FALLBACK
        ========================================================= */

        <div className="relative z-10 max-w-3xl mx-auto text-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 p-7 sm:p-10">

          <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-md flex items-center justify-center">

            <FaFish className="text-2xl text-cyan-600" />

          </div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            Our Signature Seafood Is Coming Soon
          </h3>

          <p className="mt-2 text-sm text-gray-500 leading-6 max-w-lg mx-auto">
            We're preparing a special seafood selection for you. Check back
            soon for our chef's recommendation.
          </p>

        </div>
      )}

      {/* =========================================================
          BOTTOM TRUST MESSAGE
      ========================================================= */}

      {specialItem && (

        <div className="relative z-10 max-w-4xl mx-auto mt-7">

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-gray-500">

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-600" />
              <span>Freshly Sourced</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-600" />
              <span>Premium Quality</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-600" />
              <span>Hygienically Packed</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-600" />
              <span>Family Favourite</span>
            </div>

          </div>

          <div className="flex justify-center mt-4">

            <div className="inline-flex items-center gap-2 text-cyan-700 font-semibold text-xs sm:text-sm">
              <span>Premium taste, straight from the sea</span>
              <FaArrowRight className="text-xs" />
            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default OurSpecialItems;
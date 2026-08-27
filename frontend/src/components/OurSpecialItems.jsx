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
    <section className="relative mt-16 sm:mt-20 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="absolute top-10 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 -right-24 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 text-center mb-12 sm:mb-14">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-cyan-100 text-cyan-700 px-4 sm:px-5 py-2 rounded-full border border-cyan-200 shadow-sm">
          <FaAward className="text-cyan-600" />

          <span className="font-semibold text-sm sm:text-base">
            Chef's Recommendation
          </span>

          <FaStar className="text-yellow-400 text-sm" />
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
          Our Signature{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Seafood
          </span>
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-gray-500 leading-7 px-2">
          A premium selection loved by seafood enthusiasts. Freshly sourced,
          naturally delicious and carefully packed to preserve its authentic
          taste.
        </p>
      </div>

      {/* =========================================================
          SPECIAL PRODUCT
      ========================================================= */}

      {specialItem ? (
        <div className="relative z-10 max-w-7xl mx-auto bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 rounded-[2rem] overflow-hidden shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 items-center">
            {/* =====================================================
                LEFT CONTENT
            ===================================================== */}

            <div className="p-7 sm:p-10 lg:p-14 text-white">
              {/* Premium label */}
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <FaFish className="text-xl text-cyan-200" />
                </div>

                <div>
                  <p className="text-cyan-200 text-xs uppercase tracking-wider font-semibold">
                    Premium Selection
                  </p>

                  <p className="text-sm sm:text-base font-semibold">
                    Fresh Catch of the Day
                  </p>
                </div>
              </div>

              {/* Product name */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                {specialItem.name}
              </h2>

              {/* Short divider */}
              <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mt-6" />

              {/* Description */}
              <p className="mt-6 text-cyan-100 text-sm sm:text-base leading-7 max-w-xl">
                {specialItem.overview ||
                  "Rich in Omega-3, packed with protein and perfect for delicious family meals. Carefully selected every morning from trusted fishermen."}
              </p>

              {/* =================================================
                  PRICE + RATING
              ================================================= */}

              <div className="flex flex-wrap items-center gap-8 sm:gap-12 mt-8">
                {/* Price */}
                <div>
                  <p className="text-cyan-200 text-xs uppercase tracking-wider mb-1">
                    Starting Price
                  </p>

                  <h3 className="text-3xl sm:text-4xl font-extrabold">
                    ₹{specialItem.price}
                  </h3>
                </div>

                {/* Rating */}
                <div className="h-12 w-px bg-white/20 hidden sm:block" />

                <div>
                  <p className="text-cyan-200 text-xs uppercase tracking-wider mb-1">
                    Customer Rating
                  </p>

                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl sm:text-4xl font-extrabold">
                      4.9
                    </h3>

                    <FaStar className="text-yellow-400 text-xl" />
                  </div>
                </div>
              </div>

              {/* =================================================
                  FEATURES
              ================================================= */}

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Fresh Catch</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Hygienically Packed</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Quality Assured</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-cyan-50">
                  <FaCheckCircle className="text-green-300" />
                  <span>Same Day Delivery</span>
                </div>
              </div>

              {/* Bottom message */}
              <div className="mt-9 inline-flex items-center gap-2 text-sm text-cyan-100">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                Fresh seafood selected for your family
              </div>
            </div>

            {/* =====================================================
                RIGHT PRODUCT CARD
            ===================================================== */}

            <div className="p-5 sm:p-8 lg:p-12">
              <div className="relative max-w-md mx-auto">
                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full shadow-xl shadow-yellow-900/20">
                    <FaStar className="text-yellow-100" />
                    Featured Product
                  </div>
                </div>

                {/* Product card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
                  <ProductItem
                    id={specialItem._id}
                    image={specialItem.image}
                    name={specialItem.name}
                    price={specialItem.price}
                  />
                </div>

                {/* Premium floating label */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 rounded-full px-5 py-2.5 flex items-center gap-2 whitespace-nowrap">
                  <FaAward className="text-cyan-600" />

                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
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

        <div className="relative z-10 max-w-3xl mx-auto text-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border border-cyan-100 p-10 sm:p-14">
          <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-md flex items-center justify-center">
            <FaFish className="text-3xl text-cyan-600" />
          </div>

          <h3 className="mt-6 text-2xl font-bold text-gray-800">
            Our Signature Seafood Is Coming Soon
          </h3>

          <p className="mt-3 text-gray-500 leading-7 max-w-lg mx-auto">
            We're preparing a special seafood selection for you. Check back
            soon for our chef's recommendation.
          </p>
        </div>
      )}

      {/* =========================================================
          BOTTOM TRUST MESSAGE
      ========================================================= */}

      {specialItem && (
        <div className="relative z-10 max-w-4xl mx-auto mt-12">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
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

          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 text-cyan-700 font-semibold text-sm">
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
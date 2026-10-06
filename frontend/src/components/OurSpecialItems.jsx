
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
    <section className="relative overflow-hidden">

      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-0 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />


      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 mb-5 text-center sm:mb-6">

        {/* Badge */}

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-100 px-3.5 py-1.5 text-cyan-700 shadow-sm">

          <FaAward className="text-sm text-cyan-600" />

          <span className="text-xs font-semibold sm:text-sm">
            Chef's Recommendation
          </span>

          <FaStar className="text-xs text-yellow-400" />

        </div>


        {/* Heading */}

        <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl lg:text-4xl">

          Our Signature{" "}

          <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Seafood
          </span>

        </h2>


        {/* Description */}

        <p className="mx-auto mt-1.5 max-w-2xl px-2 text-xs leading-5 text-gray-500 sm:text-sm">
          A premium selection loved by seafood enthusiasts. Freshly sourced,
          naturally delicious and carefully packed to preserve its authentic
          taste.
        </p>

      </div>


      {/* =========================================================
          SPECIAL PRODUCT
      ========================================================= */}

      {specialItem ? (

        <div className="relative z-10 mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 shadow-2xl">

          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-2xl" />


          <div className="relative grid items-center lg:grid-cols-2">

            {/* =====================================================
                LEFT CONTENT
            ===================================================== */}

            <div className="p-5 text-white sm:p-6 lg:p-8">

              {/* Premium label */}

              <div className="mb-3 inline-flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">

                  <FaFish className="text-lg text-cyan-200" />

                </div>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                    Premium Selection
                  </p>

                  <p className="text-xs font-semibold sm:text-sm">
                    Fresh Catch of the Day
                  </p>

                </div>

              </div>


              {/* Product name */}

              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {specialItem.name}
              </h2>


              {/* Short divider */}

              <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400" />


              {/* Description */}

              <p className="mt-3 max-w-xl text-xs leading-5 text-cyan-100 sm:text-sm sm:leading-6">
                {specialItem.overview ||
                  "Rich in Omega-3, packed with protein and perfect for delicious family meals. Carefully selected every morning from trusted fishermen."}
              </p>


              {/* =================================================
                  PRICE + RATING
              ================================================= */}

              <div className="mt-4 flex flex-wrap items-center gap-5 sm:gap-8">

                {/* Price */}

                <div>

                  <p className="mb-1 text-[10px] uppercase tracking-wider text-cyan-200">
                    Starting Price
                  </p>

                  <h3 className="text-2xl font-extrabold sm:text-3xl">
                    ₹{specialItem.price}
                  </h3>

                </div>


                {/* Rating Divider */}

                <div className="hidden h-9 w-px bg-white/20 sm:block" />


                {/* Rating */}

                <div>

                  <p className="mb-1 text-[10px] uppercase tracking-wider text-cyan-200">
                    Customer Rating
                  </p>

                  <div className="flex items-center gap-2">

                    <h3 className="text-2xl font-extrabold sm:text-3xl">
                      4.9
                    </h3>

                    <FaStar className="text-lg text-yellow-400" />

                  </div>

                </div>

              </div>


              {/* =================================================
                  FEATURES
              ================================================= */}

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">

                <div className="flex items-center gap-2 text-xs text-cyan-50 sm:text-sm">
                  <FaCheckCircle className="text-green-300" />
                  <span>Fresh Catch</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-cyan-50 sm:text-sm">
                  <FaCheckCircle className="text-green-300" />
                  <span>Hygienically Packed</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-cyan-50 sm:text-sm">
                  <FaCheckCircle className="text-green-300" />
                  <span>Quality Assured</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-cyan-50 sm:text-sm">
                  <FaCheckCircle className="text-green-300" />
                  <span>Same Day Delivery</span>
                </div>

              </div>


              {/* Bottom message */}

              <div className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-100 sm:text-sm">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                Fresh seafood selected for your family

              </div>

            </div>


            {/* =====================================================
                RIGHT PRODUCT CARD
            ===================================================== */}

            <div className="p-4 sm:p-5 lg:p-7">

              <div className="relative mx-auto max-w-md">

                {/* Featured badge */}

                <div className="absolute left-3 top-3 z-20">

                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-xl shadow-yellow-900/20 sm:text-xs">

                    <FaStar className="text-yellow-100" />

                    Featured Product

                  </div>

                </div>


                {/* Product card */}

                <div className="overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">

                  <ProductItem
                    id={specialItem._id}
                    image={specialItem.image}
                    name={specialItem.name}
                    price={specialItem.price}
                  />

                </div>


                {/* Premium floating label */}

                <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gray-100 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">

                  <FaAward className="text-cyan-600" />

                  <span className="text-[11px] font-semibold text-gray-700 sm:text-xs">
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

        <div className="relative z-10 mx-auto max-w-3xl rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 text-center sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">

            <FaFish className="text-2xl text-cyan-600" />

          </div>

          <h3 className="mt-3 text-xl font-bold text-gray-800">
            Our Signature Seafood Is Coming Soon
          </h3>

          <p className="mx-auto mt-1.5 max-w-lg text-sm leading-5 text-gray-500">
            We're preparing a special seafood selection for you. Check back
            soon for our chef's recommendation.
          </p>

        </div>

      )}


      {/* =========================================================
          BOTTOM TRUST MESSAGE
      ========================================================= */}

      {specialItem && (

        <div className="relative z-10 mx-auto mt-5 max-w-4xl">

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500 sm:text-sm">

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


          <div className="mt-3 flex justify-center">

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 sm:text-sm">

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

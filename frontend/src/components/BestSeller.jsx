import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { FaCrown, FaStar, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const bestProducts = products.filter(
        (item) => item.bestseller === true
      );

      setBestSeller(bestProducts.slice(0, 5));
    } else {
      setBestSeller([]);
    }
  }, [products]);

  return (
    <section className="relative mt-5 sm:mt-6 py-8 sm:py-10 px-3 sm:px-5 lg:px-6 overflow-hidden rounded-2xl bg-gradient-to-b from-white via-cyan-50/70 to-sky-100/70">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 text-center mb-6 sm:mb-7">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 px-3.5 py-1.5 rounded-full shadow-sm border border-yellow-200">
          <FaCrown className="text-yellow-500 text-sm" />

          <span className="font-semibold text-xs sm:text-sm">
            Customer Favorites
          </span>

          <FaStar className="text-yellow-500 text-xs" />
        </div>

        {/* Heading */}
        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">
          Best Selling{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Seafood
          </span>
        </h2>

        {/* Description */}
        <p className="mt-2 max-w-2xl mx-auto text-xs sm:text-sm text-gray-500 leading-5 px-2">
          Our most loved seafood products selected by hundreds of happy
          customers. Freshly sourced, hygienically packed and delivered
          with premium quality.
        </p>
      </div>

      {/* =========================================================
          PRODUCTS
      ========================================================= */}

      {bestSeller.length > 0 ? (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {bestSeller.map((item, index) => (
            <div
              key={item._id}
              className="relative group transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Bestseller Badge */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[9px] sm:text-[10px] font-semibold px-2 py-1 rounded-full shadow-lg shadow-yellow-500/20">
                  <FaStar className="text-[8px] sm:text-[9px]" />
                  <span>Bestseller</span>
                </div>
              </div>

              {/* Product Card Wrapper */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-cyan-200">
                <ProductItem
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* =======================================================
            EMPTY STATE
        ======================================================= */

        <div className="relative z-10 flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
            <FaCrown className="text-2xl text-cyan-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            Our bestsellers are coming soon
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 text-center max-w-md">
            We're preparing our most popular seafood selections for you.
          </p>
        </div>
      )}

      {/* =========================================================
          TRUST / STATISTICS SECTION
      ========================================================= */}

      <div className="relative z-10 mt-7 sm:mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          {/* Customers */}
          <div className="group">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-105">
              500+
            </div>

            <p className="text-gray-500 mt-1.5 text-xs sm:text-sm">
              Happy Families Served
            </p>
          </div>

          {/* Freshness */}
          <div className="group sm:border-x sm:border-gray-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-105">
              100%
            </div>

            <p className="text-gray-500 mt-1.5 text-xs sm:text-sm">
              Fresh Daily Catch
            </p>
          </div>

          {/* Rating */}
          <div className="group">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-105">
                4.9
              </span>

              <FaStar className="text-yellow-400 text-lg sm:text-xl" />
            </div>

            <p className="text-gray-500 mt-1.5 text-xs sm:text-sm">
              Customer Rating
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          VIEW ALL BUTTON
      ========================================================= */}

      <div className="relative z-10 flex justify-center mt-6">
        <Link
          to="/menu"
          className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl shadow-lg shadow-cyan-600/20 hover:shadow-xl hover:shadow-cyan-600/30 hover:-translate-y-1 transition-all duration-300"
        >
          <span>Explore All Seafood</span>

          <FaArrowRight className="text-xs sm:text-sm transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default BestSeller;
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
    <section className="relative mt-16 sm:mt-20 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-[2rem] bg-gradient-to-b from-white via-cyan-50/70 to-sky-100/70">

      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 text-center mb-12 sm:mb-14">

        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 px-4 sm:px-5 py-2 rounded-full shadow-sm border border-yellow-200">

          <FaCrown className="text-yellow-500" />

          <span className="font-semibold text-sm sm:text-base">
            Customer Favorites
          </span>

          <FaStar className="text-yellow-500 text-sm" />

        </div>

        {/* Heading */}
        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">

          Best Selling{" "}

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Seafood
          </span>

        </h2>

        {/* Description */}
        <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-gray-500 leading-7 px-2">

          Our most loved seafood products selected by hundreds of happy
          customers. Freshly sourced, hygienically packed and delivered
          with premium quality.

        </p>

      </div>

      {/* =========================================================
          PRODUCTS
      ========================================================= */}

      {bestSeller.length > 0 ? (

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-7">

          {bestSeller.map((item, index) => (

            <div
              key={item._id}
              className="relative group transition-all duration-500 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >

              {/* Bestseller Badge */}
              <div className="absolute top-3 left-3 z-20">

                <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full shadow-lg shadow-yellow-500/20">

                  <FaStar className="text-[9px] sm:text-[10px]" />

                  <span>Bestseller</span>

                </div>

              </div>

              {/* Product Card Wrapper */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-cyan-200">

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

        <div className="relative z-10 flex flex-col items-center justify-center py-12">

          <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mb-5">

            <FaCrown className="text-3xl text-cyan-600" />

          </div>

          <h3 className="text-xl font-semibold text-gray-700">
            Our bestsellers are coming soon
          </h3>

          <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
            We're preparing our most popular seafood selections for you.
          </p>

        </div>

      )}

      {/* =========================================================
          TRUST / STATISTICS SECTION
      ========================================================= */}

      <div className="relative z-10 mt-14 sm:mt-16 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white p-6 sm:p-8">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">

          {/* Customers */}
          <div className="group">

            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-110">

              500+

            </div>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Happy Families Served
            </p>

          </div>

          {/* Freshness */}
          <div className="group sm:border-x sm:border-gray-100">

            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-110">

              100%

            </div>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Fresh Daily Catch
            </p>

          </div>

          {/* Rating */}
          <div className="group">

            <div className="flex items-center justify-center gap-2">

              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-110">

                4.9

              </span>

              <FaStar className="text-yellow-400 text-xl sm:text-2xl" />

            </div>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Customer Rating
            </p>

          </div>

        </div>

      </div>

      {/* =========================================================
          VIEW ALL BUTTON
      ========================================================= */}

      <div className="relative z-10 flex justify-center mt-10">

        <Link
          to="/menu"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-cyan-600/20 hover:shadow-xl hover:shadow-cyan-600/30 hover:-translate-y-1 transition-all duration-300"
        >

          <span>
            Explore All Seafood
          </span>

          <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />

        </Link>

      </div>

    </section>
  );
};

export default BestSeller;
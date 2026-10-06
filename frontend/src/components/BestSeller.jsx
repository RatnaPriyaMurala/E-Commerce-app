
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
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-cyan-50/70 to-sky-100/70 px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />


      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="relative z-10 mb-5 text-center sm:mb-6">

        {/* Premium Badge */}

        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-gradient-to-r from-yellow-100 to-amber-100 px-3.5 py-1.5 text-yellow-700 shadow-sm">

          <FaCrown className="text-sm text-yellow-500" />

          <span className="text-xs font-semibold sm:text-sm">
            Customer Favorites
          </span>

          <FaStar className="text-xs text-yellow-500" />

        </div>


        {/* Heading */}

        <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl lg:text-4xl">

          Best Selling{" "}

          <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Seafood
          </span>

        </h2>


        {/* Description */}

        <p className="mx-auto mt-1.5 max-w-2xl px-2 text-xs leading-5 text-gray-500 sm:text-sm">
          Our most loved seafood products selected by hundreds of happy
          customers. Freshly sourced, hygienically packed and delivered
          with premium quality.
        </p>

      </div>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {bestSeller.length > 0 ? (

        <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          {bestSeller.map((item) => (

            <div
              key={item._id}
              className="group relative transition-all duration-300 hover:-translate-y-1"
            >

              {/* Bestseller Badge */}

              <div className="absolute left-2.5 top-2.5 z-20">

                <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-2 py-1 text-[9px] font-semibold text-white shadow-lg shadow-yellow-500/20 sm:text-[10px]">

                  <FaStar className="text-[8px] sm:text-[9px]" />

                  <span>Bestseller</span>

                </div>

              </div>


              {/* Product Card */}

              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:border-cyan-200 group-hover:shadow-xl">

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

        /* ===================================================
           EMPTY STATE
        =================================================== */

        <div className="relative z-10 flex flex-col items-center justify-center py-6">

          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100">

            <FaCrown className="text-xl text-cyan-600" />

          </div>

          <h3 className="text-base font-semibold text-gray-700 sm:text-lg">
            Our bestsellers are coming soon
          </h3>

          <p className="mt-1.5 max-w-md text-center text-xs text-gray-500 sm:text-sm">
            We're preparing our most popular seafood selections for you.
          </p>

        </div>

      )}


      {/* =====================================================
          TRUST / STATISTICS
      ===================================================== */}

      <div className="relative z-10 mt-5 rounded-2xl border border-white bg-white/90 p-3.5 shadow-lg backdrop-blur-md sm:mt-6 sm:p-5">

        <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-5">

          {/* Customers */}

          <div className="group">

            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
              500+
            </div>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Happy Families Served
            </p>

          </div>


          {/* Freshness */}

          <div className="group sm:border-x sm:border-gray-100">

            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
              100%
            </div>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Fresh Daily Catch
            </p>

          </div>


          {/* Rating */}

          <div className="group">

            <div className="flex items-center justify-center gap-1.5">

              <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                4.9
              </span>

              <FaStar className="text-lg text-yellow-400 sm:text-xl" />

            </div>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Customer Rating
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          VIEW ALL BUTTON
      ===================================================== */}

      <div className="relative z-10 mt-4 flex justify-center sm:mt-5">

        <Link
          to="/menu"
          className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-600/30 sm:px-7 sm:py-3"
        >

          <span>Explore All Seafood</span>

          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1 sm:text-sm" />

        </Link>

      </div>

    </section>
  );
};

export default BestSeller;

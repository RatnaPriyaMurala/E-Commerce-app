import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { FaFish, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const LatestAdded = () => {

  const { products } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {

    if (products.length > 0) {

      setLatestProducts(products.slice(0, 10));

    } else {

      setLatestProducts([]);

    }

  }, [products]);

  return (

    <section className="relative py-16 sm:py-20">

      {/* =====================================================
          SECTION HEADING
      ===================================================== */}

      <div className="mb-12 text-center">

        {/* Badge */}

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-5 py-2 text-sm font-semibold text-cyan-700 shadow-sm">

          <FaFish className="text-cyan-600" />

          <span>
            Fresh Catch
          </span>

        </div>


        {/* Heading */}

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl lg:text-5xl">

          Latest Added{" "}

          <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">

            Products

          </span>

        </h2>


        {/* Description */}

        <p className="mx-auto mt-4 max-w-3xl px-4 text-sm leading-7 text-gray-500 sm:text-base">

          Explore our newest arrivals carefully selected from trusted
          fishermen. Every product is cleaned hygienically, packed with care
          and delivered fresh to your doorstep.

        </p>

      </div>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {latestProducts.length > 0 ? (

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          {latestProducts.map((item) => (

            <div
              key={item._id}
              className="group transition-all duration-300 hover:-translate-y-2"
            >

              <div className="rounded-2xl transition-all duration-300 group-hover:shadow-xl group-hover:shadow-cyan-100/60">

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

        /* =====================================================
            EMPTY STATE
        ===================================================== */

        <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50">

          <div className="text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">

              <FaFish className="text-2xl text-cyan-500" />

            </div>

            <h3 className="text-lg font-semibold text-gray-700">

              Fresh catch coming soon

            </h3>

            <p className="mt-2 text-sm text-gray-500">

              Our latest seafood products will appear here.

            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          FRESH SEAFOOD BANNER
      ===================================================== */}

      <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-800 via-sky-800 to-blue-900 p-8 text-white shadow-xl sm:p-10 lg:p-12">

        {/* Decorative glow */}

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />


        <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">

          {/* Text */}

          <div className="text-center lg:text-left">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-sm">

              <span>
                🐟
              </span>

              <span>
                Fresh Every Morning
              </span>

            </div>


            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">

              Fresh Seafood Every Day

            </h2>


            <p className="mt-3 max-w-xl text-sm leading-7 text-cyan-100 sm:text-base">

              We receive fresh fish every morning to ensure premium quality,
              authentic taste and hygienic delivery.

            </p>

          </div>


          {/* Button */}

          <Link
            to="/menu"
            className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-semibold text-cyan-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-50 hover:shadow-2xl sm:px-8 sm:py-4"
          >

            <span>
              Explore More
            </span>

            <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />

          </Link>

        </div>

      </div>

    </section>

  );

};

export default LatestAdded;
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { FaFish, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const LatestAdded = () => {
  const { products = [] } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      setLatestProducts([]);
      return;
    }

    // =====================================================
    // FRESH SEAFOOD CATEGORIES
    // =====================================================
    const freshCategories = [
      "Fresh Water Fish",
      "Sea Fish",
      "Prawns",
      "Crabs",
    ];

    // =====================================================
    // GET ONLY FRESH SEAFOOD
    // Excludes:
    // - Dry Fish
    // - Dry Prawns
    // - Pickles
    // =====================================================
    const freshProducts = products.filter((item) => {
      return (
        item &&
        item.isAvailable !== false &&
        Number(item.stock) > 0 &&
        freshCategories.includes(item.category)
      );
    });

    // =====================================================
    // SORT BY NEWEST PRODUCT
    //
    // Some older products use "date"
    // Newer products use "createdAt"
    // So we support both.
    // =====================================================
    const sortedFreshProducts = [...freshProducts].sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.date || a.updatedAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.date || b.updatedAt || 0
      ).getTime();

      return dateB - dateA;
    });

    // =====================================================
    // FIRST PRIORITY:
    // Fresh products which are NOT already marked bestseller
    //
    // This prevents Latest/Fresh section from looking
    // exactly the same as Best Seller section.
    // =====================================================
    const freshNonBestSeller = sortedFreshProducts.filter(
      (item) => item.bestseller !== true
    );

    // =====================================================
    // SECOND PRIORITY:
    // Remaining fresh products
    //
    // This ensures the section still has products if
    // there aren't enough non-bestsellers.
    // =====================================================
    const freshBestSellerFallback = sortedFreshProducts.filter(
      (item) => item.bestseller === true
    );

    // First show non-bestseller fresh products.
    // Then use fresh bestseller products only if needed.
    const combinedProducts = [
      ...freshNonBestSeller,
      ...freshBestSellerFallback,
    ];

    setLatestProducts(combinedProducts.slice(0, 10));
  }, [products]);

  return (
    <section className="relative">

      {/* =====================================================
          SECTION HEADER
          ===================================================== */}

      <div className="mb-5 text-center sm:mb-6">

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3.5 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm">
          <FaFish className="text-cyan-600" />

          <span>Fresh Catch</span>
        </div>

        <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl lg:text-4xl">
          Fresh{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
            Seafood
          </span>
        </h2>

        <p className="mx-auto mt-1.5 max-w-xl px-4 text-xs leading-5 text-gray-500 sm:text-sm">
          Explore our fresh fish, prawns and crabs, carefully selected
          from trusted sources and delivered fresh to your doorstep.
        </p>

      </div>


      {/* =====================================================
          PRODUCTS
          ===================================================== */}

      {latestProducts.length > 0 ? (

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          {latestProducts.map((item) => (

            <div
              key={item._id}
              className="group transition-all duration-300 hover:-translate-y-1"
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

        /* ===================================================
           EMPTY STATE
           =================================================== */

        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">

          <div className="text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50">
              <FaFish className="text-xl text-cyan-500" />
            </div>

            <h3 className="text-base font-semibold text-gray-700">
              Fresh catch coming soon
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Our fresh seafood products will appear here.
            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          FRESH SEAFOOD BANNER
          ===================================================== */}

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-800 via-sky-800 to-blue-900 p-5 text-white shadow-xl sm:mt-6 sm:p-6 lg:p-7">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-4 lg:flex-row">

          <div className="text-center lg:text-left">

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              <span>🐟</span>
              <span>Fresh Every Morning</span>
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Fresh Seafood Every Day
            </h2>

            <p className="mt-1.5 max-w-xl text-sm leading-5 text-cyan-100 sm:text-base sm:leading-6">
              We receive fresh fish every morning to ensure premium
              quality, authentic taste and hygienic delivery.
            </p>

          </div>

          <Link
            to="/menu"
            className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-5 py-2.5 font-semibold text-cyan-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-50 hover:shadow-2xl sm:px-6 sm:py-3"
          >
            <span>Explore More</span>

            <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

        </div>

      </div>

    </section>
  );
};

export default LatestAdded;
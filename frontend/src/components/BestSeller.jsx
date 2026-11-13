
import React, { useContext, useMemo, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import {
  FaCrown,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const BestSeller = () => {
  const { products = [] } = useContext(ShopContext);
  const scrollRef = useRef(null);

  const freshCategories = [
    "Fresh Water Fish",
    "Sea Fish",
    "Prawns",
    "Crabs",
  ];

  const getTimestamp = (item) => {
    const values = [
      item.createdAt,
      item.date,
      item.updatedAt,
    ];

    for (const value of values) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      const timestamp =
        typeof value === "number"
          ? value
          : new Date(value).getTime();

      if (Number.isFinite(timestamp)) {
        return timestamp;
      }
    }

    return 0;
  };

  const bestSellers = useMemo(() => {
    return products
      .filter((item) => (
        item &&
        item.bestseller === true &&
        item.isAvailable !== false &&
        Number(item.stock) > 0 &&
        freshCategories.includes(item.category)
      ))
      .sort((a, b) => getTimestamp(b) - getTimestamp(a));
  }, [products]);

  const moveProducts = (direction) => {
    if (!scrollRef.current) return;

    const amount = scrollRef.current.clientWidth * 0.85;

    scrollRef.current.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-cyan-50/70 to-sky-100/70 px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">

      {/* DECORATIVE BACKGROUND */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 mb-5 flex items-end justify-between gap-3 sm:mb-6">

        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1.5 text-yellow-700 shadow-sm">
            <FaCrown className="text-yellow-500" />
            <span className="text-xs font-semibold">
              Customer Favorites
            </span>
            <FaStar className="text-xs text-yellow-500" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-gray-800 sm:text-2xl lg:text-3xl">
            Best Selling{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Seafood
            </span>
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Our customer-favorite seafood selections
          </p>
        </div>

        {/* ARROWS */}
        {bestSellers.length > 2 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => moveProducts(-1)}
              aria-label="Previous bestsellers"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-600 hover:text-white"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <button
              type="button"
              onClick={() => moveProducts(1)}
              aria-label="Next bestsellers"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-600 hover:text-white"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}

      </div>

      {/* PRODUCTS */}
      {bestSellers.length > 0 ? (

        <div
          ref={scrollRef}
          className="relative z-10 flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >

          {bestSellers.map((item) => (
            <div
              key={item._id}
              className="group relative w-[calc(50%-6px)] shrink-0 snap-start md:w-[calc(33.333%-11px)]"
            >

              {/* BESTSELLER BADGE */}
              <div className="absolute left-2 top-2 z-20">
                <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-2 py-1 text-[9px] font-semibold text-white shadow-lg sm:text-[10px]">
                  <FaStar className="text-[9px]" />
                  <span>Bestseller</span>
                </div>
              </div>

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

        <div className="relative z-10 flex min-h-[150px] flex-col items-center justify-center py-6 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100">
            <FaCrown className="text-xl text-cyan-600" />
          </div>

          <h3 className="text-base font-semibold text-gray-700 sm:text-lg">
            Our bestsellers are coming soon
          </h3>

          <p className="mt-1.5 max-w-md text-center text-xs text-gray-500 sm:text-sm">
            Mark available seafood products as bestsellers in your admin panel to display them here.
          </p>
        </div>

      )}

    </section>
  );
};

export default BestSeller;

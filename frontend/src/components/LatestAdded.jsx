
import React, { useContext, useMemo, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { FaFish, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LatestAdded = () => {
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

  const latestProducts = useMemo(() => {
    const availableProducts = products.filter((item) => (
      item &&
      item.isAvailable !== false &&
      Number(item.stock) > 0 &&
      freshCategories.includes(item.category)
    ));

    const sortedProducts = [...availableProducts].sort(
      (a, b) => getTimestamp(b) - getTimestamp(a)
    );

    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    const recentProducts = sortedProducts.filter((item) => {
      const timestamp = getTimestamp(item);

      return (
        timestamp > 0 &&
        timestamp <= now &&
        now - timestamp <= sevenDays
      );
    });

    // Show only products added in the last 7 days.
    // If none exist, retain older products as a fallback.
    return recentProducts.length > 0
      ? recentProducts
      : sortedProducts;
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
    <section className="relative">

      {/* HEADER */}
      <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">

        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
            <FaFish />
            <span>Fresh Catch</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-gray-800 sm:text-2xl lg:text-3xl">
            Latest{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
              Added
            </span>
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Discover our newest fresh seafood arrivals
          </p>
        </div>

        {/* ARROWS */}
        {latestProducts.length > 2 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => moveProducts(-1)}
              aria-label="Previous latest products"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-600 hover:text-white"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <button
              type="button"
              onClick={() => moveProducts(1)}
              aria-label="Next latest products"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-600 hover:text-white"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}

      </div>

      {/* PRODUCTS */}
      {latestProducts.length > 0 ? (

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >

          {latestProducts.map((item) => (
            <div
              key={item._id}
              className="w-[calc(50%-6px)] shrink-0 snap-start md:w-[calc(33.333%-11px)]"
            >
              <div className="h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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

        <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <div className="text-center">
            <FaFish className="mx-auto mb-3 text-3xl text-cyan-500" />

            <h3 className="text-base font-semibold text-gray-700">
              Fresh catch coming soon
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Our seafood products will appear here.
            </p>
          </div>
        </div>

      )}

    </section>
  );
};

export default LatestAdded;

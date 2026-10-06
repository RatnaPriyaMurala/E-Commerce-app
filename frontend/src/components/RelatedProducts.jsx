import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { FaFish, FaArrowRight } from "react-icons/fa";

const RelatedProducts = ({
  category,
  subCategory,
  currentProductId,
}) => {
  const { products } = useContext(ShopContext);

  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!products.length) {
      setRelated([]);
      return;
    }

    // Remove current product
    let filtered = products.filter(
      (item) => item._id !== currentProductId
    );

    // Match category
    if (category) {
      filtered = filtered.filter(
        (item) =>
          item.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // Prefer matching sub-category
    if (subCategory) {
      const sub = filtered.filter(
        (item) =>
          item.subCategory?.toLowerCase() ===
          subCategory.toLowerCase()
      );

      if (sub.length > 0) {
        filtered = sub;
      }
    }

    // Display maximum 5 products
    setRelated(filtered.slice(0, 5));
  }, [
    products,
    category,
    subCategory,
    currentProductId,
  ]);

  // Don't render section when there are no related products
  if (!related.length) return null;

  return (
    <section className="relative mt-3 sm:mt-4 overflow-hidden rounded-2xl bg-gradient-to-b from-white via-cyan-50/60 to-sky-100/70 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-300/20 blur-3xl" />

      {/* =====================================================
          SECTION HEADING
      ===================================================== */}

      <div className="relative z-10 mb-4 text-center sm:mb-5">

        {/* Small Badge */}

        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1.5 text-cyan-700 shadow-sm">
          <FaFish className="text-xs text-cyan-600" />

          <span className="text-xs font-semibold">
            Fresh Recommendations
          </span>
        </div>

        {/* Heading */}

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl lg:text-4xl">
          You May{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Like
          </span>
        </h2>

        {/* Description */}

        <p className="mx-auto mt-1.5 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
          Fresh seafood carefully selected based on your current
          selection. Discover more choices for your next meal.
        </p>
      </div>

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">

        {related.map((item, index) => (
          <div
            key={item._id}
            className="group relative transition-all duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            {/* Product Card */}

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-cyan-200 hover:shadow-lg">
              <ProductItem
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            </div>
          </div>
        ))}

      </div>

      {/* =====================================================
          BOTTOM MESSAGE
      ===================================================== */}

      <div className="relative z-10 mt-4 flex justify-center sm:mt-5">
        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
          <span>
            Explore more fresh seafood from our collection
          </span>

          <FaArrowRight className="text-cyan-600" />
        </div>
      </div>

    </section>
  );
};

export default RelatedProducts;
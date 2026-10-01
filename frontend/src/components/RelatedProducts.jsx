
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
    <section className="relative mt-4 sm:mt-5 py-6 sm:py-8 px-3 sm:px-5 lg:px-6 overflow-hidden rounded-2xl bg-gradient-to-b from-white via-cyan-50/60 to-sky-100/70">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="absolute -top-20 -right-20 w-56 h-56 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* =====================================================
          SECTION HEADING
      ===================================================== */}

      <div className="relative z-10 text-center mb-5 sm:mb-6">

        {/* Small Badge */}

        <div className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-full border border-cyan-200 shadow-sm">

          <FaFish className="text-xs text-cyan-600" />

          <span className="text-xs font-semibold">
            Fresh Recommendations
          </span>

        </div>

        {/* Heading */}

        <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">

          You May{" "}

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Like
          </span>

        </h2>

        {/* Description */}

        <p className="mt-2 max-w-xl mx-auto text-xs sm:text-sm text-gray-500 leading-5">

          Fresh seafood carefully selected based on your current
          selection. Discover more choices for your next meal.

        </p>

      </div>

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">

        {related.map((item, index) => (
          <div
            key={item._id}
            className="relative group transition-all duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >

            {/* Product Card */}

            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-cyan-200 transition-all duration-300">

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

      <div className="relative z-10 flex justify-center mt-5">

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

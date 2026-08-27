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
    <section className="relative mt-20 sm:mt-24 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-[2rem] bg-gradient-to-b from-white via-cyan-50/60 to-sky-100/70">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* =====================================================
          SECTION HEADING
      ===================================================== */}

      <div className="relative z-10 text-center mb-10 sm:mb-12">

        {/* Small Badge */}

        <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full border border-cyan-200 shadow-sm">

          <FaFish className="text-cyan-600" />

          <span className="text-sm font-semibold">
            Fresh Recommendations
          </span>

        </div>

        {/* Heading */}

        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">

          You May{" "}

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Like
          </span>

        </h2>

        {/* Description */}

        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-500 leading-7">

          Fresh seafood carefully selected based on your current
          selection. Discover more delicious choices for your next meal.

        </p>

      </div>

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-7">

        {related.map((item, index) => (
          <div
            key={item._id}
            className="relative group transition-all duration-500 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >

            {/* Product Card */}

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-cyan-200 transition-all duration-500">

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

      <div className="relative z-10 flex justify-center mt-10">

        <div className="inline-flex items-center gap-2 text-sm text-gray-500">

          <span>
            Explore more fresh seafood from our collection
          </span>

          <FaArrowRight className="text-cyan-600 transition-transform duration-300 hover:translate-x-1" />

        </div>

      </div>

    </section>
  );
};

export default RelatedProducts;
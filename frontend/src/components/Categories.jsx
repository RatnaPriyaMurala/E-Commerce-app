import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fresh Water Fish",
    icon: "🐟",
    description: "Rohu, Katla & more",
  },
  {
    name: "Sea Fish",
    icon: "🐠",
    description: "Fresh sea catch",
  },
  {
    name: "Kolkata Fish",
    icon: "🐟",
    description: "Popular favourites",
  },
  {
    name: "Prawns",
    icon: "🦐",
    description: "Fresh prawns",
  },
  {
    name: "Crabs",
    icon: "🦀",
    description: "Fresh crabs",
  },
  {
    name: "Dry Fish",
    icon: "🐟",
    description: "Traditional favourites",
  },
  {
    name: "Dry Prawns",
    icon: "🦐",
    description: "Dried prawns",
  },
  {
    name: "Pickles",
    icon: "🥫",
    description: "Seafood pickles",
  },
];

const Categories = () => {
  return (
    <section className="bg-white py-4 sm:py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        {/* ==================================================
            HEADING
        ================================================== */}

        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-600 sm:text-xs">
              Shop by category
            </p>

            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              What are you craving?
            </h2>

            <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
              Explore our fresh seafood collection.
            </p>
          </div>

          <Link
            to="/menu"
            className="hidden rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-cyan-700 transition hover:bg-cyan-50 sm:inline-flex sm:text-xs"
          >
            View All →
          </Link>
        </div>

        {/* ==================================================
            CATEGORY CARDS
        ================================================== */}

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/menu?category=${encodeURIComponent(
                category.name
              )}`}
              className="
                group
                rounded-xl
                border
                border-gray-100
                bg-gradient-to-b
                from-white
                to-slate-50
                p-2.5
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-100
                hover:shadow-md
                sm:rounded-2xl
                sm:p-3
              "
            >
              {/* Icon */}

              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-cyan-50
                  text-2xl
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  sm:h-14
                  sm:w-14
                  sm:text-3xl
                "
              >
                {category.icon}
              </div>

              {/* Name */}

              <h3 className="mt-2 text-[11px] font-bold text-gray-800 sm:text-xs">
                {category.name}
              </h3>

              {/* Description */}

              <p className="mt-0.5 text-[8px] leading-3.5 text-gray-400 sm:text-[9px] sm:leading-4">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}

        <Link
          to="/menu"
          className="
            mt-3
            flex
            items-center
            justify-center
            rounded-lg
            border
            border-gray-200
            py-2
            text-[11px]
            font-semibold
            text-cyan-700
            transition
            hover:bg-cyan-50
            sm:hidden
          "
        >
          View All Seafood →
        </Link>
      </div>
    </section>
  );
};

export default Categories;
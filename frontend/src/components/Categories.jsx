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
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            HEADING
        ================================================== */}

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
              Shop by category
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              What are you craving?
            </h2>

            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              Explore our fresh seafood collection.
            </p>
          </div>

          <Link
            to="/menu"
            className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 sm:inline-flex"
          >
            View All →
          </Link>
        </div>

        {/* ==================================================
            CATEGORY CARDS
        ================================================== */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/menu?category=${encodeURIComponent(
                category.name
              )}`}
              className="group rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-slate-50 p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-100 hover:shadow-md"
            >
              {/* Icon */}

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-3xl transition-transform duration-300 group-hover:scale-110">
                {category.icon}
              </div>

              {/* Name */}

              <h3 className="mt-2.5 text-xs font-bold text-gray-800">
                {category.name}
              </h3>

              {/* Description */}

              <p className="mt-1 text-[9px] leading-4 text-gray-400">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}

        <Link
          to="/menu"
          className="mt-4 flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 sm:hidden"
        >
          View All Seafood →
        </Link>
      </div>
    </section>
  );
};

export default Categories;
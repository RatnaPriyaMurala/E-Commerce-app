import React, {
  useContext,
  useMemo,
  useState,
} from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";
import {
  FaFish,
  FaTimes,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";

// ============================================================
// CATEGORIES
// ============================================================

const CATEGORIES = [
  "Fresh Water Fish",
  "Sea Fish",
  "Kolkata Fish",
  "Prawns",
  "Crabs",
  "Dry Fish",
  "Dry Prawns",
  "Pickles",
];

const Menu = () => {
  const {
    products = [],
    search = "",
    showSearch = false,
  } = useContext(ShopContext);

  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // ============================================================
  // TOGGLE CATEGORY
  // ============================================================

  const toggleCategory = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setCategory([]);
    setSortType("relevant");
  };

  // ============================================================
  // REMOVE INDIVIDUAL CATEGORY
  // ============================================================

  const removeCategory = (value) => {
    setCategory((prev) =>
      prev.filter((item) => item !== value)
    );
  };

  // ============================================================
  // FILTER + SORT PRODUCTS
  // ============================================================

  const filterProducts = useMemo(() => {
    let result = [...products];

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    if (showSearch && search.trim()) {
      const searchValue = search.trim().toLowerCase();

      result = result.filter((item) => {
        const name =
          item.name?.toLowerCase() || "";

        const categoryName =
          item.category?.toLowerCase() || "";

        return (
          name.includes(searchValue) ||
          categoryName.includes(searchValue)
        );
      });
    }

    // ----------------------------------------------------------
    // CATEGORY
    // ----------------------------------------------------------

    if (category.length > 0) {
      result = result.filter((item) =>
        category.some(
          (selectedCategory) =>
            selectedCategory.toLowerCase() ===
            item.category?.toLowerCase()
        )
      );
    }

    // ----------------------------------------------------------
    // SORT
    // ----------------------------------------------------------

    if (sortType === "low-high") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortType === "high-low") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    showSearch,
    category,
    sortType,
  ]);

  // ============================================================
  // ACTIVE FILTERS
  // ============================================================

  const hasActiveFilters =
    category.length > 0 ||
    sortType !== "relevant";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 text-white shadow-xl mb-8 sm:mb-10">

          {/* Decorative circles */}

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative p-7 sm:p-10 lg:p-12">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

              {/* Heading */}

              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold text-cyan-100">
                  <FaFish />
                  Fresh Seafood Collection
                </div>

                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">

                  Fresh Fish Delivered

                  <span className="block text-cyan-200">
                    To Your Doorstep
                  </span>

                </h1>

                <p className="mt-4 text-cyan-100 leading-7 text-sm sm:text-base max-w-2xl">
                  Explore premium fresh water fish,
                  sea fish, Kolkata fish, prawns, crabs,
                  dry fish, dry prawns and pickles sourced
                  from trusted suppliers and carefully
                  handled for quality and freshness.
                </p>

              </div>

              {/* Product Count */}

              <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-8 py-6 text-center min-w-[170px]">

                <p className="text-sm text-cyan-100">
                  Products Found
                </p>

                <p className="mt-1 text-4xl sm:text-5xl font-extrabold">
                  {filterProducts.length}
                </p>

                <p className="mt-1 text-xs text-cyan-200">
                  Fresh options available
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ====================================================
              CATEGORIES SIDEBAR
          ==================================================== */}

          <aside className="lg:w-72 shrink-0">

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">

              {/* ONLY ONE CATEGORIES HEADING */}

              <h2 className="font-bold text-xl text-gray-800 mb-5">
                Categories
              </h2>

              {/* CATEGORY LIST */}

              <div className="space-y-3">

                {CATEGORIES.map((item) => {

                  const checked =
                    category.includes(item);

                  return (
                    <label
                      key={item}
                      className={`flex items-center justify-between gap-3 cursor-pointer rounded-xl px-3 py-2.5 transition ${
                        checked
                          ? "bg-cyan-50 text-cyan-800"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >

                      <span className="flex items-center gap-3">

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCategory(item)
                          }
                          className="w-4 h-4 accent-cyan-700"
                        />

                        <span className="text-sm font-medium">
                          {item}
                        </span>

                      </span>

                      {checked && (
                        <span className="w-2 h-2 rounded-full bg-cyan-600" />
                      )}

                    </label>
                  );
                })}

              </div>

            </div>

          </aside>

          {/* ====================================================
              PRODUCT AREA
          ==================================================== */}

          <section className="flex-1 min-w-0">

            {/* ==================================================
                TOP CONTROLS
            ================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>

                <p className="text-sm text-gray-500">

                  Showing{" "}

                  <span className="font-bold text-gray-800">
                    {filterProducts.length}
                  </span>{" "}

                  seafood{" "}

                  {filterProducts.length === 1
                    ? "product"
                    : "products"}

                </p>

                {showSearch && search.trim() && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-cyan-700">

                    <FaSearch />

                    <span>
                      Search results for{" "}
                      <strong>
                        "{search.trim()}"
                      </strong>
                    </span>

                  </div>
                )}

              </div>

              {/* ==================================================
                  SORT
              ================================================== */}

              <div className="relative">

                <select
                  value={sortType}
                  onChange={(e) =>
                    setSortType(e.target.value)
                  }
                  className="appearance-none w-full sm:w-auto min-w-[210px] bg-white border border-gray-200 rounded-xl px-5 py-3 pr-10 outline-none text-sm font-semibold text-gray-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                >

                  <option value="relevant">
                    Sort: Relevant
                  </option>

                  <option value="low-high">
                    Price: Low → High
                  </option>

                  <option value="high-low">
                    Price: High → Low
                  </option>

                </select>

                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />

              </div>

            </div>

            {/* ==================================================
                ACTIVE CATEGORY
            ================================================== */}

            {category.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-7">

                <span className="text-xs font-semibold text-gray-500 mr-1">
                  Active:
                </span>

                {category.map((item) => (

                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      removeCategory(item)
                    }
                    className="inline-flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-100 px-3 py-2 rounded-full text-xs font-semibold transition"
                  >

                    {item}

                    <FaTimes />

                  </button>

                ))}

              </div>
            )}

            {/* ==================================================
                PRODUCTS
            ================================================== */}

            {filterProducts.length === 0 ? (

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center">

                <div className="w-20 h-20 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">

                  <img
                    src={assets.search_icon}
                    alt=""
                    className="w-10 h-10 opacity-50"
                  />

                </div>

                <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-800">
                  No Products Found
                </h2>

                <p className="mt-3 text-gray-500 max-w-md mx-auto leading-6">
                  We couldn't find seafood matching
                  your current search or category.
                  Try changing your selection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-7 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >

                  <FaTimes />

                  Clear Filters

                </button>

              </div>

            ) : (

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

                {filterProducts.map((item) => (

                  <ProductItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                  />

                ))}

              </div>

            )}

          </section>

        </div>

      </div>

    </main>
  );
};

export default Menu;
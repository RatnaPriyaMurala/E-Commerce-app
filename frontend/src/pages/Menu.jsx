import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products = [],
    search = "",
    showSearch = false,
  } = useContext(ShopContext);

  // ============================================================
  // STATE
  // ============================================================

  const [category, setCategory] = useState(() => {
    const urlCategory = searchParams.get("category");

    return urlCategory ? [urlCategory] : [];
  });

  const [sortType, setSortType] = useState("relevant");

  // Mobile category dropdown
  const [showMobileCategories, setShowMobileCategories] =
    useState(false);

  // ============================================================
  // READ CATEGORY FROM URL
  // ============================================================

  useEffect(() => {
    const urlCategory = searchParams.get("category");

    if (urlCategory) {
      setCategory([urlCategory]);
    } else {
      setCategory([]);
    }
  }, [searchParams]);

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
    setSearchParams({});
  };

  // ============================================================
  // REMOVE INDIVIDUAL CATEGORY
  // ============================================================

  const removeCategory = (value) => {
    setCategory((prev) =>
      prev.filter((item) => item !== value)
    );

    const currentCategory = searchParams.get("category");

    if (
      currentCategory &&
      currentCategory.toLowerCase() ===
        String(value).toLowerCase()
    ) {
      setSearchParams({});
    }
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

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3 sm:pt-5 pb-8 sm:pb-10">


       {/* ======================================================
    MOBILE CATEGORY BUTTON
    ====================================================== */}

<div className="lg:hidden mb-4 relative">

  {/* SMALL CATEGORY BUTTON */}

  <button
    type="button"
    onClick={() =>
      setShowMobileCategories((prev) => !prev)
    }
    className={`w-[82px] h-[64px] flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white border shadow-sm transition ${
      showMobileCategories
        ? "border-cyan-500 ring-2 ring-cyan-50"
        : "border-gray-200"
    }`}
  >

    <span className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-700">
      <FaFish className="text-sm" />
    </span>

    <span className="text-[11px] font-bold text-gray-800 leading-none">
      Categories
    </span>

  </button>

  {/* ==================================================
      MOBILE CATEGORY DROPDOWN
      ================================================== */}

  {showMobileCategories && (
    <div className="absolute left-0 top-[78px] z-50 w-[230px] bg-white rounded-xl border border-gray-200 shadow-xl p-2.5">

      <div className="grid grid-cols-1 gap-0.5">

        {CATEGORIES.map((item) => {
          const checked =
            category.includes(item);

          return (
            <label
              key={item}
              className={`flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-2 transition ${
                checked
                  ? "bg-cyan-50 text-cyan-800"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >

              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  toggleCategory(item);

                  // Automatically close dropdown
                  setShowMobileCategories(false);
                }}
                className="w-3.5 h-3.5 accent-cyan-700 shrink-0"
              />

              <span className="text-xs font-medium">
                {item}
              </span>

              {checked && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
              )}

            </label>
          );
        })}

      </div>

    </div>
  )}

</div>

        {/* ======================================================
            MAIN CONTENT
            ====================================================== */}

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          {/* ====================================================
              DESKTOP CATEGORIES SIDEBAR
              ==================================================== */}

          <aside className="hidden lg:block lg:w-64 shrink-0">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:sticky lg:top-24">

              <h2 className="font-bold text-lg text-gray-800 mb-4">
                Categories
              </h2>

              <div className="space-y-2">

                {CATEGORIES.map((item) => {
                  const checked =
                    category.includes(item);

                  return (
                    <label
                      key={item}
                      className={`flex items-center justify-between gap-3 cursor-pointer rounded-lg px-2.5 py-2 transition ${
                        checked
                          ? "bg-cyan-50 text-cyan-800"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >

                      <span className="flex items-center gap-2.5">

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCategory(item)
                          }
                          className="w-4 h-4 accent-cyan-700"
                        />

                        <span className="text-xs sm:text-sm font-medium">
                          {item}
                        </span>

                      </span>

                      {checked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

              <div>

                {/* SEARCH RESULT ONLY */}

                {showSearch && search.trim() && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-700">

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
                  className="appearance-none w-full sm:w-auto min-w-[190px] bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 outline-none text-xs sm:text-sm font-semibold text-gray-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
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

                <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />

              </div>

            </div>

            {/* ==================================================
                ACTIVE CATEGORY
                ================================================== */}

            {category.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">

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
                    className="inline-flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-100 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition"
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

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 sm:py-16 px-5 text-center">

                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">

                  <img
                    src={assets.search_icon}
                    alt=""
                    className="w-8 h-8 opacity-50"
                  />

                </div>

                <h2 className="mt-4 text-xl sm:text-2xl font-extrabold text-gray-800">
                  No Products Found
                </h2>

                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-5">
                  We couldn't find seafood matching
                  your current search or category.
                  Try changing your selection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <FaTimes />
                  Clear Filters
                </button>

              </div>

            ) : (

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

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
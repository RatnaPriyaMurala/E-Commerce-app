import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaFish,
  FaBoxes,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaTag,
  FaCut,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const List = ({ token }) => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // =========================================================
  // PREPARATION HELPER
  // Supports both:
  // "Whole & Cleaned"
  //
  // and:
  // { name: "Whole & Cleaned", pricePerKg: 500, _id: "..." }
  // =========================================================

  const getPreparationName = (option) => {
    if (typeof option === "string") {
      return option;
    }

    if (option && typeof option === "object") {
      return option.name || "";
    }

    return "";
  };

  // ==========================
  // FETCH PRODUCTS
  // ==========================

  const fetchList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        backendUrl + "/api/product/list"
      );

      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================

  const removeProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // ==========================
  // LOAD PRODUCTS
  // ==========================

  useEffect(() => {
    fetchList();
  }, []);

  // ==========================
  // FILTER PRODUCTS
  // ==========================

  const filteredList = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return list.filter((item) => {
      // -----------------------------------------
      // FIX:
      // Convert preparation objects into names
      // before searching.
      // -----------------------------------------

      const preparationText = Array.isArray(
        item.preparationOptions
      )
        ? item.preparationOptions
            .map((option) =>
              getPreparationName(option)
            )
            .join(" ")
            .toLowerCase()
        : "";

      const matchesSearch =
        !searchText ||
        String(item.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.category || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.overview || "")
          .toLowerCase()
          .includes(searchText) ||
        preparationText.includes(searchText);

      const matchesCategory =
        categoryFilter === "All"
          ? true
          : item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [list, search, categoryFilter]);

  // ==========================
  // DASHBOARD COUNTS
  // ==========================

  const totalProducts = list.length;

  const lowStock = list.filter(
    (item) =>
      Number(item.stock) > 0 &&
      Number(item.stock) <= 5
  ).length;

  const outOfStock = list.filter(
    (item) => Number(item.stock) <= 0
  ).length;

  const unavailableProducts = list.filter(
    (item) => item.isAvailable === false
  ).length;

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>

          <h1 className="text-xl font-bold text-gray-700">
            Loading Products...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Product Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage seafood products, preparation options, pricing and stock.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto">

          {/* SEARCH */}

          <div className="relative w-full sm:w-72">

            <FaSearch
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full outline-none focus:ring-2 focus:ring-cyan-500"
            />

          </div>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="All">
              All Categories
            </option>

            <option value="Live Fish">
              Live Fish
            </option>

            <option value="Fresh Water Fish">
              Fresh Water Fish
            </option>

            <option value="Sea Fish">
              Sea Fish
            </option>

            <option value="Kolkata Fish">
              Kolkata Fish
            </option>

            <option value="Prawns">
              Prawns
            </option>

            <option value="Crabs">
              Crabs
            </option>
          </select>

        </div>
      </div>

      {/* =====================================================
          DASHBOARD CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Total Products
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-cyan-100 p-4 rounded-full">
            <FaBoxes
              size={28}
              className="text-cyan-600"
            />
          </div>

        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Low Stock
            </p>

            <h2 className="text-3xl font-bold text-orange-600 mt-1">
              {lowStock}
            </h2>
          </div>

          <div className="bg-orange-100 p-4 rounded-full">
            <FaExclamationTriangle
              size={28}
              className="text-orange-500"
            />
          </div>

        </div>

        {/* OUT OF STOCK */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Out Of Stock
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-1">
              {outOfStock}
            </h2>
          </div>

          <div className="bg-red-100 p-4 rounded-full">
            <FaFish
              size={28}
              className="text-red-600"
            />
          </div>

        </div>

        {/* UNAVAILABLE */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Unavailable
            </p>

            <h2 className="text-3xl font-bold text-gray-600 mt-1">
              {unavailableProducts}
            </h2>
          </div>

          <div className="bg-gray-100 p-4 rounded-full">
            <FaTimesCircle
              size={28}
              className="text-gray-500"
            />
          </div>

        </div>

      </div>

      {/* =====================================================
          RESULT INFO
      ===================================================== */}

      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredList.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {totalProducts}
          </span>{" "}
          products
        </p>

        {(search || categoryFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
            }}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium text-left sm:text-right"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <div className="space-y-5">

        {filteredList.length === 0 ? (

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">

            <FaFish
              className="mx-auto text-gray-300 mb-4"
              size={50}
            />

            <h2 className="text-xl font-semibold text-gray-700">
              No products found
            </h2>

            <p className="text-gray-500 mt-1">
              Try changing your search or category filter.
            </p>

          </div>

        ) : (

          filteredList.map((item) => {

            // =================================================
            // NORMALIZE PREPARATION OPTIONS
            // =================================================

            const preparationOptions = Array.isArray(
              item.preparationOptions
            )
              ? item.preparationOptions.filter(Boolean)
              : [];

            const stock = Number(item.stock || 0);

            const isOutOfStock = stock <= 0;

            const isLowStock =
              stock > 0 && stock <= 5;

            const isAvailable =
              item.isAvailable !== false &&
              !isOutOfStock;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 p-5"
              >

                <div className="grid grid-cols-1 xl:grid-cols-[110px_minmax(220px,2fr)_170px_130px_150px_220px] gap-5 items-center">

                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  <div className="relative group flex justify-center xl:justify-start">

                    {item.image?.[0] ? (

                      <>
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="w-24 h-24 rounded-xl object-cover cursor-pointer border border-gray-200"
                        />

                        <div className="hidden group-hover:block absolute left-0 xl:left-28 top-0 z-50">

                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-56 h-56 rounded-xl shadow-2xl border bg-white object-cover"
                          />

                        </div>
                      </>

                    ) : (

                      <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">

                        <FaFish
                          size={35}
                          className="text-gray-400"
                        />

                      </div>

                    )}

                  </div>

                  {/* =========================================
                      PRODUCT
                  ========================================= */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-xl font-bold text-gray-800">
                        {item.name}
                      </h2>

                      {item.bestseller && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          Bestseller
                        </span>
                      )}

                    </div>

                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {item.overview ||
                        "No overview available"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">

                      <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium">

                        <FaTag className="inline mr-1" />

                        {item.category}

                      </span>

                      {item.subCategory && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                          {item.subCategory}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* =========================================
                      PREPARATION
                  ========================================= */}

                  <div>

                    <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">

                      <FaCut className="text-cyan-600" />

                      Preparation

                    </p>

                    {preparationOptions.length > 0 ? (

                      <div className="flex flex-wrap gap-1.5">

                        {preparationOptions.map(
                          (option, index) => {

                            // =================================
                            // IMPORTANT FIX
                            // Never render the object directly.
                            // =================================

                            const preparationName =
                              getPreparationName(option);

                            return (
                              <span
                                key={
                                  option?._id ||
                                  `${preparationName}-${index}`
                                }
                                className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {preparationName}
                              </span>
                            );
                          }
                        )}

                      </div>

                    ) : (

                      <span className="inline-block bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        Not configured
                      </span>

                    )}

                  </div>

                  {/* =========================================
                      PRICE
                  ========================================= */}

                  <div>

                    <p className="text-gray-500 text-sm">
                      Price / KG
                    </p>

                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {currency}
                      {item.price}
                    </p>

                  </div>

                  {/* =========================================
                      STOCK
                  ========================================= */}

                  <div>

                    <p className="text-gray-500 text-sm">
                      Stock
                    </p>

                    <p
                      className={`text-xl font-bold mt-1 ${
                        isOutOfStock
                          ? "text-red-600"
                          : isLowStock
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {stock} KG
                    </p>

                    {isOutOfStock ? (

                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full mt-1">

                        <FaTimesCircle />

                        Out Of Stock

                      </span>

                    ) : isLowStock ? (

                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full mt-1">

                        <FaExclamationTriangle />

                        Low Stock

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full mt-1">

                        <FaCheckCircle />

                        In Stock

                      </span>

                    )}

                  </div>

                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  <div className="flex flex-col gap-3">

                    {/* AVAILABILITY */}

                    <div className="flex items-center gap-2">

                      {isAvailable ? (

                        <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold">

                          <FaCheckCircle />

                          Available

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold">

                          <FaTimesCircle />

                          Unavailable

                        </span>

                      )}

                    </div>

                    {/* BUTTONS */}

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/add", {
                            state: {
                              product: item,
                            },
                          })
                        }
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
                      >
                        <FaEdit />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeProduct(item._id)
                        }
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                      >
                        <FaTrash />

                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
};

export default List;
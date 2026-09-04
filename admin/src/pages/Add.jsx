import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

import {
  FaCloudUploadAlt,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";

const Add = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingProduct = location.state?.product || null;

  // =========================
  // BASIC PRODUCT STATES
  // =========================
  const [category, setCategory] = useState("Live Fish");
  const [subCategory, setSubCategory] = useState("Boneless Fish");

  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);

  const [isAvailable, setIsAvailable] = useState(true);
  const [bestseller, setBestseller] = useState(false);

  // =========================
  // IMAGE
  // =========================
  const [image, setImage] = useState(null);

  // =========================
  // WEIGHT
  // =========================
  const [weight, setWeight] = useState({
    min: "",
    max: "",
  });

  // =========================
  // DESCRIPTION
  // =========================
  const [description, setDescription] = useState({
    proteins: "",
    calories: "",
    vitamins: "",
    minerals: "",
    uses: "",
    benefits: [],
  });

  const [benefitInput, setBenefitInput] = useState("");

  // =========================
  // PREPARATION OPTIONS
  // =========================
  const [preparationOptions, setPreparationOptions] = useState([]);
  const [customPreparation, setCustomPreparation] = useState("");

  const preparationPresets = {
    fish: ["Whole & Cleaned", "Curry Cut", "Fry Cut"],
    prawns: ["Cleaned", "Cleaned & Deveined"],
    crabs: ["Whole Cleaned", "Cut & Cleaned"],
  };

  // ==========================================================
  // HELPERS FOR PREPARATION OPTIONS
  // ==========================================================

  const getPreparationName = (option) => {
    if (typeof option === "string") return option;
    return option?.name || "";
  };

  const getPreparationPrice = (option) => {
    if (
      typeof option === "object" &&
      option !== null &&
      Number.isFinite(Number(option.pricePerKg))
    ) {
      return Number(option.pricePerKg);
    }

    return Number(price) || 0;
  };

  // ==========================================================
  // LOAD PRODUCT WHEN EDITING
  // ==========================================================

  useEffect(() => {
    if (!editingProduct) return;

    setCategory(editingProduct.category || "Live Fish");
    setSubCategory(editingProduct.subCategory || "Boneless Fish");

    setName(editingProduct.name || "");
    setOverview(editingProduct.overview || "");
    setPrice(editingProduct.price ?? "");
    setStock(editingProduct.stock ?? 0);

    setIsAvailable(
      editingProduct.isAvailable !== undefined
        ? editingProduct.isAvailable
        : true
    );

    setBestseller(
      editingProduct.bestseller !== undefined
        ? editingProduct.bestseller
        : false
    );

    // Load weight
    if (editingProduct.minQuantity || editingProduct.maxQuantity) {
      setWeight({
        min: editingProduct.minQuantity ?? "",
        max: editingProduct.maxQuantity ?? "",
      });
    }

    // Load description
    setDescription({
      proteins: editingProduct.description?.proteins || "",
      calories: editingProduct.description?.calories || "",
      vitamins: editingProduct.description?.vitamins || "",
      minerals: editingProduct.description?.minerals || "",
      uses: editingProduct.description?.uses || "",
      benefits: Array.isArray(editingProduct.description?.benefits)
        ? editingProduct.description.benefits
        : [],
    });

    // ========================================================
    // IMPORTANT:
    // Normalize old string preparation options into objects.
    // ========================================================

    setPreparationOptions(
      Array.isArray(editingProduct.preparationOptions)
        ? editingProduct.preparationOptions
            .map((option) => {
              if (typeof option === "string") {
                return {
                  name: option,
                  pricePerKg: Number(editingProduct.price) || 0,
                };
              }

              const parsedPrice = Number(option?.pricePerKg);

              return {
                name: option?.name || "",
                pricePerKg: Number.isFinite(parsedPrice)
                  ? parsedPrice
                  : Number(editingProduct.price) || 0,
              };
            })
            .filter((option) => option.name)
        : []
    );
  }, [editingProduct]);

  // ==========================================================
  // PREPARATION PRESET TYPE
  // ==========================================================

  const getPreparationType = () => {
    const categoryText = category.toLowerCase();
    const subCategoryText = subCategory.toLowerCase();

    if (
      categoryText.includes("prawn") ||
      categoryText.includes("shrimp") ||
      subCategoryText.includes("prawn") ||
      subCategoryText.includes("shrimp")
    ) {
      return "prawns";
    }

    if (
      categoryText.includes("crab") ||
      subCategoryText.includes("crab")
    ) {
      return "crabs";
    }

    return "fish";
  };

  // ==========================================================
  // TOGGLE PREPARATION OPTION
  // ==========================================================

  const togglePreparation = (option) => {
    setPreparationOptions((current) => {
      const exists = current.some(
        (item) =>
          getPreparationName(item).toLowerCase() === option.toLowerCase()
      );

      if (exists) {
        return current.filter(
          (item) =>
            getPreparationName(item).toLowerCase() !==
            option.toLowerCase()
        );
      }

      return [
        ...current,
        {
          name: option,
          pricePerKg: Number(price) || 0,
        },
      ];
    });
  };

  // ==========================================================
  // ADD CUSTOM PREPARATION
  // ==========================================================

  const addCustomPreparation = () => {
    const cleaned = customPreparation.trim();

    if (!cleaned) {
      toast.error("Please enter a preparation option");
      return;
    }

    const alreadyExists = preparationOptions.some(
      (option) =>
        getPreparationName(option).toLowerCase() === cleaned.toLowerCase()
    );

    if (alreadyExists) {
      toast.error("This preparation option already exists");
      return;
    }

    setPreparationOptions((current) => [
      ...current,
      {
        name: cleaned,
        pricePerKg: Number(price) || 0,
      },
    ]);

    setCustomPreparation("");
  };

  // ==========================================================
  // REMOVE PREPARATION
  // ==========================================================

  const removePreparation = (option) => {
    const optionName = getPreparationName(option);

    setPreparationOptions((current) =>
      current.filter(
        (item) =>
          getPreparationName(item).toLowerCase() !==
          optionName.toLowerCase()
      )
    );
  };

  // ==========================================================
  // BENEFITS
  // ==========================================================

  const addBenefit = () => {
    const cleaned = benefitInput.trim();

    if (!cleaned) return;

    setDescription((current) => ({
      ...current,
      benefits: [...current.benefits, cleaned],
    }));

    setBenefitInput("");
  };

  const removeBenefit = (index) => {
    setDescription((current) => ({
      ...current,
      benefits: current.benefits.filter((_, i) => i !== index),
    }));
  };

  // ==========================================================
  // DESCRIPTION CHANGE
  // ==========================================================

  const handleDescriptionChange = (field, value) => {
    setDescription((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // -----------------------------------------
      // BASIC VALIDATION
      // -----------------------------------------

      if (!name.trim()) {
        toast.error("Please enter product name");
        return;
      }

      if (!overview.trim()) {
        toast.error("Please enter product overview");
        return;
      }

      if (!price || Number(price) < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (Number(stock) < 0) {
        toast.error("Stock cannot be negative");
        return;
      }

      if (preparationOptions.length === 0) {
        toast.error("Please select at least one preparation option");
        return;
      }

      // -----------------------------------------
      // NORMALIZE PREPARATION OPTIONS
      // -----------------------------------------
      //
      // MongoDB schema expects:
      //
      // [
      //   {
      //     name: "Whole & Cleaned",
      //     pricePerKg: 500
      //   }
      // ]
      //
      // NOT:
      //
      // ["Whole & Cleaned"]
      //
      // -----------------------------------------

      const finalPreparationOptions = preparationOptions
        .map((option) => ({
          name: getPreparationName(option).trim(),
          pricePerKg: getPreparationPrice(option),
        }))
        .filter(
          (option) =>
            option.name &&
            Number.isFinite(option.pricePerKg) &&
            option.pricePerKg >= 0
        );

      if (finalPreparationOptions.length === 0) {
        toast.error("Please add a valid preparation option");
        return;
      }

      // -----------------------------------------
      // CREATE FORM DATA
      // -----------------------------------------

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("overview", overview.trim());

      formData.append("category", category);
      formData.append("subCategory", subCategory);

      formData.append("price", Number(price));
      formData.append("stock", Number(stock));

      formData.append("isAvailable", isAvailable);
      formData.append("bestseller", bestseller);

      // Weight
      formData.append(
        "minQuantity",
        weight.min !== "" ? Number(weight.min) : 0.5
      );

      formData.append(
        "maxQuantity",
        weight.max !== "" ? Number(weight.max) : 10
      );

      // Description
      formData.append(
        "description",
        JSON.stringify({
          proteins: description.proteins || "",
          calories: description.calories || "",
          vitamins: description.vitamins || "",
          minerals: description.minerals || "",
          uses: description.uses || "",
          benefits: Array.isArray(description.benefits)
            ? description.benefits
            : [],
        })
      );

      // ======================================================
      // IMPORTANT FIX
      // ======================================================

      formData.append(
        "preparationOptions",
        JSON.stringify(finalPreparationOptions)
      );

      // -----------------------------------------
      // IMAGE
      // -----------------------------------------

      if (image) {
        formData.append("image", image);
      }

      // -----------------------------------------
      // EDIT PRODUCT ID
      // -----------------------------------------

      if (editingProduct) {
        formData.append("id", editingProduct._id);
      }

      // -----------------------------------------
      // API URL
      // -----------------------------------------

      const url = editingProduct
        ? `${backendUrl}/api/product/update`
        : `${backendUrl}/api/product/add`;

      // -----------------------------------------
      // API REQUEST
      // -----------------------------------------

      const response = await axios.post(url, formData, {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        toast.success(
          editingProduct
            ? "Product updated successfully"
            : "Product added successfully"
        );

        // Clear form
        setName("");
        setOverview("");
        setPrice("");
        setStock(0);
        setImage(null);

        setWeight({
          min: "",
          max: "",
        });

        setDescription({
          proteins: "",
          calories: "",
          vitamins: "",
          minerals: "",
          uses: "",
          benefits: [],
        });

        setPreparationOptions([]);
        setCustomPreparation("");
        setBenefitInput("");

        // Go back to product list
        navigate("/list");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Product submit error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save product"
      );
    }
  };

  // ==========================================================
  // IMAGE PREVIEW
  // ==========================================================

  const imagePreview = image
    ? URL.createObjectURL(image)
    : editingProduct?.image?.[0] || null;

  // ==========================================================
  // CURRENT PREPARATION PRESETS
  // ==========================================================

  const currentPresets =
    preparationPresets[getPreparationType()] || preparationPresets.fish;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-6xl mx-auto pb-12"
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-2"
          >
            <FaArrowLeft />
            Back to Products
          </button>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {editingProduct
              ? "Update seafood product details"
              : "Add a new seafood product to your store"}
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
        >
          <FaSave />

          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* ======================================================
          IMAGE + BASIC DETAILS
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* IMAGE */}
        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">
            Product Image
          </h2>

          <label
            htmlFor="product-image"
            className="block cursor-pointer"
          >
            <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400 px-4">
                  <FaCloudUploadAlt className="text-4xl mx-auto mb-3" />

                  <p className="text-sm font-medium">
                    Upload Product Image
                  </p>

                  <p className="text-xs mt-1">
                    JPG, PNG or WEBP
                  </p>
                </div>
              )}
            </div>

            <input
              id="product-image"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];

                if (selectedFile) {
                  setImage(selectedFile);
                }
              }}
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              <FaTrash />
              Remove New Image
            </button>
          )}

          {editingProduct?.image?.[0] && !image && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              Current image will remain unless you upload a new one.
            </p>
          )}
        </div>

        {/* BASIC DETAILS */}
        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-5">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NAME */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: Rohu Fish"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPreparationOptions([]);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              >
                <option value="Live Fish">Live Fish</option>
                <option value="Prawns">Prawns</option>
                <option value="Crabs">Crabs</option>
                <option value="Sea Fish">Sea Fish</option>
                <option value="Freshwater Fish">
                  Freshwater Fish
                </option>
              </select>
            </div>

            {/* SUB CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>

              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Example: Boneless Fish"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per KG (₹)
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="500"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            {/* STOCK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* OVERVIEW */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Overview
              </label>

              <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Short description of the seafood product..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black resize-none"
                required
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-5 h-5"
              />

              <div>
                <p className="font-medium text-gray-800">
                  Available For Orders
                </p>

                <p className="text-xs text-gray-500">
                  Customers can order this product
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={(e) => setBestseller(e.target.checked)}
                className="w-5 h-5"
              />

              <div>
                <p className="font-medium text-gray-800">
                  Bestseller
                </p>

                <p className="text-xs text-gray-500">
                  Show this product in bestseller section
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* ======================================================
          WEIGHT
      ====================================================== */}

      <div className="bg-white border rounded-2xl p-5 mt-6">
        <h2 className="font-semibold text-gray-800 mb-1">
          Quantity / Weight
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Set the minimum and maximum quantity customers can order.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Quantity (KG)
            </label>

            <input
              type="number"
              min="0.1"
              step="0.1"
              value={weight.min}
              onChange={(e) =>
                setWeight((current) => ({
                  ...current,
                  min: e.target.value,
                }))
              }
              placeholder="0.5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Quantity (KG)
            </label>

            <input
              type="number"
              min="0.1"
              step="0.1"
              value={weight.max}
              onChange={(e) =>
                setWeight((current) => ({
                  ...current,
                  max: e.target.value,
                }))
              }
              placeholder="10"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          PREPARATION OPTIONS
      ====================================================== */}

      <div className="bg-white border rounded-2xl p-5 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="font-semibold text-gray-800">
              Preparation Options
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select how customers can request this product.
            </p>
          </div>

          <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-600">
            {preparationOptions.length} selected
          </span>
        </div>

        {/* PRESETS */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Common Options
          </p>

          <div className="flex flex-wrap gap-2">
            {currentPresets.map((option) => {
              const selected = preparationOptions.some(
                (item) =>
                  getPreparationName(item).toLowerCase() ===
                  option.toLowerCase()
              );

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => togglePreparation(option)}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    selected
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* CUSTOM OPTION */}
        <div className="border-t pt-5">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Add Custom Preparation
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              value={customPreparation}
              onChange={(e) => setCustomPreparation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomPreparation();
                }
              }}
              placeholder="Example: Boneless Cut"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={addCustomPreparation}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black"
            >
              <FaPlus />
              Add
            </button>
          </div>
        </div>

        {/* SELECTED OPTIONS */}
        {preparationOptions.length > 0 && (
          <div className="border-t mt-6 pt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Selected Options
            </p>

            <div className="flex flex-wrap gap-2">
              {preparationOptions.map((option, index) => (
                <div
                  key={`${getPreparationName(option)}-${index}`}
                  className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-gray-700">
                    {getPreparationName(option)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removePreparation(option)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          DESCRIPTION DETAILS
      ====================================================== */}

      <div className="bg-white border rounded-2xl p-5 mt-6">
        <h2 className="font-semibold text-gray-800 mb-5">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* PROTEINS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proteins
            </label>

            <input
              type="text"
              value={description.proteins}
              onChange={(e) =>
                handleDescriptionChange("proteins", e.target.value)
              }
              placeholder="Example: 20g per 100g"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* CALORIES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories
            </label>

            <input
              type="text"
              value={description.calories}
              onChange={(e) =>
                handleDescriptionChange("calories", e.target.value)
              }
              placeholder="Example: 120 kcal"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* VITAMINS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vitamins
            </label>

            <input
              type="text"
              value={description.vitamins}
              onChange={(e) =>
                handleDescriptionChange("vitamins", e.target.value)
              }
              placeholder="Example: Vitamin D, B12"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* MINERALS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minerals
            </label>

            <input
              type="text"
              value={description.minerals}
              onChange={(e) =>
                handleDescriptionChange("minerals", e.target.value)
              }
              placeholder="Example: Iron, Zinc"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* USES */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uses
            </label>

            <textarea
              value={description.uses}
              onChange={(e) =>
                handleDescriptionChange("uses", e.target.value)
              }
              placeholder="Example: Suitable for curry, fry and biryani..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black resize-none"
            />
          </div>
        </div>

        {/* ====================================================
            BENEFITS
        ==================================================== */}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefits
          </label>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addBenefit();
                }
              }}
              placeholder="Example: High in protein"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={addBenefit}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black"
            >
              <FaPlus />
              Add Benefit
            </button>
          </div>

          {description.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {description.benefits.map((benefit, index) => (
                <div
                  key={`${benefit}-${index}`}
                  className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-gray-700">
                    {benefit}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => navigate("/list")}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-black text-white hover:bg-gray-800"
        >
          <FaSave />

          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default Add;
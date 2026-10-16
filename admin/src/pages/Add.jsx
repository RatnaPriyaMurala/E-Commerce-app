
import React, { useEffect, useMemo, useState } from "react";
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

const PREPARATION_CHARGE_PER_KG = 40;

const CATEGORY_PREPARATIONS = {
  fish: [
    "Whole Cleaned",
    "Uncleaned",
    "Curry Cut",
    "Fry Cut",
  ],
  prawns: ["Whole Cleaned", "Uncleaned"],
  crabs: ["Whole Cleaned", "Uncleaned"],
};

const CATEGORIES_WITHOUT_PREPARATION = [
  "Boneless",
  "Dry Fish",
  "Dry Prawns",
  "Pickles",
];

const getPreparationType = (category = "", subCategory = "") => {
  const text = `${category} ${subCategory}`.toLowerCase();

  if (text.includes("prawn") || text.includes("shrimp")) {
    return "prawns";
  }

  if (text.includes("crab")) {
    return "crabs";
  }

  return "fish";
};

const getCategoryPreparations = (category, subCategory = "") => {
  if (CATEGORIES_WITHOUT_PREPARATION.includes(category)) {
    return [];
  }

  return CATEGORY_PREPARATIONS[
    getPreparationType(category, subCategory)
  ] || CATEGORY_PREPARATIONS.fish;
};

const isWholeKilogram = (value) =>
  Number.isInteger(Number(value)) && Number(value) >= 1;

const Add = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product || null;

  // =========================================================
  // BASIC PRODUCT DETAILS
  // =========================================================

  const [category, setCategory] = useState("Fresh Water Fish");
  const [subCategory, setSubCategory] = useState("");
  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [isAvailable, setIsAvailable] = useState(true);
  const [bestseller, setBestseller] = useState(false);

  const isPrawns = category === "Prawns";
  const isBoneless = category === "Boneless";
  const isDryCategory = [
    "Dry Fish",
    "Dry Prawns",
    "Pickles",
  ].includes(category);

  const requiresPreparation =
    !CATEGORIES_WITHOUT_PREPARATION.includes(category);

  const preparationPresets = useMemo(
    () => getCategoryPreparations(category, subCategory),
    [category, subCategory]
  );

  // =========================================================
  // PRAWN COUNT VARIANTS
  // =========================================================

  const [prawnVariants, setPrawnVariants] = useState([]);

  const addPrawnVariant = () => {
    setPrawnVariants((current) => [
      ...current,
      {
        count: "",
        pricePerKg: "",
        stock: "0",
        isAvailable: true,
      },
    ]);
  };

  const updatePrawnVariant = (index, field, value) => {
    setPrawnVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const removePrawnVariant = (index) => {
    setPrawnVariants((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!image) {
      setImagePreview(editingProduct?.image?.[0] || null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image, editingProduct]);

  // =========================================================
  // WEIGHT LIMITS
  // All customer order weights must be whole kg, minimum 1 kg.
  // =========================================================

  const [weight, setWeight] = useState({
    min: "1",
    max: "10",
  });

  // =========================================================
  // DESCRIPTION
  // =========================================================

  const [description, setDescription] = useState({
    proteins: "",
    calories: "",
    vitamins: "",
    minerals: "",
    uses: "",
    benefits: [],
  });

  const [benefitInput, setBenefitInput] = useState("");

  // =========================================================
  // PREPARATION OPTIONS
  //
  // Options are fixed by category:
  // Fish: 4 options
  // Prawns: 2 options
  // Crabs: 2 options
  // Boneless and dry categories: no preparation options
  //
  // The price field in each option is retained for compatibility
  // with the existing product data structure. It is NOT the
  // preparation charge. The service charge is a separate ₹40/kg.
  // =========================================================

  const [preparationOptions, setPreparationOptions] = useState([]);

  const makePreparationOptions = (
    productCategory,
    productSubCategory,
    productPrice
  ) => {
    const options = getCategoryPreparations(
      productCategory,
      productSubCategory
    );

    return options.map((option) => ({
      name: option,
      pricePerKg: Number(productPrice) || 0,
    }));
  };

  // =========================================================
  // LOAD PRODUCT FOR EDITING
  // =========================================================

  useEffect(() => {
    if (!editingProduct) return;

    const loadedCategory =
      editingProduct.category || "Fresh Water Fish";
    const loadedSubCategory = editingProduct.subCategory || "";
    const loadedPrice = editingProduct.price ?? "";

    setCategory(loadedCategory);
    setSubCategory(loadedSubCategory);
    setName(editingProduct.name || "");
    setOverview(editingProduct.overview || "");
    setPrice(loadedPrice);
    setStock(String(editingProduct.stock ?? 0));

    setIsAvailable(editingProduct.isAvailable !== false);
    setBestseller(editingProduct.bestseller === true);

    setPrawnVariants(
      Array.isArray(editingProduct.variants)
        ? editingProduct.variants.map((variant) => ({
            _id: variant._id,
            count: variant.count || "",
            pricePerKg: variant.pricePerKg ?? "",
            stock: String(variant.stock ?? 0),
            isAvailable: variant.isAvailable !== false,
          }))
        : []
    );

    const loadedMin = Number(editingProduct.minQuantity);
    const loadedMax = Number(editingProduct.maxQuantity);

    setWeight({
      min:
        Number.isInteger(loadedMin) && loadedMin >= 1
          ? String(loadedMin)
          : "1",
      max:
        Number.isInteger(loadedMax) && loadedMax >= 1
          ? String(loadedMax)
          : "10",
    });

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

    // Use the correct fixed preparation options for this category.
    setPreparationOptions(
      makePreparationOptions(
        loadedCategory,
        loadedSubCategory,
        loadedPrice
      )
    );
  }, [editingProduct]);

  // Keep preparation options consistent when category changes.
  useEffect(() => {
    setPreparationOptions(
      makePreparationOptions(category, subCategory, price)
    );
  }, [category, subCategory, price]);

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = (value) => {
    setCategory(value);

    if (value !== "Prawns") {
      setPrawnVariants([]);
    }

    // Reset weight defaults to whole kg.
    setWeight({ min: "1", max: "10" });
  };

  // =========================================================
  // DESCRIPTION HANDLERS
  // =========================================================

  const handleDescriptionChange = (field, value) => {
    setDescription((current) => ({
      ...current,
      [field]: value,
    }));
  };

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

  // =========================================================
  // VALIDATE AND SUBMIT
  // =========================================================

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!name.trim()) {
        toast.error("Please enter a product name");
        return;
      }

      if (!overview.trim()) {
        toast.error("Please enter a product overview");
        return;
      }

      if (
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
      ) {
        toast.error("Please enter a valid price greater than zero");
        return;
      }

      if (
        stock === "" ||
        !Number.isFinite(Number(stock)) ||
        Number(stock) < 0
      ) {
        toast.error("Stock cannot be negative");
        return;
      }

      // Validate whole-kilogram minimum and maximum.
      const minQuantity = Number(weight.min);
      const maxQuantity = Number(weight.max);

      if (!isWholeKilogram(minQuantity)) {
        toast.error("Minimum order quantity must be at least 1 whole KG");
        return;
      }

      if (!isWholeKilogram(maxQuantity)) {
        toast.error("Maximum order quantity must be a whole KG");
        return;
      }

      if (maxQuantity < minQuantity) {
        toast.error("Maximum quantity cannot be less than minimum quantity");
        return;
      }

      // =====================================================
      // VALIDATE PRAWN VARIANTS
      // =====================================================

      let finalPrawnVariants = [];

      if (isPrawns) {
        if (prawnVariants.length === 0) {
          toast.error("Please add at least one prawn count variant");
          return;
        }

        const usedCounts = new Set();

        for (const variant of prawnVariants) {
          const count = String(variant.count || "").trim();
          const variantPrice = Number(variant.pricePerKg);
          const variantStock = Number(variant.stock);

          if (!count) {
            toast.error("Please enter a count label for every prawn variant");
            return;
          }

          if (usedCounts.has(count.toLowerCase())) {
            toast.error(`Duplicate prawn count: ${count}`);
            return;
          }

          usedCounts.add(count.toLowerCase());

          if (
            variant.pricePerKg === "" ||
            !Number.isFinite(variantPrice) ||
            variantPrice <= 0
          ) {
            toast.error(`Enter a valid price for prawn count ${count}`);
            return;
          }

          if (
            variant.stock === "" ||
            !Number.isFinite(variantStock) ||
            variantStock < 0
          ) {
            toast.error(`Enter valid stock for prawn count ${count}`);
            return;
          }

          finalPrawnVariants.push({
            ...(variant._id ? { _id: variant._id } : {}),
            count,
            pricePerKg: variantPrice,
            stock: variantStock,
            isAvailable: variant.isAvailable !== false,
          });
        }
      }

      // =====================================================
      // FIXED PREPARATION OPTIONS
      // =====================================================

      const expectedOptions = getCategoryPreparations(
        category,
        subCategory
      );

      const finalPreparationOptions = expectedOptions.map((option) => ({
        name: option,
        // Retained for compatibility with the current schema.
        // Backend must calculate the ₹40 service charge separately.
        pricePerKg: Number(price),
      }));

      // =====================================================
      // CREATE FORM DATA
      // =====================================================

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("overview", overview.trim());
      formData.append("category", category);
      formData.append("subCategory", subCategory.trim());
      formData.append("price", String(Number(price)));
      formData.append("stock", String(Number(stock)));
      formData.append("isAvailable", String(isAvailable));
      formData.append("bestseller", String(bestseller));

      // Fixed service charge for products requiring preparation.
      // Boneless and dry products always have zero preparation charge.
      formData.append(
        "preparationChargePerKg",
        String(requiresPreparation ? PREPARATION_CHARGE_PER_KG : 0)
      );

      formData.append(
        "requiresPreparation",
        String(requiresPreparation)
      );

      // Prawn variants retain their own count, price and stock.
      formData.append(
        "variants",
        JSON.stringify(isPrawns ? finalPrawnVariants : [])
      );

      // Whole-kilogram limits.
      formData.append("minQuantity", String(minQuantity));
      formData.append("maxQuantity", String(maxQuantity));

      // Product description.
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

      formData.append(
        "preparationOptions",
        JSON.stringify(finalPreparationOptions)
      );

      if (image) {
        formData.append("image", image);
      }

      if (editingProduct) {
        formData.append("id", editingProduct._id);
      }

      const url = editingProduct
        ? `${backendUrl}/api/product/update`
        : `${backendUrl}/api/product/add`;

      const response = await axios.post(url, formData, {
        headers: { token },
      });

      if (!response.data.success) {
        toast.error(
          response.data.message || "Unable to save the product"
        );
        return;
      }

      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product added successfully"
      );

      navigate("/list");
    } catch (error) {
      console.error("Product submit error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save product"
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-6xl mx-auto pb-12"
    >
      {/* HEADER */}

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
            Add seafood, boneless fish, prawn variants and pricing.
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

      {/* IMAGE + BASIC DETAILS */}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* IMAGE */}

        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">
            Product Image
          </h2>

          <label htmlFor="product-image" className="block cursor-pointer">
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
                  <p className="text-sm font-medium">Upload Product Image</p>
                  <p className="text-xs mt-1">JPG, PNG or WEBP</p>
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
                if (selectedFile) setImage(selectedFile);
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
        </div>

        {/* BASIC DETAILS */}

        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-5">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: Rohu Fish or Boneless Rohu"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              >
                <option value="Fresh Water Fish">Fresh Water Fish</option>
                <option value="Sea Fish">Sea Fish</option>
                <option value="Kolkata Fish">Kolkata Fish</option>
                <option value="Prawns">Prawns</option>
                <option value="Crabs">Crabs</option>
                <option value="Boneless">Boneless</option>
                <option value="Dry Fish">Dry Fish</option>
                <option value="Dry Prawns">Dry Prawns</option>
                <option value="Pickles">Pickles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category / Fish Variety
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Example: Rohu, Katla, Murrel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isBoneless
                  ? "Boneless Selling Price per KG (₹)"
                  : "Base Price per KG (₹)"}
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={isBoneless ? "500" : "300"}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                required
              />
              {isBoneless && (
                <p className="text-xs text-green-700 mt-2">
                  This is the final boneless price per KG. No extra ₹40/kg
                  preparation charge will be added.
                </p>
              )}
              {isPrawns && (
                <p className="text-xs text-gray-500 mt-2">
                  Each prawn count variant below has its own price.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Stock (KG)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
              {isPrawns && (
                <p className="text-xs text-gray-500 mt-2">
                  Individual count stock is managed in the variant section.
                </p>
              )}
            </div>

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
                  Customers can order this product.
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
                <p className="font-medium text-gray-800">Bestseller</p>
                <p className="text-xs text-gray-500">
                  Show in the bestseller section.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* BONeless PRICE INFORMATION */}

      {isBoneless && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-6">
          <h2 className="font-semibold text-green-900">
            Boneless Pricing
          </h2>
          <p className="text-sm text-green-800 mt-2">
            Enter the complete boneless selling price in the price field
            above. Customers can order 1 KG, 2 KG, 3 KG and so on. The
            checkout must not add another preparation fee to this product.
          </p>
        </div>
      )}

      {/* PRAWN VARIANTS */}

      {isPrawns && (
        <div className="bg-white border rounded-2xl p-5 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-semibold text-gray-800">
                Prawn Count Variants
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Each count has a separate price and stock.
              </p>
            </div>

            <button
              type="button"
              onClick={addPrawnVariant}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              <FaPlus />
              Add Count
            </button>
          </div>

          {prawnVariants.length === 0 ? (
            <div className="border border-dashed rounded-xl p-6 text-center">
              <p className="text-sm text-gray-500">
                No count variants added yet.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Click Add Count to add the first variant.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prawnVariants.map((variant, index) => (
                <div
                  key={variant._id || `prawn-variant-${index}`}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end border rounded-xl p-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Count Label
                    </label>
                    <input
                      type="text"
                      value={variant.count}
                      onChange={(e) =>
                        updatePrawnVariant(index, "count", e.target.value)
                      }
                      placeholder="e.g. 40C"
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per KG (₹)
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={variant.pricePerKg}
                      onChange={(e) =>
                        updatePrawnVariant(
                          index,
                          "pricePerKg",
                          e.target.value
                        )
                      }
                      placeholder="1300"
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock (KG)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variant.stock}
                      onChange={(e) =>
                        updatePrawnVariant(index, "stock", e.target.value)
                      }
                      placeholder="5"
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between sm:col-span-2 lg:col-span-1 gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={variant.isAvailable}
                        onChange={(e) =>
                          updatePrawnVariant(
                            index,
                            "isAvailable",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4"
                      />
                      Available
                    </label>

                    <button
                      type="button"
                      onClick={() => removePrawnVariant(index)}
                      title="Remove variant"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <FaTrash />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WEIGHT */}

      <div className="bg-white border rounded-2xl p-5 mt-6">
        <h2 className="font-semibold text-gray-800 mb-1">
          Quantity / Weight
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Customers can order whole kilograms only. Minimum order is 1 KG.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Quantity (KG)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={weight.min}
              onChange={(e) =>
                setWeight((current) => ({
                  ...current,
                  min: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Quantity (KG)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={weight.max}
              onChange={(e) =>
                setWeight((current) => ({
                  ...current,
                  max: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>
        </div>
      </div>

      {/* FIXED PREPARATION OPTIONS */}

      {requiresPreparation && (
        <div className="bg-white border rounded-2xl p-5 mt-6">
          <h2 className="font-semibold text-gray-800">
            Preparation Options
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            These options are fixed for the selected category.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {preparationPresets.map((option) => (
              <div
                key={option}
                className="flex items-center gap-3 border rounded-xl p-4"
              >
                <span className="text-green-700 font-semibold">✓</span>
                <span className="text-sm font-medium text-gray-800">
                  {option}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-orange-50 border border-orange-200 p-4">
            <p className="font-semibold text-orange-900">
              Preparation & Cleaning Charge: ₹40 per KG
            </p>
            <p className="text-sm text-orange-800 mt-1">
              The backend and checkout must add ₹40 for every kilogram
              ordered in this category. This is separate from the product
              selling price.
            </p>
          </div>
        </div>
      )}

      {/* NO-PREPARATION INFORMATION */}

      {(isBoneless || isDryCategory) && (
        <div className="bg-gray-50 border rounded-2xl p-5 mt-6">
          <h2 className="font-semibold text-gray-800">
            No Extra Preparation Charge
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isBoneless
              ? "The price you enter is the complete boneless selling price. Do not add the ₹40/kg preparation charge."
              : "This category has no preparation selector and no preparation charge."}
          </p>
        </div>
      )}

      {/* PRODUCT DETAILS */}

      <div className="bg-white border rounded-2xl p-5 mt-6">
        <h2 className="font-semibold text-gray-800 mb-5">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        {/* BENEFITS */}

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
                  <span className="text-sm text-gray-700">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-gray-400 hover:text-red-600"
                    aria-label={`Remove ${benefit}`}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}

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

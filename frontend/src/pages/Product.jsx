import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  Link,
  useLocation,
} from "react-router-dom";

import {
  FaFish,
  FaWeightHanging,
  FaShoppingCart,
  FaStar,
  FaLeaf,
  FaHeartbeat,
  FaCheckCircle,
  FaTruck,
  FaSnowflake,
  FaCreditCard,
  FaShieldAlt,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaCut,
  FaInfoCircle,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();

  const {
    products = [],
    currency,
    addToCart,
    removeFromCart,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [weight, setWeight] = useState(0.5);
  const [selectedPreparation, setSelectedPreparation] = useState("");

  // Cart edit mode
  const editCart = location.state?.editCart === true;
  const editCartLineKey = location.state?.lineKey || "";
  const editCartWeight = Number(location.state?.weight || 0);
  const editCartPreparation =
    location.state?.preparation || "";

  // Collapsible sections
  const [showPreparation, setShowPreparation] =
    useState(false);

  const [showNutrition, setShowNutrition] =
    useState(false);

  const [showBenefits, setShowBenefits] =
    useState(false);

  const [showDescription, setShowDescription] =
    useState(false);

  const [showWhyChoose, setShowWhyChoose] =
    useState(false);

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    if (!products.length) return;

    const foundProduct = products.find(
      (item) => item._id === productId
    );

    if (!foundProduct) return;

    setProductData(foundProduct);

    const stock = Number(foundProduct.stock ?? 0);

    const minQuantity = Number(
      foundProduct.minQuantity ?? 0.5
    );

    if (editCart && editCartWeight > 0) {
      setWeight(
        Math.min(editCartWeight, stock)
      );
    } else {
      setWeight(
        stock > 0
          ? Math.min(minQuantity, stock)
          : 0
      );
    }

    if (editCart && editCartPreparation) {
      setSelectedPreparation(
        editCartPreparation
      );
    } else {
      setSelectedPreparation("");
    }
  }, [
    productId,
    products,
    editCart,
    editCartWeight,
    editCartPreparation,
  ]);

  // ============================================================
  // PREPARATION OPTIONS
  // ============================================================

  const preparationOptions = useMemo(() => {
    if (
      !productData ||
      !Array.isArray(productData.preparationOptions)
    ) {
      return [];
    }

    return productData.preparationOptions
      .map((option) => {
        if (
          option &&
          typeof option === "object" &&
          option.name
        ) {
          return {
            name: String(option.name).trim(),
            pricePerKg: Number(
              option.pricePerKg ??
                option.price ??
                productData.price ??
                0
            ),
          };
        }

        return {
          name: String(option || "").trim(),
          pricePerKg: Number(
            productData.price ?? 0
          ),
        };
      })
      .filter(
        (option) =>
          option.name &&
          Number.isFinite(option.pricePerKg) &&
          option.pricePerKg >= 0
      );
  }, [productData]);

  // ============================================================
  // LOADING
  // ============================================================

  if (!productData) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-cyan-50 flex items-center justify-center animate-pulse">
            <FaFish className="text-2xl text-cyan-600" />
          </div>

          <p className="mt-3 text-sm text-gray-500 font-medium">
            Loading fresh product...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // PRODUCT VALUES
  // ============================================================

  const min = Number(
    productData.minQuantity ?? 0.5
  );

  const max = Number(
    productData.maxQuantity ?? 10
  );

  const step = Number(
    productData.quantityStep ?? 0.5
  );

  const availableStock = Number(
    productData.stock ?? 0
  );

  const safeMin = Math.max(0, min);

  const safeStep =
    step > 0 ? step : 0.5;

  const availableMax = Math.max(
    0,
    Math.min(max, availableStock)
  );

  const isOutOfStock =
    !productData.isAvailable ||
    availableStock <= 0 ||
    availableMax < safeMin;

  const hasPreparationOptions =
    preparationOptions.length > 0;

    const categoriesWithoutPreparation = [
  "Dry Fish",
  "Dry Prawns",
  "Pickles",
];

const requiresPreparation =
  !categoriesWithoutPreparation.includes(
    productData.category?.trim()
  );

  const isPreparationSelected =
    selectedPreparation.trim().length > 0;

  const selectedPreparationOption =
    preparationOptions.find(
      (option) =>
        option.name === selectedPreparation
    );

  const productPrice = Number(
    productData.price ?? 0
  );

  const currentPricePerKg =
    selectedPreparationOption
      ? selectedPreparationOption.pricePerKg
      : productPrice;

  const estimatedTotal =
    currentPricePerKg *
    Number(weight || 0);

  // ============================================================
  // WEIGHT HANDLER
  // ============================================================

  const handleWeightChange = (value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    if (availableStock <= 0) {
      setWeight(0);
      return;
    }

    let nextValue = numericValue;

    if (nextValue < safeMin) {
      nextValue = safeMin;
    }

    if (nextValue > availableMax) {
      nextValue = availableMax;
    }

    const stepsFromMin = Math.round(
      (nextValue - safeMin) / safeStep
    );

    const steppedValue =
      safeMin +
      stepsFromMin * safeStep;

    const finalValue = Math.min(
      availableMax,
      Math.max(safeMin, steppedValue)
    );

    setWeight(
      Number(finalValue.toFixed(2))
    );
  };

  // ============================================================
  // DESCRIPTION
  // ============================================================

  const categoryDescriptions = {
    "live fish":
      "Freshly harvested seafood carefully handled and packed for dispatch.",

    "fresh water fish":
      "Freshwater fish selected for quality and carefully packed for dispatch.",

    "sea fish":
      "Premium sea fish carefully sourced, handled and packed for freshness.",

    "kolkata fish":
      "Authentic Kolkata market speciality, carefully selected and packed.",

    prawns:
      "Fresh premium prawns carefully selected and hygienically packed.",

    crabs:
      "Fresh crabs selected for quality and carefully prepared for dispatch.",
  };

  const categoryName =
    productData.category ||
    "Fresh Seafood";

  const commonDescription =
    categoryDescriptions[
      productData.category?.toLowerCase()
    ];

  const descriptionText =
    productData.overview ||
    commonDescription ||
    "Premium quality seafood, freshly sourced and carefully packed for your order.";

  // ============================================================
  // ADD / UPDATE CART
  // ============================================================

 const handleAddToCart = async () => {
  if (isOutOfStock) return;

  if (
    requiresPreparation &&
    !isPreparationSelected
  ) {
    window.alert(
      "Please select a preparation option before adding this product to your cart."
    );
    return;
  }

  if (
    !weight ||
    weight < safeMin ||
    weight > availableMax
  ) {
    window.alert(
      "Please select a valid quantity."
    );
    return;
  }

  try {
    if (editCart && editCartLineKey) {
      await removeFromCart(
        productData._id,
        editCartLineKey,
        editCartPreparation
      );
    }

    await addToCart(
      productData._id,
      weight,
      requiresPreparation
        ? selectedPreparation
        : ""
    );
  } catch (error) {
    console.error(
      "❌ Cart update error:",
      error
    );
  }
};

  // ============================================================
  // SMALL ACCORDION COMPONENT
  // ============================================================

  const AccordionHeader = ({
    icon,
    iconBg = "bg-cyan-100",
    iconColor = "text-cyan-700",
    title,
    subtitle,
    open,
    onClick,
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 text-left px-4 py-3.5"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 shrink-0 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          <span className={iconColor}>
            {icon}
          </span>
        </div>

        <div className="min-w-0">
          <h2 className="font-bold text-sm sm:text-base text-gray-800">
            {title}
          </h2>

          {subtitle && (
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {open ? (
        <FaChevronUp className="shrink-0 text-gray-400 text-xs" />
      ) : (
        <FaChevronDown className="shrink-0 text-gray-400 text-xs" />
      )}
    </button>
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-3 sm:pt-5 pb-8 overflow-hidden">

      {/* ========================================================
          BREADCRUMB
      ======================================================== */}

      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-3 overflow-hidden">
        <Link
          to="/"
          className="hover:text-cyan-600 shrink-0"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          to="/menu"
          className="hover:text-cyan-600 shrink-0"
        >
          Menu
        </Link>

        <span>/</span>

        <span className="text-cyan-700 font-medium truncate">
          {productData.name}
        </span>
      </div>

      {/* ========================================================
          MAIN PRODUCT
      ======================================================== */}

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-8 items-start">

        {/* IMAGE */}

        <div className="lg:sticky lg:top-20">
          <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

            {productData.bestseller && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow">
                <FaStar />
                Bestseller
              </div>
            )}

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 text-cyan-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow">
              <FaCheckCircle className="text-green-500" />

              {isOutOfStock
                ? "Unavailable"
                : "Available"}
            </div>

            <div className="bg-gray-50">
              {productData.image?.[0] ? (
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-full h-[260px] sm:h-[350px] lg:h-[440px] object-cover"
                />
              ) : (
                <div className="w-full h-[260px] sm:h-[350px] lg:h-[440px] flex items-center justify-center bg-cyan-50">
                  <FaFish className="text-6xl text-cyan-300" />
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between gap-3 text-[10px] sm:text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <FaSnowflake className="text-cyan-600" />
                Hygienically Packed
              </span>

              <span className="flex items-center gap-1.5">
                <FaBoxOpen className="text-cyan-600" />
                Carefully Dispatched
              </span>
            </div>
          </div>
        </div>

        {/* INFORMATION */}

        <div>

          <span className="inline-flex items-center gap-1.5 text-cyan-700 font-bold uppercase tracking-wide text-[10px] sm:text-xs">
            <FaFish />
            {categoryName}
          </span>

          <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 leading-tight">
            {productData.name}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-5">
            {descriptionText}
          </p>

          {/* PRICE */}

          <div className="mt-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-3.5 shadow-md">

            <p className="text-[10px] text-cyan-100 uppercase tracking-wide">
              {isPreparationSelected
                ? `${selectedPreparation} price`
                : "Base price"}
            </p>

            <div className="flex items-end justify-between gap-3">
              <div className="flex items-end gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold">
                  {currency}
                  {currentPricePerKg.toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span className="text-xs text-cyan-100 mb-1">
                  / KG
                </span>
              </div>

              {weight > 0 && (
                <div className="text-right">
                  <p className="text-[9px] text-cyan-200">
                    Estimated total
                  </p>

                  <p className="font-bold text-sm">
                    {currency}
                    {estimatedTotal.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* STOCK */}

          <div className="grid grid-cols-3 gap-2 mt-3">

            <div className="rounded-lg bg-green-50 border border-green-100 px-2.5 py-2">
              <p className="text-[9px] text-gray-500">
                Available
              </p>

              <p className="mt-0.5 text-sm font-bold text-green-700">
                {Math.max(
                  0,
                  availableStock
                ).toFixed(1)} KG
              </p>
            </div>

            <div className="rounded-lg bg-cyan-50 border border-cyan-100 px-2.5 py-2">
              <p className="text-[9px] text-gray-500">
                Min Order
              </p>

              <p className="mt-0.5 text-sm font-bold text-cyan-700">
                {safeMin} KG
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 border border-orange-100 px-2.5 py-2">
              <p className="text-[9px] text-gray-500">
                Max Order
              </p>

              <p className="mt-0.5 text-sm font-bold text-orange-600">
                {availableMax.toFixed(1)} KG
              </p>
            </div>
          </div>

          {/* QUANTITY */}

          <div className="mt-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3.5">

            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <FaWeightHanging className="text-cyan-700 text-xs" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-800">
                    Select Quantity
                  </h3>

                  <p className="text-[10px] text-gray-500">
                    Choose order weight
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-cyan-700">
                {weight} KG
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">

              <button
                type="button"
                onClick={() =>
                  handleWeightChange(
                    weight - safeStep
                  )
                }
                disabled={
                  isOutOfStock ||
                  weight <= safeMin
                }
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-lg font-bold"
              >
                −
              </button>

              <div className="relative">
                <input
                  type="number"
                  min={safeMin}
                  max={availableMax}
                  step={safeStep}
                  value={weight}
                  disabled={isOutOfStock}
                  onChange={(e) => {
                    const value =
                      parseFloat(
                        e.target.value
                      );

                    if (
                      !Number.isNaN(value)
                    ) {
                      handleWeightChange(
                        value
                      );
                    }
                  }}
                  className="w-24 text-center border border-gray-200 rounded-lg py-2 px-2 text-sm font-bold outline-none focus:border-cyan-500"
                />

                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 pointer-events-none">
                  KG
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleWeightChange(
                    weight + safeStep
                  )
                }
                disabled={
                  isOutOfStock ||
                  weight >= availableMax
                }
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* ====================================================
              PREPARATION COLLAPSIBLE
          ==================================================== */}
{requiresPreparation && (
          <div className="mt-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            <AccordionHeader
              icon={<FaCut />}
              title="Choose Preparation"
              subtitle={
                isPreparationSelected
                  ? `${selectedPreparation} • ${currency}${currentPricePerKg}/KG`
                  : "Select how you want it prepared"
              }
              open={showPreparation}
              onClick={() =>
                setShowPreparation(
                  !showPreparation
                )
              }
            />

            {showPreparation && (
              <div className="px-3.5 pb-3.5 border-t border-gray-100">

                <div className="flex items-center justify-between py-2">
                  <span className="text-[10px] text-gray-500">
                    Preparation is required
                  </span>

                  <span className="text-[10px] font-bold text-red-500">
                    Required
                  </span>
                </div>

                {hasPreparationOptions ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {preparationOptions.map(
                      (option) => {
                        const isSelected =
                          selectedPreparation ===
                          option.name;

                        return (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() => {
                              setSelectedPreparation(
                                option.name
                              );
                              setShowPreparation(
                                false
                              );
                            }}
                            disabled={
                              isOutOfStock
                            }
                            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                              isSelected
                                ? "border-cyan-600 bg-cyan-50"
                                : "border-gray-100 bg-gray-50 hover:border-cyan-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">

                              <span
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "border-cyan-600 bg-cyan-600"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </span>

                              <span
                                className={`text-xs font-semibold truncate ${
                                  isSelected
                                    ? "text-cyan-800"
                                    : "text-gray-700"
                                }`}
                              >
                                {option.name}
                              </span>
                            </div>

                            <span className="text-[10px] font-semibold text-gray-500 shrink-0">
                              {currency}
                              {option.pricePerKg.toLocaleString(
                                "en-IN"
                              )}
                              /KG
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <div className="flex gap-2">
                      <FaInfoCircle className="text-amber-500 mt-0.5 shrink-0" />

                      <p className="text-xs text-amber-700">
                        Preparation options are not configured for this product.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isPreparationSelected && (
              <div className="px-3.5 pb-3 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-700">
                <FaCheckCircle className="text-green-500" />
                Selected: {selectedPreparation}
              </div>
            )}
          </div>

          )}

          {/* ADD TO CART */}

          <div className="mt-3">

            {!isOutOfStock ? (
              <button
                type="button"
                disabled={
  (requiresPreparation &&
    !isPreparationSelected) ||
  weight <= 0 ||
  weight > availableStock
}
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2"
              >
                <FaShoppingCart />

                {requiresPreparation &&
!isPreparationSelected
  ? "SELECT PREPARATION TO CONTINUE"
  : editCart
  ? "UPDATE CART"
  : "ADD TO CART"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-xl bg-gray-400 text-white font-bold text-sm"
              >
                OUT OF STOCK
              </button>
            )}
          </div>

          {/* ASSURANCE */}

          <div className="mt-2 flex justify-center flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <FaShieldAlt className="text-green-500" />
              Secure Order
            </span>

            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-cyan-600" />
              Quality Checked
            </span>

            <span className="flex items-center gap-1">
              <FaBoxOpen className="text-blue-600" />
              Packed Carefully
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          QUICK INFORMATION — COMPACT
      ======================================================== */}

      <div className="grid grid-cols-3 gap-2 mt-5">

        <div className="rounded-lg bg-cyan-50 border border-cyan-100 p-2.5 text-center">
          <FaSnowflake className="mx-auto text-cyan-600 text-sm" />
          <p className="mt-1 text-[9px] sm:text-xs font-semibold text-gray-700">
            Fresh & Hygienic
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-center">
          <FaTruck className="mx-auto text-blue-600 text-sm" />
          <p className="mt-1 text-[9px] sm:text-xs font-semibold text-gray-700">
            Reliable Dispatch
          </p>
        </div>

        <div className="rounded-lg bg-green-50 border border-green-100 p-2.5 text-center">
          <FaCreditCard className="mx-auto text-green-600 text-sm" />
          <p className="mt-1 text-[9px] sm:text-xs font-semibold text-gray-700">
            Secure Payments
          </p>
        </div>

      </div>

      {/* ========================================================
          RELATED PRODUCTS — MOVED UP
      ======================================================== */}

      <div className="mt-6">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>

      {/* ========================================================
          PRODUCT INFORMATION ACCORDIONS
      ======================================================== */}

      <div className="mt-5 space-y-2">

        {/* NUTRITION */}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

          <AccordionHeader
            icon={<FaLeaf />}
            iconBg="bg-green-100"
            iconColor="text-green-700"
            title="Nutritional Information"
            subtitle="Key nutritional information"
            open={showNutrition}
            onClick={() =>
              setShowNutrition(
                !showNutrition
              )
            }
          />

          {showNutrition && (
            <div className="px-3.5 pb-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 border-t border-gray-100 pt-3">

              {[
                ["Protein", productData.description?.proteins],
                ["Calories", productData.description?.calories],
                ["Vitamins", productData.description?.vitamins],
                ["Minerals", productData.description?.minerals],
                ["Uses", productData.description?.uses],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-lg p-3"
                >
                  <p className="text-[10px] text-gray-500">
                    {label}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-700">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BENEFITS */}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

          <AccordionHeader
            icon={<FaHeartbeat />}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            title="Health Benefits"
            subtitle="Benefits listed for this product"
            open={showBenefits}
            onClick={() =>
              setShowBenefits(
                !showBenefits
              )
            }
          />

          {showBenefits && (
            <div className="px-3.5 pb-3.5 border-t border-gray-100 pt-3">

              {productData.description?.benefits?.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-2">
                  {productData.description.benefits.map(
                    (benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 bg-green-50 rounded-lg p-3"
                      >
                        <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />

                        <p className="text-xs text-gray-700 leading-5">
                          {benefit}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Health benefit information is currently unavailable.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ABOUT */}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

          <AccordionHeader
            icon={<FaFish />}
            title="About This Seafood"
            subtitle="Product details and handling"
            open={showDescription}
            onClick={() =>
              setShowDescription(
                !showDescription
              )
            }
          />

          {showDescription && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 text-xs sm:text-sm text-gray-600 leading-5 space-y-2">
              <p>
                {commonDescription ||
                  "Our seafood is sourced from trusted suppliers and carefully inspected before dispatch."}
              </p>

              <p>
                Seafood is handled carefully and packed hygienically to help maintain quality during transportation.
              </p>

              <p>
                Because these are fresh seafood products, natural variations in size and weight may occur.
              </p>
            </div>
          )}
        </div>

        {/* PREPARATION & PACKING — COMPACT ACCORDION */}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

          <AccordionHeader
            icon={<FaCut />}
            title="Preparation & Packing"
            subtitle="How your seafood is handled"
            open={showPreparation}
            onClick={() =>
              setShowPreparation(
                !showPreparation
              )
            }
          />

          {showPreparation && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">

              <div className="flex flex-wrap gap-2">
                {preparationOptions.map(
                  (option) => (
                    <span
                      key={option.name}
                      className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold border ${
                        selectedPreparation ===
                        option.name
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {option.name} • {currency}
                      {option.pricePerKg}/KG
                    </span>
                  )
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  Hygienic handling
                </span>

                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  Secure packing
                </span>

                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  Carefully dispatched
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          CUSTOMER FEEDBACK — COMPACT
      ======================================================== */}

      <div className="mt-5 bg-yellow-50 border border-yellow-100 rounded-xl p-4">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
            <FaStar className="text-yellow-500" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-yellow-700 uppercase">
              Customer Feedback
            </p>

            <h2 className="text-base font-extrabold text-gray-800">
              Your feedback matters
            </h2>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-600">
          Product reviews will appear here as customers share their experience.
        </p>
      </div>

      {/* ========================================================
          WHY CHOOSE US — NOW AT BOTTOM
      ======================================================== */}

      <div className="mt-5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-800 text-white overflow-hidden">

        <button
          type="button"
          onClick={() =>
            setShowWhyChoose(
              !showWhyChoose
            )
          }
          className="w-full flex items-center justify-between gap-3 p-4 text-left"
        >
          <div>
            <p className="text-[10px] text-cyan-100 uppercase tracking-wide">
              Priya Live Fish
            </p>

            <h2 className="mt-0.5 text-lg font-extrabold">
              Why Choose Us?
            </h2>

            <p className="mt-0.5 text-[11px] text-cyan-100">
              Fresh seafood, careful handling and reliable service.
            </p>
          </div>

          {showWhyChoose ? (
            <FaChevronUp />
          ) : (
            <FaChevronDown />
          )}
        </button>

        {showWhyChoose && (
          <div className="px-4 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-white/10 pt-3">

            {[
              [
                <FaFish />,
                "Fresh Catch",
                "Carefully sourced seafood.",
              ],
              [
                <FaTruck />,
                "Reliable Dispatch",
                "Securely packed before dispatch.",
              ],
              [
                <FaCreditCard />,
                "Safe Payments",
                "Secure payment options.",
              ],
              [
                <FaCheckCircle />,
                "Quality Assured",
                "Carefully handled seafood.",
              ],
            ].map(
              ([icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-lg bg-white/10 p-3"
                >
                  <div className="text-sm">
                    {icon}
                  </div>

                  <h3 className="mt-2 text-xs font-bold">
                    {title}
                  </h3>

                  <p className="mt-1 text-[10px] text-cyan-100 leading-4">
                    {text}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          BACK TO MENU
      ======================================================== */}

      <div className="flex justify-center mt-5">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold shadow-sm hover:text-cyan-700 transition text-xs"
        >
          <FaArrowLeft />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Product;
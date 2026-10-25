import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import customerModel from "../models/customerModel.js";

/* =========================================================
   HELPERS
========================================================= */

const normalizePreparation = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const createCartLineKey = (weight, preparation, variantId = "") => {
  const normalizedPrep = String(preparation || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const normalizedVariantId = String(variantId || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "");

  const baseKey = `${Number(weight)}-${normalizedPrep}`;

  return normalizedVariantId
    ? `${baseKey}-variant-${normalizedVariantId}`
    : baseKey;
};

const getProductVariants = (product) =>
  Array.isArray(product?.variants) ? product.variants : [];

const getVariantById = (product, variantId) => {
  if (!variantId) return null;

  return (
    getProductVariants(product).find(
      (variant) =>
        String(variant?._id || variant?.id || "") === String(variantId)
    ) || null
  );
};

// Lobster and Scampi can be sold without a count variant.
const isPrawnCountOptional = (product) =>
  /\b(lobster|scampi)\b/i.test(
    `${String(product?.name || "")} ${String(product?.subCategory || "")}`
  );

const normalizeCategory = (product) =>
  String(product?.category || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

// Boneless, dry products and pickles do not require preparation.
const requiresPreparation = (product) => {
  const category = normalizeCategory(product);
  const name = String(product?.name || "").trim().toLowerCase();

  return !(
    category.includes("boneless") ||
    name.includes("boneless") ||
    category.includes("dry fish") ||
    category.includes("dry prawn") ||
    category.includes("pickle")
  );
};

/*
  WHOLE-KG RULE:
  Accepted: 1 KG, 2 KG, 3 KG, etc.
  Rejected: 0.25 KG, 0.5 KG, 1.5 KG, etc.
*/
const validateWeight = (product, weight, availableStock) => {
  if (!Number.isFinite(weight) || weight <= 0) {
    return {
      valid: false,
      message: "Please enter a valid weight in KG.",
    };
  }

  if (!Number.isInteger(weight)) {
    return {
      valid: false,
      message:
        "Weight must be a whole number of kilograms (1 KG, 2 KG, 3 KG, etc.).",
    };
  }

  const stock = Number(availableStock);

  if (!Number.isFinite(stock) || stock <= 0) {
    return {
      valid: false,
      message: "This product option is out of stock.",
    };
  }

  const configuredMax = Number(product?.maxQuantity);

  const maxWeight = Math.min(
    Number.isFinite(configuredMax) && configuredMax > 0
      ? configuredMax
      : stock,
    stock
  );

  if (weight > maxWeight) {
    return {
      valid: false,
      message: `Maximum available weight is ${maxWeight} KG.`,
    };
  }

  return { valid: true };
};

const validatePreparation = (product, preparation) => {
  if (!requiresPreparation(product)) {
    return { valid: true, preparation: "" };
  }

  const selected = String(preparation || "").trim();

  if (!selected) {
    return {
      valid: false,
      message: "Please select a preparation option.",
    };
  }

  const options = Array.isArray(product?.preparationOptions)
    ? product.preparationOptions
    : [];

  if (options.length > 0) {
    const allowed = options
      .map((option) => {
        if (typeof option === "string") {
          return option.trim();
        }

        return String(
          option?.name ??
            option?.label ??
            option?.preparation ??
            option?.title ??
            ""
        ).trim();
      })
      .filter(Boolean);

    if (
      !allowed.some(
        (name) =>
          normalizePreparation(name) === normalizePreparation(selected)
      )
    ) {
      return {
        valid: false,
        message: "Invalid preparation option.",
      };
    }
  }

  return {
    valid: true,
    preparation: selected,
  };
};

const getPreparationPrice = (product, preparation) => {
  const basePrice = Number(product?.price || 0);

  if (!preparation) {
    return basePrice;
  }

  const options = Array.isArray(product?.preparationOptions)
    ? product.preparationOptions
    : [];

  const selected = options.find((option) => {
    if (typeof option === "string") {
      return (
        normalizePreparation(option) ===
        normalizePreparation(preparation)
      );
    }

    const name =
      option?.name ??
      option?.label ??
      option?.preparation ??
      option?.title ??
      "";

    return (
      normalizePreparation(name) ===
      normalizePreparation(preparation)
    );
  });

  if (selected && typeof selected === "object") {
    for (const value of [
      selected.pricePerKg,
      selected.price,
      selected.amount,
    ]) {
      const price = Number(value);

      if (Number.isFinite(price) && price > 0) {
        return price;
      }
    }
  }

  return basePrice;
};

/*
  Normalize current and legacy cart formats.
  Invalid fractional weights are excluded.
*/
const normalizeCartData = (cartData) => {
  if (
    !cartData ||
    typeof cartData !== "object" ||
    Array.isArray(cartData)
  ) {
    return {};
  }

  const normalized = {};

  Object.entries(cartData).forEach(([productId, productCart]) => {
    if (
      !productCart ||
      typeof productCart !== "object" ||
      Array.isArray(productCart)
    ) {
      return;
    }

    normalized[productId] = {};

    Object.entries(productCart).forEach(([key, value]) => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value.weight !== undefined
      ) {
        const weight = Number(value.weight);
        const quantity = Number(value.quantity ?? 1);
        const preparation = String(value.preparation || "").trim();
        const variantId = String(value.variantId || "").trim();
        const variantCount = String(value.variantCount || "").trim();
        const price = Number(value.pricePerKg);

        if (
          !Number.isInteger(weight) ||
          weight <= 0 ||
          !Number.isFinite(quantity) ||
          quantity <= 0
        ) {
          return;
        }

        const lineKey = createCartLineKey(
          weight,
          preparation,
          variantId
        );

        normalized[productId][lineKey] = {
          weight,
          quantity,
          preparation,
          variantId,
          variantCount,
          pricePerKg:
            Number.isFinite(price) && price > 0 ? price : 0,
        };

        return;
      }

      // Legacy cart format: { "1": 1 }
      const oldWeight = Number(key);
      const oldQuantity = Number(value || 0);

      if (
        Number.isInteger(oldWeight) &&
        oldWeight > 0 &&
        Number.isFinite(oldQuantity) &&
        oldQuantity > 0
      ) {
        const lineKey = createCartLineKey(oldWeight, "");

        normalized[productId][lineKey] = {
          weight: oldWeight,
          quantity: oldQuantity,
          preparation: "",
          variantId: "",
          variantCount: "",
          pricePerKg: 0,
        };
      }
    });

    if (Object.keys(normalized[productId]).length === 0) {
      delete normalized[productId];
    }
  });

  return normalized;
};

/*
  Rebuild the customer's separate cart using database prices.
*/
const syncCustomerCart = async (userId, cartData) => {
  try {
    const customer = await customerModel.findOne({ userId });

    if (!customer) return;

    const normalizedCart = normalizeCartData(cartData || {});
    const cartItems = [];

    for (const [productId, productCart] of Object.entries(
      normalizedCart
    )) {
      const product = await productModel.findById(productId);

      if (!product) continue;

      for (const line of Object.values(productCart)) {
        const variant = getVariantById(product, line.variantId);

        const pricePerKg = variant
          ? Number(variant.pricePerKg || 0)
          : getPreparationPrice(product, line.preparation);

        cartItems.push({
          productId: String(productId),
          productName: product.name || "",
          image: Array.isArray(product.image)
            ? product.image[0] || ""
            : product.image || "",
          weight: Number(line.weight || 0),
          quantity: Number(line.quantity || 1),
          preparation: line.preparation || "",
          variantId: line.variantId || "",
          variantCount: variant
            ? String(variant.count || "")
            : String(line.variantCount || ""),
          pricePerKg,
        });
      }
    }

    customer.cartItems = cartItems;
    await customer.save();
  } catch (error) {
    console.error("Customer cart sync error:", error);
  }
};

/*
  Validate the product or selected prawn variant.
  Lobster and Scampi can use base product stock without a variant.
*/
const getAvailableOption = (product, variantId) => {
  const variants = getProductVariants(product);
  const selectedVariantId = String(variantId || "").trim();

  if (
    variants.length > 0 &&
    !(isPrawnCountOptional(product) && !selectedVariantId)
  ) {
    if (!selectedVariantId) {
      return {
        valid: false,
        status: 400,
        message: "Please select a prawn count option.",
      };
    }

    const variant = getVariantById(product, selectedVariantId);

    if (!variant) {
      return {
        valid: false,
        status: 400,
        message:
          "Selected prawn count option is invalid. Please refresh the product.",
      };
    }

    if (
      variant.isAvailable === false ||
      Number(variant.stock || 0) <= 0
    ) {
      return {
        valid: false,
        status: 400,
        message:
          "This prawn count option is unavailable or out of stock.",
      };
    }

    return {
      valid: true,
      variant,
      stock: Number(variant.stock || 0),
    };
  }

  if (selectedVariantId) {
    return {
      valid: false,
      status: 400,
      message: "This product does not have the selected variant.",
    };
  }

  if (
    product.isAvailable === false ||
    Number(product.stock || 0) <= 0
  ) {
    return {
      valid: false,
      status: 400,
      message:
        "This product is currently unavailable or out of stock.",
    };
  }

  return {
    valid: true,
    variant: null,
    stock: Number(product.stock || 0),
  };
};

/* =========================================================
   ADD TO CART
========================================================= */

const addToCart = async (req, res) => {
  try {
    const { itemId, weight, preparation, variantId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const numericWeight = Number(weight);

    if (!Number.isFinite(numericWeight) || numericWeight <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid weight in KG.",
      });
    }

    const product = await productModel.findById(itemId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const option = getAvailableOption(product, variantId);

    if (!option.valid) {
      return res.status(option.status).json({
        success: false,
        message: option.message,
      });
    }

    const preparationValidation = validatePreparation(
      product,
      preparation
    );

    if (!preparationValidation.valid) {
      return res.status(400).json({
        success: false,
        message: preparationValidation.message,
      });
    }

    const weightValidation = validateWeight(
      product,
      numericWeight,
      option.stock
    );

    if (!weightValidation.valid) {
      return res.status(400).json({
        success: false,
        message: weightValidation.message,
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartData = normalizeCartData(user.cartData || {});
    const productId = String(itemId);

    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    const selectedVariant = option.variant;

    const normalizedVariantId = selectedVariant
      ? String(selectedVariant._id || selectedVariant.id)
      : "";

    const selectedPreparation = preparationValidation.preparation;

    const lineKey = createCartLineKey(
      numericWeight,
      selectedPreparation,
      normalizedVariantId
    );

    // Never trust the price supplied by the browser.
    const pricePerKg = selectedVariant
      ? Number(selectedVariant.pricePerKg)
      : getPreparationPrice(product, selectedPreparation);

    if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine the price for this item.",
      });
    }

    const existingLine = cartData[productId][lineKey];

    cartData[productId][lineKey] = {
      weight: numericWeight,
      quantity: Number(existingLine?.quantity || 1),
      preparation: selectedPreparation,
      variantId: normalizedVariantId,
      variantCount: selectedVariant
        ? String(selectedVariant.count || "")
        : "",
      pricePerKg,
    };

    user.cartData = cartData;
    await user.save();

    await syncCustomerCart(user._id, user.cartData);

    return res.json({
      success: true,
      message: "Added to cart.",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Add cart error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to add product to cart.",
    });
  }
};

/* =========================================================
   UPDATE CART WEIGHT
========================================================= */

const updateCartWeight = async (req, res) => {
  try {
    const {
      itemId,
      oldWeight,
      newWeight,
      preparation,
      oldLineKey,
      variantId: requestedVariantId,
    } = req.body;

    if (
      !itemId ||
      oldWeight === undefined ||
      newWeight === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Product and weight information are required.",
      });
    }

    const numericOldWeight = Number(oldWeight);
    const numericNewWeight = Number(newWeight);

    if (
      !Number.isFinite(numericOldWeight) ||
      numericOldWeight <= 0 ||
      !Number.isFinite(numericNewWeight) ||
      numericNewWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid old or new weight.",
      });
    }

    const product = await productModel.findById(itemId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartData = normalizeCartData(user.cartData || {});
    const productId = String(itemId);
    const productCart = cartData[productId];

    if (!productCart) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    let actualOldLineKey = oldLineKey;

    if (!actualOldLineKey || !productCart[actualOldLineKey]) {
      actualOldLineKey = Object.keys(productCart).find((key) => {
        const line = productCart[key];

        return (
          Number(line?.weight) === numericOldWeight &&
          String(line?.variantId || "") ===
            String(requestedVariantId || "") &&
          normalizePreparation(line?.preparation) ===
            normalizePreparation(preparation)
        );
      });
    }

    if (
      !actualOldLineKey ||
      !productCart[actualOldLineKey]
    ) {
      return res.status(404).json({
        success: false,
        message: "Previous cart item was not found.",
      });
    }

    const oldLine = productCart[actualOldLineKey];

    const selectedPreparationInput = String(
      preparation ?? oldLine.preparation ?? ""
    ).trim();

    const selectedVariantId = String(
      oldLine.variantId || requestedVariantId || ""
    ).trim();

    // Prevent changing variants through a weight-update request.
    if (
      requestedVariantId &&
      oldLine.variantId &&
      String(requestedVariantId) !== String(oldLine.variantId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected variant does not match the cart item.",
      });
    }

    const option = getAvailableOption(product, selectedVariantId);

    if (!option.valid) {
      return res.status(option.status).json({
        success: false,
        message: option.message,
      });
    }

    const preparationValidation = validatePreparation(
      product,
      selectedPreparationInput
    );

    if (!preparationValidation.valid) {
      return res.status(400).json({
        success: false,
        message: preparationValidation.message,
      });
    }

    const weightValidation = validateWeight(
      product,
      numericNewWeight,
      option.stock
    );

    if (!weightValidation.valid) {
      return res.status(400).json({
        success: false,
        message: weightValidation.message,
      });
    }

    const selectedPreparation = preparationValidation.preparation;
    const selectedVariant = option.variant;

    const normalizedVariantId = selectedVariant
      ? String(selectedVariant._id || selectedVariant.id)
      : "";

    const variantCount = selectedVariant
      ? String(selectedVariant.count || "")
      : "";

    const pricePerKg = selectedVariant
      ? Number(selectedVariant.pricePerKg)
      : getPreparationPrice(product, selectedPreparation);

    if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine the price for this item.",
      });
    }

    const newLineKey = createCartLineKey(
      numericNewWeight,
      selectedPreparation,
      normalizedVariantId
    );

    const oldQuantity = Number(oldLine.quantity || 1);

    // Remove the old line, then merge if the destination line exists.
    delete productCart[actualOldLineKey];

    const existingNewLine = productCart[newLineKey];

    productCart[newLineKey] = {
      weight: numericNewWeight,
      quantity: Number(
        existingNewLine?.quantity || oldQuantity || 1
      ),
      preparation: selectedPreparation,
      variantId: normalizedVariantId,
      variantCount,
      pricePerKg,
    };

    if (Object.keys(productCart).length === 0) {
      delete cartData[productId];
    }

    user.cartData = cartData;
    await user.save();

    await syncCustomerCart(user._id, user.cartData);

    return res.json({
      success: true,
      message: "Cart weight updated.",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Update cart weight error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update cart.",
    });
  }
};

/* =========================================================
   REMOVE FROM CART
========================================================= */

const removeFromCart = async (req, res) => {
  try {
    const {
      itemId,
      lineKey,
      preparation,
      weight,
      variantId,
    } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartData = normalizeCartData(user.cartData || {});
    const productId = String(itemId);

    if (!cartData[productId]) {
      return res.json({
        success: true,
        message: "Item already removed.",
        cartData,
      });
    }

    const productCart = cartData[productId];
    let actualLineKey = lineKey;

    if (!actualLineKey || !productCart[actualLineKey]) {
      if (
        weight !== undefined ||
        preparation !== undefined ||
        variantId !== undefined
      ) {
        const numericWeight =
          weight === undefined ? undefined : Number(weight);

        actualLineKey = Object.keys(productCart).find((key) => {
          const line = productCart[key];

          const weightMatches =
            weight === undefined ||
            Number(line?.weight) === numericWeight;

          const preparationMatches =
            preparation === undefined ||
            normalizePreparation(line?.preparation) ===
              normalizePreparation(preparation);

          const variantMatches =
            variantId === undefined ||
            String(line?.variantId || "") === String(variantId || "");

          return (
            weightMatches &&
            preparationMatches &&
            variantMatches
          );
        });
      }
    }

    if (actualLineKey && productCart[actualLineKey]) {
      delete productCart[actualLineKey];
    } else if (
      !lineKey &&
      preparation === undefined &&
      weight === undefined &&
      variantId === undefined
    ) {
      // Legacy behavior: no line selector removes the whole product.
      delete cartData[productId];
    } else {
      return res.status(404).json({
        success: false,
        message: "Cart item was not found.",
      });
    }

    if (
      cartData[productId] &&
      Object.keys(cartData[productId]).length === 0
    ) {
      delete cartData[productId];
    }

    user.cartData = cartData;
    await user.save();

    await syncCustomerCart(user._id, user.cartData);

    return res.json({
      success: true,
      message: "Item removed from cart.",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to remove item from cart.",
    });
  }
};

/* =========================================================
   GET USER CART
========================================================= */

const getUserCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("cartData");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const normalizedCart = normalizeCartData(user.cartData || {});

    if (
      JSON.stringify(user.cartData || {}) !==
      JSON.stringify(normalizedCart)
    ) {
      user.cartData = normalizedCart;
      await user.save();

      await syncCustomerCart(user._id, normalizedCart);
    }

    return res.json({
      success: true,
      cartData: normalizedCart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get cart.",
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

export {
  addToCart,
  updateCartWeight,
  removeFromCart,
  getUserCart,
};
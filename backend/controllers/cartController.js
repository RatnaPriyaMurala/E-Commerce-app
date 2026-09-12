import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import customerModel from "../models/customerModel.js";

/* =========================================================
   HELPERS
========================================================= */

/*
  Creates the same line-key format used by ShopContext.

  Example:
  1 KG + Curry Cut
  -> "1-curry-cut"

  1 KG + Fry Cut
  -> "1-fry-cut"
*/
const createCartLineKey = (weight, preparation) => {
  const normalizedPreparation = String(preparation || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `${Number(weight)}-${normalizedPreparation}`;
};

/*
  Converts old cart data into the new cart structure.

  OLD:
  {
    productId: {
      "1": 1
    }
  }

  NEW:
  {
    productId: {
      "1-curry-cut": {
        weight: 1,
        quantity: 1,
        preparation: "Curry Cut"
      }
    }
  }
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
      /*
        NEW FORMAT
      */
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value.weight !== undefined
      ) {
        const weight = Number(value.weight);
        const quantity = Number(value.quantity || 1);
        const preparation = String(
          value.preparation || ""
        ).trim();

        if (
          Number.isFinite(weight) &&
          weight > 0 &&
          Number.isFinite(quantity) &&
          quantity > 0
        ) {
          const lineKey = createCartLineKey(
            weight,
            preparation
          );

          normalized[productId][lineKey] = {
            weight,
            quantity,
            preparation,
          };
        }

        return;
      }

      /*
        OLD FORMAT

        {
          "1": 1
        }
      */
      const oldWeight = Number(key);
      const oldQuantity = Number(value || 0);

      if (
        Number.isFinite(oldWeight) &&
        oldWeight > 0 &&
        Number.isFinite(oldQuantity) &&
        oldQuantity > 0
      ) {
        const lineKey = createCartLineKey(
          oldWeight,
          ""
        );

        normalized[productId][lineKey] = {
          weight: oldWeight,
          quantity: oldQuantity,
          preparation: "",
        };
      }
    });

    if (
      Object.keys(normalized[productId]).length === 0
    ) {
      delete normalized[productId];
    }
  });

  return normalized;
};
const syncCustomerCart = async (userId, cartData) => {
  try {
    const customer = await customerModel.findOne({ userId });

    if (!customer) {
      console.log(
        "⚠️ Customer profile not found for user:",
        userId
      );
      return;
    }

    const normalizedCart = normalizeCartData(cartData || {});
    const productIds = Object.keys(normalizedCart);

    // Cart is empty
    if (productIds.length === 0) {
      customer.cartItems = [];

      await customer.save();

      console.log(
        `🛒 Customer ${customer.customerId} cart cleared`
      );

      return;
    }

    const cartItems = [];

    for (const productId of productIds) {
      const product = await productModel.findById(productId);

      if (!product) {
        continue;
      }

      const productCart = normalizedCart[productId];

      for (const line of Object.values(productCart)) {
        cartItems.push({
          productId: String(productId),

          productName: product.name || "",

          image: Array.isArray(product.image)
            ? product.image[0] || ""
            : product.image || "",

          weight: Number(line.weight || 0),

          quantity: Number(line.quantity || 1),

          preparation: line.preparation || "",
        });
      }
    }

    customer.cartItems = cartItems;

    await customer.save();

    console.log(
      `🛒 Customer ${customer.customerId} cart synchronized`
    );

  } catch (error) {
    console.error(
      "❌ Customer cart sync error:",
      error
    );
  }
};
/*
  Validates preparation against the product's
  preparationOptions.

  Supports both:

  ["Curry Cut", "Fry Cut"]

  and:

  [
    { name: "Curry Cut" },
    { label: "Fry Cut" }
  ]
*/
const validatePreparation = (
  product,
  preparation
) => {
  const selectedPreparation = String(
    preparation || ""
  ).trim();

  if (!selectedPreparation) {
    return {
      valid: false,
      message:
        "Please select a preparation option.",
    };
  }

  if (
    Array.isArray(product.preparationOptions) &&
    product.preparationOptions.length > 0
  ) {
    const allowedOptions =
      product.preparationOptions
        .map((option) => {
          if (typeof option === "string") {
            return option.trim();
          }

          return String(
            option?.name ||
              option?.label ||
              ""
          ).trim();
        })
        .filter(Boolean);

    const isAllowed =
      allowedOptions.some(
        (option) =>
          option.toLowerCase() ===
          selectedPreparation.toLowerCase()
      );

    if (!isAllowed) {
      return {
        valid: false,
        message:
          "Invalid preparation option.",
      };
    }
  }

  return {
    valid: true,
    preparation: selectedPreparation,
  };
};

/* =========================================================
   ADD TO CART
========================================================= */

const addToCart = async (req, res) => {
  try {
    const {
      itemId,
      weight,
      preparation,
      pricePerKg,
    } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const numericWeight = Number(weight);

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid weight.",
      });
    }

    const product =
      await productModel.findById(itemId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /* -------------------------------------------------------
       PREPARATION
    ------------------------------------------------------- */

    const preparationValidation =
      validatePreparation(
        product,
        preparation
      );

    if (!preparationValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          preparationValidation.message,
      });
    }

    const selectedPreparation =
      preparationValidation.preparation;

    /* -------------------------------------------------------
       AVAILABILITY / STOCK
    ------------------------------------------------------- */

    const stock = Number(
      product.stock || 0
    );

    if (
      product.isAvailable === false ||
      stock <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This product is currently unavailable.",
      });
    }

    if (numericWeight > stock) {
      return res.status(400).json({
        success: false,
        message:
          `Only ${stock} KG available.`,
      });
    }

    /* -------------------------------------------------------
       MIN / MAX
    ------------------------------------------------------- */

    const minQuantity =
      Number(product.minQuantity || 0.5);

    const maxQuantity =
      Number(
        product.maxQuantity || stock
      );

    if (numericWeight < minQuantity) {
      return res.status(400).json({
        success: false,
        message:
          `Minimum order weight is ${minQuantity} KG.`,
      });
    }

    if (numericWeight > maxQuantity) {
      return res.status(400).json({
        success: false,
        message:
          `Maximum order weight is ${maxQuantity} KG.`,
      });
    }

    /* -------------------------------------------------------
       QUANTITY STEP
    ------------------------------------------------------- */

    const quantityStep =
      Number(product.quantityStep || 0);

    if (quantityStep > 0) {
      const steps =
        numericWeight / quantityStep;

      if (
        Math.abs(
          steps - Math.round(steps)
        ) > 0.000001
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Weight must be in increments of ${quantityStep} KG.`,
        });
      }
    }

    /* -------------------------------------------------------
       USER
    ------------------------------------------------------- */

    const user =
      await userModel.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* -------------------------------------------------------
       NORMALIZE CART
    ------------------------------------------------------- */

    const cartData =
      normalizeCartData(
        user.cartData || {}
      );

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    /* -------------------------------------------------------
       LINE KEY
    ------------------------------------------------------- */

    const lineKey =
      createCartLineKey(
        numericWeight,
        selectedPreparation
      );

    /*
      Same product + same weight + same preparation
      = same cart line.

      Same product + same weight + DIFFERENT preparation
      = different cart line.
    */

    cartData[itemId][lineKey] = {
      weight: numericWeight,
      quantity: 1,
      preparation: selectedPreparation,
    };

    user.cartData = cartData;

await user.save();

await syncCustomerCart(
  user._id,
  user.cartData
);

return res.json({
      success: true,
      message: "Added to cart.",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error(
      "❌ Add cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add product to cart.",
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
      newLineKey,
    } = req.body;

    if (
      !itemId ||
      oldWeight === undefined ||
      newWeight === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product and weight information are required.",
      });
    }

    const numericOldWeight =
      Number(oldWeight);

    const numericNewWeight =
      Number(newWeight);

    if (
      !Number.isFinite(
        numericOldWeight
      ) ||
      numericOldWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid previous weight.",
      });
    }

    if (
      !Number.isFinite(
        numericNewWeight
      ) ||
      numericNewWeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid new weight.",
      });
    }

    /* -------------------------------------------------------
       PRODUCT
    ------------------------------------------------------- */

    const product =
      await productModel.findById(
        itemId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (
      product.isAvailable === false ||
      Number(product.stock || 0) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product is currently unavailable.",
      });
    }

    /* -------------------------------------------------------
       PREPARATION
    ------------------------------------------------------- */

    const preparationValidation =
      validatePreparation(
        product,
        preparation
      );

    if (!preparationValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          preparationValidation.message,
      });
    }

    const selectedPreparation =
      preparationValidation.preparation;

    /* -------------------------------------------------------
       MIN / MAX
    ------------------------------------------------------- */

    const minQuantity =
      Number(
        product.minQuantity || 0.5
      );

    const maxQuantity =
      Number(
        product.maxQuantity ||
        product.stock ||
        10
      );

    if (
      numericNewWeight <
        minQuantity ||
      numericNewWeight >
        maxQuantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Weight must be between ${minQuantity} KG and ${maxQuantity} KG.`,
      });
    }

    /* -------------------------------------------------------
       STOCK
    ------------------------------------------------------- */

    if (
      numericNewWeight >
      Number(product.stock || 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          `${product.name} has only ${product.stock} KG available.`,
      });
    }

    /* -------------------------------------------------------
       QUANTITY STEP
    ------------------------------------------------------- */

    const quantityStep =
      Number(
        product.quantityStep || 0
      );

    if (quantityStep > 0) {
      const steps =
        numericNewWeight /
        quantityStep;

      if (
        Math.abs(
          steps -
            Math.round(steps)
        ) > 0.000001
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Weight must be in increments of ${quantityStep} KG.`,
        });
      }
    }

    /* -------------------------------------------------------
       USER
    ------------------------------------------------------- */

    const user =
      await userModel.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* -------------------------------------------------------
       NORMALIZE CART
    ------------------------------------------------------- */

    const cartData =
      normalizeCartData(
        user.cartData || {}
      );

    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message:
          "Item not found in cart.",
      });
    }

    /* -------------------------------------------------------
       FIND OLD LINE
    ------------------------------------------------------- */

    let actualOldLineKey =
      oldLineKey;

    if (
      !actualOldLineKey ||
      !cartData[itemId][
        actualOldLineKey
      ]
    ) {
      actualOldLineKey =
        Object.keys(
          cartData[itemId]
        ).find((key) => {
          const line =
            cartData[itemId][key];

          return (
            Number(
              line?.weight
            ) ===
              numericOldWeight &&
            String(
              line?.preparation || ""
            ).trim().toLowerCase() ===
              selectedPreparation
                .trim()
                .toLowerCase()
          );
        });
    }

    if (
      !actualOldLineKey ||
      !cartData[itemId][
        actualOldLineKey
      ]
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Previous cart item was not found.",
      });
    }

    /* -------------------------------------------------------
       NEW LINE KEY
    ------------------------------------------------------- */

    const actualNewLineKey =
      newLineKey ||
      createCartLineKey(
        numericNewWeight,
        selectedPreparation
      );

    const oldLine =
      cartData[itemId][
        actualOldLineKey
      ];

    /*
      Preserve quantity if it exists.
    */
    const quantity =
      Number(
        oldLine?.quantity || 1
      );

    /* -------------------------------------------------------
       REMOVE OLD LINE
    ------------------------------------------------------- */

    delete cartData[itemId][
      actualOldLineKey
    ];

    /* -------------------------------------------------------
       CREATE NEW LINE
    ------------------------------------------------------- */

    cartData[itemId][
      actualNewLineKey
    ] = {
      weight: numericNewWeight,
      quantity:
        Number.isFinite(quantity) &&
        quantity > 0
          ? quantity
          : 1,
      preparation:
        selectedPreparation,
    };

    /* -------------------------------------------------------
       CLEAN EMPTY PRODUCT
    ------------------------------------------------------- */

    if (
      Object.keys(
        cartData[itemId]
      ).length === 0
    ) {
      delete cartData[itemId];
    }

    user.cartData = cartData;

await user.save();

await syncCustomerCart(
  user._id,
  user.cartData
);

return res.json({
      success: true,
      message:
        "Cart weight updated.",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error(
      "❌ Update cart weight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update cart.",
    });
  }
};

/* =========================================================
   REMOVE FROM CART
========================================================= */

/*
  IMPORTANT:

  We now remove a SPECIFIC CART LINE.

  Example:

  Ari
  ├── 1 KG Curry Cut
  └── 1 KG Fry Cut

  Removing Curry Cut must NOT remove Fry Cut.
*/

const removeFromCart = async (req, res) => {
  try {
    const {
      itemId,
      lineKey,
      preparation,
      weight,
    } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

    const user =
      await userModel.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cartData =
      normalizeCartData(
        user.cartData || {}
      );

    if (!cartData[itemId]) {
      return res.json({
        success: true,
        message:
          "Item already removed.",
        cartData,
      });
    }

    /* -------------------------------------------------------
       FIND LINE TO REMOVE
    ------------------------------------------------------- */

    let actualLineKey =
      lineKey;

    /*
      If lineKey isn't supplied,
      find using weight + preparation.
    */
    if (
      !actualLineKey ||
      !cartData[itemId][
        actualLineKey
      ]
    ) {
      if (
        weight !== undefined ||
        preparation
      ) {
        const numericWeight =
          Number(weight);

        actualLineKey =
          Object.keys(
            cartData[itemId]
          ).find((key) => {
            const line =
              cartData[itemId][key];

            const weightMatches =
              weight === undefined ||
              Number(
                line?.weight
              ) === numericWeight;

            const preparationMatches =
              !preparation ||
              String(
                line?.preparation || ""
              )
                .trim()
                .toLowerCase() ===
                String(
                  preparation
                )
                  .trim()
                  .toLowerCase();

            return (
              weightMatches &&
              preparationMatches
            );
          });
      }
    }

    /* -------------------------------------------------------
       REMOVE SPECIFIC LINE
    ------------------------------------------------------- */

    if (
      actualLineKey &&
      cartData[itemId][
        actualLineKey
      ]
    ) {
      delete cartData[itemId][
        actualLineKey
      ];
    } else {
      /*
        Backward compatibility:
        if no line information is supplied,
        remove the whole product.
      */
      if (
        !lineKey &&
        !preparation &&
        weight === undefined
      ) {
        delete cartData[itemId];
      } else {
        return res.status(404).json({
          success: false,
          message:
            "Cart item was not found.",
        });
      }
    }

    /* -------------------------------------------------------
       CLEAN EMPTY PRODUCT
    ------------------------------------------------------- */

    if (
      cartData[itemId] &&
      Object.keys(
        cartData[itemId]
      ).length === 0
    ) {
      delete cartData[itemId];
    }
user.cartData = cartData;

await user.save(); 

await syncCustomerCart(
  user._id,
  user.cartData
);

return res.json({
      success: true,
      message:
        "Item removed from cart.",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error(
      "❌ Remove from cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to remove item from cart.",
    });
  }
};

/* =========================================================
   GET USER CART
========================================================= */

const getUserCart = async (req, res) => {
  try {
    const user =
      await userModel
        .findById(req.userId)
        .select("cartData");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
      Always return normalized cart data.

      This also automatically converts
      old cart entries when the user opens
      their cart after the update.
    */
    const normalizedCart =
      normalizeCartData(
        user.cartData || {}
      );

    /*
      Save normalized structure if the old
      format was detected.
    */
    const currentCartString =
      JSON.stringify(
        user.cartData || {}
      );

    const normalizedCartString =
      JSON.stringify(
        normalizedCart
      );

    if (
      currentCartString !==
      normalizedCartString
    ) {
      user.cartData =
        normalizedCart;

      await user.save();
    }

    return res.json({
      success: true,
      cartData: normalizedCart,
    });
  } catch (error) {
    console.error(
      "❌ Get cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get cart.",
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
import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ============================================================
   SHOP CONTEXT
   Global application state:
   - Products
   - Authentication
   - User profile
   - Search
   - Cart
   - Favorites
   - Common configuration
============================================================ */

export const ShopContext = createContext();

/* ============================================================
   PROVIDER
============================================================ */

export const ShopContextProvider = ({ children }) => {
  /* ============================================================
     GLOBAL CONFIG
  ============================================================ */

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const currency = "₹";

  // Delivery is free. Preparation & Cleaning is calculated separately.
  const delivery_fee = 0;
  const PREPARATION_CHARGE_PER_KG = 40;

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ============================================================
     SEARCH
  ============================================================ */

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  /* ============================================================
     AUTHENTICATION
  ============================================================ */

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  /* ============================================================
     CART

     New cart structure:

     {
       productId: {
         "1-curry-cut": {
           weight: 1,
           quantity: 1,
           preparation: "Curry Cut"
         },

         "1-fry-cut": {
           weight: 1,
           quantity: 1,
           preparation: "Fry Cut"
         }
       }
     }

     This allows the same product + same weight
     to exist with different preparations.
  ============================================================ */

  const [cartItems, setCartItems] = useState({});

  /* ============================================================
     FAVORITES

     Favorites are stored in MongoDB for logged-in users.

     MongoDB stores:

     user.favorites = [
       productId,
       productId,
       ...
     ]

     The backend populates these product IDs and returns
     the complete product objects to the frontend.
  ============================================================ */

  const [favorites, setFavorites] = useState([]);

  /* ============================================================
     HELPERS
  ============================================================ */

  const handleAuthError = useCallback(
    (error) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken("");
        setUser(null);
        setFavorites([]);
        setCartItems({});

        toast.error(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return true;
      }

      return false;
    },
    [navigate]
  );

  /* ============================================================
     CREATE CART LINE KEY

     Example:

     1 + Curry Cut
     -> "1-curry-cut"

     1 + Fry Cut
     -> "1-fry-cut"
  ============================================================ */

  const createCartLineKey = (
    weight,
    preparation,
    variantId = ""
  ) => {
    const normalizedPreparation =
      String(preparation || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const baseKey = `${Number(weight)}-${normalizedPreparation}`;
    const normalizedVariantId = String(variantId || "").trim()
      .replace(/[^a-zA-Z0-9_-]/g, "");

    return normalizedVariantId
      ? `${baseKey}-variant-${normalizedVariantId}`
      : baseKey;
  };

  // Lobster and Scampi Prawns can be sold at the product's own price/stock
  // without forcing the customer to choose a count/size variant.
  const isPrawnCountOptional = (product) =>
    /\b(lobster|scampi)\b/i.test(String(product?.name || ""));

  const getPrawnVariants = (product) =>
    Array.isArray(product?.variants) ? product.variants : [];

  const getPrawnVariant = (product, variantId) => {
    if (!variantId) return null;
    return getPrawnVariants(product).find(
      (variant) => String(variant?._id || variant?.id || "") === String(variantId)
    ) || null;
  };

  /* ============================================================
     SEAFOOD PREPARATION HELPERS

     The seafood price remains the base price per KG.
     The fixed ₹40/KG preparation charge is calculated separately,
     so preparation is never accidentally charged twice.
  ============================================================ */

  const normalizeCategoryText = (value) =>
    String(value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ");

  const getProductType = (product) => {
    const category = normalizeCategoryText(product?.category);
    const name = normalizeCategoryText(product?.name);
    const subCategory = normalizeCategoryText(product?.subCategory);
    const combined = `${category} ${subCategory} ${name}`;

    // Boneless products use their listed price and never require preparation.
    // Check this before the generic fish rule because "Boneless Fish" also
    // contains the word "fish".
    if (/boneless/.test(combined)) return "no-preparation";
    if (/dry\s*fish|dry\s*prawns?|pickles?/.test(combined)) return "no-preparation";
    if (/prawns?|shrimp/.test(combined)) return "prawns";
    if (/crabs?/.test(combined)) return "crab";
    if (/fish|seafood|fresh seafood/.test(combined)) return "fish";
    return "other";
  };

  const getPreparationOptions = (product) => {
    const type = getProductType(product);
    if (type === "prawns" || type === "crab") {
      return ["Whole Cleaned", "Uncleaned"];
    }
    if (type === "fish") {
      return ["Whole Cleaned", "Uncleaned", "Curry Cut", "Fry Cut"];
    }
    return [];
  };

  const requiresPreparation = (product) =>
    getPreparationOptions(product).length > 0;

  // Returns seafood's base price per KG only; ₹40/KG is charged separately.
  const getPreparationPrice = (product, _preparation = "") => {
    const basePrice = Number(product?.price ?? product?.pricePerKg ?? 0);
    return Number.isFinite(basePrice) && basePrice > 0 ? basePrice : 0;
  };

  const getItemBasePricePerKg = (product, lineItem = {}) => {
    const variant = getPrawnVariant(product, lineItem?.variantId);
    const variantPrice = Number(variant?.pricePerKg);
    if (Number.isFinite(variantPrice) && variantPrice > 0) return variantPrice;

    const productPrice = Number(product?.price ?? product?.pricePerKg ?? 0);
    if (Number.isFinite(productPrice) && productPrice > 0) return productPrice;

    const storedPrice = Number(lineItem?.pricePerKg ?? 0);
    return Number.isFinite(storedPrice) && storedPrice > 0 ? storedPrice : 0;
  };

  /* ============================================================
     NORMALIZE CART DATA

     Converts old cart format into the new format.

     OLD:

     {
       productId: {
         "1": 1
       }
     }

     NEW:

     {
       productId: {
         "1-unknown-preparation": {
           weight: 1,
           quantity: 1,
           preparation: ""
         }
       }
     }

     This prevents the application from crashing if an old cart
     is still present.
  ============================================================ */

  const normalizeCartData = (cartData) => {
    if (!cartData || typeof cartData !== "object" || Array.isArray(cartData)) return {};
    const normalized = {};
    Object.entries(cartData).forEach(([productId, productCart]) => {
      if (!productCart || typeof productCart !== "object" || Array.isArray(productCart)) return;
      normalized[productId] = {};
      Object.entries(productCart).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value) && value.weight !== undefined) {
          const weight = Number(value.weight);
          const quantity = Number(value.quantity ?? 1);
          const preparation = String(value.preparation || "").trim();
          const variantId = String(value.variantId || "").trim();
          const variantCount = String(value.variantCount || "").trim();
          const price = Number(value.pricePerKg);
          if (!Number.isInteger(weight) || weight < 1 || !Number.isFinite(quantity) || quantity < 1) return;
          const lineKey = createCartLineKey(weight, preparation, variantId);
          normalized[productId][lineKey] = {
            weight, quantity, preparation, variantId, variantCount,
            pricePerKg: Number.isFinite(price) && price > 0 ? price : 0,
          };
          return;
        }
        const oldWeight = Number(key);
        const oldQuantity = Number(value || 0);
        if (Number.isInteger(oldWeight) && oldWeight >= 1 && Number.isFinite(oldQuantity) && oldQuantity > 0) {
          const lineKey = createCartLineKey(oldWeight, "");
          normalized[productId][lineKey] = {
            weight: oldWeight, quantity: oldQuantity, preparation: "",
            variantId: "", variantCount: "", pricePerKg: 0,
          };
        }
      });
      if (Object.keys(normalized[productId]).length === 0) delete normalized[productId];
    });
    return normalized;
  };


  /* ============================================================
     USER PROFILE
  ============================================================ */

  const getUserProfile = useCallback(
    async () => {
      if (!token) return;

      try {
        const response =
          await axios.get(
            `${backendUrl}/api/user/profile`,
            {
              headers: {
                token,
              },
            }
          );

        if (response.data?.success) {
          const profile =
            response.data.user;

          setUser(profile);

          localStorage.setItem(
            "user",
            JSON.stringify(profile)
          );
        }
      } catch (error) {
        console.error(
          "❌ Get user profile error:",
          error
        );

        handleAuthError(error);
      }
    },
    [
      backendUrl,
      token,
      handleAuthError,
    ]
  );

  /* ============================================================
     LOAD USER PROFILE WHEN TOKEN CHANGES
  ============================================================ */

  useEffect(() => {
    if (token) {
      getUserProfile();
    }
  }, [
    token,
    getUserProfile,
  ]);

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const getProducts = useCallback(
    async () => {
      if (!backendUrl) {
        setProducts([]);
        setError(
          "Backend URL is not configured."
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await axios.get(
            `${backendUrl}/api/product/list`
          );

        if (response.data?.success) {
          const allProducts =
            response.data.products || [];

          /*
            Only show products that are available
            and currently have stock.
          */

          const availableProducts =
            allProducts.filter((product) => {
              if (product?.isAvailable === false) return false;
              const variants = Array.isArray(product?.variants) ? product.variants : [];
              if (variants.length > 0) {
                return variants.some(
                  (variant) =>
                    variant?.isAvailable !== false &&
                    Number(variant?.stock || 0) >= 1
                );
              }
              return Number(product?.stock || 0) >= 1;
            });

          setProducts(
            availableProducts
          );
        } else {
          setProducts([]);

          setError(
            response.data?.message ||
              "Unable to load products."
          );
        }
      } catch (error) {
        console.error(
          "❌ Product loading error:",
          error
        );

        setProducts([]);

        setError(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    },
    [backendUrl]
  );

  /* ============================================================
     LOAD PRODUCTS ON APP START

     IMPORTANT:
     Only ONE effect is needed here.
     The duplicate effect from the previous file has been removed.
  ============================================================ */

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  /* ============================================================
     LOAD USER CART
  ============================================================ */

  const loadUserCart = useCallback(
    async () => {
      if (!token) return;

      try {
        const response =
          await axios.post(
            `${backendUrl}/api/cart/get`,
            {},
            {
              headers: {
                token,
              },
            }
          );

        if (response.data?.success) {
          const normalizedCart =
            normalizeCartData(
              response.data.cartData ||
                {}
            );

          setCartItems(
            normalizedCart
          );
        } else {
          setCartItems({});
        }
      } catch (error) {
        console.error(
          "❌ Load cart error:",
          error
        );

        handleAuthError(error);
      }
    },
    [
      backendUrl,
      token,
      handleAuthError,
    ]
  );

  /* ============================================================
     LOAD CART

     Logged-in user → MongoDB
     Guest user → localStorage
  ============================================================ */

  useEffect(() => {
    if (token) {
      loadUserCart();
      return;
    }

    try {
      const savedCart =
        localStorage.getItem(
          "cartItems"
        );

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        const normalizedCart =
          normalizeCartData(
            parsedCart
          );

        setCartItems(
          normalizedCart
        );
      } else {
        setCartItems({});
      }
    } catch (error) {
      console.error(
        "❌ Guest cart loading error:",
        error
      );

      setCartItems({});
    }
  }, [
    token,
    loadUserCart,
  ]);

  /* ============================================================
     SAVE GUEST CART
  ============================================================ */

  useEffect(() => {
    if (!token) {
      try {
        localStorage.setItem(
          "cartItems",
          JSON.stringify(cartItems)
        );
      } catch (error) {
        console.error(
          "❌ Guest cart save error:",
          error
        );
      }
    }
  }, [
    cartItems,
    token,
  ]);

  /* ============================================================
     FAVORITES
  ============================================================ */

  /*
    Get favorites from MongoDB.

    Backend:
    GET /api/user/favorites
  */

  const getFavorites =
    useCallback(async () => {
      if (!token) {
        setFavorites([]);
        return;
      }

      try {
        const response =
          await axios.get(
            `${backendUrl}/api/user/favorites`,
            {
              headers: {
                token,
              },
            }
          );

        if (
          response.data?.success
        ) {
          setFavorites(
            Array.isArray(
              response.data.favorites
            )
              ? response.data.favorites
              : []
          );
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error(
          "❌ Get favorites error:",
          error?.response?.data ||
            error?.message ||
            error
        );

        handleAuthError(error);
      }
    }, [
      backendUrl,
      token,
      handleAuthError,
    ]);

  /*
    Load MongoDB favorites whenever
    the authentication token becomes available.
  */

  useEffect(() => {
    if (token) {
      getFavorites();
    } else {
      setFavorites([]);
    }
  }, [
    token,
    getFavorites,
  ]);

  /* ============================================================
     ADD FAVORITE

     Backend:
     POST /api/user/favorites/add
  ============================================================ */

  const addFavorite =
    useCallback(
      async (productId) => {
        if (!productId) {
          toast.error(
            "Product not found."
          );
          return;
        }

        /*
          Favorites are currently associated
          with authenticated MongoDB users.
        */

        if (!token) {
          toast.error(
            "Please login to add favorites."
          );

          navigate("/login");

          return;
        }

        try {
          const response =
            await axios.post(
              `${backendUrl}/api/user/favorites/add`,
              {
                productId,
              },
              {
                headers: {
                  token,
                },
              }
            );

          if (
            response.data?.success
          ) {
            setFavorites(
              Array.isArray(
                response.data.favorites
              )
                ? response.data
                    .favorites
                : []
            );

            toast.success(
              "Added to favorites."
            );
          } else {
            toast.error(
              response.data?.message ||
                "Unable to add favorite."
            );
          }
        } catch (error) {
          console.error(
            "❌ Add favorite error:",
            error?.response?.data ||
              error?.message ||
              error
          );

          const authError =
            handleAuthError(
              error
            );

          if (!authError) {
            toast.error(
              error?.response
                ?.data?.message ||
                "Unable to add favorite."
            );
          }
        }
      },
      [
        backendUrl,
        token,
        navigate,
        handleAuthError,
      ]
    );

  /* ============================================================
     REMOVE FAVORITE

     Backend:
     POST /api/user/favorites/remove
  ============================================================ */

  const removeFavorite =
    useCallback(
      async (productId) => {
        if (!productId) {
          return;
        }

        if (!token) {
          return;
        }

        try {
          const response =
            await axios.post(
              `${backendUrl}/api/user/favorites/remove`,
              {
                productId,
              },
              {
                headers: {
                  token,
                },
              }
            );

          if (
            response.data?.success
          ) {
            setFavorites(
              Array.isArray(
                response.data.favorites
              )
                ? response.data
                    .favorites
                : []
            );

            toast.success(
              "Removed from favorites."
            );
          } else {
            toast.error(
              response.data?.message ||
                "Unable to remove favorite."
            );
          }
        } catch (error) {
          console.error(
            "❌ Remove favorite error:",
            error?.response?.data ||
              error?.message ||
              error
          );

          const authError =
            handleAuthError(
              error
            );

          if (!authError) {
            toast.error(
              error?.response
                ?.data?.message ||
                "Unable to remove favorite."
            );
          }
        }
      },
      [
        backendUrl,
        token,
        handleAuthError,
      ]
    );

  /* ============================================================
     ADD TO CART
  ============================================================ */

  const addToCart = async (
    id,
    weight,
    preparation,
    selectedVariantIdOrPrice = "",
    selectedPricePerKg = 0
  ) => {
    const product = products.find((item) => String(item._id) === String(id));
    if (!product) return toast.error("Product not found.");

    const allowedPreparations = getPreparationOptions(product);
    const needsPreparation = allowedPreparations.length > 0;
    const selectedPreparation = needsPreparation ? String(preparation || "").trim() : "";
    if (needsPreparation && !selectedPreparation) {
      return toast.error("Please select a preparation option.");
    }
    if (needsPreparation && !allowedPreparations.includes(selectedPreparation)) {
      return toast.error(`Choose one of these preparation options: ${allowedPreparations.join(", ")}.`);
    }

    const selectedWeight = Number(weight);
    if (!Number.isInteger(selectedWeight) || selectedWeight < 1) {
      return toast.error("Weight must be a whole number of kilograms (1 KG, 2 KG, 3 KG...).");
    }

    const variant = getPrawnVariant(product, selectedVariantIdOrPrice);
    const variants = getPrawnVariants(product);
    const numericLegacyPrice = selectedVariantIdOrPrice !== "" &&
      Number.isFinite(Number(selectedVariantIdOrPrice)) && !variant;
    if (variants.length > 0 && !variant && !isPrawnCountOptional(product)) {
      return toast.error("Please select a prawn count option.");
    }
    if (variant && variant.isAvailable === false) return toast.error("This prawn count option is unavailable.");

    const variantId = variant ? String(variant._id || variant.id || "") : "";
    const variantCount = variant ? String(variant.count || "") : "";
    const stock = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
    if (stock < 1) return toast.error("This product option is currently out of stock.");
    const maxWeight = Math.floor(Math.min(
      Number(product.maxQuantity ?? stock),
      stock
    ));
    if (selectedWeight > maxWeight) return toast.error(`Maximum available quantity is ${maxWeight} KG for this option.`);

    const suppliedPrice = numericLegacyPrice ? Number(selectedVariantIdOrPrice) : Number(selectedPricePerKg);
    const variantPrice = Number(variant?.pricePerKg);
    const productPrice = Number(product.price ?? product.pricePerKg ?? 0);
    const pricePerKg = variant && Number.isFinite(variantPrice) && variantPrice > 0
      ? variantPrice
      : Number.isFinite(productPrice) && productPrice > 0
        ? productPrice
        : Number.isFinite(suppliedPrice) && suppliedPrice > 0
          ? suppliedPrice
          : 0;
    if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) return toast.error("Unable to determine the price for this item.");

    const lineKey = createCartLineKey(selectedWeight, selectedPreparation, variantId);
    const current = normalizeCartData(cartItems);
    const existing = current[id]?.[lineKey];
    const updatedCart = {
      ...current,
      [id]: {
        ...(current[id] || {}),
        [lineKey]: {
          weight: selectedWeight,
          quantity: Number(existing?.quantity || 1),
          preparation: selectedPreparation,
          variantId,
          variantCount,
          pricePerKg,
        },
      },
    };
    setCartItems(updatedCart);

    if (!token) {
      toast.success("Added to cart.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId: id, weight: selectedWeight, preparation: selectedPreparation, variantId, variantCount, pricePerKg },
        { headers: { token } }
      );
      if (response.data?.success) {
        setCartItems(normalizeCartData(response.data.cartData || updatedCart));
        toast.success("Added to cart.");
      } else {
        toast.error(response.data?.message || "Unable to add product.");
        await loadUserCart();
      }
    } catch (error) {
      console.error("Add cart error:", error);
      handleAuthError(error);
      if (![401, 403].includes(error?.response?.status)) await loadUserCart();
    }
  };

  /* ============================================================
     REMOVE FROM CART

     Removes ONE preparation/weight line.
  ============================================================ */

  const removeFromCart =
    async (
      id,
      lineKey,
      preparation = ""
    ) => {
      const normalizedCart =
        normalizeCartData(
          cartItems
        );

      if (
        !normalizedCart[id]
      ) {
        return;
      }

      const updatedCart = {
        ...normalizedCart,

        [id]: {
          ...normalizedCart[id],
        },
      };

      /*
        If lineKey isn't supplied,
        remove the entire product for backward compatibility.
      */

      if (lineKey) {
        delete updatedCart[id][
          lineKey
        ];
      } else if (
        preparation
      ) {
        /*
          Find line by preparation.
        */

        const matchingKey =
          Object.keys(
            updatedCart[id]
          ).find(
            (key) => {
              return (
                String(
                  updatedCart[id][
                    key
                  ]?.preparation ||
                    ""
                ).trim() ===
                String(
                  preparation
                ).trim()
              );
            }
          );

        if (matchingKey) {
          delete updatedCart[id][
            matchingKey
          ];
        }
      } else {
        delete updatedCart[id];
      }

      /*
        Remove empty product object.
      */

      if (
        updatedCart[id] &&
        Object.keys(
          updatedCart[id]
        ).length === 0
      ) {
        delete updatedCart[id];
      }

      setCartItems(
        updatedCart
      );

      /* --------------------------------------------------------
         GUEST
      -------------------------------------------------------- */

      if (!token) {
        toast.success(
          "Removed from cart."
        );

        return;
      }

      /* --------------------------------------------------------
         LOGGED-IN USER
      -------------------------------------------------------- */

      try {
        const response =
          await axios.post(
            `${backendUrl}/api/cart/remove`,
            {
              itemId: id,
              lineKey,
              preparation,
            },
            {
              headers: {
                token,
              },
            }
          );

        if (
          response.data?.success
        ) {
          const backendCart =
            normalizeCartData(
              response.data
                .cartData ||
                updatedCart
            );

          setCartItems(
            backendCart
          );

          toast.success(
            "Removed from cart."
          );
        } else {
          toast.error(
            response.data
              ?.message ||
              "Unable to remove item."
          );

          await loadUserCart();
        }
      } catch (error) {
        console.error(
          "❌ Remove cart error:",
          error
        );

        handleAuthError(error);

        if (
          error?.response
            ?.status !== 401 &&
          error?.response
            ?.status !== 403
        ) {
          await loadUserCart();
        }
      }
    };

  /* ============================================================
     UPDATE CART WEIGHT

     Preparation stays attached to the item.
  ============================================================ */

  const updateWeight = async (
    id,
    oldWeight,
    newWeight,
    lineKey,
    preparation
  ) => {
    const product = products.find((item) => String(item._id) === String(id));
    if (!product) return toast.error("Product not found.");

    const updatedWeight = Number(newWeight);
    const previousWeight = Number(oldWeight);
    if (!Number.isInteger(updatedWeight) || updatedWeight < 1) {
      return toast.error("Weight must be a whole number of kilograms (1 KG, 2 KG, 3 KG...).");
    }
    if (!Number.isFinite(previousWeight) || previousWeight < 1) {
      return toast.error("Invalid previous weight.");
    }

    const current = normalizeCartData(cartItems);
    if (!current[id]) return toast.error("Cart item not found.");

    let oldLineKey = lineKey;
    if (!oldLineKey || !current[id][oldLineKey]) {
      oldLineKey = Object.keys(current[id]).find((key) => {
        const item = current[id][key];
        return Number(item?.weight) === previousWeight &&
          String(item?.preparation || "").trim() === String(preparation || "").trim();
      });
    }
    const existingItem = oldLineKey ? current[id][oldLineKey] : null;
    if (!existingItem) return toast.error("Cart item not found.");

    const variantId = String(existingItem.variantId || "");
    const variant = getPrawnVariant(product, variantId);
    const stock = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
    const maxWeight = Math.floor(Math.min(Number(product.maxQuantity ?? stock), stock));
    if (stock < 1) return toast.error("This product option is currently out of stock.");
    if (updatedWeight > maxWeight) return toast.error(`Maximum available quantity is ${maxWeight} KG for this option.`);

    const selectedPreparation = String(preparation ?? existingItem.preparation ?? "").trim();
    const variantCount = String(existingItem.variantCount || variant?.count || "");
    const pricePerKg = getItemBasePricePerKg(product, {
      ...existingItem,
      variantId,
    });

    const newLineKey = createCartLineKey(updatedWeight, selectedPreparation, variantId);
    const productCart = { ...current[id] };
    delete productCart[oldLineKey];
    const existingNewLine = productCart[newLineKey];
    productCart[newLineKey] = {
      weight: updatedWeight,
      quantity: Number(existingNewLine?.quantity || existingItem.quantity || 1),
      preparation: selectedPreparation,
      variantId,
      variantCount,
      pricePerKg,
    };
    const updatedCart = { ...current, [id]: productCart };
    setCartItems(updatedCart);

    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        {
          itemId: id,
          oldWeight: previousWeight,
          newWeight: updatedWeight,
          preparation: selectedPreparation,
          oldLineKey,
          newLineKey,
          variantId,
          variantCount,
          pricePerKg,
        },
        { headers: { token } }
      );
      if (response.data?.success) {
        setCartItems(normalizeCartData(response.data.cartData || updatedCart));
      } else {
        toast.error(response.data?.message || "Unable to update weight.");
        await loadUserCart();
      }
    } catch (error) {
      console.error("Update weight error:", error);
      handleAuthError(error);
      if (![401, 403].includes(error?.response?.status)) await loadUserCart();
    }
  };

  /* ============================================================
     CART COUNT

     Counts cart LINE ITEMS.

     Example:

     Curry Cut → 1
     Fry Cut   → 1

     Cart count = 2
  ============================================================ */

  const getCartCount =
    () => {
      let count = 0;

      const normalizedCart =
        normalizeCartData(
          cartItems
        );

      Object.values(
        normalizedCart
      ).forEach(
        (productCart) => {
          Object.values(
            productCart || {}
          ).forEach(
            (lineItem) => {
              const quantity =
                Number(
                  lineItem?.quantity ||
                    0
                );

              if (
                Number.isFinite(
                  quantity
                ) &&
                quantity > 0
              ) {
                count +=
                  quantity;
              }
            }
          );
        }
      );

      return count;
    };

  /* ============================================================
     CART AMOUNT

     Seafood subtotal only: base price × KG × item quantity.
     Preparation & Cleaning is calculated separately below.
  ============================================================ */

  const getCartAmount = () => {
    let total = 0;
    const normalizedCart = normalizeCartData(cartItems);

    Object.entries(normalizedCart).forEach(([id, productCart]) => {
      const product = products.find((item) => String(item._id) === String(id));
      if (!product) return;

      Object.values(productCart || {}).forEach((lineItem) => {
        const weight = Number(lineItem?.weight || 0);
        const quantity = Number(lineItem?.quantity || 1);
        if (!Number.isInteger(weight) || weight < 1 || !Number.isInteger(quantity) || quantity < 1) return;

        const pricePerKg = getItemBasePricePerKg(product, lineItem);
        if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) return;
        total += pricePerKg * weight * quantity;
      });
    });

    return Number(total.toFixed(2));
  };

  const getCartPreparationAmount = () => {
    let total = 0;
    const normalizedCart = normalizeCartData(cartItems);

    Object.entries(normalizedCart).forEach(([id, productCart]) => {
      const product = products.find((item) => String(item._id) === String(id));
      if (!product || !requiresPreparation(product)) return;

      Object.values(productCart || {}).forEach((lineItem) => {
        const weight = Number(lineItem?.weight || 0);
        const quantity = Number(lineItem?.quantity || 1);
        if (!Number.isInteger(weight) || weight < 1 || !Number.isInteger(quantity) || quantity < 1) return;
        total += PREPARATION_CHARGE_PER_KG * weight * quantity;
      });
    });

    return Number(total.toFixed(2));
  };

  /* ============================================================
     UPDATE USER
  ============================================================ */

  const updateUser = (
    data
  ) => {
    setUser(data);

    if (data) {
      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );
    } else {
      localStorage.removeItem(
        "user"
      );
    }
  };

  /* ============================================================
     LOGOUT
  ============================================================ */

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    /*
      Keep your existing behavior:
      logout clears the guest/local cart.
    */

    localStorage.removeItem(
      "cartItems"
    );

    setToken("");
    setUser(null);
    setCartItems({});
    setFavorites([]);

    toast.success(
      "Logged out successfully."
    );

    navigate("/login");
  };

  /* ============================================================
     CONTEXT VALUE
  ============================================================ */

  const value = {
    /* ========================================================
       Products
    ======================================================== */

    products,
    setProducts,
    getProducts,

    /* ========================================================
       Global
    ======================================================== */

    currency,
    delivery_fee,
    PREPARATION_CHARGE_PER_KG,
    backendUrl,
    navigate,

    /* ========================================================
       Search
    ======================================================== */

    search,
    setSearch,
    showSearch,
    setShowSearch,

    /* ========================================================
       Authentication
    ======================================================== */

    token,
    setToken,

    user,
    setUser,

    updateUser,
    getUserProfile,

    /* ========================================================
       Cart
    ======================================================== */

    cartItems,
    setCartItems,

    addToCart,
    removeFromCart,
    updateWeight,

    getCartCount,
    getCartAmount,
    getCartPreparationAmount,
    getPreparationPrice,
    getPreparationOptions,
    requiresPreparation,

    /* ========================================================
       Favorites
    ======================================================== */

    favorites,
    setFavorites,
    getFavorites,
    addFavorite,
    removeFavorite,

    /* ========================================================
       Status
    ======================================================== */

    loading,
    error,

    /* ========================================================
       Account
    ======================================================== */

    logout,
  };

  /* ============================================================
     PROVIDER
  ============================================================ */

  return (
    <ShopContext.Provider
      value={value}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
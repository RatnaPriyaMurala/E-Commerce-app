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

  /*
    Keep your existing delivery fee.
  */
  const delivery_fee = 10;

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
    preparation
  ) => {
    const normalizedPreparation =
      String(preparation || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    return `${Number(weight)}-${normalizedPreparation}`;
  };

  /* ============================================================
     PREPARATION PRICE HELPER

     Finds the price per KG for the selected preparation.

     Supports:
     - pricePerKg
     - price
     - amount
     - fallback to product base price
  ============================================================ */

  const getPreparationPrice = (
    product,
    preparation
  ) => {
    const basePrice = Number(
      product?.price || 0
    );

    const normalizeName = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    const selectedPreparation =
      normalizeName(preparation);

    if (!selectedPreparation) {
      return basePrice;
    }

    /*
      Support preparation pricing stored in
      preparationOptions.
    */

    const options = Array.isArray(
      product?.preparationOptions
    )
      ? product.preparationOptions
      : [];

    const selectedOption = options.find(
      (option) => {
        if (typeof option === "string") {
          return (
            normalizeName(option) ===
            selectedPreparation
          );
        }

        if (
          !option ||
          typeof option !== "object"
        ) {
          return false;
        }

        const optionName =
          option.name ??
          option.label ??
          option.preparation ??
          option.title ??
          "";

        return (
          normalizeName(optionName) ===
          selectedPreparation
        );
      }
    );

    if (!selectedOption) {
      console.warn(
        "⚠️ Preparation price not found:",
        preparation,
        product?.name,
        product?.preparationOptions
      );

      return basePrice;
    }

    /*
      If preparation option is an object,
      read its actual per-KG price.
    */

    if (
      typeof selectedOption === "object"
    ) {
      const possiblePrices = [
        selectedOption.pricePerKg,
        selectedOption.price,
        selectedOption.amount,
      ];

      for (const value of possiblePrices) {
        const price = Number(value);

        if (
          Number.isFinite(price) &&
          price > 0
        ) {
          return price;
        }
      }
    }

    return basePrice;
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

  const normalizeCartData = (
    cartData
  ) => {
    if (
      !cartData ||
      typeof cartData !== "object" ||
      Array.isArray(cartData)
    ) {
      return {};
    }

    const normalized = {};

    Object.entries(cartData).forEach(
      ([productId, productCart]) => {
        if (
          !productCart ||
          typeof productCart !== "object" ||
          Array.isArray(productCart)
        ) {
          return;
        }

        normalized[productId] = {};

        Object.entries(
          productCart
        ).forEach(
          ([key, value]) => {
            /* ==================================================
               NEW FORMAT
            ================================================== */

            if (
              value &&
              typeof value === "object" &&
              !Array.isArray(value) &&
              value.weight !== undefined
            ) {
              const weight = Number(
                value.weight
              );

              const quantity = Number(
                value.quantity || 1
              );

              const preparation =
                String(
                  value.preparation || ""
                ).trim();

              if (
                Number.isFinite(weight) &&
                weight > 0 &&
                Number.isFinite(quantity) &&
                quantity > 0
              ) {
                const lineKey =
                  createCartLineKey(
                    weight,
                    preparation
                  );

                normalized[productId][
                  lineKey
                ] = {
                  weight,
                  quantity,
                  preparation,
                  pricePerKg:
                    Number(
                      value.pricePerKg
                    ) > 0
                      ? Number(
                          value.pricePerKg
                        )
                      : 0,
                };
              }

              return;
            }

            /* ==================================================
               OLD FORMAT

               {
                 "1": 1
               }
            ================================================== */

            const oldWeight =
              Number(key);

            const oldQuantity =
              Number(value || 0);

            if (
              Number.isFinite(
                oldWeight
              ) &&
              oldWeight > 0 &&
              Number.isFinite(
                oldQuantity
              ) &&
              oldQuantity > 0
            ) {
              const lineKey =
                createCartLineKey(
                  oldWeight,
                  ""
                );

              normalized[productId][
                lineKey
              ] = {
                weight: oldWeight,
                quantity: oldQuantity,
                preparation: "",
                pricePerKg: 0,
              };
            }
          }
        );

        /*
          Remove empty product cart objects.
        */

        if (
          Object.keys(
            normalized[productId]
          ).length === 0
        ) {
          delete normalized[productId];
        }
      }
    );

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
            allProducts.filter(
              (product) =>
                product?.isAvailable !==
                  false &&
                Number(
                  product?.stock || 0
                ) > 0
            );

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
    selectedPricePerKg
  ) => {
    /* ----------------------------------------------------------
       PRODUCT
    ---------------------------------------------------------- */

    const product =
      products.find(
        (item) =>
          item._id === id
      );

    if (!product) {
      toast.error(
        "Product not found."
      );
      return;
    }

    /* ----------------------------------------------------------
       PREPARATION
    ---------------------------------------------------------- */

    const selectedPreparation =
      String(
        preparation || ""
      ).trim();

    if (!selectedPreparation) {
      toast.error(
        "Please select a preparation option."
      );
      return;
    }

    /* ----------------------------------------------------------
       WEIGHT
    ---------------------------------------------------------- */

    const selectedWeight =
      Number(weight);

    if (
      !Number.isFinite(
        selectedWeight
      ) ||
      selectedWeight <= 0
    ) {
      toast.error(
        "Please select a valid weight."
      );
      return;
    }

    /* ----------------------------------------------------------
       PREPARATION PRICE
    ---------------------------------------------------------- */

    const passedPrice =
      Number(
        selectedPricePerKg
      );

    const pricePerKg =
      Number.isFinite(
        passedPrice
      ) &&
      passedPrice > 0
        ? passedPrice
        : getPreparationPrice(
            product,
            selectedPreparation
          );

    /* ----------------------------------------------------------
       STOCK
    ---------------------------------------------------------- */

    const stock = Number(
      product.stock || 0
    );

    if (stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );
      return;
    }

    if (
      selectedWeight >
      stock
    ) {
      toast.error(
        `Only ${stock} KG available.`
      );
      return;
    }

    /* ----------------------------------------------------------
       MIN / MAX WEIGHT
    ---------------------------------------------------------- */

    const minWeight =
      Number(
        product.minQuantity ||
          0.5
      );

    const maxWeight =
      Number(
        product.maxQuantity ||
          stock
      );

    if (
      selectedWeight <
      minWeight
    ) {
      toast.error(
        `Minimum order weight is ${minWeight} KG.`
      );
      return;
    }

    if (
      selectedWeight >
      maxWeight
    ) {
      toast.error(
        `Maximum order weight is ${maxWeight} KG.`
      );
      return;
    }

    /* ----------------------------------------------------------
       QUANTITY STEP
    ---------------------------------------------------------- */

    const quantityStep =
      Number(
        product.quantityStep ||
          0
      );

    if (
      quantityStep > 0
    ) {
      const steps =
        selectedWeight /
        quantityStep;

      if (
        Math.abs(
          steps -
            Math.round(
              steps
            )
        ) > 0.000001
      ) {
        toast.error(
          `Weight must be in increments of ${quantityStep} KG.`
        );
        return;
      }
    }

    /* ----------------------------------------------------------
       CART LINE KEY
    ---------------------------------------------------------- */

    const lineKey =
      createCartLineKey(
        selectedWeight,
        selectedPreparation
      );

    /* ----------------------------------------------------------
       CURRENT CART
    ---------------------------------------------------------- */

    const normalizedCurrentCart =
      normalizeCartData(
        cartItems
      );

    /* ----------------------------------------------------------
       ADD / REPLACE SAME LINE
    ---------------------------------------------------------- */

    const updatedCart = {
      ...normalizedCurrentCart,

      [id]: {
        ...(normalizedCurrentCart[
          id
        ] || {}),

        [lineKey]: {
          weight:
            selectedWeight,
          quantity: 1,
          preparation:
            selectedPreparation,
          pricePerKg,
        },
      },
    };

    /* ----------------------------------------------------------
       UPDATE UI IMMEDIATELY
    ---------------------------------------------------------- */

    setCartItems(
      updatedCart
    );

    /* ----------------------------------------------------------
       LOGGED-IN USER → BACKEND
    ---------------------------------------------------------- */

    if (token) {
      try {
        const response =
          await axios.post(
            `${backendUrl}/api/cart/add`,
            {
              itemId: id,
              weight:
                selectedWeight,
              preparation:
                selectedPreparation,
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
            "Added to cart."
          );
        } else {
          toast.error(
            response.data
              ?.message ||
              "Unable to add product."
          );

          await loadUserCart();
        }
      } catch (error) {
        console.error(
          "❌ Add cart error:",
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
    } else {
      /* --------------------------------------------------------
         GUEST USER
      -------------------------------------------------------- */

      toast.success(
        "Added to cart."
      );
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

  const updateWeight =
    async (
      id,
      oldWeight,
      newWeight,
      lineKey,
      preparation
    ) => {
      const product =
        products.find(
          (item) =>
            item._id === id
        );

      if (!product) {
        toast.error(
          "Product not found."
        );
        return;
      }

      const updatedWeight =
        Number(newWeight);

      const previousWeight =
        Number(oldWeight);

      if (
        !Number.isFinite(
          updatedWeight
        ) ||
        updatedWeight <= 0
      ) {
        toast.error(
          "Invalid weight."
        );
        return;
      }

      if (
        !Number.isFinite(
          previousWeight
        ) ||
        previousWeight <= 0
      ) {
        toast.error(
          "Invalid previous weight."
        );
        return;
      }

      /* --------------------------------------------------------
         STOCK
      -------------------------------------------------------- */

      if (
        updatedWeight >
        Number(
          product.stock || 0
        )
      ) {
        toast.error(
          `Only ${product.stock} KG available.`
        );
        return;
      }

      /* --------------------------------------------------------
         MIN
      -------------------------------------------------------- */

      const minWeight =
        Number(
          product.minQuantity ||
            0.5
        );

      if (
        updatedWeight <
        minWeight
      ) {
        toast.error(
          `Minimum weight is ${minWeight} KG.`
        );
        return;
      }

      /* --------------------------------------------------------
         MAX
      -------------------------------------------------------- */

      const maxWeight =
        Number(
          product.maxQuantity ||
            product.stock ||
            10
        );

      if (
        updatedWeight >
        maxWeight
      ) {
        toast.error(
          `Maximum weight is ${maxWeight} KG.`
        );
        return;
      }

      /* --------------------------------------------------------
         STEP
      -------------------------------------------------------- */

      const quantityStep =
        Number(
          product.quantityStep ||
            0
        );

      if (
        quantityStep > 0
      ) {
        const steps =
          updatedWeight /
          quantityStep;

        if (
          Math.abs(
            steps -
              Math.round(
                steps
              )
          ) > 0.000001
        ) {
          toast.error(
            `Weight must be in increments of ${quantityStep} KG.`
          );
          return;
        }
      }

      /* --------------------------------------------------------
         CURRENT CART
      -------------------------------------------------------- */

      const normalizedCart =
        normalizeCartData(
          cartItems
        );

      if (
        !normalizedCart[id]
      ) {
        return;
      }

      /*
        Find the actual old line.
      */

      let oldLineKey =
        lineKey;

      if (
        !oldLineKey ||
        !normalizedCart[id][
          oldLineKey
        ]
      ) {
        oldLineKey =
          Object.keys(
            normalizedCart[id]
          ).find(
            (key) => {
              const item =
                normalizedCart[
                  id
                ][key];

              return (
                Number(
                  item?.weight
                ) ===
                  previousWeight &&
                String(
                  item?.preparation ||
                    ""
                ).trim() ===
                  String(
                    preparation || ""
                  ).trim()
              );
            }
          );
      }

      if (
        !oldLineKey ||
        !normalizedCart[id][
          oldLineKey
        ]
      ) {
        toast.error(
          "Cart item not found."
        );
        return;
      }

      const existingItem =
        normalizedCart[id][
          oldLineKey
        ];

      const selectedPreparation =
        String(
          preparation ||
            existingItem?.preparation ||
            ""
        ).trim();

      /*
        New key after changing weight.
      */

      const newLineKey =
        createCartLineKey(
          updatedWeight,
          selectedPreparation
        );

      const updatedProductCart =
        {
          ...normalizedCart[id],
        };

      /*
        Remove old line.
      */

      delete updatedProductCart[
        oldLineKey
      ];

      /*
        If the new key already exists,
        preserve its quantity.
      */

      const existingNewLine =
        updatedProductCart[
          newLineKey
        ];

      const preparationPrice =
        getPreparationPrice(
          product,
          selectedPreparation
        );

      updatedProductCart[
        newLineKey
      ] = {
        weight:
          updatedWeight,

        quantity: Number(
          existingNewLine?.quantity ||
            existingItem?.quantity ||
            1
        ),

        preparation:
          selectedPreparation,

        pricePerKg:
          preparationPrice,
      };

      const updatedCart = {
        ...normalizedCart,

        [id]:
          updatedProductCart,
      };

      setCartItems(
        updatedCart
      );

      /* --------------------------------------------------------
         GUEST
      -------------------------------------------------------- */

      if (!token) {
        return;
      }

      /* --------------------------------------------------------
         LOGGED-IN USER
      -------------------------------------------------------- */

      try {
        const response =
          await axios.post(
            `${backendUrl}/api/cart/update`,
            {
              itemId: id,

              oldWeight:
                previousWeight,

              newWeight:
                updatedWeight,

              preparation:
                selectedPreparation,

              oldLineKey,

              newLineKey,
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
        } else {
          toast.error(
            response.data
              ?.message ||
              "Unable to update weight."
          );

          await loadUserCart();
        }
      } catch (error) {
        console.error(
          "❌ Update weight error:",
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

     Price is PER KG.

     Preparation price is used when preparation exists.
  ============================================================ */

  const getCartAmount =
    () => {
      let total = 0;

      const normalizedCart =
        normalizeCartData(
          cartItems
        );

      Object.entries(
        normalizedCart
      ).forEach(
        ([id, productCart]) => {
          const product =
            products.find(
              (item) =>
                item._id === id
            );

          if (!product) {
            return;
          }

          Object.values(
            productCart || {}
          ).forEach(
            (lineItem) => {
              const weight =
                Number(
                  lineItem?.weight ||
                    0
                );

              const quantity =
                Number(
                  lineItem?.quantity ||
                    1
                );

              if (
                !Number.isFinite(
                  weight
                ) ||
                weight <= 0 ||
                !Number.isFinite(
                  quantity
                ) ||
                quantity <= 0
              ) {
                return;
              }

              let pricePerKg;

              const preparation =
                String(
                  lineItem?.preparation ||
                    ""
                ).trim();

              if (
                preparation
              ) {
                /*
                  Always calculate current price
                  from current product preparation.
                */

                pricePerKg =
                  getPreparationPrice(
                    product,
                    preparation
                  );
              } else {
                pricePerKg =
                  Number(
                    lineItem?.pricePerKg ||
                      0
                  );

                if (
                  !Number.isFinite(
                    pricePerKg
                  ) ||
                  pricePerKg <= 0
                ) {
                  pricePerKg =
                    Number(
                      product.price ||
                        0
                    );
                }
              }

              if (
                !Number.isFinite(
                  pricePerKg
                ) ||
                pricePerKg <= 0
              ) {
                return;
              }

              total +=
                pricePerKg *
                weight *
                quantity;
            }
          );
        }
      );

      return Number(
        total.toFixed(2)
      );
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
    getPreparationPrice,

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
import { createContext, useCallback, useEffect, useState } from "react";
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
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  /* ============================================================
     CART
  ============================================================ */

  const [cartItems, setCartItems] = useState({});

  /* ============================================================
     HELPER
  ============================================================ */

  const handleAuthError = (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken("");
      setUser(null);

      toast.error("Your session has expired. Please login again.");

      navigate("/login");

      return true;
    }

    return false;
  };

  /* ============================================================
     USER PROFILE
  ============================================================ */

  const getUserProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${backendUrl}/api/user/profile`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data?.success) {
        const profile = response.data.user;

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
  }, [backendUrl, token]);

  /* ============================================================
     LOAD USER PROFILE WHEN TOKEN CHANGES
  ============================================================ */

  useEffect(() => {
    if (token) {
      getUserProfile();
    }
  }, [token, getUserProfile]);

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${backendUrl}/api/product/list`
      );

      console.log(
        "✅ PRODUCT RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setProducts(response.data.products || []);
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
        error?.response?.data?.message ||
          error.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  /* ============================================================
     LOAD PRODUCTS ON APP START
  ============================================================ */

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  /* ============================================================
     LOAD USER CART
  ============================================================ */

  const loadUserCart = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        {
          headers: {
            token,
          },
        }
      );

      if (response.data?.success) {
        setCartItems(
          response.data.cartData || {}
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
  }, [backendUrl, token]);

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
        localStorage.getItem("cartItems");

      if (savedCart) {
        setCartItems(
          JSON.parse(savedCart)
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
  }, [token, loadUserCart]);

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
  }, [cartItems, token]);

  /* ============================================================
     ADD TO CART
  ============================================================ */

  const addToCart = async (id, weight) => {
    const product = products.find(
      (item) => item._id === id
    );

    if (!product) {
      toast.error("Product not found.");
      return;
    }

    const selectedWeight = Number(weight);

    if (!selectedWeight || selectedWeight <= 0) {
      toast.error("Please select a valid weight.");
      return;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (selectedWeight > stock) {
      toast.error(
        `Only ${stock} KG available.`
      );
      return;
    }

    const minWeight = Number(
      product.minQuantity || 0.5
    );

    const maxWeight = Number(
      product.maxQuantity || stock
    );

    if (selectedWeight < minWeight) {
      toast.error(
        `Minimum order weight is ${minWeight} KG.`
      );
      return;
    }

    if (selectedWeight > maxWeight) {
      toast.error(
        `Maximum order weight is ${maxWeight} KG.`
      );
      return;
    }

    /* Guest/local UI update */
    const updatedCart = {
      ...cartItems,
      [id]: {
        [selectedWeight]: 1,
      },
    };

    setCartItems(updatedCart);

    /* Logged-in user → backend */
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          {
            itemId: id,
            weight: selectedWeight,
          },
          {
            headers: {
              token,
            },
          }
        );

        if (response.data?.success) {
          setCartItems(
            response.data.cartData ||
              updatedCart
          );

          toast.success("Added to cart.");
        } else {
          toast.error(
            response.data?.message ||
              "Unable to add product."
          );
        }
      } catch (error) {
        console.error(
          "❌ Add cart error:",
          error
        );

        handleAuthError(error);
      }
    } else {
      toast.success("Added to cart.");
    }
  };

  /* ============================================================
     REMOVE FROM CART
  ============================================================ */

  const removeFromCart = async (id) => {
    const updatedCart = {
      ...cartItems,
    };

    delete updatedCart[id];

    setCartItems(updatedCart);

    /* Guest */
    if (!token) {
      toast.success("Removed from cart.");
      return;
    }

    /* Logged-in */
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/remove`,
        {
          itemId: id,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data?.success) {
        setCartItems(
          response.data.cartData ||
            updatedCart
        );

        toast.success("Removed from cart.");
      } else {
        toast.error(
          response.data?.message ||
            "Unable to remove item."
        );
      }
    } catch (error) {
      console.error(
        "❌ Remove cart error:",
        error
      );

      handleAuthError(error);
    }
  };

  /* ============================================================
     UPDATE CART WEIGHT
  ============================================================ */

  const updateWeight = async (
    id,
    oldWeight,
    newWeight
  ) => {
    const product = products.find(
      (item) => item._id === id
    );

    if (!product) {
      toast.error("Product not found.");
      return;
    }

    const updatedWeight = Number(newWeight);
    const previousWeight = Number(oldWeight);

    if (!updatedWeight || updatedWeight <= 0) {
      toast.error("Invalid weight.");
      return;
    }

    if (
      updatedWeight >
      Number(product.stock || 0)
    ) {
      toast.error(
        `Only ${product.stock} KG available.`
      );
      return;
    }

    if (
      updatedWeight <
      Number(product.minQuantity || 0.5)
    ) {
      toast.error(
        `Minimum weight is ${product.minQuantity || 0.5} KG.`
      );
      return;
    }

    if (
      updatedWeight >
      Number(
        product.maxQuantity ||
          product.stock ||
          10
      )
    ) {
      toast.error(
        `Maximum weight is ${
          product.maxQuantity ||
          product.stock ||
          10
        } KG.`
      );
      return;
    }

    const updatedCart = {
      ...cartItems,
    };

    if (!updatedCart[id]) return;

    delete updatedCart[id][previousWeight];

    updatedCart[id][updatedWeight] = 1;

    setCartItems(updatedCart);

    /* Guest cart */
    if (!token) return;

    /* Logged-in cart */
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        {
          itemId: id,
          oldWeight: previousWeight,
          newWeight: updatedWeight,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data?.success) {
        setCartItems(
          response.data.cartData ||
            updatedCart
        );
      } else {
        toast.error(
          response.data?.message ||
            "Unable to update weight."
        );
      }
    } catch (error) {
      console.error(
        "❌ Update weight error:",
        error
      );

      handleAuthError(error);
    }
  };

  /* ============================================================
     CART COUNT
  ============================================================ */

  const getCartCount = () => {
    let count = 0;

    Object.keys(cartItems).forEach((id) => {
      Object.keys(
        cartItems[id] || {}
      ).forEach((weight) => {
        count += Number(
          cartItems[id][weight] || 0
        );
      });
    });

    return count;
  };

  /* ============================================================
     CART AMOUNT
  ============================================================ */

  const getCartAmount = () => {
    let total = 0;

    Object.keys(cartItems).forEach((id) => {
      const product = products.find(
        (item) => item._id === id
      );

      if (!product) return;

      Object.keys(
        cartItems[id] || {}
      ).forEach((weight) => {
        total +=
          Number(product.price || 0) *
          Number(weight || 0) *
          Number(
            cartItems[id][weight] || 1
          );
      });
    });

    return total;
  };

  /* ============================================================
     UPDATE USER
  ============================================================ */

  const updateUser = (data) => {
    setUser(data);

    if (data) {
      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );
    } else {
      localStorage.removeItem("user");
    }
  };

  /* ============================================================
     LOGOUT
  ============================================================ */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    /*
      We intentionally remove the guest cart too,
      because the previous implementation did this
      and logout should start with a clean cart.
    */
    localStorage.removeItem("cartItems");

    setToken("");
    setUser(null);
    setCartItems({});

    toast.success("Logged out successfully.");

    navigate("/login");
  };

  /* ============================================================
     CONTEXT VALUE
  ============================================================ */

  const value = {
    /* Products */
    products,
    setProducts,
    getProducts,

    /* Global */
    currency,
    delivery_fee,
    backendUrl,
    navigate,

    /* Search */
    search,
    setSearch,
    showSearch,
    setShowSearch,

    /* Authentication */
    token,
    setToken,

    user,
    setUser,
    updateUser,
    getUserProfile,

    /* Cart */
    cartItems,
    setCartItems,

    addToCart,
    removeFromCart,
    updateWeight,

    getCartCount,
    getCartAmount,

    /* Status */
    loading,
    error,

    /* Account */
    logout,
  };

  /* ============================================================
     PROVIDER
  ============================================================ */

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
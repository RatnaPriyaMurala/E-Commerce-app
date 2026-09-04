import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

import {
  FaMapMarkerAlt,
  FaUser,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaLock,
  FaShoppingBag,
  FaMobileAlt,
} from "react-icons/fa";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    products,
    cartItems,
    token,
    getCartAmount,
    setCartItems,
    delivery_fee,
    currency = "₹",
  } = useContext(ShopContext);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    alternatePhone: "",
    deliveryPoint: "",
    city: "",
    state: "",
    zipcode: "",
    landmark: "",
  });

  /* ============================================================
     CART / TOTAL
  ============================================================ */

  const cartAmount = Number(getCartAmount?.() || 0);

  /*
   * Your backend currently uses a fixed ₹10 delivery fee.
   * Keep the frontend display consistent with the server.
   */
  const deliveryAmount = 10;

  const totalAmount = useMemo(() => {
    if (cartAmount <= 0) return 0;

    return Number(
      (cartAmount + deliveryAmount).toFixed(2)
    );
  }, [cartAmount]);

  /* ============================================================
     BUILD ORDER ITEMS
  ============================================================ */

  const orderItems = useMemo(() => {
    const items = [];

    if (
      !products?.length ||
      !cartItems ||
      typeof cartItems !== "object"
    ) {
      return items;
    }

    Object.entries(cartItems).forEach(
      ([productId, productCart]) => {
        const product = products.find(
          (item) => item._id === productId
        );

        if (!product || !productCart) return;

        Object.entries(productCart).forEach(
          ([lineKey, lineItem]) => {
            let weight = 0;
            let quantity = 0;
            let preparation = "";

            /* ------------------------------------------------
               NEW CART FORMAT
            ------------------------------------------------ */

            if (
              lineItem &&
              typeof lineItem === "object"
            ) {
              weight = Number(
                lineItem.weight || 0
              );

              quantity = Number(
                lineItem.quantity || 1
              );

              preparation = String(
                lineItem.preparation || ""
              ).trim();
            }

            /* ------------------------------------------------
               OLD CART FORMAT
            ------------------------------------------------ */

            else {
              weight = Number(lineKey);

              quantity = Number(
                lineItem || 0
              );

              preparation = "";
            }

            if (
              !Number.isFinite(weight) ||
              weight <= 0 ||
              !Number.isFinite(quantity) ||
              quantity <= 0
            ) {
              return;
            }

            items.push({
              _id: product._id,

              name: product.name,

              image:
                Array.isArray(product.image)
                  ? product.image[0] || ""
                  : product.image || "",

              price: Number(
                product.price || 0
              ),

              weight,

              quantity,

              preparation,
            });
          }
        );
      }
    );

    return items;
  }, [products, cartItems]);

  /* ============================================================
     LOAD CUSTOMER PROFILE
  ============================================================ */

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;

      try {
        setLoadingProfile(true);

        const response = await axios.get(
          `${backendUrl}/api/user/profile`,
          {
            headers: {
              token,
            },
          }
        );

        if (response.data?.success) {
          const user = response.data.user;

          setFormData((previous) => ({
            ...previous,

            firstName:
              user?.address?.firstName ||
              user?.name?.split(" ")?.[0] ||
              "",

            lastName:
              user?.address?.lastName ||
              user?.name
                ?.split(" ")
                ?.slice(1)
                ?.join(" ") ||
              "",

            phone:
              user?.address?.phone ||
              user?.phone ||
              "",

            alternatePhone:
              user?.address?.alternatePhone ||
              "",

            deliveryPoint:
              user?.address?.deliveryPoint ||
              "",

            city:
              user?.address?.city ||
              "",

            state:
              user?.address?.state ||
              "",

            zipcode:
              user?.address?.zipcode ||
              "",

            landmark:
              user?.address?.landmark ||
              "",
          }));
        }
      } catch (error) {
        console.error(
          "Checkout profile error:",
          error
        );

        const status =
          error?.response?.status;

        if (
          status === 401 ||
          status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          toast.error(
            "Your session has expired. Please login again."
          );

          navigate("/login");
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [
    token,
    backendUrl,
    navigate,
  ]);

  /* ============================================================
     INPUT HANDLER
  ============================================================ */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ============================================================
     PHONE NORMALIZER
  ============================================================ */

  const normalizePhone = (value) => {
    return String(value || "")
      .replace(/\D/g, "")
      .slice(-10);
  };

  /* ============================================================
     VALIDATE CHECKOUT
  ============================================================ */

  const validateCheckout = () => {
    if (!token) {
      toast.error(
        "Please login before placing your order."
      );

      navigate("/login");

      return false;
    }

    if (!orderItems.length) {
      toast.error(
        "Your cart is empty."
      );

      navigate("/menu");

      return false;
    }

    if (cartAmount <= 0) {
      toast.error(
        "Your order amount is invalid."
      );

      return false;
    }

    /* ----------------------------------------------------------
       PREPARATION VALIDATION
    ---------------------------------------------------------- */

    for (const item of orderItems) {
      if (!item.preparation?.trim()) {
        toast.error(
          `Please select a preparation option for ${item.name}.`
        );

        return false;
      }
    }

    /* ----------------------------------------------------------
       CUSTOMER NAME
    ---------------------------------------------------------- */

    if (
      !formData.firstName.trim()
    ) {
      toast.error(
        "Please enter your first name."
      );

      return false;
    }

    /* ----------------------------------------------------------
       PRIMARY PHONE
    ---------------------------------------------------------- */

    const phone =
      normalizePhone(
        formData.phone
      );

    if (!phone) {
      toast.error(
        "Please enter your phone number."
      );

      return false;
    }

    if (phone.length !== 10) {
      toast.error(
        "Please enter a valid 10-digit phone number."
      );

      return false;
    }

    /* ----------------------------------------------------------
       ALTERNATE PHONE
    ---------------------------------------------------------- */

    const alternatePhone =
      normalizePhone(
        formData.alternatePhone
      );

    if (
      alternatePhone &&
      alternatePhone.length !== 10
    ) {
      toast.error(
        "Please enter a valid 10-digit alternate phone number."
      );

      return false;
    }

    if (
      alternatePhone &&
      alternatePhone === phone
    ) {
      toast.error(
        "Alternate phone number should be different from your primary number."
      );

      return false;
    }

    /* ----------------------------------------------------------
       DELIVERY POINT
    ---------------------------------------------------------- */

    if (
      !formData.deliveryPoint.trim()
    ) {
      toast.error(
        "Please enter your bus stop or delivery point."
      );

      return false;
    }

    /* ----------------------------------------------------------
       CITY
    ---------------------------------------------------------- */

    if (
      !formData.city.trim()
    ) {
      toast.error(
        "Please enter your city."
      );

      return false;
    }

    /* ----------------------------------------------------------
       STATE
    ---------------------------------------------------------- */

    if (
      !formData.state.trim()
    ) {
      toast.error(
        "Please enter your state."
      );

      return false;
    }

    /* ----------------------------------------------------------
       PINCODE
    ---------------------------------------------------------- */

    const zipcode =
      formData.zipcode.trim();

    if (!zipcode) {
      toast.error(
        "Please enter your pincode."
      );

      return false;
    }

    if (!/^\d{6}$/.test(zipcode)) {
      toast.error(
        "Please enter a valid 6-digit pincode."
      );

      return false;
    }

    return true;
  };

  /* ============================================================
     AUTH ERROR HANDLER
  ============================================================ */

  const handleAuthError = (error) => {
    const status =
      error?.response?.status;

    if (
      status === 401 ||
      status === 403
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setCartItems({});

      toast.error(
        "Your session has expired. Please login again."
      );

      navigate("/login");

      return true;
    }

    return false;
  };

  /* ============================================================
     RAZORPAY PAYMENT
  ============================================================ */

  const displayRazorpay = async (
    orderData
  ) => {
    try {
      if (!window.Razorpay) {
        toast.error(
          "Razorpay is not loaded. Please refresh the page and try again."
        );

        setPlacingOrder(false);

        return;
      }

      /* --------------------------------------------------------
         CREATE RAZORPAY ORDER
         
         IMPORTANT:
         The backend calculates the real amount.
         Do not trust the frontend total.
      -------------------------------------------------------- */

      const response =
        await axios.post(
          `${backendUrl}/api/payment/create-order`,
          {
            items: orderData.items,
            deliveryFee:
              orderData.deliveryFee,
          },
          {
            headers: {
              token,
            },
          }
        );

      if (
        !response.data?.success
      ) {
        toast.error(
          response.data?.message ||
            "Unable to create payment."
        );

        setPlacingOrder(false);

        return;
      }

      const razorpayOrder =
        response.data.order;

      if (!razorpayOrder?.id) {
        toast.error(
          "Invalid payment order received from server."
        );

        setPlacingOrder(false);

        return;
      }

      const razorpayKey =
        import.meta.env
          .VITE_RAZORPAY_KEY;

      if (!razorpayKey) {
        toast.error(
          "Razorpay configuration is missing."
        );

        setPlacingOrder(false);

        return;
      }

      const customerName = [
        formData.firstName.trim(),
        formData.lastName.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      const options = {
        key: razorpayKey,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        order_id:
          razorpayOrder.id,

        name:
          "Sri Lakshmi Narasimha Live Fish & Sea Foods",

        description:
          "Seafood Order",

        prefill: {
          name: customerName,

          contact:
            normalizePhone(
              formData.phone
            ),
        },

        notes: {
          deliveryPoint:
            formData.deliveryPoint,

          city:
            formData.city,

          state:
            formData.state,

          pincode:
            formData.zipcode,
        },

        theme: {
          color: "#0891B2",
        },

        modal: {
          ondismiss: () => {
            setPlacingOrder(false);

            toast.info(
              "Payment window closed. Your order was not placed."
            );
          },
        },

        /* ------------------------------------------------------
           PAYMENT SUCCESS
        ------------------------------------------------------ */

        handler: async (
          paymentResponse
        ) => {
          try {
            const verifyResponse =
              await axios.post(
                `${backendUrl}/api/payment/verify`,
                {
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,

                  orderData,
                },
                {
                  headers: {
                    token,
                  },
                }
              );

            if (
              verifyResponse.data
                ?.success
            ) {
              setCartItems({});

              localStorage.removeItem(
                "cartItems"
              );

              toast.success(
                "Payment successful! Your order has been placed."
              );

              navigate("/orders");
            } else {
              toast.error(
                verifyResponse.data
                  ?.message ||
                  "Payment verification failed."
              );

              setPlacingOrder(false);

              navigate(
                "/payment-failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            if (
              handleAuthError(error)
            ) {
              setPlacingOrder(false);

              return;
            }

            toast.error(
              error?.response?.data
                ?.message ||
                "Payment verification failed."
            );

            setPlacingOrder(false);

            navigate(
              "/payment-failed"
            );
          }
        },
      };

      const paymentObject =
        new window.Razorpay(
          options
        );

      paymentObject.on(
        "payment.failed",
        (paymentError) => {
          console.error(
            "Razorpay payment failed:",
            paymentError
          );

          setPlacingOrder(false);

          toast.error(
            paymentError?.error
              ?.description ||
              "Payment failed. Please try again."
          );

          navigate(
            "/payment-failed"
          );
        }
      );

      paymentObject.open();
    } catch (error) {
      console.error(
        "Razorpay checkout error:",
        error
      );

      if (
        !handleAuthError(error)
      ) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Unable to start payment."
        );
      }

      setPlacingOrder(false);
    }
  };

  /* ============================================================
     PLACE ORDER
  ============================================================ */

  const placeOrder = async () => {
    if (placingOrder) return;

    if (!validateCheckout()) {
      return;
    }

    const normalizedPhone =
      normalizePhone(
        formData.phone
      );

    const normalizedAlternatePhone =
      normalizePhone(
        formData.alternatePhone
      );

    /*
     * Keep the address structure compatible with
     * the existing backend while adding the new
     * delivery-point information.
     */
    const normalizedAddress = {
      firstName:
        formData.firstName.trim(),

      lastName:
        formData.lastName.trim(),

      phone:
        normalizedPhone,

      alternatePhone:
        normalizedAlternatePhone,

      deliveryPoint:
        formData.deliveryPoint.trim(),

      city:
        formData.city.trim(),

      state:
        formData.state.trim(),

      zipcode:
        formData.zipcode.trim(),

      landmark:
        formData.landmark.trim(),

      /*
       * Keep a combined address value for compatibility
       * with existing order/address handling.
       */
      address: [
        formData.deliveryPoint.trim(),
        formData.landmark.trim()
          ? `Landmark: ${formData.landmark.trim()}`
          : "",
      ]
        .filter(Boolean)
        .join(", "),

      country: "India",
    };

    const orderData = {
      items: orderItems,

      amount:
        totalAmount,

      deliveryFee:
        deliveryAmount,

      address:
        normalizedAddress,
    };

    try {
      setPlacingOrder(true);

      await displayRazorpay(
        orderData
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      if (
        !handleAuthError(error)
      ) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Unable to place order."
        );
      }

      setPlacingOrder(false);
    }
  };

  /* ============================================================
     EMPTY CART GUARD
  ============================================================ */

  if (
    !cartItems ||
    Object.keys(cartItems).length === 0
  ) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center">
            <FaShoppingBag className="text-3xl text-cyan-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h2>

          <p className="mt-3 text-gray-500">
            Add some seafood to your cart
            before proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/menu")
            }
            className="mt-7 px-7 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
          >
            Browse Seafood
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER */}

        <div className="mb-8 sm:mb-10">
          <Title
            text1="CHECKOUT"
            text2="DETAILS"
          />

          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-2xl">
            Enter your contact and delivery-point
            details, confirm your seafood preparation
            choices, and complete your payment securely.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.55fr_0.95fr] gap-6 lg:gap-8">

          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="space-y-6">

            {/* CUSTOMER INFORMATION */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center gap-3">
                <FaUser />

                <div>
                  <h2 className="font-bold text-base sm:text-lg">
                    Customer Information
                  </h2>

                  <p className="text-xs text-cyan-100 mt-0.5">
                    Your contact details
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">

                {loadingProfile && (
                  <div className="text-sm text-cyan-600 bg-cyan-50 border border-cyan-100 rounded-xl px-4 py-3">
                    Loading your saved details...
                  </div>
                )}

                {/* NAME */}

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={
                        formData.firstName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        formData.lastName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                    />
                  </div>

                </div>

                {/* PRIMARY PHONE */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaPhoneAlt className="text-gray-400" />

                    Phone Number

                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="flex">

                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-600">
                      +91
                    </div>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      className="w-full border border-gray-200 rounded-r-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                    />

                  </div>
                </div>

                {/* ALTERNATE PHONE */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaMobileAlt className="text-gray-400" />

                    Alternate Phone Number

                    <span className="text-xs font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <div className="flex">

                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-600">
                      +91
                    </div>

                    <input
                      type="tel"
                      name="alternatePhone"
                      value={
                        formData.alternatePhone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Alternative 10-digit number"
                      maxLength={10}
                      inputMode="numeric"
                      className="w-full border border-gray-200 rounded-r-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                    />

                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Useful if our delivery team cannot
                    reach your primary number.
                  </p>
                </div>

              </div>
            </section>

            {/* ==================================================
                DELIVERY POINT
            ================================================== */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-3">

                <FaMapMarkerAlt />

                <div>
                  <h2 className="font-bold text-base sm:text-lg">
                    Delivery Point
                  </h2>

                  <p className="text-xs text-emerald-100 mt-0.5">
                    Where should we meet you for delivery?
                  </p>
                </div>

              </div>

              <div className="p-5 sm:p-6 space-y-5">

                {/* BUS STOP / DELIVERY POINT */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus Stop / Delivery Point
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="deliveryPoint"
                    value={
                      formData.deliveryPoint
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Dilsukhnagar Bus Stop"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />

                  <p className="text-xs text-gray-400 mt-2">
                    Enter the bus stop or agreed delivery
                    point where you will receive your order.
                  </p>
                </div>

                {/* CITY / STATE */}

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Hyderabad"
                      autoComplete="address-level2"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={
                        formData.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Telangana"
                      autoComplete="address-level1"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                    />
                  </div>

                </div>

                {/* PINCODE */}

                <div className="sm:w-1/2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="zipcode"
                    value={
                      formData.zipcode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />

                </div>

                {/* LANDMARK */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark / Delivery Instructions

                    <span className="text-xs font-normal text-gray-400 ml-2">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    name="landmark"
                    value={
                      formData.landmark
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Near the main entrance, beside ABC shop"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />

                </div>

                {/* DELIVERY NOTICE */}

                <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">

                  <FaMapMarkerAlt className="text-amber-500 mt-0.5 shrink-0" />

                  <div>

                    <p className="text-sm font-semibold text-amber-800">
                      Delivery Point Instructions
                    </p>

                    <p className="text-xs text-amber-700 mt-1 leading-5">
                      Please provide a clear bus stop or
                      agreed delivery point and a nearby
                      landmark. Our delivery team may
                      contact you if they need additional
                      directions.
                    </p>

                  </div>

                </div>

              </div>
            </section>

            {/* ==================================================
                PACKING
            ================================================== */}

            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-5 sm:p-6">

              <div className="flex items-start gap-3">

                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <FaTruck className="text-cyan-600 text-lg" />
                </div>

                <div>

                  <h3 className="font-bold text-gray-800">
                    Seafood Packing & Dispatch
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your selected seafood preparation
                    will be packed carefully before dispatch.
                  </p>

                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-5">

                {[
                  "Preparation selected by you",
                  "Food-grade packaging",
                  "Careful seafood handling",
                  "Delivery team may contact you",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <FaCheckCircle className="text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}

              </div>

            </section>

          </div>

          {/* ====================================================
              RIGHT
          ==================================================== */}

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">

            {/* PAYMENT */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center gap-3">

                <FaCreditCard />

                <div>

                  <h2 className="font-bold text-base sm:text-lg">
                    Payment Method
                  </h2>

                  <p className="text-xs text-indigo-100 mt-0.5">
                    Secure online payment
                  </p>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="w-full rounded-2xl border-2 border-cyan-600 bg-cyan-50 p-4 sm:p-5">

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <span className="w-5 h-5 rounded-full border-2 border-cyan-600 flex items-center justify-center">

                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />

                      </span>

                      <img
                        src={
                          assets.razorpay_logo
                        }
                        alt="Razorpay"
                        className="h-7 sm:h-8 object-contain"
                      />

                    </div>

                    <span className="text-[11px] sm:text-xs text-gray-500 text-right">
                      UPI
                      <br className="sm:hidden" />
                      {" "}• Cards • Wallets
                    </span>

                  </div>

                  <p className="mt-3 ml-8 text-xs text-gray-500">
                    Pay securely using Razorpay.
                    Available payment methods are
                    shown during payment.
                  </p>

                </div>

              </div>
            </section>

            {/* ORDER SUMMARY */}

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-lg font-bold text-gray-800">
                    Order Summary
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {orderItems.length} item
                    {orderItems.length !== 1
                      ? "s"
                      : ""}{" "}
                    in your order
                  </p>

                </div>

                <FaShoppingBag className="text-cyan-600 text-xl" />

              </div>

              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">

                {orderItems.map(
                  (item, index) => (
                    <div
                      key={`${item._id}-${item.weight}-${item.preparation}-${index}`}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                    >

                      <div className="w-14 h-14 rounded-lg bg-white overflow-hidden shrink-0">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaShoppingBag className="text-gray-300" />
                          </div>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.weight} kg ×{" "}
                          {item.quantity}
                        </p>

                        <p className="text-xs font-medium text-cyan-700 mt-1">
                          Preparation:{" "}
                          {item.preparation ||
                            "Not selected"}
                        </p>

                      </div>

                      <p className="font-bold text-sm text-gray-800 whitespace-nowrap">
                        {currency}
                        {(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.weight || 0
                          ) *
                          Number(
                            item.quantity || 1
                          )
                        ).toFixed(2)}
                      </p>

                    </div>
                  )
                )}

              </div>

              <CartTotal />

              {/* FIXED DELIVERY FEE */}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <FaTruck className="text-cyan-600" />

                  <span className="text-sm text-gray-600">
                    Delivery
                  </span>

                </div>

                <span className="font-semibold text-gray-800">
                  {currency}10.00
                </span>

              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">

                <span className="font-bold text-gray-800">
                  Total Amount
                </span>

                <span className="text-xl font-extrabold text-cyan-700">
                  {currency}
                  {totalAmount.toFixed(2)}
                </span>

              </div>

            </section>

            {/* SECURITY */}

            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <FaShieldAlt className="text-xl" />
                </div>

                <div>

                  <h3 className="font-bold">
                    Secure Checkout
                  </h3>

                  <p className="text-xs text-emerald-50 mt-1">
                    Your payment is processed
                    securely through Razorpay.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20 text-xs text-emerald-50">
                <FaLock />
                Secure payment processing
              </div>

            </div>

            {/* PLACE ORDER */}

            <button
              type="button"
              onClick={placeOrder}
              disabled={placingOrder}
              className={`w-full rounded-2xl py-4 px-5 text-base sm:text-lg font-bold text-white shadow-lg transition flex items-center justify-center gap-3 ${
                placingOrder
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 active:scale-[0.99]"
              }`}
            >

              {placingOrder ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                  Opening Payment...
                </>
              ) : (
                <>
                  Proceed to Secure Payment

                  <span>
                    →
                  </span>
                </>
              )}

            </button>

            {/* FINAL TOTAL */}

            <div className="text-center">

              <p className="text-xs text-gray-400">
                Total payable amount
              </p>

              <p className="text-xl font-extrabold text-gray-800 mt-1">
                {currency}
                {totalAmount.toFixed(2)}
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
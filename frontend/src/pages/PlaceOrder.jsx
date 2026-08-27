import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

import axios from "axios";
import { toast } from "react-toastify";

import {
  FaMapMarkerAlt,
  FaUser,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaMoneyBillWave,
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
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // ===========================
  // LOAD CUSTOMER PROFILE
  // ===========================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(
          backendUrl + "/api/user/profile",
          {
            headers: {
              token,
            },
          }
        );

        if (res.data.success) {
          const user = res.data.user;

          setFormData({
            firstName: user.address?.firstName || "",
            lastName: user.address?.lastName || "",
            email: user.email || "",
            address: user.address?.address || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            zipcode: user.address?.zipcode || "",
            country: user.address?.country || "",
            phone: user.phone || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      loadProfile();
    }
  }, [token, backendUrl]);

  // ===========================
  // HANDLE INPUTS
  // ===========================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===========================
  // RAZORPAY PAYMENT
  // ===========================

  const displayRazorpay = async (orderData) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/payment/create-order",
        {
          amount: orderData.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Unable to create payment.");
        return;
      }

      const razorpayOrder = response.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        order_id: razorpayOrder.id,

        name: "Bezawada Cuts",

        description: "Fresh Fish Order",

        prefill: {
          name:
            formData.firstName +
            " " +
            formData.lastName,

          email: formData.email,

          contact: formData.phone,
        },

        theme: {
          color: "#0F766E",
        },

        handler: async function (paymentResponse) {
          try {
            const verify = await axios.post(
              backendUrl + "/api/payment/verify",
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
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verify.data.success) {
              toast.success("Payment Successful");

              setCartItems({});

              localStorage.removeItem("cartItems");

              navigate("/orders");
            } else {
              toast.error(
                verify.data.message || "Payment verification failed"
              );
            }
          } catch (error) {
            console.log(error);

            toast.error("Verification Failed");
          }
        },
      };

      if (!window.Razorpay) {
        toast.error(
          "Razorpay is not loaded. Please refresh the page and try again."
        );

        return;
      }

      const paymentObject =
        new window.Razorpay(options);

      paymentObject.on(
        "payment.failed",
        function () {
          toast.error("Payment Failed");

          navigate("/payment-failed");
        }
      );

      paymentObject.open();
    } catch (error) {
      console.log(error);

      toast.error("Payment Failed");
    }
  };

  // ===========================
  // PLACE ORDER
  // ===========================

  const placeOrder = async () => {
    if (!token) {
      toast.error("Please Login");

      navigate("/login");

      return;
    }

    if (
      !formData.firstName ||
      !formData.address ||
      !formData.phone
    ) {
      toast.error(
        "Please fill delivery details"
      );

      return;
    }

    if (!cartItems || Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");

      navigate("/menu");

      return;
    }

    let orderItems = [];

    products.forEach((product) => {
      if (cartItems[product._id]) {
        Object.keys(
          cartItems[product._id]
        ).forEach((weight) => {
          orderItems.push({
            _id: product._id,

            name: product.name,

            image: product.image?.[0],

            price: product.price,

            weight: Number(weight),

            quantity:
              cartItems[product._id][weight],
          });
        });
      }
    });

    if (orderItems.length === 0) {
      toast.error("No valid products found in cart");

      return;
    }

    const orderData = {
      items: orderItems,

      amount:
        getCartAmount() +
        delivery_fee,

      address: formData,
    };

    try {
      // ===========================
      // CASH ON DELIVERY
      // ===========================

      if (method === "cod") {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          {
            ...orderData,

            paymentMethod: "COD",
          },
          {
            headers: {
              token,
            },
          }
        );

        if (response.data.success) {
          toast.success(
            "Order Placed Successfully"
          );

          setCartItems({});

          localStorage.removeItem(
            "cartItems"
          );

          navigate("/payment-success");
        } else {
          toast.error(
            response.data.message ||
              "Order placement failed"
          );
        }
      }

      // ===========================
      // RAZORPAY
      // ===========================

      else {
        await displayRazorpay(orderData);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Order Failed"
      );
    }
  };

  // ===========================
  // UI
  // ===========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-10">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <div className="mb-10">

          <Title
            text1="CHECKOUT"
            text2="DETAILS"
          />

          <p className="text-gray-500 mt-3 max-w-2xl">

            Complete your delivery details below.
            Fresh seafood is packed hygienically and
            delivered directly to your doorstep.

          </p>

        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">

          {/* ========================= */}
          {/* LEFT SIDE */}
          {/* ========================= */}

          <div className="space-y-8">

            {/* CUSTOMER DETAILS */}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 flex items-center gap-3">

                <FaUser className="text-xl" />

                <h2 className="text-lg font-semibold">
                  Customer Information
                </h2>

              </div>

              <div className="p-6 space-y-5">

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="text-sm text-gray-600 mb-2 block">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />

                  </div>

                  <div>

                    <label className="text-sm text-gray-600 mb-2 block">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm text-gray-600 mb-2 block">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                </div>

                <div>

                  <label className="text-sm text-gray-600 mb-2 block">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                </div>

              </div>

            </div>

            {/* DELIVERY ADDRESS */}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3">

                <FaMapMarkerAlt className="text-xl" />

                <h2 className="text-lg font-semibold">
                  Delivery Address
                </h2>

              </div>

              <div className="p-6 space-y-5">

                <div>

                  <label className="text-sm text-gray-600 mb-2 block">
                    Street Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    placeholder="Zip Code"
                    className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                </div>

              </div>

            </div>

            {/* DELIVERY INFORMATION */}

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-4">

                <FaTruck className="text-cyan-600 text-xl" />

                <h3 className="font-semibold text-lg">
                  Delivery Information
                </h3>

              </div>

              <ul className="space-y-2 text-gray-600 text-sm">

                <li>
                  ✔ Same Day Delivery Available*
                </li>

                <li>
                  ✔ Packed with Ice & Food Grade Packaging
                </li>

                <li>
                  ✔ Temperature Controlled Transport
                </li>

                <li>
                  ✔ Fresh Catch Direct From Market
                </li>

                <li>
                  ✔ SMS & Call Before Delivery
                </li>

              </ul>

            </div>

          </div>

          {/* ========================= */}
          {/* RIGHT SIDE */}
          {/* ========================= */}

          <div className="space-y-6">

            {/* PAYMENT METHOD */}

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-4 flex items-center gap-3">

                <FaCreditCard className="text-xl" />

                <h2 className="font-semibold text-lg">
                  Payment Method
                </h2>

              </div>

              <div className="p-6 space-y-4">

                {/* RAZORPAY */}

                <div
                  onClick={() =>
                    setMethod("razorpay")
                  }
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
                    method === "razorpay"
                      ? "border-cyan-600 bg-cyan-50"
                      : "border-gray-200 hover:border-cyan-300"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <input
                        type="radio"
                        checked={
                          method === "razorpay"
                        }
                        readOnly
                      />

                      <img
                        src={assets.razorpay_logo}
                        alt="Razorpay"
                        className="h-8"
                      />

                    </div>

                    <span className="text-xs text-gray-500">
                      UPI • Cards • Wallets
                    </span>

                  </div>

                </div>

                {/* CASH ON DELIVERY */}

                <div
                  onClick={() =>
                    setMethod("cod")
                  }
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
                    method === "cod"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <input
                        type="radio"
                        checked={
                          method === "cod"
                        }
                        readOnly
                      />

                      <FaMoneyBillWave className="text-2xl text-green-600" />

                      <span className="font-semibold">
                        Cash On Delivery
                      </span>

                    </div>

                    <span className="text-xs text-gray-500">
                      Pay After Delivery
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

              <h2 className="text-xl font-semibold mb-5">
                Order Summary
              </h2>

              <CartTotal />

            </div>

            {/* SECURE CHECKOUT */}

            <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5">

              <div className="flex items-center gap-3">

                <FaShieldAlt className="text-2xl" />

                <div>

                  <h3 className="font-semibold">
                    Secure Checkout
                  </h3>

                  <p className="text-sm text-green-100">
                    SSL Encrypted • 100% Safe Payments
                  </p>

                </div>

              </div>

            </div>

            {/* PLACE ORDER BUTTON */}

            <button
              onClick={placeOrder}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg transition duration-300"
            >

              {method === "razorpay"
                ? "Proceed To Payment"
                : "Place Order"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PlaceOrder;
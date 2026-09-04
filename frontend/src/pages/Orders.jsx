import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaBoxOpen,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTruck,
  FaTimesCircle,
  FaSyncAlt,
  FaCheckCircle,
  FaCut,
  FaWeightHanging,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const {
    backendUrl,
    token,
    currency,
  } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD ORDERS
  // ==========================

  const getOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(
          response.data.message || "Unable to load orders"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // CANCEL ORDER
  // ==========================

  const cancelOrder = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        {
          orderId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        getOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  // ==========================
  // LOAD ORDERS ON LOGIN
  // ==========================

  useEffect(() => {
    if (token) {
      getOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [token]);

  // ==========================
  // TOTAL ORDER WEIGHT
  // ==========================

  const getTotalWeight = (items = []) => {
    return items.reduce((total, item) => {
      const weight = Number(item.weight || 0);
      const quantity = Number(item.quantity || 1);

      return total + weight * quantity;
    }, 0);
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-700 rounded-full animate-spin mx-auto mb-4"></div>

          <h2 className="text-xl font-bold text-slate-700">
            Loading Your Orders...
          </h2>

        </div>

      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50 min-h-screen">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-10">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">

            <FaBoxOpen className="text-2xl md:text-3xl" />

          </div>

          <div>

            <h1 className="text-2xl md:text-3xl font-bold">
              My Orders
            </h1>

            <p className="text-cyan-100 mt-2 text-sm md:text-base">
              Track your seafood orders and monitor their delivery status.
            </p>

          </div>

        </div>

      </div>

      <Title text1="MY" text2="ORDERS" />

      {/* ==========================
          EMPTY ORDERS
      ========================== */}

      {orders.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-lg p-10 md:p-16 mt-10 text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">

            <FaBoxOpen className="text-5xl text-cyan-700" />

          </div>

          <h2 className="text-2xl font-bold mt-6">
            No Orders Yet
          </h2>

          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Looks like you haven't ordered any seafood yet.
            Browse our collection and place your first order.
          </p>

          <button
            onClick={() => {
              window.location.href = "/menu";
            }}
            className="mt-8 bg-gradient-to-r from-cyan-700 to-emerald-700 text-white px-8 py-3 rounded-xl hover:scale-105 transition"
          >
            Explore Products
          </button>

        </div>

      ) : (

        /* ==========================
           ORDERS LIST
        ========================== */

        orders.map((order) => {

          const items = Array.isArray(order.items)
            ? order.items
            : [];

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-lg border border-slate-200 p-5 md:p-7 mt-8"
            >

              {/* ==========================
                  ORDER TOP
              ========================== */}

              <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

                {/* ORDER INFORMATION */}

                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <FaBoxOpen className="text-cyan-700" />

                    <h2 className="text-lg md:text-xl font-bold">
                      Order #
                      {String(order._id || "")
                        .slice(-8)
                        .toUpperCase()}
                    </h2>

                  </div>

                  <p className="text-sm text-slate-500 break-all">
                    {order._id}
                  </p>

                  <div className="flex items-center gap-3 text-slate-600">

                    <FaCalendarAlt />

                    <span>
                      {order.date
                        ? new Date(
                            order.date
                          ).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </span>

                  </div>

                </div>

                {/* PAYMENT + STATUS */}

                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">

                  {/* AMOUNT */}

                  <div className="bg-slate-50 rounded-2xl p-5">

                    <div className="flex items-center gap-2 mb-2">

                      <FaMoneyBillWave className="text-green-600" />

                      <span className="font-semibold">
                        Amount
                      </span>

                    </div>

                    <p className="text-2xl font-bold text-green-700">
                      {currency}
                      {order.amount}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="bg-slate-50 rounded-2xl p-5">

                    <div className="flex items-center gap-2 mb-2">

                      <FaTruck className="text-cyan-700" />

                      <span className="font-semibold">
                        Status
                      </span>

                    </div>

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold

                        ${
                          order.orderStatus ===
                          "Delivered"
                            ? "bg-green-100 text-green-700"

                            : order.orderStatus ===
                              "Cancelled"
                            ? "bg-red-100 text-red-700"

                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >

                      {order.orderStatus ===
                      "Delivered" ? (
                        <FaCheckCircle />
                      ) : order.orderStatus ===
                        "Cancelled" ? (
                        <FaTimesCircle />
                      ) : (
                        <FaTruck />
                      )}

                      {order.orderStatus}

                    </span>

                    {/* PAYMENT STATUS */}

                    <p className="text-sm text-slate-500 mt-3">

                      Payment:

                      <span
                        className={`font-semibold ml-2 ${
                          order.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.paymentStatus ||
                          "Unknown"}
                      </span>

                    </p>

                    {/* PAYMENT METHOD */}

                    {order.paymentMethod && (
                      <p className="text-sm text-slate-500 mt-1">

                        Method:

                        <span className="font-semibold ml-2">
                          {order.paymentMethod}
                        </span>

                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* ==========================
                  ORDER SUMMARY
              ========================== */}

              <div className="mt-8 border-t pt-6">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="bg-cyan-50 rounded-xl p-4">

                    <p className="text-xs uppercase text-slate-500">
                      Items
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-1">
                      {items.length}
                    </p>

                  </div>

                  <div className="bg-orange-50 rounded-xl p-4">

                    <p className="text-xs uppercase text-slate-500">
                      Total Weight
                    </p>

                    <p className="text-lg font-bold text-slate-800 mt-1">
                      {getTotalWeight(items)} KG
                    </p>

                  </div>

                  <div className="bg-green-50 rounded-xl p-4">

                    <p className="text-xs uppercase text-slate-500">
                      Order Total
                    </p>

                    <p className="text-lg font-bold text-green-700 mt-1">
                      {currency}
                      {order.amount}
                    </p>

                  </div>

                </div>

              </div>

              {/* ==========================
                  ORDERED PRODUCTS
              ========================== */}

              <div className="mt-8 border-t pt-8 space-y-5">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">

                  <h3 className="font-bold text-xl text-slate-800">
                    Ordered Products
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your selected preparation is shown below.
                  </p>

                </div>

                {items.map((item, index) => {

                  const image = Array.isArray(item.image)
                    ? item.image[0]
                    : item.image;

                  const quantity =
                    Number(item.quantity || 1);

                  const weight =
                    Number(item.weight || 0);

                  const totalWeight =
                    weight * quantity;

                  const preparation =
                    item.preparation ||
                    "Preparation not specified";

                  return (
                    <div
                      key={
                        item._id ||
                        `${item.productId || item.name}-${item.weight}-${item.preparation}-${index}`
                      }
                      className="
                        flex
                        flex-col
                        md:flex-row
                        gap-5
                        bg-slate-50
                        rounded-2xl
                        p-5
                        hover:shadow-lg
                        transition
                      "
                    >

                      {/* ==========================
                          PRODUCT IMAGE
                      ========================== */}

                      <div className="w-full md:w-32 h-48 md:h-32 rounded-2xl overflow-hidden bg-white border shrink-0">

                        {image ? (

                          <img
                            src={image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center">

                            <FaBoxOpen
                              className="text-4xl text-slate-300"
                            />

                          </div>

                        )}

                      </div>

                      {/* ==========================
                          PRODUCT DETAILS
                      ========================== */}

                      <div className="flex-1">

                        <h3 className="text-xl font-bold text-slate-800">
                          {item.name}
                        </h3>

                        {/* PRODUCT INFORMATION */}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">

                          <div>

                            <p className="text-xs uppercase text-slate-500">
                              Price / KG
                            </p>

                            <p className="font-semibold text-slate-800">
                              {currency}
                              {item.price}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase text-slate-500">
                              Quantity
                            </p>

                            <p className="font-semibold text-slate-800">
                              {quantity}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase text-slate-500 flex items-center gap-1">
                              <FaWeightHanging />
                              Weight
                            </p>

                            <p className="font-semibold text-slate-800">
                              {weight} KG
                            </p>

                          </div>

                        </div>

                        {quantity > 1 && (
                          <p className="text-sm text-slate-500 mt-3">
                            Total weight for this item:{" "}
                            <span className="font-semibold text-slate-700">
                              {totalWeight} KG
                            </span>
                          </p>
                        )}

                        {/* ==========================
                            PREPARATION
                        ========================== */}

                        <div className="mt-5">

                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2 flex items-center gap-2">

                            <FaCut className="text-cyan-700" />

                            Selected Preparation

                          </p>

                          <div className="inline-flex items-center bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-2.5">

                            <span className="font-bold text-cyan-800">
                              {preparation}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* ==========================
                  BOTTOM ACTIONS
              ========================== */}

              <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-8 border-t pt-6">

                {/* REFRESH */}

                <button
                  onClick={getOrders}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-cyan-700
                    hover:bg-cyan-800
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    transition
                    w-full
                    md:w-auto
                  "
                >

                  <FaSyncAlt />

                  Refresh Orders

                </button>

                {/* CANCEL */}

                {order.orderStatus ===
                  "Order Placed" && (

                  <button
                    onClick={() =>
                      cancelOrder(order._id)
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      transition
                      w-full
                      md:w-auto
                    "
                  >

                    <FaTimesCircle />

                    Cancel Order

                  </button>

                )}

              </div>

            </div>
          );
        })

      )}

    </div>
  );
};

export default Orders;
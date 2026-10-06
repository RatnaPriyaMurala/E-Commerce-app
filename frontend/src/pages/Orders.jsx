
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
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD ORDERS
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
        toast.error(response.data.message || "Unable to load orders");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // CANCEL ORDER
  const cancelOrder = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        { orderId: id },
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
        error.response?.data?.message || "Unable to cancel order"
      );
    }
  };

  // LOAD ORDERS ON LOGIN
  useEffect(() => {
    if (token) {
      getOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [token]);

  // TOTAL ORDER WEIGHT
  const getTotalWeight = (items = []) => {
    return items.reduce((total, item) => {
      const weight = Number(item.weight || 0);
      const quantity = Number(item.quantity || 1);
      return total + weight * quantity;
    }, 0);
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-700 rounded-full animate-spin mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-700">
            Loading Your Orders...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50 min-h-screen pb-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-4 sm:pt-5">
        <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FaBoxOpen className="text-xl sm:text-2xl" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                My Orders
              </h1>
              <p className="text-cyan-100 mt-1 text-xs sm:text-sm">
                Track your seafood orders and delivery status.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="mt-5">
          <Title text1="MY" text2="ORDERS" />
        </div>

        {/* EMPTY ORDERS */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 mt-5 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">
              <FaBoxOpen className="text-4xl text-cyan-700" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mt-5">
              No Orders Yet
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-6">
              Looks like you haven't ordered any seafood yet. Browse our
              collection and place your first order.
            </p>

            <button
              onClick={() => {
                window.location.href = "/menu";
              }}
              className="mt-6 bg-gradient-to-r from-cyan-700 to-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition"
            >
              Explore Products
            </button>
          </div>
        ) : (
          /* ORDERS LIST */
          <div className="space-y-5 mt-5">
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5"
                >
                  {/* ORDER TOP */}
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                    {/* ORDER INFORMATION */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <FaBoxOpen className="text-cyan-700" />
                        <h2 className="text-base sm:text-lg font-bold">
                          Order #
                          {String(order._id || "")
                            .slice(-8)
                            .toUpperCase()}
                        </h2>
                      </div>

                      <p className="text-xs text-slate-400 break-all">
                        {order._id}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FaCalendarAlt className="text-slate-400" />
                        <span>
                          {order.date
                            ? new Date(order.date).toLocaleString("en-IN")
                            : "Date unavailable"}
                        </span>
                      </div>
                    </div>

                    {/* PAYMENT + STATUS */}
                    <div className="grid sm:grid-cols-2 gap-3 lg:min-w-[420px]">
                      {/* AMOUNT */}
                      <div className="bg-slate-50 rounded-xl p-3.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FaMoneyBillWave className="text-green-600" />
                          <span className="text-sm font-semibold">
                            Amount
                          </span>
                        </div>

                        <p className="text-xl font-bold text-green-700">
                          {currency}
                          {order.amount}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="bg-slate-50 rounded-xl p-3.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <FaTruck className="text-cyan-700" />
                          <span className="text-sm font-semibold">
                            Status
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            order.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.orderStatus === "Delivered" ? (
                            <FaCheckCircle />
                          ) : order.orderStatus === "Cancelled" ? (
                            <FaTimesCircle />
                          ) : (
                            <FaTruck />
                          )}

                          {order.orderStatus}
                        </span>

                        <p className="text-xs text-slate-500 mt-2">
                          Payment:
                          <span
                            className={`font-semibold ml-1.5 ${
                              order.paymentStatus === "Paid"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.paymentStatus || "Unknown"}
                          </span>
                        </p>

                        {order.paymentMethod && (
                          <p className="text-xs text-slate-500 mt-1">
                            Method:
                            <span className="font-semibold ml-1.5">
                              {order.paymentMethod}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ORDER SUMMARY */}
                  <div className="mt-5 border-t pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-cyan-50 rounded-xl p-3.5">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Items
                        </p>
                        <p className="text-lg font-bold text-slate-800 mt-0.5">
                          {items.length}
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-3.5">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Total Weight
                        </p>
                        <p className="text-lg font-bold text-slate-800 mt-0.5">
                          {getTotalWeight(items)} KG
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-3.5">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                          Order Total
                        </p>
                        <p className="text-lg font-bold text-green-700 mt-0.5">
                          {currency}
                          {order.amount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ORDERED PRODUCTS */}
                  <div className="mt-5 border-t pt-5 space-y-3.5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                      <h3 className="font-bold text-lg text-slate-800">
                        Ordered Products
                      </h3>
                      <p className="text-xs text-slate-500">
                        Selected preparation is shown below.
                      </p>
                    </div>

                    {items.map((item, index) => {
                      const image = Array.isArray(item.image)
                        ? item.image[0]
                        : item.image;

                      const quantity = Number(item.quantity || 1);
                      const weight = Number(item.weight || 0);
                      const totalWeight = weight * quantity;

                      const preparation =
                        item.preparation || "Preparation not specified";

                      return (
                        <div
                          key={
                            item._id ||
                            `${item.productId || item.name}-${item.weight}-${item.preparation}-${index}`
                          }
                          className="flex flex-col sm:flex-row gap-4 bg-slate-50 rounded-xl p-3.5 hover:shadow-sm transition"
                        >
                          {/* IMAGE */}
                          <div className="w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-white border shrink-0">
                            {image ? (
                              <img
                                src={image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBoxOpen className="text-3xl text-slate-300" />
                              </div>
                            )}
                          </div>

                          {/* DETAILS */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800">
                              {item.name}
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                              <div>
                                <p className="text-[10px] uppercase text-slate-500">
                                  Price / KG
                                </p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                  {currency}
                                  {item.price}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] uppercase text-slate-500">
                                  Quantity
                                </p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                  {quantity}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] uppercase text-slate-500 flex items-center gap-1">
                                  <FaWeightHanging />
                                  Weight
                                </p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                  {weight} KG
                                </p>
                              </div>
                            </div>

                            {quantity > 1 && (
                              <p className="text-xs text-slate-500 mt-2">
                                Total weight:{" "}
                                <span className="font-semibold text-slate-700">
                                  {totalWeight} KG
                                </span>
                              </p>
                            )}

                            {/* PREPARATION */}
                            <div className="mt-3">
                              <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1.5 flex items-center gap-1.5">
                                <FaCut className="text-cyan-700" />
                                Selected Preparation
                              </p>

                              <div className="inline-flex items-center bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1.5">
                                <span className="text-sm font-bold text-cyan-800">
                                  {preparation}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* BOTTOM ACTIONS */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5 border-t pt-5">
                    <button
                      onClick={getOrders}
                      className="flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition w-full sm:w-auto"
                    >
                      <FaSyncAlt />
                      Refresh Orders
                    </button>

                    {order.orderStatus === "Order Placed" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition w-full sm:w-auto"
                      >
                        <FaTimesCircle />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

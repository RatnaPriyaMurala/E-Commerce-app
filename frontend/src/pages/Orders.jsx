
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
  FaPhone,
  FaWeightHanging,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaCreditCard,
} from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Format order dates safely, supporting numeric timestamps and Date values.
  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    let date;

    if (typeof value === "number") {
      date = new Date(value);
    } else if (typeof value === "string" && /^\d+$/.test(value)) {
      date = new Date(Number(value));
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const getOrderDateValue = (order) => {
    const value = order.date || order.createdAt;

    if (!value) return 0;

    const date =
      typeof value === "number" || /^\d+$/.test(String(value))
        ? new Date(Number(value))
        : new Date(value);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  };

  // LOAD CUSTOMER ORDERS
  const getOrders = async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const fetchedOrders = Array.isArray(response.data.orders)
          ? response.data.orders
          : [];

        fetchedOrders.sort(
          (a, b) => getOrderDateValue(b) - getOrderDateValue(a)
        );

        setOrders(fetchedOrders);
      } else {
        toast.error(response.data.message || "Unable to load orders");
      }
    } catch (error) {
      console.error("Load customer orders error:", error);
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
      setCancellingOrderId(id);

      const response = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Order cancelled");
        await getOrders();
      } else {
        toast.error(response.data.message || "Unable to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(
        error.response?.data?.message || "Unable to cancel order"
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  useEffect(() => {
    if (token) {
      getOrders();
    } else {
      setOrders([]);
      setLoading(false);
      setExpandedOrderId(null);
    }
  }, [token]);

  const toggleOrderDetails = (id) => {
    setExpandedOrderId((currentId) => (currentId === id ? null : id));
  };

  const getTotalWeight = (items = []) =>
    items.reduce((total, item) => {
      return (
        total +
        Number(item.weight || 0) * Number(item.quantity || 1)
      );
    }, 0);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Shipped":
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getConfirmationStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "No Answer - Retry":
        return "bg-orange-100 text-orange-800";
      case "Needs Clarification":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center px-4">
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
    <div className="min-h-screen border-t border-slate-200 bg-slate-50 pb-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 pt-5">
        <div className="bg-gradient-to-r from-cyan-800 via-teal-700 to-emerald-700 rounded-2xl p-5 sm:p-6 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <FaBoxOpen className="text-2xl" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                My Orders
              </h1>
              <p className="text-cyan-100 text-sm mt-1">
                View your orders, payment details, and delivery status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <div className="rounded-lg bg-white/10 px-3 py-2">
              <p className="text-xs text-cyan-100">Total Orders</p>
              <p className="font-bold text-lg">{orders.length}</p>
            </div>

            <div className="rounded-lg bg-white/10 px-3 py-2">
              <p className="text-xs text-cyan-100">Latest Order</p>
              <p className="font-semibold text-sm">
                {orders.length
                  ? formatDate(orders[0].date || orders[0].createdAt)
                  : "No orders yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="mt-5 mb-4">
          <Title text1="MY" text2="ORDERS" />
          <p className="text-sm text-slate-500 mt-2">
            Select an order to see its complete details.
          </p>
        </div>

        {/* EMPTY ORDERS */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 mt-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">
              <FaBoxOpen className="text-3xl text-cyan-700" />
            </div>

            <h2 className="text-xl font-bold mt-4">No Orders Yet</h2>

            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-6">
              You haven't placed an order yet. Browse our fresh seafood
              collection to place your first order.
            </p>

            <button
              onClick={() => {
                window.location.href = "/menu";
              }}
              className="mt-5 bg-gradient-to-r from-cyan-700 to-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <>
            {/* COMPACT ORDER CARDS */}
            <div className="space-y-3">
              {orders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                const isExpanded = expandedOrderId === order._id;
                const itemNames = items
                  .map((item) => item.name)
                  .filter(Boolean);

                const previewNames =
                  itemNames.length > 2
                    ? `${itemNames.slice(0, 2).join(", ")} +${itemNames.length - 2} more`
                    : itemNames.join(", ") || "Order items";

                const customerName = [
                  order.address?.firstName,
                  order.address?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                const confirmationStatus =
                  order.confirmationStatus || "Call Required";

                return (
                  <article
                    key={order._id}
                    className={`bg-white rounded-xl border shadow-sm overflow-hidden transition ${
                      isExpanded
                        ? "border-cyan-300 shadow-md"
                        : "border-slate-200 hover:border-cyan-200"
                    }`}
                  >
                    {/* CLICKABLE SUMMARY */}
                    <button
                      type="button"
                      onClick={() => toggleOrderDetails(order._id)}
                      aria-expanded={isExpanded}
                      className="w-full text-left p-4 sm:px-5 sm:py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                            <FaBoxOpen className="text-xl" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-bold text-slate-800">
                                Order #
                                {String(order._id || "")
                                  .slice(-8)
                                  .toUpperCase()}
                              </h2>

                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusStyle(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus || "Order Placed"}
                              </span>
                            </div>

                            <p className="text-sm text-slate-500 mt-1 truncate">
                              {previewNames}
                            </p>

                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                              <FaCalendarAlt />
                              {formatDate(order.date || order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:min-w-[175px] sm:pl-4 sm:border-l border-slate-100">
                          <div>
                            <p className="text-xs text-slate-500">
                              Order Total
                            </p>
                            <p className="text-lg font-bold text-green-700">
                              {currency}
                              {formatAmount(order.amount)}
                            </p>
                            <p
                              className={`text-xs font-semibold mt-0.5 ${
                                order.paymentStatus === "Paid"
                                  ? "text-green-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {order.paymentStatus || "Payment status unknown"}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 text-cyan-700 font-semibold text-xs shrink-0">
                            <span className="hidden md:inline">
                              {isExpanded ? "Hide" : "View Details"}
                            </span>
                            {isExpanded ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* EXPANDED DETAILS */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 sm:p-5 bg-white">
                        {/* ORDER ID + PAYMENT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <FaMoneyBillWave className="text-green-600" />
                              Amount
                            </p>
                            <p className="text-lg font-bold text-green-700 mt-1">
                              {currency}
                              {formatAmount(order.amount)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <FaTruck className="text-cyan-700" />
                              Delivery Status
                            </p>
                            <span
                              className={`inline-flex mt-1.5 rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus || "Order Placed"}
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                              <FaCreditCard className="text-cyan-700" />
                              Payment
                            </p>
                            <p className="text-sm font-bold text-slate-800 mt-1">
                              {order.paymentStatus || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Method: {order.paymentMethod || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs text-slate-400 break-all">
                            Order ID: {order._id}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Placed on:{" "}
                            {formatDate(order.date || order.createdAt)}
                          </p>
                        </div>

                        {/* DELIVERY DETAILS */}
                        <section className="mt-5 rounded-xl border border-slate-200 p-4">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-cyan-700" />
                            Delivery Details
                          </h3>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
                            <p>
                              <span className="font-semibold text-slate-800">
                                Name:{" "}
                              </span>
                              {customerName || "Not provided"}
                            </p>

                            <p>
                              <span className="font-semibold text-slate-800">
                                Phone:{" "}
                              </span>
                              {order.address?.phone || "Not provided"}
                            </p>

                            {order.address?.alternatePhone && (
                              <p>
                                <span className="font-semibold text-slate-800">
                                  Alternate phone:{" "}
                                </span>
                                {order.address.alternatePhone}
                              </p>
                            )}

                            <p>
                              <span className="font-semibold text-slate-800">
                                Delivery point:{" "}
                              </span>
                              {order.address?.deliveryPoint || "Not provided"}
                            </p>

                            <p>
                              <span className="font-semibold text-slate-800">
                                Address:{" "}
                              </span>
                              {order.address?.address || "Not provided"}
                            </p>

                            {order.address?.landmark && (
                              <p>
                                <span className="font-semibold text-slate-800">
                                  Landmark:{" "}
                                </span>
                                {order.address.landmark}
                              </p>
                            )}

                            <p>
                              <span className="font-semibold text-slate-800">
                                City:{" "}
                              </span>
                              {order.address?.city || "Not provided"}
                            </p>

                            <p>
                              <span className="font-semibold text-slate-800">
                                State:{" "}
                              </span>
                              {order.address?.state || "Not provided"}
                            </p>

                            <p>
                              <span className="font-semibold text-slate-800">
                                PIN code:{" "}
                              </span>
                              {order.address?.zipcode || "Not provided"}
                            </p>
                          </div>
                        </section>

                        {/* SINGLE ORDER CONFIRMATION SECTION */}
                        <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-white p-2 text-cyan-700 shrink-0">
                              <FaPhone />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-slate-800">
                                Order Confirmation
                              </h3>

                              <p className="text-xs text-slate-500 mt-1">
                                Confirmation Call Status
                              </p>

                              <span
                                className={`inline-flex mt-2 rounded-full px-3 py-1.5 text-xs font-bold ${getConfirmationStyle(
                                  confirmationStatus
                                )}`}
                              >
                                {confirmationStatus}
                              </span>

                              <p className="text-sm text-slate-700 mt-3 leading-6">
                                {order.confirmationMessage ||
                                  (order.paymentStatus === "Paid"
                                    ? "Our team will contact you to confirm your delivery point and order details. Please keep your phone available."
                                    : "Your order confirmation details will be updated here.")}
                              </p>

                              {confirmationStatus === "Confirmed" && (
                                <p className="text-sm font-semibold text-green-800 mt-2">
                                  Your order details have been confirmed by our team.
                                </p>
                              )}

                              {confirmationStatus === "No Answer - Retry" && (
                                <p className="text-sm text-orange-800 mt-2">
                                  We could not reach you. Please keep your phone
                                  available for another call.
                                </p>
                              )}

                              {confirmationStatus === "Needs Clarification" && (
                                <p className="text-sm text-red-800 mt-2">
                                  Our team needs to clarify your order or delivery
                                  details. Please contact the store.
                                </p>
                              )}
                            </div>
                          </div>
                        </section>

                        {/* ORDER SUMMARY */}
                        <section className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-xl bg-cyan-50 p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Different Items
                            </p>
                            <p className="text-lg font-bold text-slate-800 mt-1">
                              {items.length}
                            </p>
                          </div>

                          <div className="rounded-xl bg-orange-50 p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Total Weight
                            </p>
                            <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                              <FaWeightHanging className="text-orange-600" />
                              {getTotalWeight(items)} KG
                            </p>
                          </div>

                          <div className="rounded-xl bg-green-50 p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Order Total
                            </p>
                            <p className="text-lg font-bold text-green-700 mt-1">
                              {currency}
                              {formatAmount(order.amount)}
                            </p>
                          </div>
                        </section>

                        {/* ORDERED PRODUCTS */}
                        <section className="mt-5">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <h3 className="font-bold text-lg text-slate-800">
                              Ordered Products
                            </h3>
                            <p className="text-xs text-slate-500">
                              {items.length} item type{items.length === 1 ? "" : "s"}
                            </p>
                          </div>

                          {items.length === 0 ? (
                            <p className="text-sm text-slate-500 rounded-xl bg-slate-50 p-4">
                              Product details are unavailable for this order.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {items.map((item, index) => {
                                const image = Array.isArray(item.image)
                                  ? item.image[0]
                                  : item.image;

                                const quantity = Number(item.quantity || 1);
                                const weight = Number(item.weight || 0);
                                const totalWeight = weight * quantity;

                                return (
                                  <div
                                    key={
                                      item._id ||
                                      `${item.productId || item.name}-${item.weight}-${item.preparation}-${index}`
                                    }
                                    className="flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3"
                                  >
                                    <div className="w-full sm:w-24 h-36 sm:h-24 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                                      {image ? (
                                        <img
                                          src={image}
                                          alt={item.name || "Seafood product"}
                                          className="w-full h-full object-cover"
                                          onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <FaBoxOpen className="text-3xl text-slate-300" />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-800">
                                        {item.name || "Seafood product"}
                                      </h4>

                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                        <div>
                                          <p className="text-[10px] uppercase text-slate-500">
                                            Price / KG
                                          </p>
                                          <p className="text-sm font-semibold text-slate-800 mt-1">
                                            {currency}
                                            {formatAmount(item.price)}
                                          </p>
                                        </div>

                                        <div>
                                          <p className="text-[10px] uppercase text-slate-500">
                                            Quantity
                                          </p>
                                          <p className="text-sm font-semibold text-slate-800 mt-1">
                                            {quantity}
                                          </p>
                                        </div>

                                        <div>
                                          <p className="text-[10px] uppercase text-slate-500">
                                            Weight
                                          </p>
                                          <p className="text-sm font-semibold text-slate-800 mt-1">
                                            {weight} KG
                                          </p>
                                        </div>

                                        <div>
                                          <p className="text-[10px] uppercase text-slate-500">
                                            Item Subtotal
                                          </p>
                                          <p className="text-sm font-semibold text-green-700 mt-1">
                                            {currency}
                                            {formatAmount(
                                              item.subtotal ??
                                                Number(item.price || 0) *
                                                  weight *
                                                  quantity
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      {quantity > 1 && (
                                        <p className="text-xs text-slate-500 mt-2">
                                          Total weight: {totalWeight} KG
                                        </p>
                                      )}

                                      <div className="mt-3">
                                        <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1.5 flex items-center gap-1.5">
                                          <FaCut className="text-cyan-700" />
                                          Selected Preparation
                                        </p>

                                        <span className="inline-flex items-center bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1.5 text-sm font-bold text-cyan-800">
                                          {item.preparation || "Not specified"}
                                        </span>
                                      </div>

                                      {item.variantCount && (
                                        <p className="text-xs text-slate-600 mt-2">
                                          Prawn count: {item.variantCount}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </section>

                        {/* ACTIONS */}
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-5 border-t border-slate-200 pt-4">
                          <button
                            type="button"
                            onClick={getOrders}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-700 text-cyan-800 hover:bg-cyan-50 px-4 py-2.5 text-sm font-semibold transition"
                          >
                            <FaSyncAlt />
                            Refresh Orders
                          </button>

                          {order.orderStatus === "Order Placed" && (
                            <button
                              type="button"
                              disabled={cancellingOrderId === order._id}
                              onClick={() => cancelOrder(order._id)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2.5 text-sm font-semibold transition"
                            >
                              <FaTimesCircle />
                              {cancellingOrderId === order._id
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleOrderDetails(order._id)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 text-sm font-semibold transition"
                          >
                            <FaChevronUp />
                            Close Details
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              Showing {orders.length} order{orders.length === 1 ? "" : "s"}.
              Select any order to view its full details.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;

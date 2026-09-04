import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaWeightHanging,
  FaBoxOpen,
  FaCut,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
} from "react-icons/fa";

const Orders = ({ token }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ===============================
  // LOAD ORDERS
  // ===============================

  const getOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        backendUrl + "/api/order/admin-orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
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

  useEffect(() => {
    if (token) {
      getOrders();
    }
  }, [token]);

  // ===============================
  // UPDATE STATUS
  // ===============================

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/update-status",
        {
          orderId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        getOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // ===============================
  // SEARCH + FILTER
  // ===============================

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return orders.filter((order) => {
      const address = order.address || {};

      const customerName =
        `${address.firstName || ""} ${
          address.lastName || ""
        }`.toLowerCase();

      const phone = String(address.phone || "").toLowerCase();

      const orderId = String(order._id || "").toLowerCase();

      const paymentMethod = String(
        order.paymentMethod || ""
      ).toLowerCase();

      const paymentStatus = String(
        order.paymentStatus || ""
      ).toLowerCase();

      const orderStatus = String(
        order.orderStatus || ""
      ).toLowerCase();

      const itemSearchText = Array.isArray(order.items)
        ? order.items
            .map((item) =>
              [
                item.name,
                item.preparation,
                item.weight,
                item.quantity,
              ]
                .filter(Boolean)
                .join(" ")
            )
            .join(" ")
            .toLowerCase()
        : "";

      const matchesSearch =
        !searchText ||
        orderId.includes(searchText) ||
        customerName.includes(searchText) ||
        phone.includes(searchText) ||
        paymentMethod.includes(searchText) ||
        paymentStatus.includes(searchText) ||
        orderStatus.includes(searchText) ||
        itemSearchText.includes(searchText);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // ===============================
  // HELPERS
  // ===============================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-600 text-white";

      case "Cancelled":
        return "bg-red-600 text-white";

      case "Processing":
        return "bg-blue-500 text-white";

      case "Shipped":
        return "bg-purple-600 text-white";

      case "Out for Delivery":
        return "bg-indigo-600 text-white";

      case "Order Placed":
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Delivered") {
      return <FaCheckCircle />;
    }

    if (status === "Cancelled") {
      return <FaTimesCircle />;
    }

    return null;
  };

  // ===============================
  // TOTAL WEIGHT
  // ===============================

  const getTotalWeight = (items = []) => {
    return items.reduce((total, item) => {
      const weight = Number(item.weight || 0);
      const quantity = Number(item.quantity || 1);

      return total + weight * quantity;
    }, 0);
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>

          <h1 className="text-xl md:text-2xl font-bold text-gray-700">
            Loading Orders...
          </h1>

        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Orders Management
          </h1>

          <p className="text-gray-500 mt-1">
            View customer orders, preparation requirements and delivery status.
          </p>
        </div>

        {/* SEARCH + FILTER */}

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">

          <div className="relative w-full sm:w-72">

            <FaSearch
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full outline-none focus:ring-2 focus:ring-cyan-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Order Placed">
              Order Placed
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Out for Delivery">
              Out for Delivery
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </div>
      </div>

      {/* ===============================
          RESULT COUNT
      =============================== */}

      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-5">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {orders.length}
          </span>{" "}
          orders
        </p>

        {(search || statusFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Clear filters
          </button>
        )}

      </div>

      {/* ===============================
          NO ORDERS
      =============================== */}

      {filteredOrders.length === 0 ? (

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">

          <FaShoppingBag
            size={50}
            className="mx-auto text-gray-300 mb-4"
          />

          <h2 className="text-xl font-semibold text-gray-700">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-1">
            Try changing your search or status filter.
          </p>

        </div>

      ) : (

        /* ===============================
           ORDERS
        =============================== */

        filteredOrders.map((order) => {

          const address = order.address || {};

          const items = Array.isArray(order.items)
            ? order.items
            : [];

          const isLocked =
            order.orderStatus === "Delivered" ||
            order.orderStatus === "Cancelled";

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden"
            >

              {/* ===============================
                  ORDER HEADER
              =============================== */}

              <div className="bg-gray-50 px-5 md:px-6 py-5 border-b">

                <div className="flex flex-col xl:flex-row justify-between gap-4">

                  <div>

                    <h2 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-800">

                      <FaShoppingBag className="text-cyan-600" />

                      Order #
                      {String(order._id || "")
                        .slice(-8)
                        .toUpperCase()}

                    </h2>

                    <p className="text-gray-500 text-sm mt-1">

                      {order.date
                        ? new Date(
                            order.date
                          ).toLocaleString("en-IN")
                        : "Date unavailable"}

                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2 items-center">

                    {/* AMOUNT */}

                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                      ₹ {order.amount}
                    </span>

                    {/* PAYMENT */}

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      {order.paymentMethod || "Online Payment"}
                    </span>

                    {/* STATUS */}

                    <span
                      className={`${getStatusClass(
                        order.orderStatus
                      )} px-4 py-2 rounded-full font-semibold flex items-center gap-2`}
                    >
                      {getStatusIcon(
                        order.orderStatus
                      )}

                      {order.orderStatus}
                    </span>

                  </div>

                </div>

              </div>

              {/* ===============================
                  CUSTOMER / ADDRESS / SUMMARY
              =============================== */}

              <div className="grid lg:grid-cols-3 gap-6 md:gap-8 p-5 md:p-6">

                {/* CUSTOMER */}

                <div>

                  <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800">

                    <FaUser className="text-cyan-600" />

                    Customer

                  </h3>

                  <p className="font-medium">
                    {address.firstName || ""}{" "}
                    {address.lastName || ""}
                  </p>

                  {address.phone && (
                    <p className="flex items-center gap-2 mt-1 text-gray-600">
                      <FaPhone className="text-sm" />
                      {address.phone}
                    </p>
                  )}

                  {address.email && (
                    <p className="text-gray-600 mt-1 break-all">
                      {address.email}
                    </p>
                  )}

                </div>

                {/* ADDRESS */}

                <div>

                  <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800">

                    <FaMapMarkerAlt className="text-red-500" />

                    Delivery Address

                  </h3>

                  <p className="text-gray-700">
                    {address.address || "Address unavailable"}
                  </p>

                  <p className="text-gray-700 mt-1">
                    {address.city || ""}
                    {address.city && address.state
                      ? ", "
                      : ""}
                    {address.state || ""}
                  </p>

                  {address.zipcode && (
                    <p className="text-gray-700">
                      {address.zipcode}
                    </p>
                  )}

                  {address.country && (
                    <p className="text-gray-700">
                      {address.country}
                    </p>
                  )}

                </div>

                {/* SUMMARY */}

                <div>

                  <h3 className="font-bold mb-3 text-gray-800">
                    Order Summary
                  </h3>

                  <p className="flex items-center gap-2 text-gray-700">

                    <FaMoneyBillWave className="text-green-600" />

                    Amount:
                    <span className="font-semibold">
                      ₹{order.amount}
                    </span>

                  </p>

                  <p className="flex items-center gap-2 mt-2 text-gray-700">

                    <FaBoxOpen className="text-cyan-600" />

                    Items:
                    <span className="font-semibold">
                      {items.length}
                    </span>

                  </p>

                  <p className="flex items-center gap-2 mt-2 text-gray-700">

                    <FaWeightHanging className="text-orange-500" />

                    Weight:
                    <span className="font-semibold">
                      {getTotalWeight(items)} KG
                    </span>

                  </p>

                </div>

              </div>

              {/* ===============================
                  ORDERED PRODUCTS
              =============================== */}

              <div className="px-5 md:px-6 pb-6">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">

                  <h3 className="font-bold text-lg text-gray-800">
                    Ordered Products
                  </h3>

                  <span className="text-sm text-gray-500">
                    Customer preparation requirements
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  {items.map((item, index) => {

                    const preparation =
                      item.preparation ||
                      "Preparation not specified";

                    const itemWeight =
                      Number(item.weight || 0);

                    const quantity =
                      Number(item.quantity || 1);

                    const itemTotalWeight =
                      itemWeight * quantity;

                    return (
                      <div
                        key={
                          item._id ||
                          `${item.productId || item.name}-${item.weight}-${item.preparation}-${index}`
                        }
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                      >

                        <div className="flex gap-4">

                          {/* IMAGE */}

                          <div className="shrink-0">

                            {item.image?.[0] ||
                            item.image ? (

                              <img
                                src={
                                  Array.isArray(item.image)
                                    ? item.image[0]
                                    : item.image
                                }
                                alt={item.name}
                                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            ) : (

                              <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FaFish
                                  className="text-gray-400"
                                  size={30}
                                />
                              </div>

                            )}

                          </div>

                          {/* DETAILS */}

                          <div className="min-w-0 flex-1">

                            <h4 className="font-bold text-gray-800 text-lg">
                              {item.name}
                            </h4>

                            <p className="text-gray-600 mt-1">
                              Weight:{" "}
                              <span className="font-semibold">
                                {itemWeight} KG
                              </span>
                            </p>

                            <p className="text-gray-600">
                              Quantity:{" "}
                              <span className="font-semibold">
                                {quantity}
                              </span>
                            </p>

                            {quantity > 1 && (
                              <p className="text-gray-600">
                                Total Weight:{" "}
                                <span className="font-semibold">
                                  {itemTotalWeight} KG
                                </span>
                              </p>
                            )}

                            <p className="text-gray-600">
                              Price:{" "}
                              <span className="font-semibold">
                                ₹ {item.price}
                              </span>
                            </p>

                          </div>

                        </div>

                        {/* ===============================
                            PREPARATION
                        =============================== */}

                        <div className="mt-4 pt-3 border-t">

                          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 flex items-center gap-2">

                            <FaCut className="text-cyan-600" />

                            Customer Selected Preparation

                          </p>

                          <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-2">

                            <p className="font-bold text-cyan-800">
                              {preparation}
                            </p>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

              {/* ===============================
                  PAYMENT + STATUS
              =============================== */}

              <div className="border-t px-5 md:px-6 py-5">

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">

                  {/* PAYMENT STATUS */}

                  <div>

                    <p className="text-sm text-gray-500">
                      Payment Status
                    </p>

                    <p
                      className={`font-bold mt-1 ${
                        order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.paymentStatus ||
                        "Unknown"}
                    </p>

                    {order.paymentMethod && (
                      <p className="text-xs text-gray-500 mt-1">
                        Method:{" "}
                        {order.paymentMethod}
                      </p>
                    )}

                  </div>

                  {/* STATUS UPDATE */}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">

                    <label className="font-semibold text-gray-700">
                      Update Status:
                    </label>

                    <select
                      value={
                        order.orderStatus ||
                        "Order Placed"
                      }
                      disabled={isLocked}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >

                      <option value="Order Placed">
                        Order Placed
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

                {/* LOCK MESSAGE */}

                {isLocked && (
                  <p className="text-xs text-gray-500 mt-4">

                    {order.orderStatus ===
                    "Delivered"
                      ? "Delivered orders cannot be changed."
                      : "Cancelled orders cannot be reopened."}

                  </p>
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
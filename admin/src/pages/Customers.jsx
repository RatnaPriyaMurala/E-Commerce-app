
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

import {
  FaSearch,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaRupeeSign,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaBoxOpen,
  FaFish,
} from "react-icons/fa";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatDate = (date) => {
  if (!date) return "Not Available";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "Not Available"
    : parsedDate.toLocaleString("en-IN");
};

const getCustomerName = (customer) =>
  customer.name ||
  [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ") ||
  "Customer";

const getUserId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getOrderCustomerName = (order) =>
  [
    order.address?.firstName,
    order.address?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

const Customers = ({ token }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${backendUrl}/api/customer/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCustomers(response.data.customers || []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error(
        "Unable to load customers:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCustomers();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Load every available order page and select this customer's orders.
  const viewCustomerOrders = async (customer) => {
    setSelectedCustomer(customer);
    setCustomerOrders([]);
    setOrdersError("");
    setOrdersLoading(true);

    try {
      const allOrders = [];
      const pageSize = 100;
      let page = 1;
      let totalPages = 1;

      do {
        const response = await axios.post(
          `${backendUrl}/api/order/admin-orders`,
          {
            includeAll: true,
            page,
            limit: pageSize,
            search: "",
            status: "All Status",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Unable to load orders"
          );
        }

        const orders = response.data.orders || [];
        allOrders.push(...orders);

        // Supports the paginated backend and the older endpoint
        // that returns all orders without pagination metadata.
        const pagination = response.data.pagination;

        if (pagination?.totalPages) {
          totalPages = pagination.totalPages;
        } else {
          totalPages = page;
        }

        page += 1;
      } while (page <= totalPages);

      const customerUserId = getUserId(customer.userId);
      const customerPhone = String(customer.phone || "").replace(/\D/g, "");
      const customerName = getCustomerName(customer)
        .trim()
        .toLowerCase();

      const matchingOrders = allOrders.filter((order) => {
  const orderUserId = getUserId(order.userId);

  // Match by user ID whenever it agrees.
  if (
    customerUserId &&
    orderUserId &&
    customerUserId === orderUserId
  ) {
    return true;
  }

  // Fallback for older records with missing or mismatched IDs.
  // Only use a phone number when both records have one.
  const orderPhone = String(
    order.address?.phone || ""
  ).replace(/\D/g, "");

  if (
    customerPhone &&
    orderPhone &&
    customerPhone === orderPhone
  ) {
    return true;
  }

  // Last fallback: exact full-name match.
  const orderName = getOrderCustomerName(order)
    .trim()
    .toLowerCase();

  return Boolean(
    customerName &&
    orderName &&
    customerName === orderName
  );
});
const getOrderTimestamp = (order) => {
  const value = order.date ?? order.createdAt;

  if (value == null) return 0;

  // Supports numeric milliseconds, ISO date strings,
  // and MongoDB date values serialized as strings.
  const timestamp =
    typeof value === "number"
      ? value
      : new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
};

matchingOrders.sort(
  (a, b) => getOrderTimestamp(b) - getOrderTimestamp(a)
);
      setCustomerOrders(matchingOrders);

      if (matchingOrders.length === 0) {
        setOrdersError(
          "No matching orders were found for this customer. If the customer has ordered before, verify that their customer record and order records have the same userId."
        );
      }
    } catch (error) {
      console.error(
        "Unable to load customer order history:",
        error.response?.data || error.message
      );

      setOrdersError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load this customer's orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    return (
      getCustomerName(customer).toLowerCase().includes(text) ||
      String(customer.phone || "").includes(search.trim()) ||
      String(customer.city || "").toLowerCase().includes(text)
    );
  });

  const closeOrders = () => {
    setSelectedCustomer(null);
    setCustomerOrders([]);
    setOrdersError("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-2xl font-bold">
          Loading Customers...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Customers Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage customer profiles and view complete order history.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search name, phone or city"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border rounded-lg pl-10 pr-4 py-2 w-full outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* CUSTOMER CARDS */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Customers Found
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCustomers.map((customer, index) => {
            const totalOrders = Number(customer.totalOrders || 0);
            const name = getCustomerName(customer);

            return (
              <div
                key={customer._id || customer.userId || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-5">
                  <div className="flex items-center gap-3">
                    <FaUser size={28} />

                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {name}
                      </h2>

                      <p className="text-sm opacity-90">
                        Customer Profile
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {/* PHONE */}
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-600" />

                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <p className="font-semibold">
                        {customer.phone || "Not Available"}
                      </p>
                    </div>
                  </div>

                  {/* CITY */}
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500" />

                    <div>
                      <p className="text-gray-500 text-sm">City</p>
                      <p className="font-semibold">
                        {customer.city || "Not Available"}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER TOTALS */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <FaShoppingBag
                        className="mx-auto text-blue-600 mb-2"
                        size={22}
                      />

                      <p className="text-sm text-gray-500">Orders</p>

                      <p className="text-2xl font-bold">
                        {totalOrders}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <FaRupeeSign
                        className="mx-auto text-green-600 mb-2"
                        size={22}
                      />

                      <p className="text-sm text-gray-500">Spent</p>

                      <p className="text-2xl font-bold">
                        ₹{formatMoney(customer.totalSpent)}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER HISTORY SUMMARY */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between gap-4">
                      <p className="text-gray-500">Last Order</p>

                      <p className="font-semibold text-right">
                        {customer.lastOrder
                          ? new Date(
                              customer.lastOrder
                            ).toLocaleDateString("en-IN")
                          : "Not Available"}
                      </p>
                    </div>

                    <div className="flex justify-between gap-4">
                      <p className="text-gray-500">
                        Total Weight Purchased
                      </p>

                      <p className="font-semibold text-right">
                        {Number(customer.totalWeight || 0)} KG
                      </p>
                    </div>
                  </div>

                  {/* CURRENT CART */}
                  <div className="border-t pt-4">
                    <p className="text-gray-500 mb-3">Current Cart</p>

                    {customer.cartItems?.length > 0 ? (
                      <div className="space-y-3">
                        {customer.cartItems.map((item, itemIndex) => (
                          <div
                            key={item._id || itemIndex}
                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.productName || "Fish product"}
                                className="w-14 h-14 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-lg">
                                <FaFish className="text-gray-500" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold break-words">
                                {item.productName || item.name || "Product"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {item.weight || 0} KG
                                {Number(item.quantity || 1) > 1 &&
                                  ` × ${item.quantity}`}
                              </p>

                              {item.preparation && (
                                <p className="text-sm text-cyan-600">
                                  {item.preparation}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Cart is empty
                      </p>
                    )}
                  </div>

                  {/* CUSTOMER STATUS */}
                  <div className="flex justify-between items-center gap-3 border-t pt-4">
                    <p className="text-gray-500">Customer Status</p>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        totalOrders >= 10
                          ? "bg-green-100 text-green-700"
                          : totalOrders >= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : totalOrders > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {totalOrders >= 10
                        ? "Loyal Customer"
                        : totalOrders >= 5
                        ? "Regular Customer"
                        : totalOrders > 0
                        ? "New Customer"
                        : "Registered - No Orders"}
                    </span>
                  </div>

                  {/* FUNCTIONAL VIEW ORDERS BUTTON */}
                  <button
                    type="button"
                    onClick={() => viewCustomerOrders(customer)}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition font-semibold"
                  >
                    <FaEye />
                    View Orders
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6"
          onClick={closeOrders}
        >
          <div
            className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white p-4 sm:p-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {getCustomerName(selectedCustomer)}
                </h2>

                <p className="text-sm opacity-90 mt-1">
                  Complete Customer Order History
                </p>

                <p className="text-sm mt-2">
                  Phone: {selectedCustomer.phone || "Not Available"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeOrders}
                aria-label="Close customer orders"
                className="p-2 hover:bg-white/20 rounded-lg"
              >
                <FaTimes size={22} />
              </button>
            </div>

            {/* ORDER HISTORY CONTENT */}
            <div className="overflow-y-auto p-4 sm:p-6">
              {ordersLoading ? (
                <div className="py-16 text-center">
                  <p className="text-lg font-semibold">
                    Loading customer orders...
                  </p>
                </div>
              ) : ordersError && customerOrders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <FaBoxOpen className="mx-auto text-gray-400 mb-3" size={36} />

                  <p className="font-semibold">
                    No Order History Available
                  </p>

                  <p className="text-gray-600 text-sm mt-2 break-words">
                    {ordersError}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-white shadow-sm rounded-lg p-4">
                      <p className="text-gray-500 text-sm">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold">
                        {customerOrders.length}
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4">
                      <p className="text-gray-500 text-sm">
                        Order Value
                      </p>
                      <p className="text-xl font-bold">
                        ₹
                        {formatMoney(
                          customerOrders.reduce(
                            (total, order) =>
                              total + Number(order.amount || 0),
                            0
                          )
                        )}
                      </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 col-span-2 sm:col-span-1">
                      <p className="text-gray-500 text-sm">
                        Total Weight
                      </p>
                      <p className="text-xl font-bold">
                        {formatMoney(
                          customerOrders.reduce(
                            (total, order) =>
                              total +
                              (order.items || []).reduce(
                                (itemTotal, item) =>
                                  itemTotal +
                                  Number(item.weight || 0) *
                                    Number(item.quantity || 1),
                                0
                              ),
                            0
                          )
                        )}{" "}
                        KG
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {customerOrders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden"
                      >
                        {/* ORDER CARD HEADER */}
                        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-bold break-all">
                              Order #{String(order._id || "").slice(-8).toUpperCase()}
                            </p>

                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                              <FaCalendarAlt />
                              {formatDate(order.date || order.createdAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="bg-cyan-50 text-cyan-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {order.orderStatus || "Order Placed"}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                order.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.paymentStatus || "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* ORDER ITEMS */}
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                            <p className="text-gray-600">
                              Payment:{" "}
                              <span className="font-semibold text-gray-900">
                                {order.paymentMethod || "Not Available"}
                              </span>
                            </p>

                            <p className="text-lg font-bold">
                              Total: ₹{formatMoney(order.amount)}
                            </p>
                          </div>

                          <h3 className="font-semibold mb-3">
                            Products Ordered
                          </h3>

                          <div className="space-y-3">
                            {(order.items || []).map((item, itemIndex) => (
                              <div
                                key={item._id || itemIndex}
                                className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name || "Product"}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <FaFish className="text-gray-500" size={22} />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold break-words">
                                    {item.name || "Product"}
                                  </p>

                                  <p className="text-sm text-gray-600 mt-1">
                                    Weight: {item.weight || 0} KG
                                    {" · "}
                                    Quantity: {item.quantity || 1}
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Price per KG: ₹{formatMoney(item.price)}
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Preparation:{" "}
                                    {item.preparation || "Not specified"}
                                  </p>

                                  <p className="text-sm font-semibold mt-1">
                                    Item subtotal: ₹
                                    {formatMoney(
                                      item.subtotal ??
                                        Number(item.price || 0) *
                                          Number(item.weight || 0) *
                                          Number(item.quantity || 1)
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* DELIVERY ADDRESS */}
                          <div className="mt-4 pt-4 border-t">
                            <h3 className="font-semibold mb-2">
                              Delivery Address
                            </h3>

                            <p className="text-sm text-gray-600">
                              {[
                                order.address?.deliveryPoint,
                                order.address?.address,
                                order.address?.landmark
                                  ? `Landmark: ${order.address.landmark}`
                                  : "",
                                order.address?.city,
                                order.address?.state,
                                order.address?.zipcode,
                                order.address?.country,
                              ]
                                .filter(Boolean)
                                .filter(
                                  (value, index, array) =>
                                    array.indexOf(value) === index
                                )
                                .join(", ") || "Address unavailable"}
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                              Phone:{" "}
                              {order.address?.phone ||
                                selectedCustomer.phone ||
                                "Not Available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="border-t bg-white p-4 flex justify-end">
              <button
                type="button"
                onClick={closeOrders}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

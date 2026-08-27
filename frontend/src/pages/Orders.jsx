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
  FaCheckCircle
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {

  const {
    backendUrl,
    token,
    currency
  } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);

  // ==========================
  // LOAD ORDERS
  // ==========================

  const getOrders = async () => {

    try {

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        {
          headers: {
            token
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }

    } catch (error) {

      console.log(error);

    }

  };

  // ==========================
  // CANCEL ORDER
  // ==========================

  const cancelOrder = async (id) => {

    try {

      const response = await axios.post(
        backendUrl + "/api/order/cancel",
        {
          orderId: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token
          }
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

      toast.error("Unable to cancel order");

    }

  };

  // ==========================

  useEffect(() => {

    if (token) {
      getOrders();
    }

  }, [token]);

  return (

    <div className="border-t border-slate-200 bg-slate-50 min-h-screen">

      {/* Header */}

      <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-700 rounded-3xl p-8 text-white shadow-xl mb-10">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">

            <FaBoxOpen className="text-3xl" />

          </div>

          <div>

            <h1 className="text-3xl font-bold">
              My Orders
            </h1>

            <p className="text-cyan-100 mt-2">
              Track every seafood order you've placed and monitor delivery status.
            </p>

          </div>

        </div>

      </div>

      <Title text1="MY" text2="ORDERS" />

      {/* Empty Orders */}

      {
        orders.length === 0

        ?

        (

          <div className="bg-white rounded-3xl shadow-lg p-16 mt-10 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">

              <FaBoxOpen className="text-5xl text-cyan-700" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              No Orders Yet
            </h2>

            <p className="text-slate-500 mt-3 max-w-lg mx-auto">

              Looks like you haven't ordered any fresh seafood yet.
              Browse our premium collection and place your first order.

            </p>

            <button
              onClick={() => window.location.href = "/menu"}
              className="mt-8 bg-gradient-to-r from-cyan-700 to-emerald-700 text-white px-8 py-3 rounded-xl hover:scale-105 transition"
            >
              Explore Products
            </button>

          </div>

        )

        :

        orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-3xl shadow-lg border border-slate-200 p-7 mt-8"
          >

            {/* Order Top */}

            <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

              <div className="space-y-3">

                <div className="flex items-center gap-3">

                  <FaBoxOpen className="text-cyan-700" />

                  <h2 className="text-xl font-bold">
                    Order #{order._id.slice(-8)}
                  </h2>

                </div>

                <p className="text-sm text-slate-500 break-all">
                  {order._id}
                </p>

                <div className="flex items-center gap-3 text-slate-600">

                  <FaCalendarAlt />

                  <span>
                    {new Date(order.date).toLocaleString()}
                  </span>

                </div>

              </div>

              {/* Payment */}

              <div className="grid sm:grid-cols-2 gap-6">

                <div className="bg-slate-50 rounded-2xl p-5">

                  <div className="flex items-center gap-2 mb-2">

                    <FaMoneyBillWave className="text-green-600" />

                    <span className="font-semibold">
                      Amount
                    </span>

                  </div>

                  <p className="text-2xl font-bold text-green-700">
                    {currency}{order.amount}
                  </p>

                </div>

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
                        order.orderStatus === "Delivered"

                        ? "bg-green-100 text-green-700"

                        : order.orderStatus === "Cancelled"

                        ? "bg-red-100 text-red-700"

                        : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >

                    {
                      order.orderStatus === "Delivered"
                      ?
                      <FaCheckCircle />
                      :
                      <FaTruck />
                    }

                    {order.orderStatus}

                  </span>

                  <p className="text-sm text-slate-500 mt-3">

                    Payment :

                    <span className="font-semibold ml-2">
                      {order.paymentMethod.toUpperCase()}
                    </span>

                  </p>

                </div>

              </div>

            </div>

            {/* Ordered Products */}

            <div className="mt-8 border-t pt-8 space-y-5">

              {
                order.items.map((item, index) => (

                  <div
                    key={index}
                    className="
                      flex
                      flex-col
                      md:flex-row
                      gap-6
                      bg-slate-50
                      rounded-2xl
                      p-5
                      hover:shadow-lg
                      transition
                    "
                  >

                    {/* Product Image */}

                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white border">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    {/* Product Details */}

                    <div className="flex-1 flex flex-col justify-between">

                      <div>

                        <h3 className="text-xl font-bold text-slate-800">
                          {item.name}
                        </h3>

                        <div className="grid sm:grid-cols-3 gap-4 mt-4">

                          <div>

                            <p className="text-xs uppercase text-slate-500">
                              Price
                            </p>

                            <p className="font-semibold">
                              {currency}{item.price}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase text-slate-500">
                              Quantity
                            </p>

                            <p className="font-semibold">
                              {item.quantity}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase text-slate-500">
                              Weight
                            </p>

                            <p className="font-semibold">
                              {item.weight} KG
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                ))
              }

            </div>

            {/* Bottom Actions */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-8 border-t pt-6">

              <button
                onClick={getOrders}
                className="
                  flex
                  items-center
                  gap-2
                  bg-cyan-700
                  hover:bg-cyan-800
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  transition
                "
              >

                <FaSyncAlt />

                Refresh Orders

              </button>

              {
                order.orderStatus === "Order Placed" &&

                (

                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="
                      flex
                      items-center
                      gap-2
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      transition
                    "
                  >

                    <FaTimesCircle />

                    Cancel Order

                  </button>

                )
              }

            </div>

          </div>

        ))

      }

    </div>

  );

};

export default Orders;
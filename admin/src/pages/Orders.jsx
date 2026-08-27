import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaWeightHanging,
  FaBoxOpen
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

            Authorization: `Bearer ${token}`

          }

        }

      );

      if (response.data.success) {

        setOrders(response.data.orders);

      }

      else {

        toast.error(response.data.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Unable to load orders");

    }

    finally {

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

          status

        },

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      if (response.data.success) {

        toast.success("Status Updated");

        getOrders();

      }

      else {

        toast.error(response.data.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Failed to update status");

    }

  };

  // ===============================
  // SEARCH + FILTER
  // ===============================

  const filteredOrders = orders.filter((order) => {

    const searchText = search.toLowerCase();

    const matchesSearch =

      order._id.toLowerCase().includes(searchText)

      ||

      `${order.address.firstName} ${order.address.lastName}`

        .toLowerCase()

        .includes(searchText)

      ||

      order.address.phone.includes(search)

      ||

      (order.paymentMethod || "")

        .toLowerCase()

        .includes(searchText)

      ||

      (order.orderStatus || "")

        .toLowerCase()

        .includes(searchText);

    const matchesStatus =

      statusFilter === "All"

        ? true

        : order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;

  });

  // ===============================

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[70vh]">

        <h1 className="text-2xl font-bold">

          Loading Orders...

        </h1>

      </div>

    );

  }

  return (

    <div className="p-6">

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

        <h1 className="text-3xl font-bold">

          Orders Management

        </h1>

        <div className="flex flex-col sm:flex-row gap-3">

          <div className="relative">

            <FaSearch

              className="absolute left-3 top-3 text-gray-400"

            />

            <input

              type="text"

              placeholder="Search Orders"

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              className="border rounded-lg pl-10 pr-4 py-2 w-72"

            />

          </div>

          <select

            value={statusFilter}

            onChange={(e)=>setStatusFilter(e.target.value)}

            className="border rounded-lg px-4 py-2"

          >

            <option value="All">All Status</option>

            <option value="Order Placed">Order Placed</option>

            <option value="Processing">Processing</option>

            <option value="Packed">Packed</option>

            <option value="Out for Delivery">Out for Delivery</option>

            <option value="Delivered">Delivered</option>

            <option value="Cancelled">Cancelled</option>

          </select>

        </div>

      </div>

      {

        filteredOrders.length === 0 ?

        (

          <div className="bg-white rounded-xl shadow p-10 text-center">

            <h2 className="text-xl font-semibold">

              No Orders Found

            </h2>

          </div>

        )

        :
        filteredOrders.map((order) => (

<div
  key={order._id}
  className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border"
>

  {/* ================= HEADER ================= */}

  <div className="bg-gray-50 px-6 py-4 flex flex-col lg:flex-row justify-between lg:items-center gap-4">

    <div>

      <h2 className="font-bold text-lg flex items-center gap-2">

        <FaShoppingBag />

        Order #{order._id.slice(-8).toUpperCase()}

      </h2>

      <p className="text-gray-500 text-sm">

        {new Date(order.date).toLocaleString("en-IN")}

      </p>

    </div>

    <div className="flex flex-wrap gap-3">

      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

        ₹ {order.amount}

      </span>

      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

        {order.paymentMethod}

      </span>

      <span

        className={`

px-4

py-2

rounded-full

font-semibold

text-white

${

order.orderStatus==="Delivered"

?"bg-green-600"

:order.orderStatus==="Cancelled"

?"bg-red-600"

:order.orderStatus==="Packed"

?"bg-orange-500"

:order.orderStatus==="Processing"

?"bg-blue-500"

:order.orderStatus==="Out for Delivery"

?"bg-purple-600"

:"bg-gray-600"

}

`}

      >

        {order.orderStatus}

      </span>

    </div>

  </div>

  {/* ================= BODY ================= */}

  <div className="grid lg:grid-cols-3 gap-8 p-6">

    {/* CUSTOMER */}

    <div>

      <h3 className="font-bold mb-3 flex items-center gap-2">

        <FaUser />

        Customer

      </h3>

      <p>

        {order.address.firstName} {order.address.lastName}

      </p>

      <p>{order.address.phone}</p>

      {

        order.address.email &&

        <p>{order.address.email}</p>

      }

    </div>

    {/* ADDRESS */}

    <div>

      <h3 className="font-bold mb-3 flex items-center gap-2">

        <FaMapMarkerAlt />

        Delivery Address

      </h3>

      <p>{order.address.address}</p>

      <p>

        {order.address.city},

        {order.address.state}

      </p>

      <p>

        {order.address.zipcode}

      </p>

      <p>

        {order.address.country}

      </p>

    </div>

    {/* SUMMARY */}

    <div>

      <h3 className="font-bold mb-3">

        Order Summary

      </h3>

      <p className="flex items-center gap-2">

        <FaMoneyBillWave />

        Amount :

        ₹{order.amount}

      </p>

      <p className="flex items-center gap-2 mt-2">

        <FaBoxOpen />

        Items :

        {order.items.length}

      </p>

      <p className="flex items-center gap-2 mt-2">

        <FaWeightHanging />

        Weight :

        {

          order.items.reduce(

            (total,item)=>

            total+Number(item.weight),

            0

          )

        }

        KG

      </p>

    </div>

  </div>

  {/* ================= PRODUCTS ================= */}

  <div className="px-6 pb-6">

    <h3 className="font-bold text-lg mb-4">

      Ordered Products

    </h3>

    <div className="grid md:grid-cols-2 gap-4">

      {

        order.items.map((item)=>(

        <div

          key={item._id+item.weight}

          className="border rounded-lg p-4 flex gap-4"

        >

          <img

            src={

              Array.isArray(item.image)

              ? item.image[0]

              : item.image

            }

            alt={item.name}

            className="w-24 h-24 rounded-lg object-cover"

            onError={(e)=>{

              e.target.src="https://via.placeholder.com/100";

            }}

          />

          <div>

            <h4 className="font-bold">

              {item.name}

            </h4>

            <p>

              Weight :

              {item.weight} KG

            </p>

            <p>

              Qty :

              {item.quantity || 1}

            </p>

            <p>

              ₹ {item.price}

            </p>

          </div>

        </div>

        ))

      }

    </div>
      </div>

  {/* ================= STATUS UPDATE ================= */}

  <div className="border-t px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

    <div>

      <p className="text-sm text-gray-500">
        Payment Status :
      </p>

      <p
        className={`font-semibold ${
          order.paymentStatus === "Paid"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {order.paymentStatus}
      </p>

    </div>

    <div className="flex items-center gap-3">

      <label className="font-semibold">
        Update Status :
      </label>

      <select
        value={order.orderStatus}
        disabled={
          order.orderStatus === "Delivered" ||
          order.orderStatus === "Cancelled"
        }
        onChange={(e) =>
          updateStatus(
            order._id,
            e.target.value
          )
        }
        className="border rounded-lg px-4 py-2 disabled:bg-gray-200"
      >

        <option value="Order Placed">
          Order Placed
        </option>

        <option value="Processing">
          Processing
        </option>

        <option value="Packed">
          Packed
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

</div>

))

}

</div>

);

};

export default Orders;
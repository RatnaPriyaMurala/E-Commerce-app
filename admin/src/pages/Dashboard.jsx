import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import {
  FaShoppingCart,
  FaRupeeSign,
  FaFish,
  FaUsers,
  FaExclamationTriangle,
  FaEdit
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ token }) => {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    latestOrders: []
  });

  const [lowStock, setLowStock] = useState([]);

  // ==============================
  // Dashboard
  // ==============================

  const loadDashboard = async () => {

    try {

      const response = await axios.get(

        backendUrl + "/api/admin/dashboard",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      if (response.data.success) {

        setDashboard(response.data.dashboard);

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  // ==============================
  // Low Stock
  // ==============================

  const loadLowStock = async () => {

    try {

      const response = await axios.get(

        backendUrl + "/api/product/low-stock",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      if (response.data.success) {

        setLowStock(response.data.products);

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    if (token) {

      loadDashboard();
      loadLowStock();

    }

  }, [token]);
  return (

<div className="p-6 bg-gray-100 min-h-screen">

<h1 className="text-3xl font-bold mb-8">
Dashboard
</h1>

{/* =========================
   DASHBOARD CARDS
========================= */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

<div
onClick={()=>navigate("/orders")}
className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
>

<div className="flex justify-between items-center">

<div>

<p className="text-gray-500 text-sm">
Total Orders
</p>

<h2 className="text-3xl font-bold mt-2">
{dashboard.totalOrders}
</h2>

</div>

<FaShoppingCart
size={40}
className="text-blue-600"
/>

</div>

</div>

<div
className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
>

<div className="flex justify-between items-center">

<div>

<p className="text-gray-500 text-sm">
Revenue
</p>

<h2 className="text-3xl font-bold mt-2">
₹{dashboard.totalRevenue}
</h2>

</div>

<FaRupeeSign
size={40}
className="text-green-600"
/>

</div>

</div>

<div
onClick={()=>navigate("/list")}
className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
>

<div className="flex justify-between items-center">

<div>

<p className="text-gray-500 text-sm">
Products
</p>

<h2 className="text-3xl font-bold mt-2">
{dashboard.totalProducts}
</h2>

</div>

<FaFish
size={40}
className="text-cyan-600"
/>

</div>

</div>

<div
onClick={()=>navigate("/customers")}
className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
>

<div className="flex justify-between items-center">

<div>

<p className="text-gray-500 text-sm">
Customers
</p>

<h2 className="text-3xl font-bold mt-2">
{dashboard.totalCustomers}
</h2>

</div>

<FaUsers
size={40}
className="text-purple-600"
/>

</div>

</div>

<div
onClick={()=>navigate("/list?stock=low")}
className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
>

<div className="flex justify-between items-center">

<div>

<p className="text-gray-500 text-sm">
Low Stock
</p>

<h2 className="text-3xl font-bold mt-2">
{lowStock.length}
</h2>

</div>

<FaExclamationTriangle
size={40}
className="text-red-600"
/>

</div>

</div>

</div>

{/* =========================
LOW STOCK PRODUCTS
========================= */}

<div className="bg-white rounded-xl shadow-md mt-8 p-6">

<div className="flex justify-between items-center mb-6">

<h2 className="text-2xl font-bold">

⚠ Low Stock Products

</h2>

<button

onClick={()=>navigate("/list?stock=low")}

className="bg-black text-white px-4 py-2 rounded-lg"

>

View All

</button>

</div>

{

lowStock.length===0 ?

<div className="text-center py-10">

<p className="text-green-600 text-xl font-semibold">

✅ All Products Have Good Stock

</p>

</div>

:

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

{

lowStock.map((item)=>(

<div

key={item._id}

className="border rounded-xl p-4 hover:shadow-lg transition"

>

<img

src={item.image?.[0]}

className="w-full h-44 object-cover rounded-lg"

/>

<h3 className="font-bold text-lg mt-4">

{item.name}

</h3>

<p className="text-gray-500 mt-2">

Available Stock

</p>

<p className="text-red-600 text-2xl font-bold">

{item.stock} KG

</p>

{

item.stock===0 ?

<span className="inline-block mt-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">

OUT OF STOCK

</span>

:

<span className="inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

LOW STOCK

</span>

}

<button

onClick={()=>navigate("/list")}

className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2"

>

<FaEdit/>

Update Stock

</button>

</div>

))

}

</div>

}

</div>
{/* =========================
LATEST ORDERS
========================= */}

<div className="bg-white rounded-xl shadow-md mt-8 p-6">

<div className="flex justify-between items-center mb-5">

<h2 className="text-2xl font-bold">

Latest Orders

</h2>

<button

onClick={()=>navigate("/orders")}

className="bg-black text-white px-4 py-2 rounded-lg"

>

View All

</button>

</div>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b bg-gray-50">

<th className="text-left p-3">Customer</th>

<th className="text-center">Amount</th>

<th className="text-center">Payment</th>

<th className="text-center">Status</th>

<th className="text-center">Date</th>

</tr>

</thead>

<tbody>

{

dashboard.latestOrders?.map((order)=>(

<tr

key={order._id}

className="border-b hover:bg-gray-50 transition"

>

<td className="p-4">

<div>

<p className="font-semibold">

{order.address?.firstName} {order.address?.lastName}

</p>

<p className="text-xs text-gray-500">

#{order._id.slice(-8).toUpperCase()}

</p>

</div>

</td>

<td className="text-center font-semibold">

₹{order.amount}

</td>

<td className="text-center">

<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">

{order.paymentMethod}

</span>

</td>

<td className="text-center">

{

order.orderStatus==="Delivered" ?

<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">

Delivered

</span>

:

order.orderStatus==="Cancelled" ?

<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">

Cancelled

</span>

:

order.orderStatus==="Out for Delivery" ?

<span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">

Out for Delivery

</span>

:

order.orderStatus==="Shipped" ?

<span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">

Shipped

</span>

:

order.orderStatus==="Packed" ?

<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">

Packed

</span>

:

<span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">

Order Placed

</span>

}

</td>

<td className="text-center text-sm text-gray-500">

{

new Date(order.date)

.toLocaleDateString(

"en-IN",

{

day:"2-digit",

month:"short",

year:"numeric"

}

)

}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

</div>

);

};

export default Dashboard;
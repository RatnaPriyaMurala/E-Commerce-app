import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import {
FaSearch,
FaUser,
FaPhone,
FaMapMarkerAlt,
FaShoppingBag,
FaRupeeSign
} from "react-icons/fa";

const Customers = ({ token }) => {

const [customers,setCustomers]=useState([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");

const loadCustomers=async()=>{

try{

const response=await axios.get(

backendUrl+"/api/customer/list",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);

if(response.data.success){

setCustomers(response.data.customers);

}

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

}

useEffect(()=>{

if(token){

loadCustomers();

}

},[token]);

const filteredCustomers=customers.filter((customer)=>{

const text=search.toLowerCase();

return(

customer.name.toLowerCase().includes(text)

||

customer.phone.includes(search)

||

(customer.city || "").toLowerCase().includes(text)

);

});

if(loading){

return(

<div className="flex justify-center items-center h-[70vh]">

<h1 className="text-2xl font-bold">

Loading Customers...

</h1>

</div>

);

}
return (

<div className="p-6">

<div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

<h1 className="text-3xl font-bold">

Customers Management

</h1>

<div className="relative">

<FaSearch
className="absolute left-3 top-3 text-gray-400"
/>

<input

type="text"

placeholder="Search Customer"

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="border rounded-lg pl-10 pr-4 py-2 w-72"

/>

</div>

</div>

{

filteredCustomers.length===0 ?

(

<div className="bg-white rounded-xl shadow p-10 text-center">

<h2 className="text-xl font-semibold">

No Customers Found

</h2>

</div>

)

:

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{

filteredCustomers.map((customer,index)=>(

<div

key={index}

className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"

>

<div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-5">

<div className="flex items-center gap-3">

<FaUser size={28}/>

<div>

<h2 className="text-2xl font-bold">

{customer.name}

</h2>

<p className="text-sm opacity-90">

Customer Profile

</p>

</div>

</div>

</div>

<div className="p-6 space-y-4">

<div className="flex items-center gap-3">

<FaPhone className="text-green-600"/>

<div>

<p className="text-gray-500 text-sm">

Phone

</p>

<p className="font-semibold">

{customer.phone}

</p>

</div>

</div>

<div className="flex items-center gap-3">

<FaMapMarkerAlt className="text-red-500"/>

<div>

<p className="text-gray-500 text-sm">

City

</p>

<p className="font-semibold">

{customer.city || "Not Available"}

</p>

</div>

</div>

<div className="grid grid-cols-2 gap-4 mt-4">

<div className="bg-blue-50 rounded-lg p-4 text-center">

<FaShoppingBag
className="mx-auto text-blue-600 mb-2"
size={22}
/>

<p className="text-sm text-gray-500">

Orders

</p>

<p className="text-2xl font-bold">

{customer.totalOrders}

</p>

</div>

<div className="bg-green-50 rounded-lg p-4 text-center">

<FaRupeeSign
className="mx-auto text-green-600 mb-2"
size={22}
/>

<p className="text-sm text-gray-500">

Spent

</p>

<p className="text-2xl font-bold">

₹{customer.totalSpent}

</p>

</div>

</div> 
<div className="border-t pt-4 mt-4 space-y-3">

<div className="flex justify-between">

<p className="text-gray-500">

Last Order

</p>

<p className="font-semibold">

{

customer.lastOrder

?

new Date(customer.lastOrder).toLocaleDateString("en-IN")

:

"Not Available"

}

</p>

</div>

<div className="flex justify-between">

<p className="text-gray-500">

Total Weight Purchased

</p>

<p className="font-semibold">

{

customer.totalWeight

?

`${customer.totalWeight} KG`

:

"0 KG"

}

</p>

</div>

<div className="flex justify-between items-center">

<p className="text-gray-500">

Customer Status

</p>

<span

className={`px-3 py-1 rounded-full text-sm font-semibold

${

customer.totalOrders>=10

?

"bg-green-100 text-green-700"

:

customer.totalOrders>=5

?

"bg-yellow-100 text-yellow-700"

:

"bg-blue-100 text-blue-700"

}

`}

>

{

customer.totalOrders>=10

?

"Loyal Customer"

:

customer.totalOrders>=5

?

"Regular Customer"

:

"New Customer"

}

</span>

</div>

<button

className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition"

>

View Orders

</button>

</div>

</div>

</div>

))

}

</div>

}

</div>

);

};

export default Customers;
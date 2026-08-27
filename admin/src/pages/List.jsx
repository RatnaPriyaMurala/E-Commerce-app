import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaFish,
  FaBoxes,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaTag
} from "react-icons/fa";

const List = ({ token }) => {

  const navigate = useNavigate();

  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  // ==========================
  // FETCH PRODUCTS
  // ==========================

  const fetchList = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        backendUrl + "/api/product/list"
      );

      if (response.data.success) {

        setList(response.data.products);

      } else {

        toast.error(response.data.message);

      }

    } catch (error) {

      console.log(error);

      toast.error(error.message);

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // DELETE PRODUCT
  // ==========================

  const removeProduct = async (id) => {

    try {

      const response = await axios.post(

        backendUrl + "/api/product/remove",

        { id },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      if (response.data.success) {

        toast.success(response.data.message);

        fetchList();

      }

      else {

        toast.error(response.data.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(error.message);

    }

  };

  useEffect(() => {

    fetchList();

  }, []);

  // ==========================
  // FILTER PRODUCTS
  // ==========================

  const filteredList = list.filter((item) => {

    const searchText = search.toLowerCase();

    const matchesSearch =

      item.name.toLowerCase().includes(searchText)

      ||

      item.category.toLowerCase().includes(searchText);

    const matchesCategory =

      categoryFilter === "All"

        ? true

        : item.category === categoryFilter;

    return matchesSearch && matchesCategory;

  });

  // ==========================
  // DASHBOARD COUNTS
  // ==========================

  const totalProducts = list.length;

  const lowStock = list.filter(

    item => item.stock > 0 && item.stock <= 5

  ).length;

  const outOfStock = list.filter(

    item => item.stock <= 0

  ).length;

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[70vh]">

        <h1 className="text-2xl font-bold">

          Loading Products...

        </h1>

      </div>

    );

  }
  return (

<div className="p-6">

{/* ===================== HEADER ===================== */}

<div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

<div>

<h1 className="text-3xl font-bold">

Product Management

</h1>

<p className="text-gray-500 mt-1">

Manage all fish products

</p>

</div>

<div className="flex flex-wrap gap-3">

<div className="relative">

<FaSearch
className="absolute left-3 top-3 text-gray-400"
/>

<input

type="text"

placeholder="Search Products"

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="border rounded-lg pl-10 pr-4 py-2 w-72"

/>

</div>

<select

value={categoryFilter}

onChange={(e)=>setCategoryFilter(e.target.value)}

className="border rounded-lg px-4 py-2"

>

<option value="All">All Categories</option>

<option value="Live Fish">Live Fish</option>

<option value="Fresh Water Fish">Fresh Water Fish</option>

<option value="Sea Fish">Sea Fish</option>

<option value="Kolkata Fish">Kolkata Fish</option>

<option value="Prawns">Prawns</option>

<option value="Crabs">Crabs</option>

</select>

</div>

</div>

{/* ===================== DASHBOARD CARDS ===================== */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

<div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

<div>

<p className="text-gray-500">

Total Products

</p>

<h2 className="text-3xl font-bold">

{totalProducts}

</h2>

</div>

<FaBoxes
size={42}
className="text-cyan-600"
/>

</div>

<div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

<div>

<p className="text-gray-500">

Low Stock

</p>

<h2 className="text-3xl font-bold text-orange-600">

{lowStock}

</h2>

</div>

<FaExclamationTriangle
size={42}
className="text-orange-500"
/>

</div>

<div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">

<div>

<p className="text-gray-500">

Out Of Stock

</p>

<h2 className="text-3xl font-bold text-red-600">

{outOfStock}

</h2>

</div>

<FaFish
size={42}
className="text-red-600"
/>

</div>

</div>

{/* ===================== PRODUCTS ===================== */}

<div className="space-y-5">

{

filteredList.map((item)=>(

<div

key={item._id}

className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 p-5"

>

<div className="grid lg:grid-cols-[120px_2fr_1fr_120px_120px_200px] gap-5 items-center">

{/* IMAGE */}

<div className="relative group">

<img

src={item.image?.[0]}

alt={item.name}

className="w-24 h-24 rounded-lg object-cover cursor-pointer"

/>

<div className="hidden group-hover:block absolute left-28 top-0 z-50">

<img

src={item.image?.[0]}

className="w-56 h-56 rounded-xl shadow-xl border bg-white object-cover"

/>

</div>

</div>

{/* PRODUCT */}

<div>

<h2 className="text-xl font-bold">

{item.name}

</h2>

<p className="text-gray-500 text-sm mt-2">

{item.overview}

</p>

<div className="mt-3">

<span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs">

<FaTag className="inline mr-1"/>

{item.category}

</span>

</div>

</div>

{/* CATEGORY */}

<div>

<p className="text-gray-500 text-sm">

Category

</p>

<p className="font-semibold">

{item.category}

</p>

</div>

{/* PRICE */}

<div>

<p className="text-gray-500 text-sm">

Price

</p>

<p className="text-2xl font-bold">

{currency}{item.price}

</p>

</div>

{/* STOCK */}

<div>

<p className="text-gray-500 text-sm">

Stock

</p>

<p

className={`text-xl font-bold

${

item.stock<=0

?

"text-red-600"

:

item.stock<=5

?

"text-orange-600"

:

"text-green-600"

}

`}

>

{item.stock} KG

</p>

{

item.stock<=0 ?

(

<span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">

Out Of Stock

</span>

)

:

item.stock<=5 ?

(

<span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">

Low Stock

</span>

)

:

(

<span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">

In Stock

</span>

)

}

</div>

{/* ACTION BUTTONS */}

<div className="flex justify-center gap-3">
<button
  onClick={() =>
    navigate("/add", {
      state: {
        product: item,
      },
    })
  }
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
>
  <FaEdit />
  Edit
</button>

<button
  onClick={() => removeProduct(item._id)}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
>
  <FaTrash />
  Delete
</button>

</div>

</div>

</div>

))

}

</div>

</div>

);

};

export default List;
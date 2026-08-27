import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaPlusCircle, FaFish, FaShoppingCart, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const menuClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300
    ${
      isActive
        ? "bg-cyan-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">

      <div className="p-6 border-b border-slate-700">

        <h2 className="text-white text-2xl font-bold">
          Fish Mart
        </h2>

        <p className="text-gray-400 text-sm">
          Admin Panel
        </p>

      </div>

      <div className="flex flex-col gap-3 p-5">

        <NavLink to="/dashboard" className={menuClass}>
          <FaTachometerAlt size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/add" className={menuClass}>
          <FaPlusCircle size={20} />
          <span>Add Product</span>
        </NavLink>

        <NavLink to="/list" className={menuClass}>
          <FaFish size={20} />
          <span>Products</span>
        </NavLink>

        <NavLink to="/orders" className={menuClass}>
          <FaShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/customers" className={menuClass}>
          <FaUsers size={20} />
          <span>Customers</span>
        </NavLink>

      </div>

    </div>
  );
};

export default Sidebar;
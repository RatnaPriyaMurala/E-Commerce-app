import React from "react";
import { assests } from "../assets/assests";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-md">

      <div className="flex items-center gap-3">

        <img
          src={assests.logo}
          alt="Logo"
          className="w-12 h-12 object-contain"
        />

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Fish Mart
          </h1>

          <p className="text-sm text-gray-500">
            Admin Dashboard
          </p>

        </div>

      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2">

          <FaUserCircle
            size={34}
            className="text-cyan-600"
          />

          <div>

            <p className="font-semibold">
              Welcome
            </p>

            <p className="text-sm text-gray-500">
              Administrator
            </p>

          </div>

        </div>

        <button
          onClick={() => setToken("")}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </div>
  );
};

export default Navbar;
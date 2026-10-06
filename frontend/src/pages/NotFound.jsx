
import React from "react";
import { Link } from "react-router-dom";
import { FaFish, FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-100 flex items-center justify-center px-3 sm:px-5 py-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl max-w-xl w-full p-6 sm:p-8 text-center">
        {/* ICON */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg mb-5">
          <FaFish className="text-3xl sm:text-4xl text-white" />
        </div>

        {/* 404 */}
        <h1 className="text-5xl sm:text-6xl font-black text-teal-600">
          404
        </h1>

        {/* TITLE */}
        <h2 className="text-xl sm:text-2xl font-bold mt-3 text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm sm:text-base text-gray-500 mt-3 leading-6 max-w-lg mx-auto">
          Looks like this seafood has swum away!
          <br />
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-7">
          <Link
            to="/"
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 text-white text-sm font-semibold hover:scale-[1.02] transition shadow-md"
          >
            <FaHome />
            Back to Home
          </Link>

          <Link
            to="/menu"
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border-2 border-teal-600 text-teal-700 text-sm font-semibold hover:bg-teal-50 transition"
          >
            <FaSearch />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
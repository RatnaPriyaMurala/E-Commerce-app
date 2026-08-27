import React from "react";
import { Link } from "react-router-dom";
import {
  FaFish,
  FaHome,
  FaSearch,
} from "react-icons/fa";

const NotFound = () => {

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-100 flex items-center justify-center px-5">

      <div className="bg-white rounded-[35px] shadow-2xl max-w-2xl w-full p-8 sm:p-12 text-center">

        {/* ICON */}

        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg mb-8">

          <FaFish className="text-4xl sm:text-5xl text-white" />

        </div>

        {/* 404 */}

        <h1 className="text-6xl sm:text-7xl font-black text-teal-600">

          404

        </h1>

        {/* TITLE */}

        <h2 className="text-2xl sm:text-3xl font-bold mt-5 text-gray-800">

          Oops! Page Not Found

        </h2>

        {/* DESCRIPTION */}

        <p className="text-gray-500 mt-5 leading-7 max-w-lg mx-auto">

          Looks like this seafood has swum away!

          <br />

          The page you're looking for doesn't exist or has been moved.

        </p>

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 mt-10">

          <Link
            to="/"
            className="
              flex
              items-center
              justify-center
              gap-3
              px-8
              py-4
              rounded-xl
              bg-gradient-to-r
              from-teal-600
              to-cyan-700
              text-white
              font-semibold
              hover:scale-105
              transition
              shadow-lg
            "
          >

            <FaHome />

            Back to Home

          </Link>

          <Link
            to="/menu"
            className="
              flex
              items-center
              justify-center
              gap-3
              px-8
              py-4
              rounded-xl
              border-2
              border-teal-600
              text-teal-700
              font-semibold
              hover:bg-teal-50
              transition
            "
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
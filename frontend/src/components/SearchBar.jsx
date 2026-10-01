import React, { useContext, useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
  } = useContext(ShopContext);

  const location = useLocation();

  const [visible, setVisible] = useState(false);

  /* =========================================================
     SHOW SEARCH ONLY ON MENU PAGE
  ========================================================= */

  useEffect(() => {
    if (location.pathname.includes("/menu")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location.pathname]);

  /* =========================================================
     HIDE SEARCH BAR
  ========================================================= */

  if (!showSearch || !visible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-teal-600 to-cyan-700 py-4 sm:py-5 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center gap-2.5 sm:gap-3 px-3 sm:px-5">

        {/* SEARCH INPUT */}
        <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2.5 sm:px-5 sm:py-3 shadow-md">

          <FaSearch className="text-gray-500 mr-3 text-sm sm:text-base" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fresh fish, prawns, crabs..."
            className="flex-1 outline-none bg-transparent text-sm sm:text-base"
          />

        </div>

        {/* CLOSE SEARCH */}
        <button
          type="button"
          onClick={() => {
            setShowSearch(false);
            setSearch("");
          }}
          aria-label="Close search"
          className="
            w-10
            h-10
            sm:w-11
            sm:h-11
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            shadow
            hover:bg-gray-100
            hover:scale-105
            transition-all
            duration-200
            shrink-0
          "
        >
          <FaTimes className="text-sm" />
        </button>

      </div>
    </div>
  );
};

export default SearchBar;
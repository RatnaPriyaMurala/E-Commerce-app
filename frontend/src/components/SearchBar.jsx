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
    <div className="bg-gradient-to-r from-teal-600 to-cyan-700 py-8 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center gap-4 px-5">

        {/* SEARCH INPUT */}
        <div className="flex-1 bg-white rounded-full flex items-center px-5 py-4 shadow-lg">

          <FaSearch className="text-gray-500 mr-4" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fresh fish, prawns, crabs..."
            className="flex-1 outline-none bg-transparent"
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
            w-12
            h-12
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
          "
        >
          <FaTimes />
        </button>

      </div>
    </div>
  );
};

export default SearchBar;
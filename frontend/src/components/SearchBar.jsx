import React, { useContext, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
  } = useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================================================
     OPEN SEARCH BAR
     
     The search bar is global.
     It can be opened from any page.
  ========================================================= */

  /* =========================================================
     SEARCH SUBMIT
  ========================================================= */

  const handleSearch = (event) => {
    event?.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      return;
    }

    /*
      Send the search text to the Menu page.

      Example:
      /menu?search=rohu
      /menu?search=prawn
      /menu?search=crab
    */

    setShowSearch(false);

    navigate(
      `/menu?search=${encodeURIComponent(searchValue)}`
    );
  };

  /* =========================================================
     CLOSE SEARCH
  ========================================================= */

  const handleClose = () => {
    setShowSearch(false);
    setSearch("");
  };

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    if (!showSearch) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showSearch]);

  /* =========================================================
     DO NOT RENDER WHEN CLOSED
  ========================================================= */

  if (!showSearch) {
    return null;
  }

  return (
    <div
      className="
        fixed
        left-0
        right-0
        top-14
        z-[90]
        border-b
        border-cyan-700/20
        bg-gradient-to-r
        from-teal-600
        to-cyan-700
        py-2.5
        shadow-lg
        sm:top-16
        sm:py-3
      "
    >
      <form
        onSubmit={handleSearch}
        className="
          mx-auto
          flex
          max-w-5xl
          items-center
          gap-2
          px-3
          sm:gap-2.5
          sm:px-5
        "
      >
        {/* =====================================================
            SEARCH INPUT
        ===================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            rounded-full
            bg-white
            px-3.5
            py-2
            shadow-md
            sm:px-4
            sm:py-2.5
          "
        >
          <FaSearch
            className="
              mr-2.5
              shrink-0
              text-xs
              text-gray-500
              sm:mr-3
              sm:text-sm
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search fresh fish, prawns, crabs..."
            autoFocus
            className="
              min-w-0
              flex-1
              bg-transparent
              text-sm
              text-gray-800
              outline-none
              placeholder:text-gray-400
              sm:text-base
            "
          />
        </div>

        {/* =====================================================
            SEARCH BUTTON
        ===================================================== */}

        <button
          type="submit"
          aria-label="Search products"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
            text-cyan-700
            shadow
            transition-all
            duration-200
            hover:scale-105
            hover:bg-cyan-50
            sm:h-10
            sm:w-10
          "
        >
          <FaSearch className="text-xs sm:text-sm" />
        </button>

        {/* =====================================================
            CLOSE BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close search"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
            text-gray-700
            shadow
            transition-all
            duration-200
            hover:scale-105
            hover:bg-gray-100
            sm:h-10
            sm:w-10
          "
        >
          <FaTimes className="text-xs sm:text-sm" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
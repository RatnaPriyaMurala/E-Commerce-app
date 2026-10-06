import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  Link,
} from "react-router-dom";

import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBoxOpen,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import logo from "../assets/logo.png";

import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  /* =========================================================
     REFS
  ========================================================= */

  const profileRef = useRef(null);

  /* =========================================================
     SHOP CONTEXT
  ========================================================= */

  const {
    setShowSearch,
    getCartCount,
    token,
    user,
    navigate,
    logout,
  } = useContext(ShopContext);

  /* =========================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU ON ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setShowProfile(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =========================================================
     PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =========================================================
     NAVIGATION HELPERS
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =========================================================
     DESKTOP NAV LINK STYLE
  ========================================================= */

  const desktopNavLink = ({ isActive }) => {
    return `
      group
      relative
      py-1
      text-sm
      font-semibold
      tracking-wide
      transition-all
      duration-300
      ${
        isActive
          ? "text-cyan-600"
          : "text-gray-700 hover:text-cyan-600"
      }
    `;
  };

  /* =========================================================
     MOBILE NAV LINK STYLE
  ========================================================= */

  const mobileNavLink = ({ isActive }) => {
    return `
      flex
      items-center
      rounded-xl
      px-3
      py-2.5
      font-medium
      transition-all
      duration-300
      ${
        isActive
          ? "bg-cyan-50 text-cyan-700 shadow-sm"
          : "text-gray-700 hover:bg-gray-50 hover:text-cyan-600"
      }
    `;
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setShowProfile(false);
    setMobileMenuOpen(false);
    logout();
  };

  return (
    <>
      {/* =====================================================
          MAIN NAVBAR
      ===================================================== */}

      <header
  className="
    fixed
    left-0
    right-0
    top-0
    z-[100]
    w-full
    border-b
    border-cyan-100/70
    bg-white/95
    shadow-[0_3px_18px_rgba(0,0,0,0.05)]
    backdrop-blur-xl
  "
>
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-5 lg:px-6">
          <div className="flex h-14 min-w-0 items-center justify-between sm:h-16">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="
                flex
                min-w-0
                shrink
                items-center
              "
            >
              <img
                src={logo}
                alt="Priya Live Fish"
                className="
                  block
                  h-auto
                  w-20
                  max-w-full
                  object-contain
                  sm:w-32
                "
              />
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
              <NavLink
                to="/"
                className={desktopNavLink}
              >
                Home

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-gradient-to-r
                    from-cyan-500
                    to-teal-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </NavLink>

              <NavLink
                to="/menu"
                className={desktopNavLink}
              >
                Menu

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-gradient-to-r
                    from-cyan-500
                    to-teal-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </NavLink>

              <NavLink
                to="/about"
                className={desktopNavLink}
              >
                About

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-gradient-to-r
                    from-cyan-500
                    to-teal-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </NavLink>

              <NavLink
                to="/contact"
                className={desktopNavLink}
              >
                Contact

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-gradient-to-r
                    from-cyan-500
                    to-teal-500
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </NavLink>
            </nav>

            {/* =================================================
                RIGHT SIDE ACTIONS
            ================================================= */}

            <div
              className="
                ml-1
                flex
                shrink-0
                items-center
                gap-0
                sm:ml-2
                sm:gap-1
              "
            >

              {/* SEARCH */}

              <button
                type="button"
                onClick={() => {setShowSearch(true)}}
                aria-label="Search"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-cyan-50
                  hover:text-cyan-600
                  sm:h-10
                  sm:w-10
                "
              >
                <FaSearch className="text-sm sm:text-lg" />
              </button>

              {/* FAVORITES */}

              <Link
                to="/favorites"
                aria-label="Favorites"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-red-50
                  hover:text-red-500
                  sm:h-10
                  sm:w-10
                "
              >
                <FaHeart className="text-sm sm:text-lg" />
              </Link>

              {/* PROFILE */}

              <div
                ref={profileRef}
                className="relative shrink-0"
              >
                {token ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShowProfile(!showProfile)
                    }
                    aria-label="Open profile menu"
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-500
                      to-teal-600
                      text-xs
                      font-bold
                      text-white
                      shadow-md
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:shadow-lg
                      active:scale-95
                      sm:h-10
                      sm:w-10
                      sm:text-base
                    "
                  >
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : "M"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login")
                    }
                    aria-label="Login"
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-gray-700
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:bg-cyan-50
                      hover:text-cyan-600
                      sm:h-10
                      sm:w-10
                    "
                  >
                    <FaUserCircle className="text-lg sm:text-2xl" />
                  </button>
                )}

                {/* PROFILE DROPDOWN */}

                {showProfile && token && (
                  <div
                    className="
                      absolute
                      right-0
                      top-10
                      z-[110]
                      w-64
                      overflow-hidden
                      rounded-2xl
                      border
                      border-cyan-100
                      bg-white/95
                      shadow-[0_16px_50px_rgba(0,0,0,0.14)]
                      backdrop-blur-xl
                      sm:top-13
                    "
                  >
                    <div
                      className="
                        relative
                        overflow-hidden
                        bg-gradient-to-r
                        from-cyan-600
                        via-cyan-500
                        to-teal-600
                        px-4
                        py-3.5
                        text-white
                      "
                    >
                      <div
                        className="
                          absolute
                          -right-8
                          -top-8
                          h-24
                          w-24
                          rounded-full
                          bg-white/10
                        "
                      />

                      <div className="relative flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/30
                            bg-white/20
                            text-base
                            font-bold
                            backdrop-blur-sm
                          "
                        >
                          {user?.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "M"}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-semibold">
                            {user?.name || "My Account"}
                          </h2>

                          <p className="mt-0.5 truncate text-[11px] text-white/80">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/profile");
                          setShowProfile(false);
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2
                          text-left
                          text-sm
                          text-gray-700
                          transition-all
                          hover:bg-cyan-50
                          hover:text-cyan-700
                        "
                      >
                        <FaUser className="text-cyan-600" />
                        <span>My Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/orders");
                          setShowProfile(false);
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2
                          text-left
                          text-sm
                          text-gray-700
                          transition-all
                          hover:bg-cyan-50
                          hover:text-cyan-700
                        "
                      >
                        <FaBoxOpen className="text-cyan-600" />
                        <span>My Orders</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/favorites");
                          setShowProfile(false);
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2
                          text-left
                          text-sm
                          text-gray-700
                          transition-all
                          hover:bg-red-50
                          hover:text-red-600
                        "
                      >
                        <FaHeart className="text-red-500" />
                        <span>Favorites</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/settings");
                          setShowProfile(false);
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2
                          text-left
                          text-sm
                          text-gray-700
                          transition-all
                          hover:bg-gray-100
                        "
                      >
                        <FaCog className="text-gray-500" />
                        <span>Settings</span>
                      </button>

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2
                          text-left
                          text-sm
                          text-red-600
                          transition-all
                          hover:bg-red-50
                        "
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>

                    </div>
                  </div>
                )}
              </div>

              {/* CART */}

              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="
                  relative
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-cyan-50
                  hover:text-cyan-600
                  sm:h-10
                  sm:w-10
                "
              >
                <FaShoppingCart className="text-base sm:text-xl" />

                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-[17px]
                    min-w-[17px]
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white
                    bg-gradient-to-r
                    from-cyan-500
                    to-teal-600
                    px-1
                    text-[8px]
                    font-bold
                    text-white
                    shadow-md
                  "
                >
                  {getCartCount()}
                </span>
              </Link>

              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  transition-all
                  duration-300
                  hover:bg-cyan-50
                  hover:text-cyan-600
                  lg:hidden
                  sm:h-10
                  sm:w-10
                "
              >
                <FaBars className="text-base sm:text-xl" />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      <div
        onClick={closeMobileMenu}
        className={`
          fixed
          inset-0
          z-[998]
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          lg:hidden
          ${
            mobileMenuOpen
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }
        `}
      />

      {/* =========================================================
          MOBILE DRAWER
      ========================================================= */}

      <aside
        className={`
          fixed
          right-0
          top-0
          z-[999]
          h-full
          w-[285px]
          max-w-[85vw]
          bg-white
          shadow-[-15px_0_50px_rgba(0,0,0,0.15)]
          transition-transform
          duration-300
          ease-out
          lg:hidden
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* DRAWER HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            px-4
            py-3
          "
        >
          <Link
            to="/"
            onClick={closeMobileMenu}
          >
            <img
              src={logo}
              alt="Priya Live Fish"
              className="w-28 object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-600
              transition-all
              hover:bg-red-50
              hover:text-red-500
            "
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* DRAWER CONTENT */}

        <div className="h-[calc(100%-64px)] overflow-y-auto px-4 py-4">

          <p
            className="
              mb-2
              px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-widest
              text-gray-400
            "
          >
            Navigation
          </p>

          <nav className="flex flex-col gap-1">

            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >
              Home
            </NavLink>

            <NavLink
              to="/menu"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >
              Menu
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >
              Contact
            </NavLink>

            <NavLink
              to="/favorites"
              onClick={closeMobileMenu}
              className={mobileNavLink}
            >
              <FaHeart className="mr-3 text-red-500" />
              Favorites
            </NavLink>

          </nav>

          {token && (
            <>
              <div className="my-4 border-t border-gray-100" />

              <p
                className="
                  mb-2
                  px-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-gray-400
                "
              >
                My Account
              </p>

              <nav className="flex flex-col gap-1">

                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={mobileNavLink}
                >
                  <FaUser className="mr-3 text-cyan-600" />
                  My Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={closeMobileMenu}
                  className={mobileNavLink}
                >
                  <FaBoxOpen className="mr-3 text-cyan-600" />
                  My Orders
                </NavLink>

                <NavLink
                  to="/favorites"
                  onClick={closeMobileMenu}
                  className={mobileNavLink}
                >
                  <FaHeart className="mr-3 text-red-500" />
                  Favorites
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={closeMobileMenu}
                  className={mobileNavLink}
                >
                  <FaCog className="mr-3 text-gray-500" />
                  Settings
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    items-center
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-red-600
                    transition-all
                    hover:bg-red-50
                  "
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>

              </nav>
            </>
          )}

          {!token && (
            <>
              <div className="my-4 border-t border-gray-100" />

              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                  closeMobileMenu();
                }}
                className="
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-teal-600
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >
                Sign In / Create Account
              </button>
            </>
          )}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-cyan-100
              bg-gradient-to-br
              from-cyan-50
              to-teal-50
              p-4
            "
          >
            <p className="mb-0.5 text-base">
              🐟
            </p>

            <p className="font-semibold text-gray-800">
              Fresh Seafood Daily
            </p>

            <p className="mt-1 text-[11px] leading-4.5 text-gray-500">
              Premium quality fish sourced fresh
              from trusted fishermen.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Navbar;
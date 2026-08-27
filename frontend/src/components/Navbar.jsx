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

  }, []);


  /* =========================================================
     PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {

    if (mobileMenuOpen) {

      document.body.style.overflow = "hidden";

    }

    else {

      document.body.style.overflow = "";

    }


    return () => {

      document.body.style.overflow = "";

    };

  }, [mobileMenuOpen]);


  /* =========================================================
     NAVIGATION HELPER
  ========================================================= */

  const closeMobileMenu = () => {

    setMobileMenuOpen(false);

  };


  /* =========================================================
     NAV LINK STYLE
  ========================================================= */

  const desktopNavLink = ({ isActive }) => {

    return `
      relative
      py-2
      text-sm
      font-semibold
      tracking-wide
      transition-all
      duration-300
      group

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
      px-4
      py-3
      rounded-xl
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
     LOGOUT HANDLER
  ========================================================= */

  const handleLogout = () => {

    setShowProfile(false);

    setMobileMenuOpen(false);

    logout();

  };


  return (

    <>

      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          w-full
          bg-white/90
          backdrop-blur-xl
          border-b
          border-cyan-100/70
          shadow-[0_4px_25px_rgba(0,0,0,0.06)]
          transition-all
          duration-300
        "
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div
            className="
              h-[76px]
              flex
              items-center
              justify-between
            "
          >

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="
                flex
                items-center
                group
                shrink-0
              "
            >

              <img
                src={logo}
                alt="Priya Live Fish"
                className="
                  w-32
                  sm:w-36
                  object-contain
                  transition-all
                  duration-500
                  group-hover:scale-105
                  group-hover:-translate-y-0.5
                "
              />

            </Link>


            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                gap-8
                xl:gap-10
              "
            >

              <NavLink
                to="/"
                className={desktopNavLink}
              >

                Home

                <span
                  className="
                    absolute
                    left-0
                    bottom-0
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
                    left-0
                    bottom-0
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
                    left-0
                    bottom-0
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
                    left-0
                    bottom-0
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
                flex
                items-center
                gap-2
                sm:gap-4
              "
            >

              {/* SEARCH */}

              <button
                type="button"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-gray-700
                  hover:text-cyan-600
                  hover:bg-cyan-50
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >

                <FaSearch className="text-lg" />

              </button>


              {/* =================================================
                  PROFILE
              ================================================= */}

              <div
                ref={profileRef}
                className="relative"
              >

                {token ? (

                  <button
                    type="button"
                    onClick={() =>
                      setShowProfile(!showProfile)
                    }
                    aria-label="Open profile menu"
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-500
                      to-teal-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-105
                      active:scale-95
                      transition-all
                      duration-300
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
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-gray-700
                      hover:text-cyan-600
                      hover:bg-cyan-50
                      hover:scale-105
                      transition-all
                      duration-300
                    "
                  >

                    <FaUserCircle className="text-2xl" />

                  </button>

                )}


                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                {showProfile && token && (

                  <div
                    className="
                      absolute
                      right-0
                      top-14
                      w-72
                      bg-white/95
                      backdrop-blur-xl
                      rounded-2xl
                      border
                      border-cyan-100
                      shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                      overflow-hidden
                      animate-[fadeIn_.2s_ease-out]
                    "
                  >

                    {/* USER HEADER */}

                    <div
                      className="
                        relative
                        overflow-hidden
                        bg-gradient-to-r
                        from-cyan-600
                        via-cyan-500
                        to-teal-600
                        text-white
                        px-5
                        py-5
                      "
                    >

                      <div
                        className="
                          absolute
                          -right-8
                          -top-8
                          w-24
                          h-24
                          rounded-full
                          bg-white/10
                        "
                      />

                      <div
                        className="
                          relative
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-12
                            h-12
                            rounded-full
                            bg-white/20
                            border
                            border-white/30
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-lg
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

                          <h2
                            className="
                              font-semibold
                              text-base
                              truncate
                            "
                          >

                            {user?.name || "My Account"}

                          </h2>


                          <p
                            className="
                              text-xs
                              text-white/80
                              truncate
                              mt-0.5
                            "
                          >

                            {user?.email || ""}

                          </p>

                        </div>

                      </div>

                    </div>


                    {/* PROFILE OPTIONS */}

                    <div className="p-2">

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/profile");
                          setShowProfile(false);
                        }}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-left
                          text-gray-700
                          hover:bg-cyan-50
                          hover:text-cyan-700
                          transition-all
                          duration-200
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
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-left
                          text-gray-700
                          hover:bg-cyan-50
                          hover:text-cyan-700
                          transition-all
                          duration-200
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
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-left
                          text-gray-700
                          hover:bg-red-50
                          hover:text-red-600
                          transition-all
                          duration-200
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
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-left
                          text-gray-700
                          hover:bg-gray-100
                          transition-all
                          duration-200
                        "
                      >

                        <FaCog className="text-gray-500" />

                        <span>Settings</span>

                      </button>


                      <div className="my-2 border-t border-gray-100" />


                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-left
                          text-red-600
                          hover:bg-red-50
                          transition-all
                          duration-200
                        "
                      >

                        <FaSignOutAlt />

                        <span>Logout</span>

                      </button>

                    </div>

                  </div>

                )}

              </div>


              {/* =================================================
                  CART
              ================================================= */}

              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="
                  relative
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-gray-700
                  hover:text-cyan-600
                  hover:bg-cyan-50
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >

                <FaShoppingCart className="text-xl" />


                <span
                  className="
                    absolute
                    -top-0.5
                    -right-0.5
                    min-w-[19px]
                    h-[19px]
                    px-1
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-500
                    to-teal-600
                    text-white
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    shadow-md
                    border-2
                    border-white
                  "
                >

                  {getCartCount()}

                </span>

              </Link>


              {/* =================================================
                  MOBILE MENU BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                aria-label="Open menu"
                className="
                  lg:hidden
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-gray-700
                  hover:text-cyan-600
                  hover:bg-cyan-50
                  transition-all
                  duration-300
                "
              >

                <FaBars className="text-xl" />

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
          bg-black/40
          backdrop-blur-[2px]
          z-[998]
          transition-opacity
          duration-300
          lg:hidden

          ${
            mobileMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />


      {/* =========================================================
          MOBILE DRAWER
      ========================================================= */}

      <aside
        className={`
          fixed
          top-0
          right-0
          h-full
          w-[300px]
          max-w-[85vw]
          bg-white
          z-[999]
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
            px-6
            py-5
            border-b
            border-gray-100
          "
        >

          <Link
            to="/"
            onClick={closeMobileMenu}
          >

            <img
              src={logo}
              alt="Priya Live Fish"
              className="w-32"
            />

          </Link>


          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              text-gray-600
              hover:bg-red-50
              hover:text-red-500
              transition-all
            "
          >

            <FaTimes className="text-xl" />

          </button>

        </div>


        {/* DRAWER CONTENT */}

        <div className="px-5 py-6 overflow-y-auto h-[calc(100%-80px)]">

          {/* MAIN NAVIGATION */}

          <p
            className="
              px-4
              mb-3
              text-xs
              uppercase
              tracking-widest
              text-gray-400
              font-semibold
            "
          >

            Navigation

          </p>


          <nav className="flex flex-col gap-2">

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

          </nav>


          {/* ACCOUNT */}

          {token && (

            <>

              <div className="my-6 border-t border-gray-100" />


              <p
                className="
                  px-4
                  mb-3
                  text-xs
                  uppercase
                  tracking-widest
                  text-gray-400
                  font-semibold
                "
              >

                My Account

              </p>


              <nav className="flex flex-col gap-2">

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
                    px-4
                    py-3
                    rounded-xl
                    text-red-600
                    hover:bg-red-50
                    transition-all
                    text-left
                  "
                >

                  <FaSignOutAlt className="mr-3" />

                  Logout

                </button>

              </nav>

            </>

          )}


          {/* LOGIN FOR GUEST */}

          {!token && (

            <>

              <div className="my-6 border-t border-gray-100" />


              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                  closeMobileMenu();
                }}
                className="
                  w-full
                  py-3.5
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-teal-600
                  text-white
                  font-semibold
                  shadow-lg
                  hover:shadow-xl
                  hover:-translate-y-0.5
                  transition-all
                  duration-300
                "
              >

                Sign In / Create Account

              </button>

            </>

          )}


          {/* SEAFOOD BRAND MESSAGE */}

          <div
            className="
              mt-8
              p-5
              rounded-2xl
              bg-gradient-to-br
              from-cyan-50
              to-teal-50
              border
              border-cyan-100
            "
          >

            <p className="text-lg mb-1">
              🐟
            </p>

            <p
              className="
                font-semibold
                text-gray-800
              "
            >

              Fresh Seafood Daily

            </p>

            <p
              className="
                text-xs
                text-gray-500
                mt-1
                leading-relaxed
              "
            >

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
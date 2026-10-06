
import React, {
  useEffect,
} from "react";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// =========================
// PAGES
// =========================

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsConditions from "./pages/TermsConditions";

import NotFound from "./pages/NotFound";

// =========================
// COMPONENTS
// =========================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

// =========================
// TOAST
// =========================

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// SCROLL TO TOP
// ============================================================

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    /*
     * Always start a new page at the very top.
     *
     * This prevents React Router from keeping the
     * previous page's scroll position.
     */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

// =========================
// APP
// =========================

const App = () => {
  return (
    <div className="min-h-screen px-3 sm:px-[3vw] md:px-[4vw] lg:px-[5vw]">

      {/* =========================
          SCROLL POSITION
      ========================== */}

      <ScrollToTop />

      {/* =========================
          TOAST NOTIFICATIONS
      ========================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* =========================
          NAVBAR
      ========================== */}

      <Navbar />

      {/* =========================
          SEARCH BAR
      ========================== */}

      <div className="pt-14 sm:pt-16">
        <SearchBar/>
      

      {/* =========================
          ROUTES
      ========================== */}

      <Routes>

        {/* =========================
            MAIN SHOP
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/product/:productId"
          element={<Product />}
        />

        {/* =========================
            CART & ORDER
        ========================== */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/place-order"
          element={<PlaceOrder />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* =========================
            AUTHENTICATION
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =========================
            USER ACCOUNT
        ========================== */}

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* =========================
            INFORMATION PAGES
        ========================== */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* =========================
            POLICIES
        ========================== */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />

        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/terms-conditions"
          element={<TermsConditions />}
        />

        {/* =========================
            PAYMENT
        ========================== */}

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment-failed"
          element={<PaymentFailed />}
        />

        {/* =========================
            404 PAGE
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
      </div>

      {/* =========================
          FOOTER
      ========================== */}

      <Footer />

    </div>
  );
};

export default App;

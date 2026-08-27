import React from "react";
import { Routes, Route } from "react-router-dom";

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
import Profile from "./pages/Profile";
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

// =========================
// BACKEND URL
// =========================

export const backendUrl = "http://localhost:4000";


// =========================
// APP
// =========================

const App = () => {

  return (

    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">

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

      <SearchBar />

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

      {/* =========================
          FOOTER
      ========================== */}

      <Footer />

    </div>

  );

};

export default App;
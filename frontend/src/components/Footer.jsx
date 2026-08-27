import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaFish,
  FaCheckCircle,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-20 sm:mt-24 bg-slate-950 text-white rounded-t-[2rem] overflow-hidden">
      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* =====================================================
              BRAND
          ===================================================== */}

          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src={assets.logo}
                className="w-36 sm:w-40 bg-white rounded-xl p-2 shadow-lg"
                alt="Priya Live Fish"
              />
            </Link>

            <p className="mt-6 text-sm sm:text-base text-gray-400 leading-7 max-w-md">
              Priya Live Fish delivers premium quality freshwater, seawater
              fish, prawns and crabs directly from trusted fishermen to your
              doorstep with freshness you can trust.
            </p>

            {/* Freshness badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 px-4 py-2.5 rounded-full text-sm">
              <FaFish />
              <span>Freshness Delivered</span>
            </div>
          </div>

          {/* =====================================================
              COMPANY
          ===================================================== */}

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-6">
              Company
            </h3>

            <ul className="space-y-3.5 text-sm sm:text-base text-gray-400">
              <li>
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              POLICIES
          ===================================================== */}

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-6">
              Policies
            </h3>

            <ul className="space-y-3.5 text-sm sm:text-base text-gray-400">
              <li>
                <Link
                  to="/privacy-policy"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/refund-policy"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/shipping-policy"
                  className="group inline-flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaArrowRight className="text-[9px] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              CONTACT
          ===================================================== */}

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-6">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-gray-400">
              {/* Phone */}
              <a
                href="tel:+919954833369"
                className="flex gap-3 items-center hover:text-cyan-400 transition-colors duration-300"
              >
                <span className="w-9 h-9 shrink-0 rounded-full bg-cyan-950 flex items-center justify-center">
                  <FaPhoneAlt className="text-cyan-400 text-sm" />
                </span>

                <span>+91 9954833369</span>
              </a>

              {/* Email */}
              <a
                href="mailto:priyalivefish@gmail.com"
                className="flex gap-3 items-center hover:text-cyan-400 transition-colors duration-300 break-all"
              >
                <span className="w-9 h-9 shrink-0 rounded-full bg-cyan-950 flex items-center justify-center">
                  <FaEnvelope className="text-cyan-400 text-sm" />
                </span>

                <span>priyalivefish@gmail.com</span>
              </a>

              {/* Address */}
              <div className="flex gap-3 items-start">
                <span className="w-9 h-9 shrink-0 rounded-full bg-cyan-950 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-cyan-400 text-sm" />
                </span>

                <span className="leading-6">
                  Fresh Fish Market,
                  <br />
                  Andhra Pradesh,
                  <br />
                  India
                </span>
              </div>
            </div>

            {/* =================================================
                SOCIAL ICONS
            ================================================= */}

            <div className="flex gap-3 mt-7">
              {/* Facebook */}
              <button
                type="button"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-cyan-900/70 border border-cyan-800 flex items-center justify-center hover:bg-cyan-700 hover:-translate-y-1 transition-all duration-300"
              >
                <FaFacebookF />
              </button>

              {/* Instagram */}
              <button
                type="button"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-pink-900/40 border border-pink-800/50 flex items-center justify-center hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300"
              >
                <FaInstagram />
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-green-900/40 border border-green-800/50 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition-all duration-300"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================
            TRUST STRIP
        ======================================================= */}

        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-wrap justify-center sm:justify-between gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-500" />
              Fresh Seafood
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-500" />
              Hygienically Packed
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-500" />
              Quality Assured
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-cyan-500" />
              Customer First
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          COPYRIGHT
      ========================================================= */}

      <div className="relative z-10 border-t border-slate-800 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-300 font-medium">
              Priya Live Fish
            </span>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
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
    <footer className="relative mt-10 sm:mt-12 bg-slate-950 text-white rounded-t-2xl overflow-hidden">

      {/* MAIN FOOTER */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">

          {/* BRAND */}

          <div className="col-span-2 lg:col-span-1">

            <Link to="/" className="inline-block">
              <img
                src={assets.logo}
                className="w-28 sm:w-32 bg-white rounded-lg p-1.5"
                alt="Priya Live Fish"
              />
            </Link>

            <p className="mt-3 text-[11px] sm:text-xs text-gray-400 leading-5 max-w-sm">
              Freshwater fish, seawater fish, prawns and crabs sourced carefully and packed hygienically.
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 px-2.5 py-1.5 rounded-full text-[10px]">
              <FaFish />
              Freshness Delivered
            </div>
          </div>

          {/* COMPANY */}

          <div>
            <h3 className="text-sm font-bold mb-3">
              Company
            </h3>

            <ul className="space-y-2 text-[11px] text-gray-400">

              <li>
                <Link
                  to="/"
                  className="flex items-center gap-1.5 hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-1.5 hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="flex items-center gap-1.5 hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          {/* POLICIES */}

          <div>
            <h3 className="text-sm font-bold mb-3">
              Policies
            </h3>

            <ul className="space-y-2 text-[11px] text-gray-400">

              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-cyan-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-cyan-400"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/refund-policy"
                  className="hover:text-cyan-400"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-cyan-400"
                >
                  Shipping Policy
                </Link>
              </li>

            </ul>
          </div>

          {/* CONTACT */}

          <div className="col-span-2 lg:col-span-1">

            <h3 className="text-sm font-bold mb-3">
              Contact Us
            </h3>

            <div className="space-y-2.5 text-[11px] text-gray-400">

              <a
                href="tel:+919954833369"
                className="flex items-center gap-2 hover:text-cyan-400"
              >
                <span className="w-7 h-7 rounded-full bg-cyan-950 flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="text-cyan-400 text-[10px]" />
                </span>

                <span>
                  +91 9954833369
                </span>
              </a>

              <a
                href="mailto:priyalivefish@gmail.com"
                className="flex items-center gap-2 hover:text-cyan-400"
              >
                <span className="w-7 h-7 rounded-full bg-cyan-950 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-cyan-400 text-[10px]" />
                </span>

                <span className="break-all">
                  priyalivefish@gmail.com
                </span>
              </a>

              <div className="flex items-start gap-2">
                <span className="w-7 h-7 rounded-full bg-cyan-950 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-cyan-400 text-[10px]" />
                </span>

                <span className="leading-4">
                  Fresh Fish Market,
                  <br />
                  Andhra Pradesh,
                  <br />
                  India
                </span>
              </div>

            </div>

            {/* SOCIAL */}

            <div className="flex gap-2 mt-3">

              <button
                type="button"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-cyan-900/70 flex items-center justify-center text-xs"
              >
                <FaFacebookF />
              </button>

              <button
                type="button"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-pink-900/40 flex items-center justify-center text-xs"
              >
                <FaInstagram />
              </button>

              <button
                type="button"
                aria-label="WhatsApp"
                className="w-7 h-7 rounded-full bg-green-900/40 flex items-center justify-center text-xs"
              >
                <FaWhatsapp />
              </button>

            </div>
          </div>
        </div>

        {/* TRUST STRIP */}

        <div className="mt-6 pt-4 border-t border-slate-800">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] sm:text-[10px] text-gray-500">

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-cyan-500" />
              Fresh Seafood
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-cyan-500" />
              Hygienically Packed
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-cyan-500" />
              Quality Assured
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-cyan-500" />
              Customer First
            </div>

          </div>
        </div>
      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-4 py-3 text-center">

          <p className="text-[9px] sm:text-[10px] text-gray-500">
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
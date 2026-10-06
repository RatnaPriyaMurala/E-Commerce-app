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
    <footer className="relative mt-5 overflow-hidden rounded-t-2xl bg-slate-950 text-white sm:mt-6">
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-3 pb-4 pt-5 sm:px-5 sm:pb-4 sm:pt-6 lg:px-6">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
          {/* =================================================
              BRAND
          ================================================= */}

          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src={assets.logo}
                className="w-24 rounded-lg bg-white p-1 sm:w-28"
                alt="Priya Live Fish"
              />
            </Link>

            <p className="mt-2 max-w-sm text-[10px] leading-4.5 text-gray-400 sm:text-[11px]">
              Freshwater fish, seawater fish, prawns and crabs sourced
              carefully and packed hygienically.
            </p>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-800/50 bg-cyan-950/70 px-2.5 py-1 text-[9px] text-cyan-300 sm:text-[10px]">
              <FaFish />
              Freshness Delivered
            </div>
          </div>

          {/* =================================================
              COMPANY
          ================================================= */}

          <div>
            <h3 className="mb-2 text-sm font-bold">
              Company
            </h3>

            <ul className="space-y-1 text-[10px] text-gray-400 sm:text-[11px]">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-1.5 transition-colors hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-1.5 transition-colors hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="flex items-center gap-1.5 transition-colors hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 transition-colors hover:text-cyan-400"
                >
                  <FaArrowRight className="text-[7px]" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              POLICIES
          ================================================= */}

          <div>
            <h3 className="mb-2 text-sm font-bold">
              Policies
            </h3>

            <ul className="space-y-1 text-[10px] text-gray-400 sm:text-[11px]">
              <li>
                <Link
                  to="/privacy-policy"
                  className="transition-colors hover:text-cyan-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-conditions"
                  className="transition-colors hover:text-cyan-400"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/refund-policy"
                  className="transition-colors hover:text-cyan-400"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/shipping-policy"
                  className="transition-colors hover:text-cyan-400"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-2 text-sm font-bold">
              Contact Us
            </h3>

            <div className="space-y-1.5 text-[10px] text-gray-400 sm:text-[11px]">
              <a
                href="tel:+919954833369"
                className="flex items-center gap-2 transition-colors hover:text-cyan-400"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-950">
                  <FaPhoneAlt className="text-[9px] text-cyan-400" />
                </span>

                <span>+91 9954833369</span>
              </a>

              <a
                href="mailto:priyalivefish@gmail.com"
                className="flex items-center gap-2 transition-colors hover:text-cyan-400"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-950">
                  <FaEnvelope className="text-[9px] text-cyan-400" />
                </span>

                <span className="break-all">
                  priyalivefish@gmail.com
                </span>
              </a>

              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-950">
                  <FaMapMarkerAlt className="text-[9px] text-cyan-400" />
                </span>

                <span className="leading-3.5">
                  Fresh Fish Market,
                  <br />
                  Andhra Pradesh,
                  <br />
                  India
                </span>
              </div>
            </div>

            {/* SOCIAL */}

            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                aria-label="Facebook"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-900/70 text-[10px] transition hover:scale-105"
              >
                <FaFacebookF />
              </button>

              <button
                type="button"
                aria-label="Instagram"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-900/40 text-[10px] transition hover:scale-105"
              >
                <FaInstagram />
              </button>

              <button
                type="button"
                aria-label="WhatsApp"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/40 text-[10px] transition hover:scale-105"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            TRUST STRIP
        ===================================================== */}

        <div className="mt-4 border-t border-slate-800 pt-2.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[8px] text-gray-500 sm:grid-cols-4 sm:text-[10px]">
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

      {/* =====================================================
          COPYRIGHT
      ===================================================== */}

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-3 py-2 text-center sm:px-5">
          <p className="text-[8px] text-gray-500 sm:text-[10px]">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-300">
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
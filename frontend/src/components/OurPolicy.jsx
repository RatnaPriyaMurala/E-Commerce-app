
import React, { useState } from "react";
import {
  FaTruck,
  FaSnowflake,
  FaCreditCard,
  FaHeadset,
  FaCheckCircle,
  FaChevronDown,
  FaShieldAlt,
} from "react-icons/fa";

const OurPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);

  const policies = [
    {
      icon: FaTruck,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-700",
      title: "Fast Delivery",
      description:
        "Same-day delivery available in selected locations with hygienic and secure packaging.",
    },
    {
      icon: FaSnowflake,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      title: "Fresh Guarantee",
      description:
        "Freshly caught seafood stored under controlled temperature to preserve quality and taste.",
    },
    {
      icon: FaCreditCard,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      title: "Secure Payments",
      description:
        "Safe payment options including UPI, Cards, Net Banking and Cash on Delivery.",
    },
    {
      icon: FaHeadset,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Customer Support",
      description:
        "Friendly support to assist you with orders, delivery and product information.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">

      {/* COMPACT CLICKABLE HEADER */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="policy-details"
        className="flex w-full items-center gap-3 rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-white px-3 py-3 text-left shadow-sm transition-all duration-300 hover:border-cyan-300 hover:shadow-md sm:px-5 sm:py-3.5"
      >

        {/* ICON */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 sm:h-11 sm:w-11">
          <FaShieldAlt className="text-lg" />
        </div>

        {/* TITLE */}
        <div className="min-w-0 flex-1">

          <h2 className="text-sm font-bold text-gray-800 sm:text-base">
            Why Customers{" "}
            <span className="text-cyan-700">Choose Us</span>
          </h2>

          <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
            Fresh seafood · Quality · Fast delivery · Trusted service
          </p>

          <p className="mt-1 text-[10px] font-semibold text-cyan-700 sm:text-xs">
            {isOpen ? "Tap to close" : "Tap to discover what we provide"}
          </p>

        </div>

        {/* EXPAND ARROW */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <FaChevronDown className="text-xs" />
        </div>

      </button>

      {/* EXPANDABLE CONTENT */}
      <div
        id="policy-details"
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
          isOpen
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >

        <div className="overflow-hidden">

          {/* POLICY CARDS */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">

            {policies.map((policy) => {
              const Icon = policy.icon;

              return (
                <div
                  key={policy.title}
                  className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-200 hover:border-cyan-200 hover:shadow-md sm:p-4"
                >

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${policy.iconBg} sm:h-10 sm:w-10`}
                  >
                    <Icon
                      className={`${policy.iconColor} text-base sm:text-lg`}
                    />
                  </div>

                  <h3 className="mt-2 text-xs font-bold text-gray-800 sm:text-sm">
                    {policy.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-gray-500 sm:text-xs sm:leading-5">
                    {policy.description}
                  </p>

                </div>
              );
            })}

          </div>

          {/* TRUST STRIP */}
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 rounded-xl border border-cyan-50 bg-cyan-50/60 px-3 py-3 text-[10px] text-gray-600 sm:gap-x-6 sm:text-xs">

            {[
              "Quality Checked",
              "Hygienically Packed",
              "Freshly Sourced",
              "Customer First",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <FaCheckCircle className="text-green-500" />
                <span>{item}</span>
              </div>
            ))}

          </div>

        </div>
      </div>

    </section>
  );
};

export default OurPolicy;

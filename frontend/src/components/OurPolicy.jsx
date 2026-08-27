import React from "react";
import {
  FaTruck,
  FaSnowflake,
  FaCreditCard,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

const OurPolicy = () => {
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
    <section className="relative mt-16 sm:mt-20 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-[2rem] bg-gradient-to-b from-cyan-50 via-white to-white">
      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 text-center mb-12 sm:mb-14">
        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 sm:px-5 py-2 rounded-full border border-cyan-200 shadow-sm">
          <FaCheckCircle className="text-cyan-600" />

          <span className="font-semibold text-sm sm:text-base">
            Quality You Can Trust
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
          Why Customers{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Choose Us
          </span>
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-3xl mx-auto leading-7 px-2">
          We are committed to delivering premium seafood with unmatched
          freshness, quality and customer satisfaction — from our fishermen
          to your family table.
        </p>
      </div>

      {/* =========================================================
          POLICY CARDS
      ========================================================= */}

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
        {policies.map((policy, index) => {
          const Icon = policy.icon;

          return (
            <div
              key={policy.title}
              className="group relative bg-white rounded-3xl border border-gray-100 p-7 sm:p-8 text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Card Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/0 to-cyan-50/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] mx-auto rounded-2xl ${policy.iconBg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon
                    size={28}
                    className={`${policy.iconColor} transition-transform duration-500 group-hover:scale-110`}
                  />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg sm:text-xl font-bold text-gray-800">
                  {policy.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm sm:text-base text-gray-500 leading-7">
                  {policy.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-6 flex justify-center">
                  <span className="w-10 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 group-hover:w-16" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          TRUST STRIP
      ========================================================= */}

      <div className="relative z-10 max-w-5xl mx-auto mt-12 sm:mt-14">
        <div className="bg-white/90 backdrop-blur-md border border-white rounded-3xl shadow-lg px-5 sm:px-8 py-5 sm:py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Quality Checked</span>
            </div>

            <div className="hidden sm:block w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Hygienically Packed</span>
            </div>

            <div className="hidden sm:block w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Freshly Sourced</span>
            </div>

            <div className="hidden sm:block w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Customer First</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
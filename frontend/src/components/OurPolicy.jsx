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
    <section className="relative mt-6 sm:mt-8 py-8 sm:py-10 px-3 sm:px-5 lg:px-6 overflow-hidden rounded-2xl bg-gradient-to-b from-cyan-50 via-white to-white">

      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          HEADING
      ========================================================= */}

      <div className="relative z-10 text-center mb-6 sm:mb-7">

        {/* Small Badge */}

        <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3.5 py-1.5 rounded-full border border-cyan-200 shadow-sm">

          <FaCheckCircle className="text-cyan-600 text-sm" />

          <span className="font-semibold text-xs sm:text-sm">
            Quality You Can Trust
          </span>

        </div>

        {/* Main Heading */}

        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">

          Why Customers{" "}

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
            Choose Us
          </span>

        </h2>

        {/* Description */}

        <p className="mt-2 max-w-2xl mx-auto text-xs sm:text-sm text-gray-500 leading-5 px-2">
          We are committed to delivering premium seafood with unmatched
          freshness, quality and customer satisfaction — from our fishermen
          to your family table.
        </p>

      </div>

      {/* =========================================================
          POLICY CARDS
      ========================================================= */}

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

        {policies.map((policy, index) => {
          const Icon = policy.icon;

          return (
            <div
              key={policy.title}
              className="group relative bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >

              {/* Card Hover Background */}

              <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/0 to-cyan-50/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">

                {/* Icon */}

                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl ${policy.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-2`}
                >
                  <Icon
                    size={25}
                    className={`${policy.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>

                {/* Title */}

                <h3 className="mt-4 text-base sm:text-lg font-bold text-gray-800">
                  {policy.title}
                </h3>

                {/* Description */}

                <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-5 sm:leading-6">
                  {policy.description}
                </p>

                {/* Bottom Accent */}

                <div className="mt-4 flex justify-center">
                  <span className="w-8 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:w-14" />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* =========================================================
          TRUST STRIP
      ========================================================= */}

      <div className="relative z-10 max-w-5xl mx-auto mt-7 sm:mt-8">

        <div className="bg-white/90 backdrop-blur-md border border-white rounded-2xl shadow-lg px-4 sm:px-6 py-4">

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-gray-600">

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" />
              <span>Quality Checked</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-200" />

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" />
              <span>Hygienically Packed</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-200" />

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" />
              <span>Freshly Sourced</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-200" />

            <div className="flex items-center gap-1.5">
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
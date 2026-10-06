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
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-cyan-50 via-white to-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

      {/* Heading */}
      <div className="relative z-10 mb-5 text-center sm:mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-100 px-3.5 py-1.5 text-cyan-700 shadow-sm">
          <FaCheckCircle className="text-sm text-cyan-600" />

          <span className="text-xs font-semibold sm:text-sm">
            Quality You Can Trust
          </span>
        </div>

        <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl lg:text-4xl">
          Why Customers{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
            Choose Us
          </span>
        </h2>

        <p className="mx-auto mt-1.5 max-w-2xl px-2 text-xs leading-5 text-gray-500 sm:text-sm">
          We are committed to delivering premium seafood with unmatched
          freshness, quality and customer satisfaction — from our fishermen
          to your family table.
        </p>
      </div>

      {/* Policy Cards */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {policies.map((policy, index) => {
          const Icon = policy.icon;

          return (
            <div
              key={policy.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Card Hover Background */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-50/0 to-cyan-50/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${policy.iconBg} transition-all duration-300 group-hover:rotate-2 group-hover:scale-105 sm:h-14 sm:w-14`}
                >
                  <Icon
                    size={23}
                    className={`${policy.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>

                {/* Title */}
                <h3 className="mt-3 text-base font-bold text-gray-800 sm:text-lg">
                  {policy.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                  {policy.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-3 flex justify-center">
                  <span className="h-1 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:w-14" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Strip */}
      <div className="relative z-10 mx-auto mt-5 max-w-5xl sm:mt-6">
        <div className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6 sm:py-3.5">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-600 sm:text-sm">
            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" />
              <span>Quality Checked</span>
            </div>

            <div className="hidden h-4 w-px bg-gray-200 sm:block" />

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" />
              <span>Hygienically Packed</span>
            </div>

            <div className="hidden h-4 w-px bg-gray-200 sm:block" />

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" />
              <span>Freshly Sourced</span>
            </div>

            <div className="hidden h-4 w-px bg-gray-200 sm:block" />

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
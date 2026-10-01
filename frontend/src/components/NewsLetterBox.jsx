import React from "react";
import {
  FaPaperPlane,
  FaFish,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

const NewsLetterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();

    alert("Thank you for subscribing!");
  };

  return (
    <section className="relative mt-8 sm:mt-10 py-6 sm:py-8 px-3 sm:px-5 lg:px-6 overflow-hidden">
      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================= */}

      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          NEWSLETTER CARD
      ========================================================= */}

      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 shadow-2xl">
        {/* Decorative circles */}

        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 text-center text-white">

          {/* =====================================================
              ICON
          ===================================================== */}

          <div className="flex justify-center">
            <div className="relative">

              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-125" />

              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                <FaFish
                  size={28}
                  className="sm:hidden text-cyan-700"
                />

                <FaFish
                  size={34}
                  className="hidden sm:block text-cyan-700"
                />
              </div>

              <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-md">
                <FaStar size={9} />
              </div>
            </div>
          </div>

          {/* =====================================================
              HEADING
          ===================================================== */}

          <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Stay Updated
          </h2>

          <p className="mt-2.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-sm text-cyan-100 leading-5 sm:leading-6">
            Subscribe to receive updates on fresh arrivals, seasonal seafood
            offers, exclusive discounts and delicious cooking tips delivered
            directly to your inbox.
          </p>

          {/* =====================================================
              SUBSCRIPTION FORM
          ===================================================== */}

          <form
            onSubmit={onSubmitHandler}
            className="mt-5 sm:mt-6 max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row bg-white rounded-xl sm:rounded-full p-1.5 shadow-2xl">

              <input
                type="email"
                required
                placeholder="Enter your email address"
                aria-label="Email address"
                className="flex-1 min-w-0 px-4 sm:px-6 py-3 sm:py-3.5 bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm rounded-lg sm:rounded-full"
              />

              <button
                type="submit"
                className="mt-1 sm:mt-0 bg-gradient-to-r from-slate-900 to-gray-900 hover:from-black hover:to-black px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg sm:rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Subscribe</span>

                <FaPaperPlane className="text-xs sm:text-sm" />
              </button>

            </div>
          </form>

          {/* =====================================================
              TRUST INFORMATION
          ===================================================== */}

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-[11px] sm:text-xs text-cyan-100">

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-300" />
              <span>Fresh seafood updates</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-300" />
              <span>Exclusive offers</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-300" />
              <span>No unnecessary spam</span>
            </div>

          </div>

          {/* Small footer text */}

          <p className="mt-3 text-[11px] text-cyan-200/80">
            Stay connected with our latest seafood arrivals and offers.
          </p>

        </div>
      </div>
    </section>
  );
};

export default NewsLetterBox;
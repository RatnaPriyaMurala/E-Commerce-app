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
    <section className="relative overflow-hidden">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />

      {/* Newsletter Card */}
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 shadow-2xl">
        {/* Decorative Circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-cyan-400/20 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative z-10 px-4 py-6 text-center text-white sm:px-7 sm:py-7 lg:px-10 lg:py-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 scale-125 rounded-full bg-white/20 blur-xl" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl sm:h-16 sm:w-16">
                <FaFish
                  size={26}
                  className="text-cyan-700 sm:hidden"
                />

                <FaFish
                  size={30}
                  className="hidden text-cyan-700 sm:block"
                />
              </div>

              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-white shadow-md sm:h-6 sm:w-6">
                <FaStar size={8} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl lg:text-4xl">
            Stay Updated
          </h2>

          <p className="mx-auto mt-1.5 max-w-2xl text-xs leading-5 text-cyan-100 sm:mt-2 sm:text-sm sm:leading-6">
            Subscribe to receive updates on fresh arrivals, seasonal seafood
            offers, exclusive discounts and delicious cooking tips delivered
            directly to your inbox.
          </p>

          {/* Subscription Form */}
          <form
            onSubmit={onSubmitHandler}
            className="mx-auto mt-4 max-w-2xl sm:mt-5"
          >
            <div className="flex flex-col rounded-xl bg-white p-1.5 shadow-2xl sm:flex-row sm:rounded-full">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-lg bg-transparent px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:rounded-full sm:px-6 sm:py-3"
              />

              <button
                type="submit"
                className="mt-1 flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-slate-900 to-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-black hover:to-black hover:shadow-lg sm:mt-0 sm:rounded-full sm:px-7 sm:py-3"
              >
                <span>Subscribe</span>

                <FaPaperPlane className="text-xs sm:text-sm" />
              </button>
            </div>
          </form>

          {/* Trust Information */}
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-cyan-100 sm:mt-5 sm:text-xs">
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

          {/* Small Footer Text */}
          <p className="mt-2 text-[10px] text-cyan-200/80 sm:text-[11px]">
            Stay connected with our latest seafood arrivals and offers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetterBox;
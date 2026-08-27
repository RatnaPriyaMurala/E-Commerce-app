import React from "react";
import { Link } from "react-router-dom";
import hero_backgroundimage from "../assets/hero_backgroundimage.png";

const Hero = () => {
  return (
    <section className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950 via-sky-900 to-blue-950 text-white shadow-2xl">

      {/* Decorative Background */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative grid items-center lg:grid-cols-2">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="px-6 py-12 sm:px-10 md:px-14 lg:px-16 lg:py-20">

          {/* Badge */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg backdrop-blur-md transition duration-300 hover:bg-white/20">

            <span className="animate-pulse">
              🐟
            </span>

            <span>
              Fresh Seafood Delivered Daily
            </span>

          </div>


          {/* Heading */}

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-6xl">

            Fresh Fish

            <br />

            <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-teal-300 bg-clip-text text-transparent">

              Straight From

            </span>

            <br />

            Ocean To Your Home

          </h1>


          {/* Description */}

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">

            Premium quality seafood sourced directly from trusted fishermen.
            Cleaned hygienically, packed carefully and delivered fresh to your
            doorstep.

          </p>


          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/menu"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-7 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-900/30 transition-all duration-300 hover:-translate-y-1 hover:from-cyan-300 hover:to-teal-300 hover:shadow-xl hover:shadow-cyan-400/20 active:translate-y-0 sm:px-8 sm:py-4"
            >

              <span>
                Shop Now
              </span>

              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </Link>


            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-900 hover:shadow-xl active:translate-y-0 sm:px-8 sm:py-4"
            >
              Learn More
            </Link>

          </div>


          {/* =====================================================
              STATISTICS
          ===================================================== */}

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 sm:gap-6">

            {/* Fresh Quality */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:p-4">

              <h2 className="text-2xl font-bold sm:text-3xl">
                100%
              </h2>

              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Fresh Quality
              </p>

            </div>


            {/* Customers */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:p-4">

              <h2 className="text-2xl font-bold sm:text-3xl">
                500+
              </h2>

              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Happy Customers
              </p>

            </div>


            {/* Fresh Catch */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:p-4">

              <h2 className="text-2xl font-bold sm:text-3xl">
                Daily
              </h2>

              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Fresh Catch
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT IMAGE
        ===================================================== */}

        <div className="relative flex min-h-[320px] items-center justify-center px-6 pb-10 sm:min-h-[400px] sm:px-10 lg:min-h-[600px] lg:px-8 lg:pb-0">

          {/* Large Glow */}

          <div className="absolute h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl sm:h-96 sm:w-96" />

          {/* Secondary Glow */}

          <div className="absolute h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64" />


          {/* Image Container */}

          <div className="relative z-10 w-full max-w-xl">

            <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-2xl" />

            <img
              src={hero_backgroundimage}
              alt="Fresh seafood"
              className="relative z-10 mx-auto w-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-out hover:scale-105"
            />

          </div>


          {/* Floating Fresh Catch Badge */}

          <div className="absolute bottom-8 right-4 z-20 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:bottom-12 sm:right-10">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20">

                🐟

              </div>

              <div>

                <p className="text-xs text-cyan-200">
                  Today's
                </p>

                <p className="font-semibold">
                  Fresh Catch
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;
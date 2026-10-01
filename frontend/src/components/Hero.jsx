import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import hero_backgroundimage from "../assets/hero_backgroundimage.png";

const slides = [
  {
    id: 1,
    badge: "FRESH SEAFOOD DELIVERED DAILY",
    title: "Fresh Fish",
    highlight: "Straight From",
    ending: "Ocean To Your Home",
    description:
      "Premium quality seafood sourced from trusted fishermen. Cleaned hygienically, packed carefully and delivered fresh to your doorstep.",
    primaryText: "Shop Now",
    primaryLink: "/menu",
    secondaryText: "Learn More",
    secondaryLink: "/about",
    visualLabel: "Today's",
    visualTitle: "Fresh Catch",
  },
  {
    id: 2,
    badge: "FRESH CATCH",
    title: "Fresh Seafood",
    highlight: "For Every",
    ending: "Family Meal",
    description:
      "Explore fresh water fish, sea fish, prawns and crabs selected with care for your everyday seafood needs.",
    primaryText: "Explore Seafood",
    primaryLink: "/menu",
    secondaryText: "View Categories",
    secondaryLink: "/menu",
    visualLabel: "Fresh",
    visualTitle: "Every Day",
  },
  {
    id: 3,
    badge: "QUALITY YOU CAN TRUST",
    title: "Picked With Care,",
    highlight: "Prepared With",
    ending: "Quality",
    description:
      "From selection to preparation, we focus on freshness and careful handling so you get quality seafood at home.",
    primaryText: "Order Now",
    primaryLink: "/menu",
    secondaryText: "Why Choose Us",
    secondaryLink: "/about",
    visualLabel: "Quality",
    visualTitle: "Checked",
  },
  {
    id: 4,
    badge: "WEEKEND SPECIAL",
    title: "Make Your Weekend",
    highlight: "Extra",
    ending: "Delicious",
    description:
      "Bring home fresh seafood and enjoy a delicious meal with your family. Choose your favourite fish and seafood today.",
    primaryText: "Shop Seafood",
    primaryLink: "/menu",
    secondaryText: "Explore Menu",
    secondaryLink: "/menu",
    visualLabel: "Weekend",
    visualTitle: "Special",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const activeSlide = slides[currentSlide];

  // ============================================================
  // AUTO SLIDE
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // SLIDE CONTROLS
  // ============================================================

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // ============================================================
  // MOBILE SWIPE
  // ============================================================

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < 50) {
      return;
    }

    if (distance > 0) {
      nextSlide();
    } else {
      previousSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950 via-sky-900 to-blue-950 text-white shadow-xl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ======================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/5 blur-3xl" />

      {/* ======================================================
          SLIDE CONTENT
      ====================================================== */}

      <div
        key={activeSlide.id}
        className="relative grid min-h-[360px] items-center lg:grid-cols-2 lg:min-h-[430px]"
      >
        {/* ====================================================
            LEFT CONTENT
        ==================================================== */}

        <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-9 md:px-10 lg:px-11 lg:py-10">
          {/* Badge */}

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-cyan-100 shadow-md backdrop-blur-md sm:text-xs">
            <span className="animate-pulse">🐟</span>

            <span>{activeSlide.badge}</span>
          </div>

          {/* Heading */}

          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
            {activeSlide.title}

            <br />

            <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              {activeSlide.highlight}
            </span>

            <br />

            {activeSlide.ending}
          </h1>

          {/* Description */}

          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-200 sm:text-sm sm:leading-6">
            {activeSlide.description}
          </p>

          {/* Buttons */}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to={activeSlide.primaryLink}
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-900/30 transition-all duration-300 hover:-translate-y-1 hover:from-cyan-300 hover:to-teal-300 hover:shadow-lg hover:shadow-cyan-400/20 active:translate-y-0 sm:px-6 sm:py-3"
            >
              <span>{activeSlide.primaryText}</span>

              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to={activeSlide.secondaryLink}
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-900 hover:shadow-lg active:translate-y-0 sm:px-6 sm:py-3"
            >
              {activeSlide.secondaryText}
            </Link>
          </div>

          {/* Trust Stats */}

          <div className="mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-2.5">
              <h2 className="text-lg font-bold sm:text-xl">
                100%
              </h2>

              <p className="mt-0.5 text-[9px] text-slate-300 sm:text-[11px]">
                Fresh Quality
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-2.5">
              <h2 className="text-lg font-bold sm:text-xl">
                500+
              </h2>

              <p className="mt-0.5 text-[9px] text-slate-300 sm:text-[11px]">
                Happy Customers
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:p-2.5">
              <h2 className="text-lg font-bold sm:text-xl">
                Daily
              </h2>

              <p className="mt-0.5 text-[9px] text-slate-300 sm:text-[11px]">
                Fresh Catch
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            RIGHT VISUAL
        ==================================================== */}

        <div className="relative flex min-h-[180px] items-center justify-center px-5 pb-8 sm:min-h-[220px] sm:px-8 sm:pb-8 lg:min-h-[430px] lg:px-6 lg:pb-0">
          {/* Glow */}

          <div className="absolute h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

          <div className="absolute h-36 w-36 rounded-full bg-white/10 blur-3xl sm:h-48 sm:w-48" />

          {/* Image */}

          <div className="relative z-10 w-full max-w-[270px] sm:max-w-sm lg:max-w-md">
            <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-2xl" />

            <img
              src={hero_backgroundimage}
              alt="Fresh seafood"
              className="relative z-10 mx-auto w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>

          {/* Fresh Catch Card */}

          <div className="absolute bottom-5 right-3 z-20 rounded-xl border border-white/20 bg-white/10 px-2.5 py-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:bottom-7 sm:right-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/20">
                🐟
              </div>

              <div>
                <p className="text-[9px] text-cyan-200">
                  {activeSlide.visualLabel}
                </p>

                <p className="text-xs font-semibold sm:text-sm">
                  {activeSlide.visualTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          PREVIOUS BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-sm text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-4 sm:h-9 sm:w-9"
      >
        ←
      </button>

      {/* ======================================================
          NEXT BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-sm text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-4 sm:h-9 sm:w-9"
      >
        →
      </button>

      {/* ======================================================
          SLIDE INDICATORS
      ====================================================== */}

      <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-6 bg-white"
                : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
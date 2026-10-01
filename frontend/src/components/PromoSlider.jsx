import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hero_backgroundimage from "../assets/hero_backgroundimage.png";

/* ============================================================
   DECORATIVE SEAFOOD ILLUSTRATIONS
   These are built directly into the component.
   No extra image files are required.
============================================================ */

/* =========================
   FISH
========================= */

const FishIllustration = () => {
  return (
    <svg
      viewBox="0 0 520 360"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fishBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="45%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        <linearGradient id="fishFin" x1="0" x2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <filter id="fishShadow">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#001827"
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="265"
        cy="300"
        rx="170"
        ry="25"
        fill="#001827"
        opacity="0.22"
      />

      <g filter="url(#fishShadow)">
        {/* Tail */}
        <path
          d="M108 178
             C72 135 42 125 24 126
             C47 158 48 197 24 232
             C47 233 77 220 108 181
             Z"
          fill="url(#fishFin)"
        />

        {/* Main body */}
        <ellipse
          cx="280"
          cy="180"
          rx="175"
          ry="105"
          fill="url(#fishBody)"
        />

        {/* Top fin */}
        <path
          d="M245 84
             C258 44 303 34 338 42
             C321 65 312 87 307 103
             Z"
          fill="#0ea5e9"
        />

        {/* Bottom fin */}
        <path
          d="M254 269
             C276 310 320 319 348 310
             C329 286 316 266 309 249
             Z"
          fill="#0284c7"
        />

        {/* Side fin */}
        <path
          d="M325 178
             C377 187 404 212 413 237
             C369 230 338 212 314 194
             Z"
          fill="#7dd3fc"
          opacity="0.9"
        />

        {/* Body highlight */}
        <ellipse
          cx="238"
          cy="143"
          rx="80"
          ry="38"
          fill="#ffffff"
          opacity="0.16"
        />

        {/* Scales */}
        <g
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="3"
          opacity="0.35"
        >
          <path d="M175 150 Q190 165 205 150" />
          <path d="M205 145 Q220 160 235 145" />
          <path d="M235 140 Q250 155 265 140" />
          <path d="M265 138 Q280 153 295 138" />

          <path d="M185 177 Q200 192 215 177" />
          <path d="M215 172 Q230 187 245 172" />
          <path d="M245 168 Q260 183 275 168" />
          <path d="M275 166 Q290 181 305 166" />
        </g>

        {/* Eye */}
        <circle cx="390" cy="150" r="27" fill="#ffffff" />

        <circle cx="397" cy="150" r="13" fill="#0f172a" />

        <circle
          cx="402"
          cy="145"
          r="4"
          fill="#ffffff"
        />

        {/* Mouth */}
        <path
          d="M437 188 Q455 195 467 185"
          fill="none"
          stroke="#082f49"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Gill */}
        <path
          d="M357 195 Q370 217 393 222"
          fill="none"
          stroke="#075985"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>
    </svg>
  );
};


/* =========================
   PRAWN
========================= */

const PrawnIllustration = () => {
  return (
    <svg
      viewBox="0 0 520 360"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="prawnBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="40%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        <linearGradient id="prawnLight" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>

        <filter id="prawnShadow">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#431407"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="260"
        cy="305"
        rx="155"
        ry="20"
        fill="#431407"
        opacity="0.2"
      />

      <g filter="url(#prawnShadow)">
        {/* Curved prawn body */}
        <path
          d="
            M390 82
            C325 58 238 67 177 116
            C120 162 112 226 159 263
            C204 299 280 293 327 251
            C370 212 376 166 354 128
            C340 105 317 94 294 94
            C317 115 320 144 306 164
            C286 193 244 210 214 194
            C181 176 184 139 216 119
            C254 94 318 91 390 82
            Z
          "
          fill="url(#prawnBody)"
        />

        {/* Segment lines */}
        <g
          fill="none"
          stroke="#9a3412"
          strokeWidth="6"
          opacity="0.6"
        >
          <path d="M350 99 Q318 117 310 145" />
          <path d="M321 95 Q291 115 285 148" />
          <path d="M292 98 Q264 119 259 151" />
          <path d="M263 104 Q238 126 233 157" />
          <path d="M235 112 Q213 137 212 164" />
          <path d="M208 125 Q193 150 197 174" />
        </g>

        {/* Belly highlight */}
        <path
          d="
            M169 230
            C214 268 278 259 316 223
          "
          fill="none"
          stroke="url(#prawnLight)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Tail */}
        <path
          d="
            M158 261
            C126 276 98 279 70 268
            C88 250 107 234 137 222
            C129 245 138 257 158 261
            Z
          "
          fill="#f97316"
        />

        <path
          d="
            M155 258
            C125 283 112 298 111 315
            C135 305 159 290 176 267
            Z
          "
          fill="#fb923c"
        />

        {/* Antennae */}
        <path
          d="M387 84 C431 48 466 42 490 51"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          d="M390 92 C442 77 472 79 495 93"
          fill="none"
          stroke="#fdba74"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Eye */}
        <circle cx="385" cy="91" r="11" fill="#431407" />

        <circle
          cx="389"
          cy="87"
          r="3"
          fill="#ffffff"
        />

        {/* Small legs */}
        <g
          stroke="#c2410c"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <path d="M214 211 L194 246" />
          <path d="M240 215 L225 252" />
          <path d="M267 213 L258 251" />
          <path d="M293 202 L291 240" />
        </g>
      </g>
    </svg>
  );
};


/* =========================
   CRAB
========================= */

const CrabIllustration = () => {
  return (
    <svg
      viewBox="0 0 520 360"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crabBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <linearGradient id="crabClaw" x1="0" x2="1">
          <stop offset="0%" stopColor="#fecaca" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        <filter id="crabShadow">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#450a0a"
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="260"
        cy="306"
        rx="180"
        ry="22"
        fill="#450a0a"
        opacity="0.22"
      />

      <g filter="url(#crabShadow)">
        {/* Left claw */}
        <path
          d="
            M155 169
            C112 130 72 128 49 153
            C27 177 40 211 69 216
            C95 220 114 198 127 183
            C143 202 159 208 177 201
            Z
          "
          fill="url(#crabClaw)"
        />

        {/* Left claw opening */}
        <path
          d="M65 179 Q91 169 113 181"
          fill="none"
          stroke="#991b1b"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Right claw */}
        <path
          d="
            M365 169
            C408 130 448 128 471 153
            C493 177 480 211 451 216
            C425 220 406 198 393 183
            C377 202 361 208 343 201
            Z
          "
          fill="url(#crabClaw)"
        />

        {/* Right claw opening */}
        <path
          d="M455 179 Q429 169 407 181"
          fill="none"
          stroke="#991b1b"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Main shell */}
        <ellipse
          cx="260"
          cy="188"
          rx="145"
          ry="103"
          fill="url(#crabBody)"
        />

        {/* Shell highlight */}
        <ellipse
          cx="220"
          cy="151"
          rx="65"
          ry="34"
          fill="#ffffff"
          opacity="0.14"
        />

        {/* Shell detail */}
        <path
          d="M170 188 Q260 238 350 188"
          fill="none"
          stroke="#991b1b"
          strokeWidth="8"
          opacity="0.5"
        />

        {/* Eyes */}
        <path
          d="M196 111 L196 86"
          stroke="#991b1b"
          strokeWidth="9"
          strokeLinecap="round"
        />

        <path
          d="M324 111 L324 86"
          stroke="#991b1b"
          strokeWidth="9"
          strokeLinecap="round"
        />

        <circle
          cx="196"
          cy="80"
          r="18"
          fill="#fee2e2"
        />

        <circle
          cx="324"
          cy="80"
          r="18"
          fill="#fee2e2"
        />

        <circle
          cx="200"
          cy="80"
          r="9"
          fill="#450a0a"
        />

        <circle
          cx="328"
          cy="80"
          r="9"
          fill="#450a0a"
        />

        {/* Smile */}
        <path
          d="M235 207 Q260 226 285 207"
          fill="none"
          stroke="#7f1d1d"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Legs */}
        <g
          fill="none"
          stroke="#b91c1c"
          strokeWidth="8"
          strokeLinecap="round"
        >
          <path d="M151 225 L103 250 L82 278" />
          <path d="M175 244 L134 275 L120 302" />
          <path d="M205 256 L178 293 L175 315" />

          <path d="M369 225 L417 250 L438 278" />
          <path d="M345 244 L386 275 L400 302" />
          <path d="M315 256 L342 293 L345 315" />
        </g>

        {/* Small shell dots */}
        <g fill="#fee2e2" opacity="0.35">
          <circle cx="205" cy="178" r="7" />
          <circle cx="232" cy="193" r="5" />
          <circle cx="286" cy="170" r="6" />
          <circle cx="315" cy="193" r="5" />
        </g>
      </g>
    </svg>
  );
};


/* ============================================================
   SLIDES
============================================================ */

const slides = [
  {
    id: 1,
    type: "hero",

    badge: "FRESH SEAFOOD",

    title: "Fresh Fish",

    highlight: "Straight To Your Home",

    description:
      "Freshly selected seafood, carefully handled and delivered with quality you can trust.",

    buttonText: "Shop Fresh Seafood",

    buttonLink: "/menu",

    image: hero_backgroundimage,
  },

  {
    id: 2,
    type: "fish",

    badge: "FRESH FISH",

    title: "Fresh Fish",

    highlight: "Every Day",

    description:
      "Choose from fresh fish carefully selected for quality, freshness and great taste.",

    buttonText: "Explore Fish",

    buttonLink: "/menu",

    Illustration: FishIllustration,
  },

  {
    id: 3,
    type: "prawn",

    badge: "PREMIUM PRAWNS",

    title: "Fresh Prawns",

    highlight: "Perfect For Every Meal",

    description:
      "Fresh and carefully selected prawns, handled with care for delicious meals at home.",

    buttonText: "Shop Prawns",

    buttonLink: "/menu",

    Illustration: PrawnIllustration,
  },

  {
    id: 4,
    type: "crab",

    badge: "FRESH CRABS",

    title: "Fresh Crabs",

    highlight: "Delicious Seafood",

    description:
      "Quality fresh crabs selected for seafood lovers who want freshness and taste.",

    buttonText: "Shop Crabs",

    buttonLink: "/menu",

    Illustration: CrabIllustration,
  },
];


/* ============================================================
   PROMO SLIDER
============================================================ */

const PromoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ==========================================================
     AUTO SLIDE
  ========================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ==========================================================
     NEXT
  ========================================================== */

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  /* ==========================================================
     PREVIOUS
  ========================================================== */

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const slide = slides[currentSlide];

  return (
    <section
      aria-label="Promotional seafood slider"
      className="relative mx-auto w-full max-w-7xl"
    >
      {/* ======================================================
          SLIDER CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          h-[330px]
          w-full
          overflow-hidden
          rounded-2xl
          shadow-lg
          sm:h-[370px]
          lg:h-[420px]
        "
      >

        {/* ====================================================
            SLIDE 1 — REAL HERO BACKGROUND IMAGE
        ==================================================== */}

        {slide.type === "hero" && (
          <>
            <img
              src={slide.image}
              alt="Fresh seafood"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-[62%_center]
                sm:object-center
              "
            />

            {/* Dark overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-slate-950/90
                via-slate-900/60
                to-slate-900/15
              "
            />

            {/* Extra mobile overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-slate-950/45
                via-transparent
                to-transparent
                sm:hidden
              "
            />
          </>
        )}


        {/* ====================================================
            SLIDES 2–4 — COLORFUL BACKGROUND
        ==================================================== */}

        {slide.type !== "hero" && (
          <div
            className={`
              absolute
              inset-0

              ${
                slide.type === "fish"
                  ? "bg-gradient-to-br from-sky-950 via-cyan-800 to-blue-600"
                  : ""
              }

              ${
                slide.type === "prawn"
                  ? "bg-gradient-to-br from-orange-950 via-orange-700 to-amber-500"
                  : ""
              }

              ${
                slide.type === "crab"
                  ? "bg-gradient-to-br from-red-950 via-red-700 to-rose-500"
                  : ""
              }
            `}
          />
        )}


        {/* ====================================================
            DECORATIVE GLOW FOR SLIDES 2–4
        ==================================================== */}

        {slide.type !== "hero" && (
          <>
            <div
              className="
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-24
                -left-20
                h-64
                w-64
                rounded-full
                bg-white/10
                blur-3xl
              "
            />
          </>
        )}


        {/* ====================================================
            SEAFOOD ILLUSTRATION — SLIDES 2–4

            IMPORTANT:
            This is deliberately NOT hidden on mobile.

            Desktop:
            large visual on right.

            Mobile:
            smaller but still clearly visible on right.
        ==================================================== */}

        {slide.type !== "hero" && slide.Illustration && (
          <div
            className="
              pointer-events-none
              absolute
              right-[-35px]
              top-1/2
              z-[2]
              h-[220px]
              w-[300px]
              -translate-y-1/2
              opacity-90

              sm:right-[-20px]
              sm:h-[280px]
              sm:w-[380px]
              sm:opacity-95

              md:right-[-10px]
              md:h-[320px]
              md:w-[430px]

              lg:right-0
              lg:h-[350px]
              lg:w-[500px]
            "
          >
            <slide.Illustration />
          </div>
        )}


        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-full
            items-center
          "
        >
          <div
            className="
              w-full
              max-w-[600px]
              px-5
              sm:px-8
              lg:px-12
            "
          >

            {/* ==================================================
                BADGE
            ================================================== */}

            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-white/25
                bg-black/20
                px-3
                py-1.5
                text-[9px]
                font-bold
                tracking-wide
                text-white
                backdrop-blur-md
                sm:text-xs
              "
            >
              <span>🐟</span>

              <span className="ml-1.5">
                {slide.badge}
              </span>
            </div>


            {/* ==================================================
                TITLE
            ================================================== */}

            <h2
              className="
                mt-3
                max-w-[520px]
                text-3xl
                font-extrabold
                leading-[1.05]
                tracking-tight
                text-white
                sm:mt-4
                sm:text-4xl
                lg:text-5xl
              "
            >
              {slide.title}

              <span className="block text-cyan-200">
                {slide.highlight}
              </span>
            </h2>


            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <p
              className="
                mt-3
                max-w-[390px]
                text-xs
                leading-5
                text-white/90
                sm:mt-4
                sm:text-sm
                sm:leading-6
              "
            >
              {slide.description}
            </p>


            {/* ==================================================
                BUTTON
            ================================================== */}

            <Link
              to={slide.buttonLink}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-4
                py-2.5
                text-xs
                font-bold
                text-slate-900
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-cyan-100
                sm:mt-5
                sm:px-5
                sm:py-3
                sm:text-sm
              "
            >
              {slide.buttonText}

              <span className="text-base">
                →
              </span>
            </Link>

          </div>
        </div>


        {/* ====================================================
            PREVIOUS BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute
            left-3
            top-1/2
            z-30
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-black/30
            text-2xl
            leading-none
            text-white
            backdrop-blur-md
            transition
            hover:bg-black/50
            sm:flex
          "
        >
          ‹
        </button>


        {/* ====================================================
            NEXT BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute
            right-3
            top-1/2
            z-30
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-black/30
            text-2xl
            leading-none
            text-white
            backdrop-blur-md
            transition
            hover:bg-black/50
            sm:flex
          "
        >
          ›
        </button>


        {/* ====================================================
            SMALL ROUND DOTS

            NO TALL BARS.

            Mobile and desktop are both explicitly forced
            to 6px / 8px circles.
        ==================================================== */}

        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-40
            -translate-x-1/2
          "
        >
          <div
            className="
              flex
              h-[16px]
              items-center
              justify-center
              gap-[6px]
              rounded-full
              bg-black/20
              px-2
              backdrop-blur-sm
            "
          >
            {slides.map((item, index) => {
              const active = currentSlide === index;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={active ? "true" : undefined}
                  className="
                    m-0
                    block
                    !min-h-0
                    !min-w-0
                    !max-h-none
                    !max-w-none
                    !border-0
                    !p-0
                    !shadow-none
                    !outline-none
                    !ring-0
                    appearance-none
                    rounded-full
                    transition-all
                    duration-300
                  "
                  style={{
                    width: active ? "8px" : "6px",
                    height: active ? "8px" : "6px",
                    minWidth: active ? "8px" : "6px",
                    minHeight: active ? "8px" : "6px",
                    maxWidth: active ? "8px" : "6px",
                    maxHeight: active ? "8px" : "6px",
                    padding: 0,
                    margin: 0,
                    border: "none",
                    borderRadius: "50%",
                    display: "block",
                    flex: "0 0 auto",
                    backgroundColor: active
                      ? "#ffffff"
                      : "rgba(255,255,255,0.50)",
                  }}
                />
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PromoSlider;
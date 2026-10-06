import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

import {
  FaFish,
  FaTruck,
  FaLeaf,
  FaUsers,
  FaShieldAlt,
  FaAward,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="border-t">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="py-5 text-center sm:py-6">
        <Title
          text1="ABOUT"
          text2="BEZAWADA CUTS"
        />

        <p className="mx-auto mt-2.5 max-w-3xl text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
          At{" "}
          <span className="font-semibold text-teal-700">
            Bezawada Cuts
          </span>
          , we believe fresh seafood should reach your kitchen exactly
          the way it leaves the market—fresh, hygienic and full of
          natural flavor. We source premium quality fish, prawns and
          crabs directly from trusted fishermen and verified suppliers
          to deliver an unmatched seafood experience.
        </p>
      </section>

      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="mb-7 grid items-center gap-5 md:grid-cols-2 md:gap-7 sm:mb-9">

        {/* VIDEO */}

        <div>
          <video
            src={assets.live_videos}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* CONTENT */}

        <div>
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Fresh From Water To Your Plate
          </h2>

          <p className="mb-3 text-sm leading-6 text-gray-600">
            Every order is handled carefully to preserve freshness,
            cleanliness and taste. Our seafood is processed under
            hygienic conditions and packed professionally before
            dispatch.
          </p>

          <p className="mb-3 text-sm leading-6 text-gray-600">
            Whether you're preparing everyday family meals or special
            celebrations, Bezawada Cuts delivers premium seafood with
            convenience and confidence.
          </p>

          {/* MISSION */}

          <div className="rounded-lg border-l-4 border-teal-600 bg-teal-50 p-3.5">
            <h3 className="mb-1 text-lg font-bold">
              Our Mission
            </h3>

            <p className="text-sm leading-6 text-gray-700">
              To become the most trusted seafood delivery platform by
              delivering farm-fresh and ocean-fresh products with
              quality, honesty and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="mb-5 text-center sm:mb-6">
        <Title
          text1="WHY"
          text2="CHOOSE US"
        />

        <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
          We don't just sell seafood—we deliver freshness you can trust.
        </p>
      </section>

      {/* FEATURES */}

      <section className="mb-7 grid gap-3.5 sm:gap-4 md:grid-cols-3 sm:mb-9">

        {/* FRESH DAILY CATCH */}

        <div className="rounded-2xl bg-white p-4 text-center shadow-md transition hover:-translate-y-1">
          <FaFish className="mx-auto mb-3 text-4xl text-teal-600" />

          <h3 className="mb-1.5 text-lg font-bold">
            Fresh Daily Catch
          </h3>

          <p className="text-sm leading-6 text-gray-600">
            Fresh seafood sourced every day from trusted fishermen
            and verified suppliers.
          </p>
        </div>

        {/* QUALITY */}

        <div className="rounded-2xl bg-white p-4 text-center shadow-md transition hover:-translate-y-1">
          <FaShieldAlt className="mx-auto mb-3 text-4xl text-teal-600" />

          <h3 className="mb-1.5 text-lg font-bold">
            Quality Assured
          </h3>

          <p className="text-sm leading-6 text-gray-600">
            Every product undergoes strict quality inspection before
            it reaches your doorstep.
          </p>
        </div>

        {/* DELIVERY */}

        <div className="rounded-2xl bg-white p-4 text-center shadow-md transition hover:-translate-y-1">
          <FaTruck className="mx-auto mb-3 text-4xl text-teal-600" />

          <h3 className="mb-1.5 text-lg font-bold">
            Fast Delivery
          </h3>

          <p className="text-sm leading-6 text-gray-600">
            Carefully packed and delivered quickly to preserve
            freshness and taste.
          </p>
        </div>
      </section>

      {/* =====================================================
          OUR CORE VALUES
      ===================================================== */}

      <section className="mb-7 rounded-2xl bg-gray-50 p-5 sm:mb-9 sm:p-6">

        <h2 className="mb-5 text-center text-2xl font-bold sm:text-3xl">
          Our Core Values
        </h2>

        <div className="grid gap-5 md:grid-cols-3 sm:gap-6">

          {/* SUSTAINABILITY */}

          <div className="text-center">
            <FaLeaf className="mx-auto mb-2.5 text-3xl text-green-600" />

            <h4 className="mb-1 font-semibold">
              Sustainability
            </h4>

            <p className="text-sm leading-6 text-gray-600">
              Responsible sourcing practices that support healthy
              marine ecosystems.
            </p>
          </div>

          {/* PREMIUM QUALITY */}

          <div className="text-center">
            <FaAward className="mx-auto mb-2.5 text-3xl text-yellow-500" />

            <h4 className="mb-1 font-semibold">
              Premium Quality
            </h4>

            <p className="text-sm leading-6 text-gray-600">
              We never compromise on freshness, hygiene or customer
              satisfaction.
            </p>
          </div>

          {/* CUSTOMER FIRST */}

          <div className="text-center">
            <FaUsers className="mx-auto mb-2.5 text-3xl text-blue-600" />

            <h4 className="mb-1 font-semibold">
              Customer First
            </h4>

            <p className="text-sm leading-6 text-gray-600">
              Every decision we make is focused on providing the best
              shopping experience.
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <NewsLetterBox />

    </div>
  );
};

export default About;
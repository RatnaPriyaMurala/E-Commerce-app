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

      <section className="py-7 sm:py-8 text-center">
        <Title
          text1="ABOUT"
          text2="BEZAWADA CUTS"
        />

        <p className="max-w-3xl mx-auto mt-3 text-xs sm:text-sm text-gray-600 leading-6">
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

      <section className="grid md:grid-cols-2 gap-7 md:gap-9 items-center mb-10 sm:mb-12">

        {/* VIDEO */}

        <div>
          <video
            src={assets.live_videos}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="rounded-2xl shadow-lg w-full"
          />
        </div>

        {/* CONTENT */}

        <div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Fresh From Water To Your Plate
          </h2>

          <p className="text-sm text-gray-600 leading-6 mb-4">
            Every order is handled carefully to preserve freshness,
            cleanliness and taste. Our seafood is processed under
            hygienic conditions and packed professionally before
            dispatch.
          </p>

          <p className="text-sm text-gray-600 leading-6 mb-4">
            Whether you're preparing everyday family meals or special
            celebrations, Bezawada Cuts delivers premium seafood with
            convenience and confidence.
          </p>

          {/* MISSION */}

          <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-lg">

            <h3 className="font-bold text-lg mb-1.5">
              Our Mission
            </h3>

            <p className="text-sm text-gray-700 leading-6">
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

      <section className="text-center mb-6 sm:mb-7">

        <Title
          text1="WHY"
          text2="CHOOSE US"
        />

        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          We don't just sell seafood—we deliver freshness you can trust.
        </p>

      </section>

      {/* FEATURES */}

      <section className="grid md:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-12">

        {/* FRESH DAILY CATCH */}

        <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:-translate-y-1 transition">

          <FaFish className="text-4xl text-teal-600 mx-auto mb-4" />

          <h3 className="font-bold text-lg mb-2">
            Fresh Daily Catch
          </h3>

          <p className="text-sm text-gray-600 leading-6">
            Fresh seafood sourced every day from trusted fishermen
            and verified suppliers.
          </p>

        </div>

        {/* QUALITY */}

        <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:-translate-y-1 transition">

          <FaShieldAlt className="text-4xl text-teal-600 mx-auto mb-4" />

          <h3 className="font-bold text-lg mb-2">
            Quality Assured
          </h3>

          <p className="text-sm text-gray-600 leading-6">
            Every product undergoes strict quality inspection before
            it reaches your doorstep.
          </p>

        </div>

        {/* DELIVERY */}

        <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:-translate-y-1 transition">

          <FaTruck className="text-4xl text-teal-600 mx-auto mb-4" />

          <h3 className="font-bold text-lg mb-2">
            Fast Delivery
          </h3>

          <p className="text-sm text-gray-600 leading-6">
            Carefully packed and delivered quickly to preserve
            freshness and taste.
          </p>

        </div>

      </section>

      {/* =====================================================
          OUR CORE VALUES
      ===================================================== */}

      <section className="bg-gray-50 rounded-2xl p-6 sm:p-7 mb-10 sm:mb-12">

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-7">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-7">

          {/* SUSTAINABILITY */}

          <div className="text-center">

            <FaLeaf className="text-3xl text-green-600 mx-auto mb-3" />

            <h4 className="font-semibold mb-1.5">
              Sustainability
            </h4>

            <p className="text-sm text-gray-600 leading-6">
              Responsible sourcing practices that support healthy
              marine ecosystems.
            </p>

          </div>

          {/* PREMIUM QUALITY */}

          <div className="text-center">

            <FaAward className="text-3xl text-yellow-500 mx-auto mb-3" />

            <h4 className="font-semibold mb-1.5">
              Premium Quality
            </h4>

            <p className="text-sm text-gray-600 leading-6">
              We never compromise on freshness, hygiene or customer
              satisfaction.
            </p>

          </div>

          {/* CUSTOMER FIRST */}

          <div className="text-center">

            <FaUsers className="text-3xl text-blue-600 mx-auto mb-3" />

            <h4 className="font-semibold mb-1.5">
              Customer First
            </h4>

            <p className="text-sm text-gray-600 leading-6">
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
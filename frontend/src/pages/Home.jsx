import React from "react";

import Hero from "../components/Hero";
import LatestAdded from "../components/LatestAdded";
import BestSeller from "../components/BestSeller";
import OurSpecialItems from "../components/OurSpecialItems";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";

const Home = () => {
  return (
    <main className="overflow-hidden bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <Hero />

      {/* =====================================================
          LATEST PRODUCTS
      ===================================================== */}

      <section
        aria-labelledby="latest-products"
        className="bg-white py-12 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LatestAdded />
        </div>
      </section>

      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      <section
        aria-labelledby="best-sellers"
        className="bg-gray-50 py-12 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BestSeller />
        </div>
      </section>

      {/* =====================================================
          OUR SPECIAL ITEMS
      ===================================================== */}

      <section
        aria-labelledby="special-items"
        className="bg-white py-12 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OurSpecialItems />
        </div>
      </section>

      {/* =====================================================
          WHY CUSTOMERS CHOOSE US
      ===================================================== */}

      <section
        aria-labelledby="our-policy"
        className="bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OurPolicy />
        </div>
      </section>

      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <section
        aria-labelledby="newsletter"
        className="bg-cyan-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsLetterBox />
        </div>
      </section>

    </main>
  );
};

export default Home;
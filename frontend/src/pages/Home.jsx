import React from "react";

import PromoSlider from "../components/PromoSlider";
import LatestAdded from "../components/LatestAdded";
import BestSeller from "../components/BestSeller";
import OurSpecialItems from "../components/OurSpecialItems";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";

const Home = () => {
  return (
    <main className="overflow-hidden bg-white">

      {/* =====================================================
          PROMOTIONAL SLIDER
          
          Replaces the old large Hero.
          The first slide uses the existing hero image.
      ===================================================== */}

      <PromoSlider />

      {/* =====================================================
          LATEST PRODUCTS
      ===================================================== */}

      <section
        aria-labelledby="latest-products"
        className="bg-white py-8 sm:py-10 lg:py-12"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <LatestAdded />
        </div>
      </section>

      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      <section
        aria-labelledby="best-sellers"
        className="bg-gray-50 py-8 sm:py-10 lg:py-12"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <BestSeller />
        </div>
      </section>

      {/* =====================================================
          OUR SPECIAL ITEMS
      ===================================================== */}

      <section
        aria-labelledby="special-items"
        className="bg-white py-8 sm:py-10 lg:py-12"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <NewsLetterBox />
        </div>
      </section>

    </main>
  );
};

export default Home;

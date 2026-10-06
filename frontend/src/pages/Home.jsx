
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
          ===================================================== */}

      <section
        aria-label="Fresh seafood promotional slider"
        className="pt-2 sm:pt-3 lg:pt-4"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <PromoSlider />
        </div>
      </section>


      {/* =====================================================
          LATEST PRODUCTS
          ===================================================== */}

      <section
        aria-labelledby="latest-products"
        className="bg-white py-5 sm:py-6 lg:py-7"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <LatestAdded />
        </div>
      </section>


      {/* =====================================================
          BEST SELLERS
          ===================================================== */}

      <section
        aria-labelledby="best-sellers"
        className="bg-gray-50 py-5 sm:py-6 lg:py-7"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <BestSeller />
        </div>
      </section>


      {/* =====================================================
          OUR SPECIAL ITEMS
          ===================================================== */}

      <section
        aria-labelledby="special-items"
        className="bg-white py-5 sm:py-6 lg:py-7"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <OurSpecialItems />
        </div>
      </section>


      {/* =====================================================
          WHY CUSTOMERS CHOOSE US
          ===================================================== */}

      <section
        aria-labelledby="our-policy"
        className="bg-gradient-to-b from-slate-50 to-white py-3 sm:py-4 lg:py-5"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <OurPolicy />
        </div>
      </section>


      {/* =====================================================
          NEWSLETTER
          ===================================================== */}

      <section
        aria-labelledby="newsletter"
        className="bg-cyan-50 py-3 sm:py-4 lg:py-5"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <NewsLetterBox />
        </div>
      </section>

    </main>
  );
};

export default Home;
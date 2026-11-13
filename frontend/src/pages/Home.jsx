
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

      {/* PROMOTIONAL BANNER */}
      <section className="pt-2 sm:pt-3 lg:pt-4">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <PromoSlider />
        </div>
      </section>

      {/* 1. OUR SIGNATURE SEAFOOD */}
      <section className="bg-white py-5 sm:py-6 lg:py-7">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <OurSpecialItems />
        </div>
      </section>

      {/* 2. LATEST ADDED */}
      <section className="bg-white py-5 sm:py-6 lg:py-7">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <LatestAdded />
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="bg-gray-50 py-5 sm:py-6 lg:py-7">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <BestSeller />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-3 sm:py-4 lg:py-5">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <OurPolicy />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-cyan-50 py-3 sm:py-4 lg:py-5">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <NewsLetterBox />
        </div>
      </section>

    </main>
  );
};

export default Home;

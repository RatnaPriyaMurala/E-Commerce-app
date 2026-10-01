import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBriefcase,
  FaArrowRight,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="border-t">
      <section className="py-8 sm:py-10">
        <div className="text-center mb-7">
          <Title text1="CONTACT" text2="US" />

          <p className="max-w-2xl mx-auto mt-2 text-xs sm:text-sm text-gray-500 leading-5 sm:leading-6">
            Have a question about our seafood, delivery or services?
            We would love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7 items-start">
          <div>
            <img
              src={assets.contact_us}
              alt="Contact us"
              className="w-full rounded-2xl shadow-md object-cover"
            />
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Store Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-cyan-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Address
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 leading-5">
                      Sri Lakshmi Narasimha Live Fish and Sea Foods,
                      Moula Ali / ECIL, Hyderabad, Telangana.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                    <FaPhoneAlt className="text-cyan-600 text-sm" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Phone
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Contact us for orders and enquiries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-cyan-600 text-sm" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Email
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      We are happy to assist with your questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <FaBriefcase className="text-cyan-600" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Careers
                  </h2>

                  <p className="mt-2 text-sm text-gray-600 leading-6">
                    Interested in working with us? Explore available
                    opportunities and become part of our growing team.
                  </p>

                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    Explore Jobs
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NewsLetterBox />
      </section>
    </div>
  );
};

export default Contact;
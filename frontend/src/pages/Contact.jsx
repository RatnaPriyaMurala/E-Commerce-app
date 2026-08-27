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
    <div className="bg-gradient-to-b from-slate-50 via-white to-cyan-50">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <Title text1={"CONTACT"} text2={"US"} />

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out anytime and we'll happily
            answer your questions.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Contact Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={assets.contact_us}
              alt="Contact Bezawada Cuts"
              className="w-full h-full object-cover hover:scale-105 duration-500"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">

            {/* Store Information */}
            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Visit Our Store
              </h2>

              <div className="space-y-6">

                {/* Address */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-cyan-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Address
                    </h3>

                    <p className="text-gray-500">
                      2343-4 Jagathgiri Gutta
                      <br />
                      Kukatpally,
                      <br />
                      Medchal-Malkajgiri,
                      <br />
                      Telangana, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <FaPhoneAlt className="text-green-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Phone
                    </h3>

                    <p className="text-gray-500">
                      +91 9954833369
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-orange-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Email
                    </h3>

                    <p className="text-gray-500">
                      priyalivefish@gmail.com
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Careers */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl">

              <div className="flex items-center gap-4 mb-4">
                <FaBriefcase className="text-2xl" />

                <h3 className="text-2xl font-bold">
                  Careers
                </h3>
              </div>

              <p className="text-cyan-100 leading-7">
                Join our growing seafood family and build your career with us.
                We are always looking for passionate people.
              </p>

              <button
                type="button"
                className="mt-6 bg-white text-cyan-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 duration-300 flex items-center gap-3"
              >
                Explore Jobs
                <FaArrowRight />
              </button>

            </div>

          </div>
        </div>
      </div>

      <NewsLetterBox />

    </div>
  );
};

export default Contact;
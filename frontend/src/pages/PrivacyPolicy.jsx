import React from "react";
import {
  FaShieldAlt,
  FaUserShield,
  FaLock,
  FaDatabase,
  FaPhoneAlt,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-7 sm:py-9 px-3 sm:px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-7 sm:mb-9">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 flex items-center justify-center shadow-lg">
            <FaShieldAlt className="text-white text-3xl sm:text-4xl" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mt-4 sm:mt-5">
            Privacy Policy
          </h1>

          <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-5">
            Your privacy and personal information are important to us.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">

          {/* Information Collection */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaUserShield className="text-2xl sm:text-3xl text-teal-600 shrink-0" />

              <h2 className="text-xl sm:text-2xl font-bold">
                Information We Collect
              </h2>
            </div>

            <p className="text-gray-600 text-sm leading-6">
              We collect only the information necessary to process your
              seafood orders, deliver products, provide customer support,
              and improve your shopping experience. This may include your
              name, email address, phone number, delivery address, and
              payment-related information.
            </p>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaLock className="text-2xl sm:text-3xl text-green-600 shrink-0" />

              <h2 className="text-xl sm:text-2xl font-bold">
                Data Security
              </h2>
            </div>

            <p className="text-gray-600 text-sm leading-6">
              We use secure technologies and encryption to protect your
              personal information. Access to your data is limited only
              to authorized personnel responsible for processing your
              orders and customer support.
            </p>
          </div>

          {/* Data Usage */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaDatabase className="text-2xl sm:text-3xl text-blue-600 shrink-0" />

              <h2 className="text-xl sm:text-2xl font-bold">
                How We Use Your Data
              </h2>
            </div>

            <ul className="list-disc ml-6 sm:ml-8 text-gray-600 text-sm space-y-2">
              <li>Process and deliver seafood orders.</li>
              <li>Provide order status updates.</li>
              <li>Improve our website and services.</li>
              <li>Respond to customer queries.</li>
              <li>Maintain transaction records where required by law.</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl shadow-md p-5 sm:p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FaPhoneAlt className="text-2xl sm:text-3xl shrink-0" />

              <h2 className="text-xl sm:text-2xl font-bold">
                Contact Us
              </h2>
            </div>

            <p className="text-sm leading-6">
              If you have any questions regarding this Privacy Policy,
              please contact us through our Contact page or email our
              customer support team.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
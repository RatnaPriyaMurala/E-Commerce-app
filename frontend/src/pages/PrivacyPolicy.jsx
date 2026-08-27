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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="text-center mb-12">

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-700 flex items-center justify-center shadow-xl">

            <FaShieldAlt className="text-white text-5xl" />

          </div>

          <h1 className="text-5xl font-bold text-gray-800 mt-8">
            Privacy Policy
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Your privacy and personal information are important to us.
          </p>

        </div>

        <div className="space-y-8">

          {/* Information Collection */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaUserShield className="text-3xl text-teal-600" />

              <h2 className="text-2xl font-bold">
                Information We Collect
              </h2>

            </div>

            <p className="text-gray-600 leading-8">
              We collect only the information necessary to process your
              seafood orders, deliver products, provide customer support,
              and improve your shopping experience. This may include your
              name, email address, phone number, delivery address, and
              payment-related information.
            </p>

          </div>

          {/* Data Security */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaLock className="text-3xl text-green-600" />

              <h2 className="text-2xl font-bold">
                Data Security
              </h2>

            </div>

            <p className="text-gray-600 leading-8">
              We use secure technologies and encryption to protect your
              personal information. Access to your data is limited only
              to authorized personnel responsible for processing your
              orders and customer support.
            </p>

          </div>

          {/* Data Usage */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaDatabase className="text-3xl text-blue-600" />

              <h2 className="text-2xl font-bold">
                How We Use Your Data
              </h2>

            </div>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>Process and deliver seafood orders.</li>

              <li>Provide order status updates.</li>

              <li>Improve our website and services.</li>

              <li>Respond to customer queries.</li>

              <li>Maintain transaction records where required by law.</li>

            </ul>

          </div>

          {/* Contact */}

          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-3xl shadow-xl p-8 text-white">

            <div className="flex items-center gap-4 mb-5">

              <FaPhoneAlt className="text-3xl" />

              <h2 className="text-2xl font-bold">
                Contact Us
              </h2>

            </div>

            <p className="leading-8">
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
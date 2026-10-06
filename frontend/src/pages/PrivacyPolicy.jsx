
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 px-3 py-7 sm:px-5 sm:py-9">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 text-center sm:mb-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 shadow-lg sm:h-20 sm:w-20">
            <FaShieldAlt className="text-3xl text-white sm:text-4xl" />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-800 sm:mt-5 sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
            Your privacy and personal information are important to us.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <FaUserShield className="shrink-0 text-2xl text-teal-600 sm:text-3xl" />
              <h2 className="text-xl font-bold sm:text-2xl">
                Information We Collect
              </h2>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              We collect only the information necessary to process your
              seafood orders, deliver products, provide customer support,
              and improve your shopping experience. This may include your
              name, email address, phone number, delivery address, and
              payment-related information.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <FaLock className="shrink-0 text-2xl text-green-600 sm:text-3xl" />
              <h2 className="text-xl font-bold sm:text-2xl">
                Data Security
              </h2>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              We use secure technologies and encryption to protect your
              personal information. Access to your data is limited only
              to authorized personnel responsible for processing your
              orders and customer support.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <FaDatabase className="shrink-0 text-2xl text-blue-600 sm:text-3xl" />
              <h2 className="text-xl font-bold sm:text-2xl">
                How We Use Your Data
              </h2>
            </div>

            <ul className="ml-6 list-disc space-y-2 text-sm text-gray-600 sm:ml-8">
              <li>Process and deliver seafood orders.</li>
              <li>Provide order status updates.</li>
              <li>Improve our website and services.</li>
              <li>Respond to customer queries.</li>
              <li>Maintain transaction records where required by law.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 p-5 text-white shadow-md sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <FaPhoneAlt className="shrink-0 text-2xl sm:text-3xl" />
              <h2 className="text-xl font-bold sm:text-2xl">
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

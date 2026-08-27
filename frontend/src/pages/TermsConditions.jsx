import React from "react";
import {
  FaFileContract,
  FaUser,
  FaShoppingCart,
  FaFish,
  FaMoneyBillWave,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaExclamationTriangle,
  FaBan,
  FaBalanceScale,
  FaLock,
  FaGavel,
} from "react-icons/fa";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="text-center mb-12">

          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-700 flex items-center justify-center shadow-xl">

            <FaFileContract className="text-white text-5xl" />

          </div>

          <h1 className="text-5xl font-bold text-gray-800 mt-8">
            Terms & Conditions
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Please read these terms carefully before using our website
            or placing an order.
          </p>

          <p className="text-sm text-gray-400 mt-3">
            Last Updated: August 2026
          </p>

        </div>

        <div className="space-y-8">

          {/* Introduction */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaFileContract className="text-3xl text-teal-600" />

              <h2 className="text-2xl font-bold">
                1. Introduction
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              These Terms & Conditions govern your use of the Bezawada Cuts
              website, mobile applications, services and seafood ordering
              platform. By accessing our website, creating an account or
              placing an order, you acknowledge that you have read,
              understood and agreed to these Terms & Conditions.

            </p>

          </div>

          {/* Eligibility */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaUser className="text-3xl text-blue-600" />

              <h2 className="text-2xl font-bold">
                2. Customer Eligibility & Account
              </h2>

            </div>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                You must provide accurate and complete information when
                creating an account.
              </li>

              <li>
                You are responsible for maintaining the confidentiality
                of your login credentials.
              </li>

              <li>
                You are responsible for activities performed through
                your account.
              </li>

              <li>
                You must immediately notify us if you suspect unauthorized
                access to your account.
              </li>

              <li>
                We reserve the right to suspend or terminate accounts
                involved in fraudulent, abusive or unlawful activities.
              </li>

            </ul>

          </div>

          {/* Product Information */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaFish className="text-3xl text-teal-600" />

              <h2 className="text-2xl font-bold">
                3. Seafood Products & Product Information
              </h2>

            </div>

            <p className="text-gray-600 leading-8 mb-5">

              We make reasonable efforts to ensure that product descriptions,
              images, prices and availability displayed on the website are
              accurate. However, seafood is a natural and perishable product
              and certain characteristics may vary.

            </p>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                The size, colour, shape and appearance of seafood may vary
                depending on the day's catch.
              </li>

              <li>
                Product images are for representation purposes and may not
                exactly match the delivered product.
              </li>

              <li>
                Natural seafood may contain bones, shells, scales or other
                naturally occurring parts depending on the product.
              </li>

              <li>
                Product availability may change without prior notice.
              </li>

              <li>
                We may substitute or cancel a product when it becomes
                unavailable, subject to applicable refund or customer
                communication.
              </li>

            </ul>

          </div>

          {/* Weight Variation */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaFish className="text-3xl text-cyan-600" />

              <h2 className="text-2xl font-bold">
                4. Weight & Quantity Variation
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              Seafood is naturally variable in size and weight. The actual
              weight of cleaned, cut, peeled or processed seafood may differ
              slightly from the estimated quantity displayed at the time of
              ordering. Where applicable, the final price may be calculated
              based on the actual weight supplied. Any material difference
              that affects the amount payable will be communicated or
              adjusted according to our applicable ordering process.

            </p>

          </div>

          {/* Orders */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaShoppingCart className="text-3xl text-teal-600" />

              <h2 className="text-2xl font-bold">
                5. Orders & Order Confirmation
              </h2>

            </div>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                Adding a product to the cart does not guarantee its
                availability.
              </li>

              <li>
                An order is considered accepted only after successful
                confirmation by Bezawada Cuts.
              </li>

              <li>
                We reserve the right to reject or cancel an order due to
                product unavailability, incorrect pricing, delivery
                limitations, payment issues or suspected fraudulent activity.
              </li>

              <li>
                If an order is cancelled by us after payment, the eligible
                amount will be refunded according to the applicable refund
                process.
              </li>

            </ul>

          </div>

          {/* Pricing */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaMoneyBillWave className="text-3xl text-green-600" />

              <h2 className="text-2xl font-bold">
                6. Pricing & Taxes
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              Product prices displayed on the website may change from time
              to time. Applicable taxes, delivery charges, processing charges
              or other fees, if any, will be displayed during the ordering or
              checkout process. We reserve the right to correct accidental
              pricing or display errors.

            </p>

          </div>

          {/* Payments */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaMoneyBillWave className="text-3xl text-green-600" />

              <h2 className="text-2xl font-bold">
                7. Payments
              </h2>

            </div>

            <p className="text-gray-600 leading-8 mb-5">

              We may provide payment options such as online payments and
              Cash on Delivery, depending on availability for your location
              and order.

            </p>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                Online payments are processed through authorized third-party
                payment gateways.
              </li>

              <li>
                We do not intentionally store complete debit or credit card
                details on our servers.
              </li>

              <li>
                Payment transactions may be subject to the terms and privacy
                policies of the relevant payment provider.
              </li>

              <li>
                COD orders may be subject to verification before dispatch.
              </li>

            </ul>

          </div>

          {/* Delivery */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaTruck className="text-3xl text-cyan-600" />

              <h2 className="text-2xl font-bold">
                8. Delivery
              </h2>

            </div>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                Delivery is available only in locations covered by our
                delivery service.
              </li>

              <li>
                Estimated delivery times are provided for guidance and may
                vary because of traffic, weather, demand, product availability
                or other circumstances.
              </li>

              <li>
                Customers must provide a complete and accurate delivery
                address and contact number.
              </li>

              <li>
                The customer or an authorized person should be available to
                receive the order.
              </li>

              <li>
                We may contact you by phone or other available communication
                methods regarding delivery.
              </li>

            </ul>

          </div>

          {/* Perishable Food */}

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-xl p-8 text-white">

            <div className="flex items-center gap-4 mb-5">

              <FaExclamationTriangle className="text-3xl" />

              <h2 className="text-2xl font-bold">
                9. Perishable & Food Safety
              </h2>

            </div>

            <p className="leading-8">

              Seafood is a perishable food product. Customers should
              refrigerate or appropriately store the products immediately
              after delivery and follow safe food-handling practices.
              Customers should not consume seafood that has been improperly
              stored after delivery. We are not responsible for deterioration
              caused by improper storage, handling or delay after successful
              delivery.

            </p>

          </div>

          {/* Cancellation */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaUndo className="text-3xl text-red-500" />

              <h2 className="text-2xl font-bold">
                10. Order Cancellation
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              Cancellation availability depends on the status of the order.
              Because seafood is a fresh and perishable product, cancellation
              may not be possible after preparation or dispatch has started.
              Any cancellation request will be handled according to the
              cancellation options available on the website or communicated
              by our customer support team.

            </p>

          </div>

          {/* Returns Refunds */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaUndo className="text-3xl text-green-600" />

              <h2 className="text-2xl font-bold">
                11. Returns, Refunds & Complaints
              </h2>

            </div>

            <p className="text-gray-600 leading-8 mb-5">

              Due to the perishable nature of seafood, ordinary product
              returns may not be accepted after delivery. However, customers
              may be eligible for a refund, replacement or other appropriate
              resolution where the delivered product is damaged, spoiled,
              substantially incorrect or otherwise covered by our refund
              policy.

            </p>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                Report product issues to customer support as soon as possible
                after delivery.
              </li>

              <li>
                Provide the order ID and relevant details when submitting
                a complaint.
              </li>

              <li>
                We may request photographs or other reasonable evidence to
                evaluate the complaint.
              </li>

              <li>
                Refunds, where approved, will be processed according to the
                applicable refund policy and payment method.
              </li>

            </ul>

          </div>

          {/* Customer Responsibilities */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaShieldAlt className="text-3xl text-blue-600" />

              <h2 className="text-2xl font-bold">
                12. Customer Responsibilities
              </h2>

            </div>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                Provide correct personal, contact and delivery information.
              </li>

              <li>
                Keep account information and passwords secure.
              </li>

              <li>
                Be available to receive the order.
              </li>

              <li>
                Inspect the seafood packaging and products promptly after
                delivery.
              </li>

              <li>
                Follow appropriate food storage and handling practices.
              </li>

              <li>
                Do not use the website for fraudulent, unlawful or abusive
                activities.
              </li>

            </ul>

          </div>

          {/* Prohibited Activities */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaBan className="text-3xl text-red-600" />

              <h2 className="text-2xl font-bold">
                13. Prohibited Activities
              </h2>

            </div>

            <p className="text-gray-600 leading-8 mb-5">
              You agree not to:
            </p>

            <ul className="list-disc ml-8 text-gray-600 space-y-3">

              <li>
                Use the website for any unlawful purpose.
              </li>

              <li>
                Attempt to gain unauthorized access to our systems.
              </li>

              <li>
                Submit false or misleading information.
              </li>

              <li>
                Use another person's account without authorization.
              </li>

              <li>
                Interfere with the website's operation or security.
              </li>

              <li>
                Use automated systems to abuse, scrape or overload the
                website without authorization.
              </li>

            </ul>

          </div>

          {/* Privacy */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaLock className="text-3xl text-teal-600" />

              <h2 className="text-2xl font-bold">
                14. Privacy & Personal Information
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              Your use of our website is also governed by our Privacy Policy.
              We may collect and process information such as your name,
              contact details, delivery address, order information and payment
              transaction details as necessary to provide our services,
              process orders, communicate with you and meet legal obligations.

            </p>

          </div>

          {/* Intellectual Property */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaShieldAlt className="text-3xl text-purple-600" />

              <h2 className="text-2xl font-bold">
                15. Intellectual Property
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              Unless otherwise stated, the website design, logo, branding,
              text, graphics, images, software and other content provided by
              Bezawada Cuts are owned by or licensed to us. You may not copy,
              reproduce, modify, distribute or commercially exploit such
              content without prior written permission.

            </p>

          </div>

          {/* Liability */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaBalanceScale className="text-3xl text-orange-600" />

              <h2 className="text-2xl font-bold">
                16. Limitation of Liability
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              To the extent permitted by applicable law, Bezawada Cuts will
              not be responsible for losses arising from circumstances beyond
              our reasonable control, including delivery disruptions, natural
              disasters, severe weather, technical failures, third-party
              service interruptions or incorrect information provided by the
              customer.

            </p>

          </div>

          {/* Force Majeure */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaExclamationTriangle className="text-3xl text-yellow-600" />

              <h2 className="text-2xl font-bold">
                17. Events Beyond Our Control
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              We will not be considered in breach of these Terms where
              performance is delayed or prevented by events beyond our
              reasonable control, including natural disasters, extreme
              weather, government restrictions, transportation disruptions,
              strikes, technical failures or other unforeseen circumstances.

            </p>

          </div>

          {/* Changes */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaFileContract className="text-3xl text-cyan-600" />

              <h2 className="text-2xl font-bold">
                18. Changes to These Terms
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              We may update these Terms & Conditions from time to time to
              reflect changes in our services, business practices or legal
              requirements. Updated terms will be published on this page.
              Your continued use of the website after an update constitutes
              acceptance of the revised terms, subject to applicable law.

            </p>

          </div>

          {/* Governing Law */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center gap-4 mb-5">

              <FaGavel className="text-3xl text-indigo-600" />

              <h2 className="text-2xl font-bold">
                19. Governing Law & Disputes
              </h2>

            </div>

            <p className="text-gray-600 leading-8">

              These Terms & Conditions shall be governed by the applicable
              laws of India. Any disputes arising from the use of our
              website or services shall be handled in accordance with
              applicable Indian laws and the jurisdiction of the appropriate
              courts.

            </p>

          </div>

          {/* Contact */}

          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-3xl shadow-xl p-8 text-white">

            <div className="flex items-center gap-4 mb-5">

              <FaFileContract className="text-3xl" />

              <h2 className="text-2xl font-bold">
                20. Contact Us
              </h2>

            </div>

            <p className="leading-8">

              If you have questions about these Terms & Conditions, your
              order, cancellation, delivery or refund, please contact
              Bezawada Cuts through the contact details provided on our
              Contact page.

            </p>

          </div>

          {/* Final Agreement */}

          <div className="text-center bg-gray-900 rounded-3xl p-8 text-white">

            <FaFileContract className="text-4xl mx-auto mb-4 text-cyan-400" />

            <h2 className="text-2xl font-bold mb-3">
              Your Agreement
            </h2>

            <p className="text-gray-300 leading-7">

              By creating an account, browsing our website or placing an
              order, you confirm that you have read and agree to these
              Terms & Conditions.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default TermsConditions;
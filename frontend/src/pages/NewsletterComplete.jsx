import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaFish, FaCheckCircle } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NewsletterComplete = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "Your confirmation link is missing or invalid. Please subscribe again."
      );
      return;
    }

    if (!name.trim() || !city.trim()) {
      setError("Please enter your name and city.");
      return;
    }

    if (!BACKEND_URL) {
      setError("Newsletter service is not configured. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/newsletter/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            name: name.trim(),
            city: city.trim(),
            phone: phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to complete your subscription."
        );
      }

      setCompleted(true);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-gradient-to-r from-cyan-700 to-blue-900 px-6 py-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <FaFish className="text-3xl text-cyan-700" />
          </div>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            Bezawada Cuts
          </h1>

          <p className="mt-2 text-sm text-cyan-100">
            Fresh seafood updates delivered to your inbox
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {completed ? (
            <div className="py-5 text-center">
              <FaCheckCircle className="mx-auto text-6xl text-green-500" />

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                Thank You!
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Your email has been confirmed and your newsletter
                subscription is now active.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                You'll receive fresh seafood arrivals, special offers
                and updates from Bezawada Cuts.
              </p>

              <Link
                to="/"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-cyan-700 px-7 py-3 font-semibold text-white transition hover:bg-cyan-800"
              >
                Return to Shopping
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold text-gray-800">
                Complete Your Subscription
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                Your email confirmation link is ready. Please provide
                these basic details to finish subscribing.
              </p>

              <form onSubmit={onSubmitHandler} className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Enter your city"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Mobile Number{" "}
                    <span className="font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your mobile number"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-700 to-blue-900 px-5 py-3 font-semibold text-white transition hover:from-cyan-800 hover:to-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Complete Subscription"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-gray-400">
                Your details will be used for Bezawada Cuts newsletter
                updates. You can unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterComplete;
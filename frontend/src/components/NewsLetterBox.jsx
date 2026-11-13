
import React, { useState } from "react";
import {
  FaPaperPlane,
  FaFish,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NewsLetterBox = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      if (!BACKEND_URL) {
        throw new Error("Newsletter service is not configured.");
      }

      const response = await fetch(
        `${BACKEND_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to subscribe. Please try again."
        );
      }

      setSuccess(true);
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/4 top-0 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 shadow-2xl">
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative z-10 px-4 py-6 text-center text-white sm:px-7 sm:py-7 lg:px-10 lg:py-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 scale-125 rounded-full bg-white/20 blur-xl" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl sm:h-16 sm:w-16">
                <FaFish size={28} className="text-cyan-700" />
              </div>

              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-white shadow-md sm:h-6 sm:w-6">
                <FaStar size={8} />
              </div>
            </div>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl lg:text-4xl">
            Stay Updated
          </h2>

          <p className="mx-auto mt-1.5 max-w-2xl text-xs leading-5 text-cyan-100 sm:mt-2 sm:text-sm sm:leading-6">
            Subscribe to receive updates on fresh arrivals, seasonal seafood
            offers, exclusive discounts and cooking tips from Bezawada Cuts.
          </p>

          <form
            onSubmit={onSubmitHandler}
            className="mx-auto mt-4 max-w-2xl sm:mt-5"
          >
            <div className="flex flex-col rounded-xl bg-white p-1.5 shadow-2xl sm:flex-row sm:rounded-full">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                disabled={loading}
                className="min-w-0 flex-1 rounded-lg bg-transparent px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:rounded-full sm:px-6 sm:py-3"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-slate-900 to-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-black hover:to-black disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:rounded-full sm:px-7 sm:py-3"
              >
                <span>{loading ? "Subscribing..." : "Subscribe"}</span>
                {!loading && <FaPaperPlane className="text-xs sm:text-sm" />}
              </button>
            </div>
          </form>

          {message && (
            <p
              role="status"
              className={`mx-auto mt-3 max-w-2xl rounded-lg px-3 py-2 text-xs sm:text-sm ${
                success
                  ? "bg-green-500/20 text-green-100"
                  : "bg-red-500/20 text-red-100"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-cyan-100 sm:mt-5 sm:text-xs">
            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-300" />
              <span>Fresh seafood updates</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-300" />
              <span>Exclusive offers</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FaCheckCircle className="text-green-300" />
              <span>No unnecessary spam</span>
            </div>
          </div>

          <p className="mt-2 text-[10px] text-cyan-200/80 sm:text-[11px]">
            You can unsubscribe whenever you wish.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetterBox;

import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaKey, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${backendUrl}/api/user/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Password changed successfully");

        setEmail("");
        setPassword("");

        navigate("/login");
      } else {
        toast.error(data.message || "Unable to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen border-t bg-gradient-to-b from-cyan-50 via-white to-sky-50 flex items-center justify-center py-8 px-3">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center">
              <FaKey className="text-3xl text-cyan-600" />
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-gray-500 leading-5">
              Enter your registered email and choose a new password.
            </p>
          </div>

          <form onSubmit={resetPassword} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                autoComplete="new-password"
              />

              <p className="mt-1.5 text-[11px] text-gray-400">
                Password must contain at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-sm transition ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-cyan-600 text-white hover:bg-cyan-700"
              }`}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-cyan-700 transition"
          >
            <FaArrowLeft className="text-xs" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
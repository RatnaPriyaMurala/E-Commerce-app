import React, { useContext, useState } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaKey,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const ForgotPassword = () => {
  const {
    backendUrl,
    navigate,
  } = useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
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

      const response = await axios.post(
        backendUrl + "/api/user/reset-password",
        {
          email: email.trim(),
          password,
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully");

        setEmail("");
        setPassword("");

        navigate("/login");
      } else {
        toast.error(
          response.data.message || "Unable to reset password"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-blue-800 px-5 py-12">

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-10">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
            <FaKey className="text-4xl text-teal-700" />
          </div>

          <h2 className="text-3xl font-bold mt-6 text-gray-800">
            Reset Password
          </h2>

          <p className="text-gray-500 mt-3 leading-6">
            Enter your registered email and create a new password.
          </p>

        </div>

        {/* Form */}
        <div className="mt-10 space-y-6">

          {/* Email */}
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100 transition">

            <FaEnvelope className="text-gray-500 shrink-0" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ml-4 w-full outline-none text-gray-700"
              autoComplete="email"
            />

          </div>

          {/* New Password */}
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100 transition">

            <FaLock className="text-gray-500 shrink-0" />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ml-4 w-full outline-none text-gray-700"
              autoComplete="new-password"
            />

          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={resetPassword}
            disabled={loading}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-semibold transition ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-[1.02] hover:shadow-lg"
            }`}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-sm text-gray-500 hover:text-teal-700 transition"
          >
            Back to Login
          </button>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
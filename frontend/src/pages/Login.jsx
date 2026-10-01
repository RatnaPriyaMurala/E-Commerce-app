import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {
  const {
    token,
    setToken,
    navigate,
    setUser,
    backendUrl,
  } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  // ============================================================
  // SUBMIT HANDLER
  // ============================================================

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      // ========================================================
      // SIGN UP
      // ========================================================

      if (currentState === "Sign Up") {
        const response = await axios.post(
          backendUrl + "/api/user/register",
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
          }
        );

        if (response.data.success) {
          const newToken = response.data.token;

          setToken(newToken);

          localStorage.setItem("token", newToken);

          if (response.data.userId) {
            localStorage.setItem(
              "userId",
              response.data.userId
            );
          }

          // If registration API returns user data
          if (response.data.user) {
            setUser(response.data.user);

            localStorage.setItem(
              "user",
              JSON.stringify(response.data.user)
            );
          }

          toast.success("Account Created Successfully");

          resetForm();

          navigate("/");
        } else {
          toast.error(
            response.data.message ||
              "Unable to create account"
          );
        }
      }

      // ========================================================
      // LOGIN
      // ========================================================

      else {
        const response = await axios.post(
          backendUrl + "/api/user/login",
          {
            email: email.trim(),
            password,
          }
        );

        if (response.data.success) {
          const loginToken = response.data.token;

          setToken(loginToken);

          localStorage.setItem(
            "token",
            loginToken
          );

          // ====================================================
          // LOAD USER PROFILE
          // ====================================================

          try {
            const profile = await axios.get(
              backendUrl + "/api/user/profile",
              {
                headers: {
                  token: loginToken,
                },
              }
            );

            if (profile.data.success) {
              setUser(profile.data.user);

              localStorage.setItem(
                "user",
                JSON.stringify(profile.data.user)
              );
            }
          } catch (profileError) {
            console.log(
              "Profile loading error:",
              profileError
            );
          }

          toast.success("Login Successful");

          resetForm();

          navigate("/");
        } else {
          toast.error(
            response.data.message ||
              "Invalid email or password"
          );
        }
      }
    } catch (error) {
      console.log("Authentication error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REDIRECT IF ALREADY LOGGED IN
  // ============================================================

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // ============================================================
  // SWITCH LOGIN / SIGNUP
  // ============================================================

  const switchState = (state) => {
    resetForm();
    setCurrentState(state);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-100 flex items-center justify-center px-3 sm:px-5 py-6 sm:py-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">

        {/* ======================================================
            LEFT SIDE
        ====================================================== */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-800 text-white p-10 relative overflow-hidden">

          {/* Decorative Circles */}

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />

          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full" />

          <div className="relative">
            <p className="uppercase tracking-[5px] text-xs font-semibold mb-4">
              Premium Fresh Seafood
            </p>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Fresh Fish
              <br />
              Delivered
              <br />
              To Your Door
            </h1>

            <p className="mt-6 text-white/90 leading-6 text-base">
              Order farm-fresh fish, prawns and crabs directly
              from trusted fishermen. Experience hygienic cutting,
              fast delivery and premium quality seafood every day.
            </p>

            {/* Statistics */}

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl font-bold">
                  100%
                </h3>

                <p className="text-xs mt-1.5">
                  Fresh Catch Daily
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl font-bold">
                  30 Min
                </h3>

                <p className="text-xs mt-1.5">
                  Fast Delivery
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl font-bold">
                  500+
                </h3>

                <p className="text-xs mt-1.5">
                  Happy Customers
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <h3 className="text-2xl font-bold">
                  24×7
                </h3>

                <p className="text-xs mt-1.5">
                  Customer Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">

            {/* Header */}

            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                {currentState === "Login"
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                {currentState === "Login"
                  ? "Login to continue shopping fresh seafood."
                  : "Join us and enjoy premium seafood delivery."}
              </p>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={onSubmitHandler}
              className="space-y-4"
            >
              {/* Name */}

              {currentState === "Sign Up" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
                  required
                  autoComplete="name"
                />
              )}

              {/* Email */}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
                required
                autoComplete="email"
              />

              {/* Phone */}

              {currentState === "Sign Up" && (
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
                  required
                  autoComplete="tel"
                />
              )}

              {/* Password */}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
                required
                minLength={6}
                autoComplete={
                  currentState === "Login"
                    ? "current-password"
                    : "new-password"
                }
              />

              {/* Links */}

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/forgot-password")
                  }
                  className="text-teal-700 hover:text-teal-900 font-medium"
                >
                  Forgot Password?
                </button>

                {currentState === "Login" ? (
                  <button
                    type="button"
                    onClick={() =>
                      switchState("Sign Up")
                    }
                    className="text-teal-700 hover:text-teal-900 font-medium"
                  >
                    Create Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      switchState("Login")
                    }
                    className="text-teal-700 hover:text-teal-900 font-medium"
                  >
                    Already have an account?
                  </button>
                )}
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 transition-all duration-300 shadow-lg ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                {loading
                  ? currentState === "Login"
                    ? "Signing In..."
                    : "Creating Account..."
                  : currentState === "Login"
                    ? "Sign In"
                    : "Create Account"}
              </button>

              {/* Secure Authentication */}

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-500">
                    Secure Authentication
                  </span>
                </div>
              </div>

              {/* Features */}

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xl mb-1.5">
                    🔒
                  </div>

                  <p className="text-[11px] text-gray-600">
                    Secure Login
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xl mb-1.5">
                    ⚡
                  </div>

                  <p className="text-[11px] text-gray-600">
                    Fast Checkout
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-xl mb-1.5">
                    🐟
                  </div>

                  <p className="text-[11px] text-gray-600">
                    Fresh Daily
                  </p>
                </div>
              </div>
            </form>

            {/* Footer */}

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>
                © 2026 Bezawada Cuts
              </p>

              <p className="mt-1.5">
                Fresh Seafood • Secure Payments • Fast Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
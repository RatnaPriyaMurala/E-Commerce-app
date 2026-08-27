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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-100 flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* ======================================================
            LEFT SIDE
        ====================================================== */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-800 text-white p-14 relative overflow-hidden">

          {/* Decorative Circles */}

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />

          <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-white/10 rounded-full" />

          <div className="relative">

            <p className="uppercase tracking-[6px] text-sm font-semibold mb-5">
              Premium Fresh Seafood
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Fresh Fish
              <br />
              Delivered
              <br />
              To Your Door
            </h1>

            <p className="mt-8 text-white/90 leading-8 text-lg">
              Order farm-fresh fish, prawns and crabs directly
              from trusted fishermen. Experience hygienic cutting,
              fast delivery and premium quality seafood every day.
            </p>

            {/* Statistics */}

            <div className="grid grid-cols-2 gap-5 mt-12">

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-3xl font-bold">
                  100%
                </h3>

                <p className="text-sm mt-2">
                  Fresh Catch Daily
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-3xl font-bold">
                  30 Min
                </h3>

                <p className="text-sm mt-2">
                  Fast Delivery
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-3xl font-bold">
                  500+
                </h3>

                <p className="text-sm mt-2">
                  Happy Customers
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-3xl font-bold">
                  24×7
                </h3>

                <p className="text-sm mt-2">
                  Customer Support
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ======================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex items-center justify-center p-8 sm:p-12">

          <div className="w-full max-w-md">

            {/* Header */}

            <div className="text-center mb-8">

              <h2 className="text-4xl font-bold text-gray-800">

                {currentState === "Login"
                  ? "Welcome Back"
                  : "Create Account"}

              </h2>

              <p className="text-gray-500 mt-3">

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
              className="space-y-5"
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

              <div className="flex items-center justify-between text-sm">

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
                className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 transition-all duration-300 shadow-lg ${
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

              <div className="relative py-3">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    Secure Authentication
                  </span>
                </div>

              </div>

              {/* Features */}

              <div className="grid grid-cols-3 gap-4 text-center">

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-2xl mb-2">
                    🔒
                  </div>

                  <p className="text-xs text-gray-600">
                    Secure Login
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-2xl mb-2">
                    ⚡
                  </div>

                  <p className="text-xs text-gray-600">
                    Fast Checkout
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-2xl mb-2">
                    🐟
                  </div>

                  <p className="text-xs text-gray-600">
                    Fresh Daily
                  </p>
                </div>

              </div>

            </form>

            {/* Footer */}

            <div className="mt-10 text-center text-sm text-gray-500">

              <p>
                © 2026 Bezawada Cuts
              </p>

              <p className="mt-2">
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
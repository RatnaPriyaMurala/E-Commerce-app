import React, { useContext, useState } from "react";
import {
  FaCog,
  FaUser,
  FaLock,
  FaMoon,
  FaBell,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const Settings = () => {
  const { user, logout, navigate } = useContext(ShopContext);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex items-center gap-5 mb-10">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-700 flex items-center justify-center shadow-xl">

            <FaCog className="text-white text-4xl" />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              Settings
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your account preferences.
            </p>

          </div>

        </div>

        {/* Account */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">

            <FaUser className="text-teal-600" />

            Account

          </h2>

          <button
            onClick={() => navigate("/profile")}
            className="w-full flex justify-between items-center p-5 rounded-2xl hover:bg-gray-50 transition"
          >

            <div>

              <p className="font-semibold text-lg">
                {user?.name || "My Profile"}
              </p>

              <p className="text-gray-500">
                View and edit your profile
              </p>

            </div>

            <FaChevronRight className="text-gray-400" />

          </button>

        </div>

        {/* Security */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">

            <FaLock className="text-teal-600" />

            Security

          </h2>

          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full flex justify-between items-center p-5 rounded-2xl hover:bg-gray-50 transition"
          >

            <div>

              <p className="font-semibold">
                Change Password
              </p>

              <p className="text-gray-500 text-sm">
                Update your account password
              </p>

            </div>

            <FaChevronRight className="text-gray-400" />

          </button>

        </div>

        {/* Appearance */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">

            <FaMoon className="text-indigo-600" />

            Appearance

          </h2>

          <div className="flex justify-between items-center">

            <div>

              <p className="font-semibold">
                Dark Mode
              </p>

              <p className="text-gray-500 text-sm">
                Toggle dark theme
              </p>

            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-16 h-8 rounded-full transition ${
                darkMode ? "bg-teal-600" : "bg-gray-300"
              }`}
            >

              <div
                className={`w-7 h-7 bg-white rounded-full shadow transform transition ${
                  darkMode ? "translate-x-8" : "translate-x-0.5"
                }`}
              />

            </button>

          </div>

        </div>

        {/* Notifications */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">

            <FaBell className="text-yellow-500" />

            Notifications

          </h2>

          <div className="flex justify-between items-center">

            <div>

              <p className="font-semibold">
                Order Notifications
              </p>

              <p className="text-gray-500 text-sm">
                Receive order updates
              </p>

            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-16 h-8 rounded-full transition ${
                notifications ? "bg-green-600" : "bg-gray-300"
              }`}
            >

              <div
                className={`w-7 h-7 bg-white rounded-full shadow transform transition ${
                  notifications ? "translate-x-8" : "translate-x-0.5"
                }`}
              />

            </button>

          </div>

        </div>

        {/* Logout */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <button
            onClick={logout}
            className="w-full flex justify-center items-center gap-4 py-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg hover:scale-[1.02] transition"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;
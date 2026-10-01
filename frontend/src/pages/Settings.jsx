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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 py-7 sm:py-9 px-3 sm:px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-7">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 flex items-center justify-center shadow-lg">
            <FaCog className="text-white text-2xl sm:text-3xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Settings
            </h1>

            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Manage your account preferences.
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">

          {/* Account */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
              <FaUser className="text-teal-600" />
              Account
            </h2>

            <button
              onClick={() => navigate("/profile")}
              className="w-full flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition text-left"
            >
              <div>
                <p className="font-semibold">
                  {user?.name || "My Profile"}
                </p>

                <p className="text-gray-500 text-sm mt-0.5">
                  View and edit your profile
                </p>
              </div>

              <FaChevronRight className="text-gray-400 shrink-0" />
            </button>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
              <FaLock className="text-teal-600" />
              Security
            </h2>

            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition text-left"
            >
              <div>
                <p className="font-semibold">
                  Change Password
                </p>

                <p className="text-gray-500 text-sm mt-0.5">
                  Update your account password
                </p>
              </div>

              <FaChevronRight className="text-gray-400 shrink-0" />
            </button>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
              <FaMoon className="text-indigo-600" />
              Appearance
            </h2>

            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="font-semibold">
                  Dark Mode
                </p>

                <p className="text-gray-500 text-sm mt-0.5">
                  Toggle dark theme
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                className={`w-14 h-7 rounded-full transition shrink-0 ${
                  darkMode ? "bg-teal-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                    darkMode ? "translate-x-7" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
              <FaBell className="text-yellow-500" />
              Notifications
            </h2>

            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="font-semibold">
                  Order Notifications
                </p>

                <p className="text-gray-500 text-sm mt-0.5">
                  Receive order updates
                </p>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                aria-label="Toggle notifications"
                className={`w-14 h-7 rounded-full transition shrink-0 ${
                  notifications ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                    notifications ? "translate-x-7" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <button
              onClick={logout}
              className="w-full flex justify-center items-center gap-3 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:scale-[1.01] transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
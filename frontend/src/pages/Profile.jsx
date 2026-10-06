import React, { useContext, useState, useEffect } from "react";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser, backendUrl, token } = useContext(ShopContext);

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.address?.firstName || "",
        lastName: user.address?.lastName || "",
        phone: user.phone || "",
        address: user.address?.address || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipcode: user.address?.zipcode || "",
        country: user.address?.country || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/user/update-profile",
        {
          name: user.name,
          phone: form.phone,
          address: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            state: form.state,
            zipcode: form.zipcode,
            country: form.country,
          },
        },
        {
          headers: {
            token,
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile Updated Successfully");
        setEdit(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Profile Update Failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-7 sm:py-9">
      <div className="mb-6 sm:mb-7">
        <p className="text-teal-600 font-semibold uppercase tracking-widest text-xs">
          My Account
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-1.5">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Manage your personal information and delivery details.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 h-24 sm:h-28" />

          <div className="px-5 sm:px-6 pb-6 -mt-12">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-4xl font-bold flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="text-center mt-4">
              <h2 className="text-xl sm:text-2xl font-bold">{user?.name}</h2>

              <p className="text-gray-500 text-sm mt-1.5 flex items-center justify-center gap-2">
                <FaUserCircle />
                Customer Account
              </p>

              <p className="text-gray-500 text-sm mt-1.5 break-all">
                📧 {user?.email}
              </p>
            </div>

            <button
              onClick={() => setEdit(!edit)}
              className={`mt-6 w-full py-2.5 rounded-xl font-semibold transition ${
                edit
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {edit ? (
                <>
                  <FaTimes className="inline mr-2" />
                  Cancel Editing
                </>
              ) : (
                <>
                  <FaEdit className="inline mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-5">
            Personal Information
          </h2>

          {edit ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="First Name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Delivery Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Complete Address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Pincode
                  </label>
                  <input
                    name="zipcode"
                    value={form.zipcode}
                    onChange={handleChange}
                    className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Pincode"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Country
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full mt-1.5 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={updateProfile}
                  className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition"
                >
                  <FaSave className="inline mr-2" />
                  Save Changes
                </button>

                <button
                  onClick={() => setEdit(false)}
                  className="border border-gray-300 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-semibold transition"
                >
                  <FaTimes className="inline mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2.5 mb-4">
                  <FaPhoneAlt className="text-teal-600" />
                  Contact Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold mt-1">{user?.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-semibold mt-1 break-all">
                      {user?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-semibold mt-1">
                      {user?.phone ? user.phone : "Not Added"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                <h3 className="text-lg font-semibold flex items-center gap-2.5 mb-4">
                  <FaMapMarkerAlt className="text-teal-600" />
                  Delivery Address
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Receiver Name</p>
                    <p className="font-semibold mt-1">
                      {user?.address?.firstName} {user?.address?.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold mt-1">
                      {user?.address?.address || "Not Added"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="font-semibold mt-1">
                      {user?.address?.city || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">State</p>
                    <p className="font-semibold mt-1">
                      {user?.address?.state || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Pincode</p>
                    <p className="font-semibold mt-1">
                      {user?.address?.zipcode || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="font-semibold mt-1">
                      {user?.address?.country || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-2xl p-5 text-white">
                <h3 className="text-lg font-bold mb-1.5">
                  Premium FreshFish Member
                </h3>
                <p className="text-sm opacity-90 leading-5">
                  Manage your profile, delivery information, orders and
                  receive fresh seafood delivered safely to your doorstep.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
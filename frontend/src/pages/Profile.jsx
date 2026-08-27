import React, { useContext, useState, useEffect } from "react";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {

  const {
    user,
    setUser,
    backendUrl,
    token
  } = useContext(ShopContext);

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
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
        country: user.address?.country || ""
      });

    }

  }, [user]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
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
            country: form.country
          }
        },

        {
          headers: {
            token
          }
        }

      );

      if (res.data.success) {

        setUser(res.data.user);

        toast.success("Profile Updated Successfully");

        setEdit(false);

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Profile Update Failed");

    }

  };

  return (

    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Header */}

      <div className="mb-10">

        <p className="text-teal-600 font-semibold uppercase tracking-widest">
          My Account
        </p>

        <h1 className="text-4xl font-bold text-gray-800 mt-2">
          Profile Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your personal information and delivery details.
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT PROFILE CARD */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 h-32"></div>

          <div className="px-8 pb-8 -mt-14">

            <div className="w-28 h-28 rounded-full bg-white shadow-xl mx-auto flex items-center justify-center">

              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-5xl font-bold flex items-center justify-center">

                {
                  user?.name?.charAt(0).toUpperCase()
                }

              </div>

            </div>

            <div className="text-center mt-5">

              <h2 className="text-2xl font-bold">
                {user?.name}
              </h2>

              <p className="text-gray-500 mt-2 flex items-center justify-center gap-2">

                <FaUserCircle />

                Customer Account

              </p>

              <p className="text-gray-500 mt-2 break-all">

                📧 {user?.email}

              </p>

            </div>

            <button

              onClick={() => setEdit(!edit)}

              className={`

                mt-8

                w-full

                py-3

                rounded-xl

                font-semibold

                transition

                ${
                  edit

                    ? "bg-red-500 hover:bg-red-600 text-white"

                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }

              `}

            >

              {

                edit

                  ?

                  <>

                    <FaTimes className="inline mr-2" />

                    Cancel Editing

                  </>

                  :

                  <>

                    <FaEdit className="inline mr-2" />

                    Edit Profile

                  </>

              }

            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-8">
            Personal Information
          </h2>

          {

            edit

              ?

              <div className="space-y-6">

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="text-sm font-medium text-gray-600">
                      First Name
                    </label>

                    <input

                      name="firstName"

                      value={form.firstName}

                      onChange={handleChange}

                      className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

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

                      className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

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

                    className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

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

                    className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

                    placeholder="Complete Address"

                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="text-sm font-medium text-gray-600">
                      City
                    </label>

                    <input

                      name="city"

                      value={form.city}

                      onChange={handleChange}

                      className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

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

                      className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

                      placeholder="State"

                    />

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="text-sm font-medium text-gray-600">
                      Pincode
                    </label>

                    <input

                      name="zipcode"

                      value={form.zipcode}

                      onChange={handleChange}

                      className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

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

                      className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"

                      placeholder="Country"

                    />

                  </div>

                </div>

                <div className="flex flex-wrap gap-4 pt-6">

                  <button

                    onClick={updateProfile}

                    className="

                      bg-gradient-to-r

                      from-teal-600

                      to-cyan-500

                      hover:from-teal-700

                      hover:to-cyan-600

                      text-white

                      px-8

                      py-3

                      rounded-xl

                      font-semibold

                      shadow-lg

                      transition

                    "

                  >

                    <FaSave className="inline mr-2" />

                    Save Changes

                  </button>

                  <button

                    onClick={() => setEdit(false)}

                    className="

                      border

                      border-gray-300

                      hover:bg-gray-100

                      px-8

                      py-3

                      rounded-xl

                      font-semibold

                      transition

                    "

                  >

                    <FaTimes className="inline mr-2" />

                    Cancel

                  </button>

                </div>

              </div>

              :

              <div className="space-y-8">

                {/* CONTACT INFORMATION */}

                <div className="bg-gray-50 rounded-2xl p-6">

                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-5">

                    <FaPhoneAlt className="text-teal-600" />

                    Contact Information

                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>

                      <p className="text-sm text-gray-500">
                        Full Name
                      </p>

                      <p className="font-semibold text-lg mt-1">
                        {user?.name}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Email Address
                      </p>

                      <p className="font-semibold mt-1">
                        {user?.email}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Phone Number
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.phone
                            ? user.phone
                            : "Not Added"
                        }

                      </p>

                    </div>

                  </div>

                </div>

                {/* DELIVERY ADDRESS */}

                <div className="bg-gray-50 rounded-2xl p-6">

                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-5">

                    <FaMapMarkerAlt className="text-teal-600" />

                    Delivery Address

                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>

                      <p className="text-sm text-gray-500">
                        Receiver Name
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.address?.firstName
                        }

                        {" "}

                        {
                          user?.address?.lastName
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Address
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.address?.address
                            ? user.address.address
                            : "Not Added"
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        City
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.address?.city || "-"
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        State
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.address?.state || "-"
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Pincode
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.address?.zipcode || "-"
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Country
                      </p>

                      <p className="font-semibold mt-1">

                        {
                          user?.address?.country || "-"
                        }

                      </p>

                    </div>

                  </div>

                </div>

                {/* ACCOUNT STATUS */}

                <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-2xl p-6 text-white">

                  <h3 className="text-xl font-bold mb-2">
                    Premium FreshFish Member
                  </h3>

                  <p className="opacity-90">

                    Manage your profile, delivery information,
                    orders and receive fresh seafood delivered
                    safely to your doorstep.

                  </p>

                </div>

              </div>

          }

        </div>

      </div>

    </div>

  );

};

export default Profile;
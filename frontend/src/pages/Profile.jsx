
import React, { useContext, useEffect, useState } from "react";
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

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  alternatePhone: "",
  deliveryPoint: "",
  landmark: "",
  address: "",
  city: "",
  state: "",
  zipcode: "",
  country: "India",
};

const Profile = () => {
  const { user, setUser, backendUrl, token } =
    useContext(ShopContext);

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!user) return;

    const address = user.address || {};

    setForm({
      firstName:
        address.firstName || user.name?.split(" ")[0] || "",
      lastName:
        address.lastName ||
        user.name?.split(" ").slice(1).join(" ") ||
        "",
      phone: address.phone || user.phone || "",
      alternatePhone: address.alternatePhone || "",
      deliveryPoint:
        address.deliveryPoint || address.address || "",
      landmark: address.landmark || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      zipcode: address.zipcode || "",
      country: address.country || "India",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const cancelEditing = () => {
    const address = user?.address || {};

    setForm({
      ...emptyForm,
      firstName:
        address.firstName || user?.name?.split(" ")[0] || "",
      lastName:
        address.lastName ||
        user?.name?.split(" ").slice(1).join(" ") ||
        "",
      phone: address.phone || user?.phone || "",
      alternatePhone: address.alternatePhone || "",
      deliveryPoint:
        address.deliveryPoint || address.address || "",
      landmark: address.landmark || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      zipcode: address.zipcode || "",
      country: address.country || "India",
    });

    setEdit(false);
  };

  const updateProfile = async () => {
    if (!token) {
      toast.error("Please log in again.");
      return;
    }

    const phone = form.phone.replace(/\D/g, "");
    const alternatePhone = form.alternatePhone.replace(/\D/g, "");
    const zipcode = form.zipcode.replace(/\D/g, "");

    if (!form.firstName.trim()) {
      toast.error("Please enter the receiver's first name.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    if (alternatePhone && !/^\d{10}$/.test(alternatePhone)) {
      toast.error("Enter a valid 10-digit alternate phone number.");
      return;
    }

    if (alternatePhone && alternatePhone === phone) {
      toast.error("Alternate phone must differ from the primary phone.");
      return;
    }

    if (!form.deliveryPoint.trim()) {
      toast.error("Please enter your delivery point.");
      return;
    }

    if (!form.city.trim() || !form.state.trim()) {
      toast.error("Please enter your city and state.");
      return;
    }

    if (!/^\d{6}$/.test(zipcode)) {
      toast.error("Enter a valid 6-digit PIN code.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        {
          name: [
            form.firstName.trim(),
            form.lastName.trim(),
          ].filter(Boolean).join(" "),
          phone,
          address: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone,
            alternatePhone,
            deliveryPoint: form.deliveryPoint.trim(),
            landmark: form.landmark.trim(),
            // Keep the legacy field for compatibility with existing code.
            address: form.deliveryPoint.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            zipcode,
            country: form.country.trim() || "India",
          },
        },
        {
          headers: { token },
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to update profile."
        );
      }

      setUser(response.data.user);
      toast.success("Profile and delivery details saved.");
      setEdit(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label,
    name,
    placeholder,
    required = false,
    type = "text",
  }) => (
    <div>
      <label className="text-sm font-medium text-gray-600">
        {label}{required ? " *" : ""}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        maxLength={name === "phone" || name === "alternatePhone" ? 10 : undefined}
        className="w-full mt-1.5 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
      />
    </div>
  );

  const valueOrDash = (value) => value || "Not Added";

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-7 sm:py-9">
      <div className="mb-6">
        <p className="text-teal-600 font-semibold uppercase tracking-widest text-xs">
          My Account
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1.5">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Keep your contact and delivery details up to date.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 h-24" />
          <div className="px-5 pb-6 -mt-12">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-4xl font-bold flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="text-center mt-4">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-gray-500 text-sm mt-2">
                <FaUserCircle className="inline mr-2" />
                Customer Account
              </p>
              <p className="text-gray-500 text-sm mt-2 break-all">
                {user?.email}
              </p>
            </div>

            <button
              onClick={() => edit ? cancelEditing() : setEdit(true)}
              className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-white ${
                edit
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {edit ? (
                <><FaTimes className="inline mr-2" />Cancel Editing</>
              ) : (
                <><FaEdit className="inline mr-2" />Edit Profile</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <h2 className="text-xl font-bold mb-5">
            Personal & Delivery Information
          </h2>

          {edit ? (
            <div className="space-y-5">
              <h3 className="font-semibold text-teal-700">
                Contact Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="First Name" name="firstName" placeholder="Receiver's first name" required />
                <Field label="Last Name" name="lastName" placeholder="Last name" />
                <Field label="Primary Phone" name="phone" placeholder="10-digit mobile number" required type="tel" />
                <Field label="Alternate Phone" name="alternatePhone" placeholder="Optional alternate number" type="tel" />
              </div>

              <div className="border-t pt-5">
                <h3 className="font-semibold text-teal-700 mb-1">
                  Delivery Point
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Enter the exact meeting place or delivery location where
                  our team should meet you.
                </p>

                <div className="space-y-4">
                  <Field
                    label="Delivery Point / Meeting Place"
                    name="deliveryPoint"
                    placeholder="e.g. bus stop, apartment gate, shop name"
                    required
                  />
                  <Field
                    label="Nearby Landmark"
                    name="landmark"
                    placeholder="e.g. near a school, temple, or main road"
                  />
                  <Field
                    label="Additional Address Details (optional)"
                    name="address"
                    placeholder="House number, apartment, or directions"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="City" name="city" placeholder="City" required />
                    <Field label="State" name="state" placeholder="State" required />
                    <Field label="PIN Code" name="zipcode" placeholder="6-digit PIN code" required />
                    <Field label="Country" name="country" placeholder="India" required />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={updateProfile}
                  className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold disabled:opacity-60"
                >
                  <FaSave className="inline mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={cancelEditing}
                  className="border border-gray-300 px-6 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <section className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <FaPhoneAlt className="text-teal-600" />
                  Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold mt-1">{user?.name || "Not Added"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold mt-1 break-all">{user?.email || "Not Added"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Primary Phone</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.phone)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Alternate Phone</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.alternatePhone)}</p>
                  </div>
                </div>
              </section>

              <section className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-teal-600" />
                  Delivery Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Receiver Name</p>
                    <p className="font-semibold mt-1">
                      {[form.firstName, form.lastName].filter(Boolean).join(" ") || "Not Added"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Delivery Point</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.deliveryPoint)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nearby Landmark</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.landmark)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Additional Address</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.address)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.city)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">State</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.state)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">PIN Code</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.zipcode)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="font-semibold mt-1">{valueOrDash(form.country)}</p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Offers = ({ token }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountCode: "",
    imageUrl: "",
    expiresAt: "",
  });

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOffers = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/offer/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load offers.");
      }

      setOffers(data.offers || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadOffers();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePublish = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/offer/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to publish offer.");
      }

      setMessage(data.message);
      setForm({
        title: "",
        description: "",
        discountCode: "",
        imageUrl: "",
        expiresAt: "",
      });

      await loadOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Offers & Promotions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Publish a Bezawada Cuts offer and email your active subscribers.
        </p>
      </div>

      <form
        onSubmit={handlePublish}
        className="mb-8 max-w-3xl space-y-4 rounded-xl border bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Create a new offer
        </h2>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Offer title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={120}
            placeholder="Example: Weekend Seafood Special"
            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-cyan-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            maxLength={2000}
            rows={4}
            placeholder="Describe your offer and its terms..."
            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-cyan-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Discount code (optional)
            </label>
            <input
              name="discountCode"
              value={form.discountCode}
              onChange={handleChange}
              maxLength={50}
              placeholder="Example: FRESH10"
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Offer expiry date (optional)
            </label>
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-cyan-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Offer image URL (optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-cyan-600"
          />
        </div>

        <p className="rounded-lg bg-yellow-50 p-3 text-xs leading-5 text-yellow-800">
          Publishing sends an email announcement to active newsletter
          subscribers. Check the title, description and expiry date carefully
          before publishing.
        </p>

        {message && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-700 px-6 py-3 font-semibold text-white hover:bg-cyan-800 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish offer and send emails"}
        </button>
      </form>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Published offers
        </h2>

        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {offer.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {offer.description}
                  </p>
                  {offer.discountCode && (
                    <p className="mt-2 text-sm font-medium text-cyan-700">
                      Code: {offer.discountCode}
                    </p>
                  )}
                </div>

                <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {offer.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Published:{" "}
                {offer.publishedAt
                  ? new Date(offer.publishedAt).toLocaleDateString("en-IN")
                  : "Not published"}
              </p>
            </div>
          ))}

          {offers.length === 0 && (
            <p className="rounded-xl border bg-white p-6 text-center text-sm text-gray-500">
              No offers created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offers;

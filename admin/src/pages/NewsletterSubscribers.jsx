
import React, { useCallback, useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NewsletterSubscribers = ({ token }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    unsubscribed: 0,
  });
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (status) params.set("status", status);
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(
        `${BACKEND_URL}/api/newsletter/admin/subscribers?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load subscribers.");
      }

      setSubscribers(data.subscribers || []);
      setStats(data.stats || {
        active: 0,
        pending: 0,
        unsubscribed: 0,
      });
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, status, search]);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const statusStyle = (value) => {
    if (value === "active") {
      return "bg-green-100 text-green-700";
    }

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Newsletter Subscribers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage Bezawada Cuts newsletter subscribers.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active subscribers</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.active}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending confirmation</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unsubscribed</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.unsubscribed}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by email..."
          className="w-full rounded-lg border bg-white px-4 py-2.5 outline-none focus:border-cyan-600 sm:max-w-sm"
        />

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border bg-white px-4 py-2.5 outline-none focus:border-cyan-600"
        >
          <option value="">All subscribers</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>

        <button
          onClick={loadSubscribers}
          disabled={loading}
          className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Subscribed date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-800">
                  {subscriber.email}
                </td>
                <td className="px-5 py-4">
                  {subscriber.name || "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(subscriber.status)}`}
                  >
                    {subscriber.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {new Date(subscriber.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}

            {!loading && subscribers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-gray-500">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => current - 1)}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsletterSubscribers;

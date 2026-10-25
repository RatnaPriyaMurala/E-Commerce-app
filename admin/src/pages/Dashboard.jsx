import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import {
  FaShoppingCart,
  FaRupeeSign,
  FaFish,
  FaUsers,
  FaExclamationTriangle,
  FaEdit,
  FaArrowRight,
  FaSyncAlt,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCustomerName = (order) => {
  const address = order?.address || {};
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ").trim();
  return name || order?.userName || order?.customerName || order?.name || "Customer";
};

const getOrderAmount = (order) =>
  Number(order?.amount ?? order?.totalAmount ?? order?.total ?? order?.totalPrice ?? 0);

const getOrderStatusStyle = (status = "Order Placed") => {
  const normalized = String(status).toLowerCase();
  if (normalized === "delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (normalized === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-600/20";
  if (normalized === "out for delivery") return "bg-violet-50 text-violet-700 ring-violet-600/20";
  if (normalized === "shipped") return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";
  if (["packed", "processing"].includes(normalized)) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  return "bg-sky-50 text-sky-700 ring-sky-600/20";
};

const getPaymentStyle = (status = "") => {
  const normalized = String(status).toLowerCase();
  if (normalized === "paid" || normalized === "completed") return "bg-emerald-50 text-emerald-700";
  if (normalized === "failed") return "bg-rose-50 text-rose-700";
  if (normalized === "cod") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    latestOrders: [],
  });
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lowStockError, setLowStockError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Could not load dashboard information.");
      }
      const data = response.data.dashboard || {};
      setDashboard({
        totalOrders: Number(data.totalOrders) || 0,
        totalRevenue: Number(data.totalRevenue) || 0,
        totalProducts: Number(data.totalProducts) || 0,
        totalCustomers: Number(data.totalCustomers) || 0,
        latestOrders: Array.isArray(data.latestOrders) ? data.latestOrders : [],
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Dashboard request failed:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Unable to load dashboard. Check the backend connection."
      );
    }
  }, [token]);

  const loadLowStock = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/product/low-stock`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Could not load low-stock products.");
      }
      setLowStock(Array.isArray(response.data.products) ? response.data.products : []);
      setLowStockError("");
    } catch (error) {
      console.error("Low-stock request failed:", error);
      setLowStockError(
        error.response?.data?.message || error.message || "Unable to load stock information."
      );
    }
  }, [token]);

  const refreshDashboard = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadDashboard(), loadLowStock()]);
    setRefreshing(false);
    setLoading(false);
  }, [loadDashboard, loadLowStock]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    const load = async () => {
      await Promise.all([loadDashboard(), loadLowStock()]);
      if (active) setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [token, loadDashboard, loadLowStock]);

  const stats = [
    {
      label: "Total orders",
      value: loading ? "—" : dashboard.totalOrders.toLocaleString("en-IN"),
      helper: "All orders recorded",
      icon: FaShoppingCart,
      iconClass: "bg-blue-50 text-blue-700",
      onClick: () => navigate("/orders"),
    },
    {
      label: "Revenue",
      value: loading ? "—" : formatCurrency(dashboard.totalRevenue),
      helper: "Reported by your backend",
      icon: FaRupeeSign,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Products",
      value: loading ? "—" : dashboard.totalProducts.toLocaleString("en-IN"),
      helper: "Products in catalogue",
      icon: FaFish,
      iconClass: "bg-cyan-50 text-cyan-700",
      onClick: () => navigate("/list"),
    },
    {
      label: "Customers",
      value: loading ? "—" : dashboard.totalCustomers.toLocaleString("en-IN"),
      helper: "Registered customer accounts",
      icon: FaUsers,
      iconClass: "bg-violet-50 text-violet-700",
      onClick: () => navigate("/customers"),
    },
    {
      label: "Low stock",
      value: loading ? "—" : lowStock.length.toLocaleString("en-IN"),
      helper: "Products needing attention",
      icon: FaExclamationTriangle,
      iconClass: "bg-amber-50 text-amber-700",
      onClick: () => navigate("/list?stock=low"),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-7">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Priya Live Fish · Admin</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Business overview</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitor orders, sales, catalogue health and customer activity in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshDashboard}
            disabled={refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing…" : "Refresh data"}
          </button>
        </header>

        {errorMessage && (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2"><FaExclamationTriangle className="mt-0.5 shrink-0" /><span><strong>Dashboard data could not be loaded.</strong> {errorMessage}</span></div>
            <button onClick={refreshDashboard} className="rounded-lg bg-rose-700 px-3 py-2 font-semibold text-white hover:bg-rose-800">Try again</button>
          </div>
        )}

        <section aria-label="Business statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map(({ label, value, helper, icon: Icon, iconClass, onClick }) => (
            <button
              type="button"
              key={label}
              onClick={onClick}
              disabled={!onClick}
              className={`group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md" : "cursor-default"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
                </div>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}><Icon size={19} /></span>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">{helper}{onClick && <FaArrowRight className="ml-auto opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />}</p>
            </button>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><FaExclamationTriangle /></span><h2 className="text-lg font-bold text-slate-900">Stock requiring attention</h2></div>
              <p className="mt-1 text-sm text-slate-500">Review inventory before an item becomes unavailable.</p>
            </div>
            <button onClick={() => navigate("/list?stock=low")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Manage inventory <FaArrowRight size={12} /></button>
          </div>

          {lowStockError ? (
            <div role="alert" className="m-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{lowStockError}</div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3"><div className="h-36 animate-pulse rounded-xl bg-slate-100" /><div className="h-36 animate-pulse rounded-xl bg-slate-100" /><div className="h-36 animate-pulse rounded-xl bg-slate-100" /></div>
          ) : lowStock.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><FaCheckCircle size={22} /></span><h3 className="mt-3 font-semibold text-slate-900">No low-stock products returned</h3><p className="mt-1 text-sm text-slate-500">Check stock thresholds and the low-stock API if you expected products here.</p></div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {lowStock.map((item) => {
                const image = Array.isArray(item.image) ? item.image[0] : item.image;
                const stock = Number(item.stock) || 0;
                const outOfStock = stock <= 0;
                return (
                  <article key={item._id} className="flex gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-cyan-200 hover:shadow-sm">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {image ? <img src={image} alt={item.name || "Product"} loading="lazy" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="flex h-full items-center justify-center text-slate-400"><FaBoxOpen size={24} /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-semibold text-slate-900">{item.name || "Unnamed product"}</h3>
                      <p className="mt-1 text-xs text-slate-500">Available stock</p>
                      <p className={`mt-0.5 text-xl font-bold ${outOfStock ? "text-rose-700" : "text-amber-700"}`}>{stock.toLocaleString("en-IN")} <span className="text-sm font-medium">KG</span></p>
                      <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${outOfStock ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{outOfStock ? "OUT OF STOCK" : "LOW STOCK"}</span>
                      <button onClick={() => navigate("/list")} className="mt-3 flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900"><FaEdit /> Update stock</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><FaShoppingCart /></span><h2 className="text-lg font-bold text-slate-900">Latest orders</h2></div>
              <p className="mt-1 text-sm text-slate-500">Recent orders returned by your admin API.</p>
            </div>
            <button onClick={() => navigate("/orders")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800">View all orders <FaArrowRight size={12} /></button>
          </div>

          {loading ? (
            <div className="space-y-3 p-5"><div className="h-12 animate-pulse rounded-lg bg-slate-100" /><div className="h-12 animate-pulse rounded-lg bg-slate-100" /><div className="h-12 animate-pulse rounded-lg bg-slate-100" /></div>
          ) : dashboard.latestOrders.length === 0 ? (
            <div className="px-5 py-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><FaBoxOpen size={22} /></span><h3 className="mt-3 font-semibold text-slate-900">No recent orders available</h3><p className="mt-1 text-sm text-slate-500">If orders exist in MongoDB, check the dashboard API query and date sorting.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead><tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><th className="px-6 py-4 font-semibold">Customer / order</th><th className="px-5 py-4 font-semibold">Order amount</th><th className="px-5 py-4 font-semibold">Payment</th><th className="px-5 py-4 font-semibold">Order status</th><th className="px-5 py-4 font-semibold"><span className="inline-flex items-center gap-1.5"><FaCalendarAlt /> Date</span></th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard.latestOrders.map((order, index) => {
                    const id = order?._id || order?.id || `recent-order-${index}`;
                    const status = order?.orderStatus || order?.status || "Order Placed";
                    const payment = order?.paymentStatus || order?.paymentMethod || "Unknown";
                    const rawDate = order?.date || order?.createdAt || order?.updatedAt;
                    return (
                      <tr key={id} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-4"><p className="font-semibold text-slate-900">{getCustomerName(order)}</p><p className="mt-1 font-mono text-xs text-slate-500">#{String(order?._id || order?.id || "").slice(-8).toUpperCase() || "—"}</p></td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{formatCurrency(getOrderAmount(order))}</td>
                        <td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStyle(payment)}`}>{payment}</span></td>
                        <td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getOrderStatusStyle(status)}`}>{status}</span></td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{formatDate(rawDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 sm:px-6"><span className="inline-flex items-center gap-1.5"><FaClock /> Data shown from your backend</span><button onClick={refreshDashboard} className="font-semibold text-cyan-700 hover:text-cyan-900">Refresh latest data</button></div>
        </section>
        <p className="px-1 text-xs leading-5 text-slate-400">Dashboard figures depend on the backend API. Verify the revenue calculation, order filters, and test-record cleanup in the backend before using these totals for business reporting.</p>
      </div>
    </main>
  );
};

export default Dashboard;

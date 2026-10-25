
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import customerModel from "../models/customerModel.js";

/* =========================================================
   ADMIN DASHBOARD
   - Counts orders, products and customers
   - Calculates collected revenue
   - Returns low-stock products
   - Returns the latest orders
========================================================= */

const dashboard = async (req, res) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueResult,
      lowStockProducts,
      latestOrders,
    ] = await Promise.all([
      // Count all orders.
      orderModel.countDocuments({}),

      // Count all products.
      productModel.countDocuments({}),

      // Count all customers.
      customerModel.countDocuments({}),

      // Calculate collected revenue.
      // Paid orders count unless cancelled.
      // COD orders count only when delivered.
      orderModel.aggregate([
        {
          $match: {
            orderStatus: {
              $not: { $regex: /^Cancelled$/i },
            },
            $or: [
              {
                paymentStatus: {
                  $regex: /^Paid$/i,
                },
              },
              {
                paymentMethod: {
                  $regex: /^COD$/i,
                },
                orderStatus: {
                  $regex: /^Delivered$/i,
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $convert: {
                  input: "$amount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ]),

      // Show up to five products with stock at or below 5.
      productModel
        .find({ stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .limit(5)
        .lean(),

      // Fetch all orders so MongoDB does not limit the results
      // to the eight oldest/newest records based on a mixed date field.
      orderModel.find({}).lean(),
    ]);

    // Convert supported date values to timestamps.
    // createdAt is preferred because it is present on the
    // October order; date is used as a fallback.
    const getOrderTimestamp = (order) => {
      const values = [
        order.createdAt,
        order.date,
        order.updatedAt,
      ];

      for (const value of values) {
        if (value === undefined || value === null || value === "") {
          continue;
        }

        const timestamp =
          typeof value === "number"
            ? value
            : new Date(value).getTime();

        if (Number.isFinite(timestamp)) {
          return timestamp;
        }
      }

      return 0;
    };

    const sortedLatestOrders = latestOrders
      .sort((a, b) => {
        const difference =
          getOrderTimestamp(b) - getOrderTimestamp(a);

        if (difference !== 0) {
          return difference;
        }

        // Deterministic fallback when dates are equal or missing.
        return String(b._id).localeCompare(String(a._id));
      })
      .slice(0, 8);

    const totalRevenue = Number(
      revenueResult[0]?.totalRevenue ?? 0
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        lowStockProducts,
        latestOrders: sortedLatestOrders,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard",
    });
  }
};

export { dashboard };

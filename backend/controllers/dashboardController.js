
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import customerModel from "../models/customerModel.js";

/* =========================================================
   ADMIN DASHBOARD
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
            // Count all stored orders, including historical orders.
            orderModel.countDocuments({}),

            // Count products.
            productModel.countDocuments({}),

            // Use the same customer collection as the Customers page.
            customerModel.countDocuments({}),

            // Count collected revenue:
            // paid online orders and delivered COD orders.
           orderModel.aggregate([
    {
        $match: {
            orderStatus: { $ne: "Cancelled" },
            $or: [
                { paymentStatus: "Paid" },
                {
                    paymentMethod: "COD",
                    orderStatus: "Delivered",
                },
            ],
        },
    },
    {
        $group: {
            _id: null,
            totalRevenue: {
                $sum: {
                    $ifNull: ["$amount", 0],
                },
            },
        },
    },
]),

            // Low-stock products.
            productModel
                .find({ stock: { $lte: 5 } })
                .sort({ stock: 1 })
                .limit(5)
                .lean(),

            // Most recent orders first.
           orderModel
    .find({})
    .sort({
        date: -1,
        createdAt: -1,
        _id: -1,
    })
    .limit(8)
    .lean(),
        ]);

        const totalRevenue =
            revenueResult[0]?.totalRevenue ?? 0;

        return res.json({
            success: true,
            dashboard: {
                totalOrders,
                totalProducts,
                totalCustomers,
                totalRevenue,
                lowStockProducts,
                latestOrders,
            },
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard",
        });
    }
};

export { dashboard };

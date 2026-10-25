
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import customerModel from "../models/customerModel.js";

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const dashboard = async (req, res) => {
    try {
        console.log("ADMIN DASHBOARD: MIXED DATE SORT FIX");

        const [
            totalOrders,
            totalProducts,
            totalCustomers,
            revenueResult,
            lowStockProducts,
            allOrders,
        ] = await Promise.all([
            orderModel.countDocuments({}),

            productModel.countDocuments({}),

            customerModel.countDocuments({}),

            // Collected revenue: paid orders or delivered COD orders.
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

            productModel
                .find({ stock: { $lte: 5 } })
                .sort({ stock: 1 })
                .limit(5)
                .lean(),

            // Fetch all orders, then sort mixed date types in JavaScript.
            orderModel.find({}).lean(),
        ]);

        const getTimestamp = (value) => {
            if (value === null || value === undefined || value === "") {
                return NaN;
            }

            const timestamp =
                typeof value === "number"
                    ? value
                    : new Date(value).getTime();

            return Number.isFinite(timestamp) ? timestamp : NaN;
        };

        const getOrderTimestamp = (order) => {
            // Prefer the actual creation time when available.
            for (const value of [
                order.createdAt,
                order.date,
                order.updatedAt,
            ]) {
                const timestamp = getTimestamp(value);

                if (Number.isFinite(timestamp)) {
                    return timestamp;
                }
            }

            return 0;
        };

        const latestOrders = allOrders
            .sort((a, b) => {
                const difference =
                    getOrderTimestamp(b) - getOrderTimestamp(a);

                if (difference !== 0) {
                    return difference;
                }

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

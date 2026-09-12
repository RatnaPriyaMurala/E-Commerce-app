
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
            // ----------------------------------
            // TOTAL ORDERS
            // ----------------------------------

            orderModel.countDocuments(),

            // ----------------------------------
            // TOTAL PRODUCTS
            // ----------------------------------

            productModel.countDocuments(),

            // ----------------------------------
            // TOTAL CUSTOMERS
            // ----------------------------------
customerModel.countDocuments(),

            // ----------------------------------
            // TOTAL REVENUE
            // ----------------------------------

            orderModel.aggregate([
                {
                    $match: {
                        orderStatus: {
                            $ne: "Cancelled",
                        },

                        /*
                         * Count paid orders and COD orders
                         * as revenue only when they are not
                         * cancelled.
                         *
                         * Pending COD orders are still valid
                         * orders but are not yet collected.
                         */
                        $or: [
                            {
                                paymentStatus: "Paid",
                            },
                            {
                                paymentMethod: "COD",
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: null,

                        totalRevenue: {
                            $sum: {
                                $ifNull: [
                                    "$amount",
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),

            // ----------------------------------
            // LOW STOCK PRODUCTS
            // ----------------------------------

            productModel
                .find({
                    stock: {
                        $lte: 5,
                    },
                })
                .sort({
                    stock: 1,
                })
                .limit(5)
                .lean(),

            // ----------------------------------
            // LATEST ORDERS
            // ----------------------------------

            orderModel
                .find({})
                .sort({
                    date: -1,
                })
                .limit(8)
                .lean(),
        ]);

        const totalRevenue =
            revenueResult[0]?.totalRevenue || 0;

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
        console.error(
            "Dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load dashboard",
        });
    }
};

export {
    dashboard,
};

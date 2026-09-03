import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

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
      orderModel.countDocuments(),

      productModel.countDocuments(),

      userModel.countDocuments(),

      orderModel.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),

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

      orderModel
        .find({})
        .sort({
          date: -1,
        })
        .limit(8)
        .lean(),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

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
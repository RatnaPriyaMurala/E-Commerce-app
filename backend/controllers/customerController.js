
import mongoose from "mongoose";
import customerModel from "../models/customerModel.js";
import orderModel from "../models/orderModel.js";

/* =========================================================
   GET ALL CUSTOMERS
   ADMIN ONLY

   - Fetches saved customer records.
   - Calculates order statistics from the orders collection.
   - Matches orders using userId.
   - Does not delete or modify database records.
========================================================= */

const getCustomers = async (req, res) => {
  try {
    const customers = await customerModel
      .find({})
      .sort({
        lastOrder: -1,
        createdAt: -1,
      })
      .lean();

    if (!customers.length) {
      return res.json({
        success: true,
        customers: [],
      });
    }

    const userIds = customers
      .map((customer) => customer.userId)
      .filter(Boolean)
      .map((id) => new mongoose.Types.ObjectId(id));

    const orderStats = await orderModel.aggregate([
      {
        $match: {
          userId: { $in: userIds },
        },
      },
      {
        $addFields: {
          normalizedStatus: {
            $toLower: {
              $ifNull: ["$orderStatus", ""],
            },
          },
          normalizedPaymentStatus: {
            $toLower: {
              $ifNull: ["$paymentStatus", ""],
            },
          },
          normalizedPaymentMethod: {
            $toLower: {
              $ifNull: ["$paymentMethod", ""],
            },
          },
        },
      },
      {
        $group: {
          _id: "$userId",

          totalOrders: {
            $sum: {
              $cond: [
                {
                  $ne: ["$normalizedStatus", "cancelled"],
                },
                1,
                0,
              ],
            },
          },

          totalSpent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $ne: ["$normalizedStatus", "cancelled"],
                    },
                    {
                      $or: [
                        {
                          $eq: ["$normalizedPaymentStatus", "paid"],
                        },
                        {
                          $and: [
                            {
                              $eq: ["$normalizedPaymentMethod", "cod"],
                            },
                            {
                              $eq: ["$normalizedStatus", "delivered"],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  $ifNull: ["$amount", 0],
                },
                0,
              ],
            },
          },

          totalWeight: {
            $sum: {
              $cond: [
                {
                  $ne: ["$normalizedStatus", "cancelled"],
                },
                {
                  $sum: {
                    $map: {
                      input: { $ifNull: ["$items", []] },
                      as: "item",
                      in: {
                        $multiply: [
                          { $ifNull: ["$$item.weight", 0] },
                          { $ifNull: ["$$item.quantity", 1] },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },

          lastOrder: {
            $max: {
              $ifNull: ["$date", "$createdAt"],
            },
          },
        },
      },
    ]);

    const statsByUserId = new Map(
      orderStats.map((stats) => [
        String(stats._id),
        stats,
      ])
    );

    const formattedCustomers = customers.map((customer) => {
      const stats = customer.userId
        ? statsByUserId.get(String(customer.userId))
        : null;

      return {
        ...customer,

        name:
          `${customer.firstName || ""} ${
            customer.lastName || ""
          }`.trim() || "Customer",

        totalOrders: stats?.totalOrders ?? 0,
        totalSpent: stats?.totalSpent ?? 0,
        totalWeight: stats?.totalWeight ?? 0,
        lastOrder: stats?.lastOrder ?? customer.lastOrder ?? null,
      };
    });

    return res.json({
      success: true,
      customers: formattedCustomers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customers",
    });
  }
};

export { getCustomers };

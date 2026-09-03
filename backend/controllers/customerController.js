
import orderModel from "../models/orderModel.js";

/* =========================================================
   GET ALL CUSTOMERS
   ADMIN ONLY
========================================================= */

const getCustomers = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .sort({ date: -1 })
            .lean();

        const customersMap = new Map();

        for (const order of orders) {
            const address = order.address || {};

            const userId = order.userId
                ? order.userId.toString()
                : null;

            const phone =
                address.phone ||
                "No phone";

            /*
             * Prefer userId because phone numbers can change.
             * Fall back to phone for older orders without userId.
             */
            const customerKey =
                userId || phone;

            if (!customersMap.has(customerKey)) {
                customersMap.set(
                    customerKey,
                    {
                        userId:
                            order.userId || null,

                        name:
                            `${address.firstName || ""} ${
                                address.lastName || ""
                            }`.trim() ||
                            "Customer",

                        phone,

                        city:
                            address.city || "",

                        state:
                            address.state || "",

                        address:
                            address.address || "",

                        totalOrders: 0,

                        totalSpent: 0,

                        latestOrder:
                            order.date || null,
                    }
                );
            }

            const customer =
                customersMap.get(customerKey);

            /*
             * Every order contributes to order count.
             */
            customer.totalOrders += 1;

            /*
             * Cancelled orders should not contribute
             * to customer spending.
             */
            if (
                order.orderStatus !==
                "Cancelled"
            ) {
                customer.totalSpent +=
                    Number(order.amount) || 0;
            }

            /*
             * Keep the latest order date.
             */
            if (
                order.date &&
                (!customer.latestOrder ||
                    new Date(order.date) >
                        new Date(
                            customer.latestOrder
                        ))
            ) {
                customer.latestOrder =
                    order.date;
            }
        }

        return res.json({
            success: true,
            customers:
                Array.from(
                    customersMap.values()
                ),
        });
    } catch (error) {
        console.error(
            "Get customers error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch customers",
        });
    }
};

export {
    getCustomers,
};
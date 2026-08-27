import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const dashboard = async (req, res) => {

    try {

        const totalOrders = await orderModel.countDocuments();

        const totalProducts = await productModel.countDocuments();

        const totalCustomers = await userModel.countDocuments();

        const revenueOrders = await orderModel.find({

            orderStatus: {
                $ne: "Cancelled"
            }

        });

        let totalRevenue = 0;

        revenueOrders.forEach(order => {

            totalRevenue += order.amount;

        });

        const lowStockProducts = await productModel

            .find({

                stock: {
                    $lte: 5
                }

            })

            .sort({

                stock: 1

            })

            .limit(5);

        const latestOrders = await orderModel

            .find()

            .sort({

                date: -1

            })

            .limit(8);

        res.json({

            success: true,

            dashboard: {

                totalOrders,

                totalProducts,

                totalCustomers,

                totalRevenue,

                lowStockProducts,

                latestOrders

            }

        });

    }

    catch (error) {

        console.log(error);

        res.json({

            success: false,

            message: error.message

        });

    }

};

export { dashboard };
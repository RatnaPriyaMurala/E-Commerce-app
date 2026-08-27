import orderModel from "../models/orderModel.js";

const getCustomers = async (req, res) => {
  try {

    const orders = await orderModel.find().sort({ date: -1 });

    const customersMap = {};

    orders.forEach((order) => {

      const phone = order.address.phone;

      if (!customersMap[phone]) {

        customersMap[phone] = {
          name:
            order.address.firstName +
            " " +
            order.address.lastName,

          phone,

          city: order.address.city,

          address: order.address.address,

          totalOrders: 0,

          totalSpent: 0,

          latestOrder: order.date
        };

      }

      customersMap[phone].totalOrders++;

      customersMap[phone].totalSpent += order.amount;

      if(order.date > customersMap[phone].latestOrder){
        customersMap[phone].latestOrder = order.date;
      }

    });

    res.json({
      success: true,
      customers: Object.values(customersMap)
    });

  } catch (error) {

    console.log(error);

    res.json({
      success:false,
      message:error.message
    });

  }
};

export { getCustomers };
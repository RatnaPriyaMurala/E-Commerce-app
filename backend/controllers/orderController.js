import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// ===============================
// PLACE ORDER
// ===============================
const placeOrder = async (req, res) => {
  try {

    const {

items,
amount,
address,
paymentMethod,
paymentStatus,
paymentId,
razorpayOrderId,
razorpaySignature

} = req.body;

    console.log("========== ITEMS RECEIVED ==========");
    console.log(items);

    items.forEach(item => {
      console.log({
        name: item.name,
        weight: item.weight,
        quantity: item.quantity
      });
    });

    console.log("AUTH USER ID:", req.userId);

    // ===============================
    // UPDATE USER DETAILS
    // ===============================
    await userModel.findByIdAndUpdate(
      req.userId,
      {
        phone: address.phone,
        address: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          country: address.country
        }
      }
    );

    // ===============================
    // CHECK STOCK
    // ===============================
    console.log("========== CHECKING STOCK ==========");

    for (const item of items) {

      console.log("ITEM RECEIVED:");
      console.log(item);

      const product = await productModel.findById(item._id);

      if (!product) {

        return res.json({
          success: false,
          message: `${item.name} not found`
        });

      }

      console.log("Found Product:", product.name);
      console.log("Current Stock:", product.stock);

      const orderedWeight = Number(item.weight);

      console.log("Ordered Weight:", orderedWeight);

      if (orderedWeight > product.stock) {

        return res.json({
          success: false,
          message: `${item.name} has only ${product.stock} kg available`
        });

      }

    }

    // ===============================
    // CREATE ORDER
    // ===============================
    const orderData = {

userId: req.userId,

items,

amount,

address,

paymentMethod,

paymentStatus: paymentStatus || "Pending",

paymentId: paymentId || "",

razorpayOrderId: razorpayOrderId || "",

razorpaySignature: razorpaySignature || "",

orderStatus: "Order Placed",

date: Date.now()

};

    const newOrder = new orderModel(orderData);

    await newOrder.save();

    // ===============================
    // REDUCE PRODUCT STOCK
    // ===============================
    for (const item of items) {

      const product = await productModel.findById(item._id);

      if (!product) continue;

      const orderedWeight = Number(item.weight);

      const newStock = Math.max(
        product.stock - orderedWeight,
        0
      );

      await productModel.findByIdAndUpdate(
        product._id,
        {
          stock: newStock,
          isAvailable: newStock > 0
        },
        {
          runValidators: false
        }
      );

    }

    // ===============================
    // CLEAR USER CART
    // ===============================
    await userModel.findByIdAndUpdate(
      req.userId,
      {
        cartData: {}
      }
    );

    res.json({
      success: true,
      message: "Order placed successfully"
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

// ===============================
// USER ORDERS
// ===============================
const userOrders = async (req, res) => {

  try {

    console.log("USER ORDERS ID:", req.userId);

    const orders = await orderModel.find({
      userId: req.userId
    }).sort({
      date: -1
    });

    res.json({
      success: true,
      orders
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

// ===============================
// ADMIN ALL ORDERS
// ===============================
const allOrders = async (req, res) => {

  try {

    const orders = await orderModel
      .find({})
      .sort({
        date: -1
      });

    res.json({
      success: true,
      orders
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

// ===============================
// UPDATE ORDER STATUS
// ===============================
const updateOrderStatus = async (req, res) => {

  try {

    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: status
      }
    );

    res.json({
      success: true,
      message: "Status updated"
    });

  }

  catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

};

//----------------Cancel Order ------------//


const cancelOrder = async (req, res) => {

    try {

        const { orderId } = req.body;

        const order = await orderModel.findById(orderId);

        if (!order) {

            return res.json({
                success: false,
                message: "Order not found"
            });

        }

        // Don't allow cancellation after shipping

        if (

            order.orderStatus === "Shipped" ||

            order.orderStatus === "Out for Delivery" ||

            order.orderStatus === "Delivered"

        ) {

            return res.json({

                success: false,

                message: "Order cannot be cancelled."

            });

        }

        // Restore stock

        for (const item of order.items) {

            const product = await productModel.findById(item._id);

            if (!product) continue;

            await productModel.findByIdAndUpdate(

                item._id,

                {

                    stock: product.stock + item.weight,

                    isAvailable: true

                }

            );

        }

        order.orderStatus = "Cancelled";

        await order.save();

        res.json({

            success: true,

            message: "Order Cancelled Successfully"

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

export {
  placeOrder,
  userOrders,
  allOrders,
  updateOrderStatus,
  cancelOrder
};
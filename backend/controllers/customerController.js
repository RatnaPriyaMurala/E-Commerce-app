import customerModel from "../models/customerModel.js";

/* =========================================================
   GET ALL CUSTOMERS
   ADMIN ONLY
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

    const formattedCustomers =
      customers.map((customer) => ({
        ...customer,

        name:
          `${customer.firstName || ""} ${
            customer.lastName || ""
          }`.trim() || "Customer",
      }));

    return res.json({
      success: true,
      customers: formattedCustomers,
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
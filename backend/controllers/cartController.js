import userModel from "../models/userModel.js";

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
  
    let cartData = userData.cartData || {};

    const {itemId,weight} = req.body;

    // ✅ Ensure product object exists
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // ✅ Always store quantity as 1 (your frontend logic)
    cartData[itemId][weight] = 1;

    await userModel.findByIdAndUpdate(
req.userId,
{
cartData
}
);


res.json({
success:true,
message:"Added to cart"
});

console.log("ADD TO CART");
console.log(req.body);

}


catch(error){

res.json({
success:false,
message:error.message
})

}

}

/* ================= UPDATE CART WEIGHT ================= */
export const updateCartWeight = async (req, res) => {

    try {

        const { itemId, oldWeight, newWeight } = req.body;

        const user = await userModel.findById(req.userId);

        let cartData = user.cartData || {};

        if (!cartData[itemId]) {

            return res.json({
                success: false,
                message: "Item not found"
            });

        }

        delete cartData[itemId][oldWeight];

        cartData[itemId][newWeight] = 1;

        await userModel.findByIdAndUpdate(

            req.userId,

            {
                cartData
            }

        );

        res.json({

            success: true,

            cartData

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
/* ================= REMOVE FROM CART ================= */
/* ================= REMOVE FROM CART ================= */
export const removeFromCart = async (req, res) => {
  try {

    const { itemId } = req.body;

    console.log("REMOVE ITEM:", itemId);
    console.log("USER:", req.userId);

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = user.cartData || {};

    console.log("BEFORE:", cartData);

    delete cartData[itemId];

    user.cartData = cartData;

    await user.save();

    await userModel.updateOne(
      { _id: req.userId },
      { $set: { cartData } }
    );

    const updatedUser = await userModel.findById(req.userId);

    console.log("AFTER:", updatedUser.cartData);

    return res.json({
      success: true,
      cartData: updatedUser.cartData
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: error.message
    });

  }
};

/* ================= GET CART ================= */
export const getUserCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    res.json({
      success: true,
      cartData: user?.cartData || {}
    });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false });
  }
};

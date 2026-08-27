import Razorpay from "razorpay";
import crypto from "crypto";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// ======================================
// CREATE RAZORPAY ORDER
// ======================================

const createRazorpayOrder = async (req,res)=>{

    try{

        const {amount}=req.body;

        const options={

            amount:Number(amount)*100,

            currency:"INR",

            receipt:"receipt_"+Date.now()

        };

        const order=await razorpay.orders.create(options);

        res.json({
            success:true,
            order
        });

    }

    catch(error){

        console.log(error);

        res.json({
            success:false,
            message:error.message
        });

    }

};

// ======================================
// VERIFY PAYMENT
// ======================================

const verifyPayment=async(req,res)=>{

    try{

        const{

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,

            orderData

        }=req.body;

        const generatedSignature=

        crypto

        .createHmac(

            "sha256",

            process.env.RAZORPAY_SECRET

        )

        .update(

            razorpay_order_id+"|"+razorpay_payment_id

        )

        .digest("hex");

        if(generatedSignature!==razorpay_signature){

            return res.json({

                success:false,

                message:"Payment Verification Failed"

            });

        }

        // ===========================
        // STOCK CHECK
        // ===========================

        for(const item of orderData.items){

            const product=await productModel.findById(item._id);

            if(!product){

                return res.json({

                    success:false,

                    message:item.name+" not found"

                });

            }

            if(item.weight>product.stock){

                return res.json({

                    success:false,

                    message:item.name+" stock not available"

                });

            }

        }

        // ===========================
        // SAVE ORDER
        // ===========================

        const newOrder = new orderModel({
    userId: req.userId,
    items: orderData.items,
    amount: orderData.amount,
    address: orderData.address,

    paymentMethod: "Razorpay",
    paymentStatus: "Paid",

    orderStatus: "Order Placed",

    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,

    date: Date.now()
});

        await newOrder.save();

        // ===========================
        // REDUCE STOCK
        // ===========================

        for(const item of orderData.items){

            const product=await productModel.findById(item._id);

            const remaining=

            Math.max(

                product.stock-item.weight,

                0

            );

            await productModel.findByIdAndUpdate(

                item._id,

                {

                    stock:remaining,

                    isAvailable:remaining>0

                }

            );

        }

        // ===========================
        // CLEAR CART
        // ===========================

        await userModel.findByIdAndUpdate(

            req.userId,

            {

                cartData:{}

            }

        );

        res.json({

            success:true,

            message:"Payment Verified"

        });

    }

    catch(error){

        console.log(error);

        res.json({

            success:false,

            message:error.message

        });

    }

};

export{

createRazorpayOrder,

verifyPayment

};
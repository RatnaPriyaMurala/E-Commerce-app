import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true
    },

    items:{
        type:Array,
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    address:{
        type:Object,
        required:true
    },

    paymentMethod:{
        type:String,
        required:true
    },

    paymentStatus:{
        type:String,
        default:"Pending"
    },

    orderStatus:{
        type:String,
        default:"Order Placed"
    },
    razorpayOrderId:{
        type:String,
        default:""
    },

    razorpayPaymentId:{
        type:String,
        default:""
    },

    razorpaySignature:{
        type:String,
        default:""
    },

    date:{
        type:Number,
        default:Date.now()
    }

});

const orderModel =
mongoose.models.order ||
mongoose.model("order",orderSchema);

export default orderModel;
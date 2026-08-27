// controllers/userController.js


import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// Generate JWT token

const createToken = (id)=>{

return jwt.sign(
{id},
process.env.JWT_SECRET
);

};




// LOGIN USER

const loginUser = async(req,res)=>{


try{


const {password}=req.body;


const emailLower=req.body.email.toLowerCase();



const user=await userModel.findOne({

email:emailLower

});



if(!user){

return res.json({

success:false,

message:"User doesn't exist"

});

}




const isMatch=await bcrypt.compare(

password,

user.password

);



if(isMatch){



const token=createToken(user._id);



res.json({

success:true,

token,


userId:user._id,


user:{


_id:user._id,

name:user.name,

email:user.email,

phone:user.phone,

address:user.address,

cartData:user.cartData


},


message:"Login successful"



});



}

else{


res.json({

success:false,

message:"Invalid credentials"

});


}



}


catch(error){


console.log(error);


res.json({

success:false,

message:error.message

});


}



};








// RESET PASSWORD


const resetPassword=async(req,res)=>{


try{


const {

email,

password

}=req.body;



const emailLower=email.toLowerCase();



if(!emailLower || !password){


return res.json({

success:false,

message:"Email and password required"

});


}




const user=await userModel.findOne({

email:emailLower

});



if(!user){


return res.json({

success:false,

message:"User doesn't exist"

});


}




const salt=await bcrypt.genSalt(10);



user.password=await bcrypt.hash(

password,

salt

);



await user.save();




res.json({

success:true,

message:"Password changed successfully"

});




}


catch(error){


res.json({

success:false,

message:error.message

});


}


};









// REGISTER USER


const registerUser=async(req,res)=>{


try{


const {

name,

email,

password,

phone


}=req.body;



const emailLower=email.toLowerCase();





const exists=await userModel.findOne({

email:emailLower

});



if(exists){


return res.json({

success:false,

message:"User already exists"

});


}





if(!validator.isEmail(emailLower)){


return res.json({

success:false,

message:"Please enter valid email"

});


}




if(password.length < 8){


return res.json({

success:false,

message:"Password must be at least 8 characters"

});


}






const salt=await bcrypt.genSalt(10);



const hashedPassword=await bcrypt.hash(

password,

salt

);





const newUser=new userModel({


name,

email:emailLower,

phone,

password:hashedPassword



});





const user=await newUser.save();



const token=createToken(user._id);





res.json({

success:true,

token,


userId:user._id,


user:{


_id:user._id,

name:user.name,

email:user.email,

phone:user.phone,

address:user.address

},


message:"User registered successfully"



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









// GET PROFILE


const getProfile=async(req,res)=>{


try{


const user=await userModel.findById(req.userId)

.select("-password");




res.json({

success:true,

user

});




}


catch(error){


res.json({

success:false,

message:error.message

});


}


};










// ADMIN LOGIN


const adminLogin=async(req,res)=>{


try{


const {

email,

password

}=req.body;




if(

email.trim()===process.env.ADMIN_EMAIL.trim()

&&

password.trim()===process.env.ADMIN_PASSWORD.trim()

){


const token=jwt.sign(

{email},

process.env.JWT_SECRET,

{expiresIn:"7d"}

);



return res.json({

success:true,

token,

message:"Admin login successful"

});


}




res.json({

success:false,

message:"Invalid credentials"

});



}



catch(error){


res.json({

success:false,

message:error.message

});


}


};









// USER ORDERS


const userOrders=async(req,res)=>{


try{


const orders=await orderModel.find({

userId:req.userId

});



res.json({

success:true,

orders

});



}


catch(error){


res.json({

success:false,

message:error.message

});


}


};









// UPDATE PROFILE


const updateProfile = async(req,res)=>{

try{


const {
name,
phone,
address

}=req.body;



const user=await userModel.findByIdAndUpdate(

req.userId,

{

name,

phone,

address

},

{
new:true
}


).select("-password");



res.json({

success:true,

user

});



}

catch(error){

res.json({

success:false,

message:error.message

});

}


}







export {


registerUser,

loginUser,

adminLogin,

resetPassword,

getProfile,

userOrders,

updateProfile

};
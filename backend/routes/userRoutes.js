import express from 'express';
import { loginUser, registerUser, adminLogin, resetPassword, getProfile, updateProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post("/reset-password",resetPassword);
userRouter.get("/profile",authUser,getProfile);
userRouter.post("/update-profile",authUser,updateProfile);

export default userRouter;
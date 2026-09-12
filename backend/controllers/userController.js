// controllers/userController.js

import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import customerModel from "../models/customerModel.js";

import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ======================================
// CREATE JWT TOKEN
// ======================================

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ======================================
// LOGIN USER
// ======================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const emailLower =
            email.trim().toLowerCase();

        const user = await userModel.findOne({
            email: emailLower,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist",
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        /* =================================================
           MAKE SURE CUSTOMER PROFILE EXISTS
           
           This also handles older users who registered
           before the customer collection was introduced.
        ================================================= */

        let customer =
            await customerModel.findOne({
                userId: user._id,
            });

        if (!customer) {
            const customerCount =
                await customerModel.countDocuments();

            const nextNumber =
                customerCount + 1;

            const customerId =
                `CUS${String(nextNumber).padStart(6, "0")}`;

            customer =
                await customerModel.create({
                    customerId,

                    userId: user._id,

                    firstName:
                        user.name?.trim() || "Customer",

                    lastName: "",

                    phone:
                        user.phone || "",

                    address:
                        user.address?.address || "",

                    city:
                        user.address?.city || "",

                    state:
                        user.address?.state || "",

                    zipcode:
                        user.address?.zipcode || "",

                    country:
                        user.address?.country ||
                        "India",

                    totalOrders: 0,

                    totalSpent: 0,

                    totalWeight: 0,

                    lastOrder: null,
                });

            console.log(
                "✅ Customer profile created during login:",
                customer.customerId
            );
        }

        const token =
            createToken(user._id);

        return res.json({
            success: true,

            token,

            userId: user._id,

            customerId:
                customer.customerId,

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                cartData: user.cartData,
            },

            message: "Login successful",
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to login",
        });
    }
};

// ======================================
// RESET PASSWORD
// ======================================

const resetPassword = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const emailLower =
            email.trim().toLowerCase();

        if (!validator.isEmail(emailLower)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters",
            });
        }

        const user =
            await userModel.findOne({
                email: emailLower,
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist",
            });
        }

        const salt =
            await bcrypt.genSalt(10);

        user.password =
            await bcrypt.hash(
                password,
                salt
            );

        await user.save();

        return res.json({
            success: true,
            message:
                "Password changed successfully",
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to reset password",
        });
    }
};

// ======================================
// REGISTER USER
// ======================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
        } = req.body;

        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required",
            });
        }

        const cleanName =
            name.trim();

        const emailLower =
            email.trim().toLowerCase();

        const cleanPhone =
            phone?.trim() || "";

        if (!validator.isEmail(emailLower)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters",
            });
        }

        const exists =
            await userModel.findOne({
                email: emailLower,
            });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(
                password,
                salt
            );

        /* =================================================
           CREATE USER
        ================================================= */

        const newUser =
            new userModel({
                name: cleanName,

                email: emailLower,

                phone: cleanPhone,

                password: hashedPassword,
            });

        const user =
            await newUser.save();

        /* =================================================
           CREATE CUSTOMER PROFILE
           
           Customer is created immediately after signup.
           Payment is NOT required.
        ================================================= */

        const customerCount =
            await customerModel.countDocuments();

        const nextNumber =
            customerCount + 1;

        const customerId =
            `CUS${String(nextNumber).padStart(6, "0")}`;

        const customer =
            await customerModel.create({
                customerId,

                userId: user._id,

                firstName:
                    cleanName,

                lastName: "",

                phone:
                    cleanPhone,

                address: "",

                city: "",

                state: "",

                zipcode: "",

                country: "India",

                totalOrders: 0,

                totalSpent: 0,

                totalWeight: 0,

                lastOrder: null,
            });

        console.log(
            "✅ Customer created:",
            customer.customerId
        );

        /* =================================================
           AUTOMATIC LOGIN AFTER SIGNUP
        ================================================= */

        const token =
            createToken(user._id);

        return res.status(201).json({
            success: true,

            token,

            userId: user._id,

            customerId:
                customer.customerId,

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },

            message:
                "User registered successfully",
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to register user",
        });
    }
};

// ======================================
// GET PROFILE
// ======================================

const getProfile = async (req, res) => {
    try {
        const user =
            await userModel
                .findById(req.userId)
                .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const customer =
            await customerModel.findOne({
                userId: user._id,
            });

        return res.json({
            success: true,

            user,

            customer: customer || null,

            customerId:
                customer?.customerId || null,
        });

    } catch (error) {
        console.error(
            "Get profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to fetch profile",
        });
    }
};

// ======================================
// ADMIN LOGIN
// ======================================

const adminLogin = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const adminEmail =
            process.env.ADMIN_EMAIL;

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        if (
            !adminEmail ||
            !adminPassword
        ) {
            console.error(
                "Admin credentials are missing from environment variables"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Admin login is not configured",
            });
        }

        const emailMatch =
            email.trim().toLowerCase() ===
            adminEmail.trim().toLowerCase();

        const passwordMatch =
            password === adminPassword;

        if (
            emailMatch &&
            passwordMatch
        ) {
            const token =
                jwt.sign(
                    {
                        email:
                            adminEmail,
                        role: "admin",
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "7d",
                    }
                );

            return res.json({
                success: true,
                token,
                message:
                    "Admin login successful",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });

    } catch (error) {
        console.error(
            "Admin login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to login as admin",
        });
    }
};

// ======================================
// USER ORDERS
// ======================================

const userOrders = async (req, res) => {
    try {
        const orders =
            await orderModel
                .find({
                    userId: req.userId,
                })
                .sort({
                    date: -1,
                });

        return res.json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error(
            "User orders error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to fetch orders",
        });
    }
};

// ======================================
// UPDATE PROFILE
// ======================================

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
        } = req.body;

        const updateData = {};

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Name cannot be empty",
                });
            }

            updateData.name =
                name.trim();
        }

        if (phone !== undefined) {
            updateData.phone =
                phone.trim();
        }

        if (address !== undefined) {
            updateData.address =
                address;
        }

        const user =
            await userModel
                .findByIdAndUpdate(
                    req.userId,
                    updateData,
                    {
                        new: true,
                        runValidators: true,
                    }
                )
                .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        /* =================================================
           UPDATE CUSTOMER PROFILE TOO
        ================================================= */

        const customer =
            await customerModel.findOne({
                userId: req.userId,
            });

        if (customer) {
            if (name !== undefined) {
                customer.firstName =
                    name.trim();
            }

            if (phone !== undefined) {
                customer.phone =
                    phone.trim();
            }

            if (address !== undefined) {
                customer.address =
                    address.address || "";

                customer.city =
                    address.city || "";

                customer.state =
                    address.state || "";

                customer.zipcode =
                    address.zipcode || "";

                customer.country =
                    address.country ||
                    "India";
            }

            await customer.save();
        }

        return res.json({
            success: true,

            user,

            customer:
                customer || null,

            customerId:
                customer?.customerId ||
                null,
        });

    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to update profile",
        });
    }
};

// ======================================
// EXPORT
// ======================================

export {
    registerUser,
    loginUser,
    adminLogin,
    resetPassword,
    getProfile,
    userOrders,
    updateProfile,
};
// controllers/userController.js
import mongoose from "mongoose";
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

// ======================================
// UPDATE PROFILE
// ======================================

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            firstName,
            lastName,
            phone,
        } = req.body || {};

        // The profile form sends delivery details inside `address`.
        // Supports older requests as well.
        const incomingAddress =
            req.body?.address &&
            typeof req.body.address === "object" &&
            !Array.isArray(req.body.address)
                ? req.body.address
                : null;

        const clean = (value, fallback = "") => {
            if (value === undefined || value === null) {
                return fallback;
            }

            return String(value).trim();
        };

        // Find the existing user.
        const existingUser = await userModel.findById(
            req.userId
        );

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // --------------------------------------
        // UPDATE CUSTOMER NAME
        // --------------------------------------

        let updatedName = existingUser.name;

        if (name !== undefined) {
            updatedName = clean(name);

            if (!updatedName) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }
        } else if (
            firstName !== undefined ||
            lastName !== undefined
        ) {
            const currentParts = clean(existingUser.name)
                .split(/\s+/)
                .filter(Boolean);

            const currentFirstName = currentParts.shift() || "";
            const currentLastName = currentParts.join(" ");

            const nextFirstName = clean(
                firstName,
                currentFirstName
            );

            const nextLastName = clean(
                lastName,
                currentLastName
            );

            if (!nextFirstName) {
                return res.status(400).json({
                    success: false,
                    message: "First name cannot be empty",
                });
            }

            updatedName = [
                nextFirstName,
                nextLastName,
            ].filter(Boolean).join(" ");
        }

        // --------------------------------------
        // VALIDATE PRIMARY PHONE
        // --------------------------------------

        if (phone !== undefined && clean(phone)) {
            if (!/^\d{10}$/.test(clean(phone))) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid 10-digit phone number",
                });
            }
        }

        // --------------------------------------
        // PRESERVE EXISTING ADDRESS INFORMATION
        // --------------------------------------

        const oldAddress =
            existingUser.address?.toObject?.() ||
            existingUser.address ||
            {};

        let nextAddress = oldAddress;

        if (incomingAddress) {
            nextAddress = {
                ...oldAddress,

                firstName: clean(
                    incomingAddress.firstName,
                    clean(firstName, oldAddress.firstName || "")
                ),

                lastName: clean(
                    incomingAddress.lastName,
                    clean(lastName, oldAddress.lastName || "")
                ),

                phone: clean(
                    incomingAddress.phone,
                    clean(phone, oldAddress.phone || existingUser.phone || "")
                ),

                alternatePhone: clean(
                    incomingAddress.alternatePhone,
                    oldAddress.alternatePhone || ""
                ),

                deliveryPoint: clean(
                    incomingAddress.deliveryPoint,
                    oldAddress.deliveryPoint || ""
                ),

                landmark: clean(
                    incomingAddress.landmark,
                    oldAddress.landmark || ""
                ),

                address: clean(
                    incomingAddress.address,
                    oldAddress.address || ""
                ),

                city: clean(
                    incomingAddress.city,
                    oldAddress.city || ""
                ),

                state: clean(
                    incomingAddress.state,
                    oldAddress.state || ""
                ),

                zipcode: clean(
                    incomingAddress.zipcode,
                    oldAddress.zipcode || ""
                ),

                country: clean(
                    incomingAddress.country,
                    oldAddress.country || "India"
                ) || "India",
            };

            // --------------------------------------
            // VALIDATE ADDRESS PHONE NUMBERS
            // --------------------------------------

            const mainPhone = clean(
                incomingAddress.phone,
                clean(phone, existingUser.phone || "")
            );

            const alternatePhone = clean(
                incomingAddress.alternatePhone,
                oldAddress.alternatePhone || ""
            );

            if (
                mainPhone &&
                !/^\d{10}$/.test(mainPhone)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid 10-digit phone number",
                });
            }

            if (
                alternatePhone &&
                !/^\d{10}$/.test(alternatePhone)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid 10-digit alternate phone number",
                });
            }

            if (
                alternatePhone &&
                mainPhone &&
                alternatePhone === mainPhone
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Alternate phone number must be different from the primary phone number",
                });
            }

            // Validate PIN code when provided.
            if (
                nextAddress.zipcode &&
                !/^\d{6}$/.test(nextAddress.zipcode)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please enter a valid 6-digit PIN code",
                });
            }
        }

        // --------------------------------------
        // SAVE USER PROFILE
        // --------------------------------------

        const updateData = {};

        if (updatedName !== existingUser.name) {
            updateData.name = updatedName;
        }

        if (phone !== undefined) {
            updateData.phone = clean(phone);
        }

        if (incomingAddress) {
            updateData.address = nextAddress;
        }

        const user = await userModel.findByIdAndUpdate(
            req.userId,
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // --------------------------------------
        // SYNC ADMIN CUSTOMER PROFILE
        // --------------------------------------

        let customer = await customerModel.findOne({
            userId: req.userId,
        });

        // Create a customer record if one does not exist.
        if (!customer) {
            const customerCount =
                await customerModel.countDocuments();

            const customerId =
                `CUS${String(customerCount + 1).padStart(6, "0")}`;

            customer = new customerModel({
                customerId,
                userId: user._id,

                firstName: clean(
                    user.address?.firstName,
                    user.name || "Customer"
                ),

                lastName: clean(
                    user.address?.lastName
                ),

                phone:
                    user.address?.phone ||
                    user.phone ||
                    "",

                totalOrders: 0,
                totalSpent: 0,
                totalWeight: 0,
                lastOrder: null,
            });
        }

        // Keep the customer's name synchronized.
        if (
            name !== undefined ||
            firstName !== undefined ||
            lastName !== undefined
        ) {
            const nameParts = clean(user.name)
                .split(/\s+/)
                .filter(Boolean);

            customer.firstName = clean(
                user.address?.firstName,
                nameParts.shift() || "Customer"
            );

            customer.lastName = clean(
                user.address?.lastName,
                nameParts.join(" ")
            );
        }

        // Synchronize contact information.
        if (phone !== undefined || incomingAddress) {
            customer.phone = clean(
                user.address?.phone,
                user.phone || ""
            );
        }

        // Synchronize all delivery fields.
        if (incomingAddress) {
            customer.alternatePhone = clean(
                user.address?.alternatePhone
            );

            customer.deliveryPoint = clean(
                user.address?.deliveryPoint
            );

            customer.landmark = clean(
                user.address?.landmark
            );

            customer.address = clean(
                user.address?.address
            );

            customer.city = clean(
                user.address?.city
            );

            customer.state = clean(
                user.address?.state
            );

            customer.zipcode = clean(
                user.address?.zipcode
            );

            customer.country = clean(
                user.address?.country,
                "India"
            ) || "India";
        }

        await customer.save();

        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user,
            customer,
            customerId: customer.customerId || null,
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
// GET USER FAVORITES
// ======================================

const getFavorites = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.userId)
            .select("-password")
            .populate("favorites");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Remove products that no longer exist
        const validFavorites =
            (user.favorites || []).filter(Boolean);

        return res.json({
            success: true,
            favorites: validFavorites,
        });

    } catch (error) {
        console.error(
            "Get favorites error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to fetch favorites",
        });
    }
};


// ======================================
// ADD FAVORITE
// ======================================

const addFavorite = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Check whether product exists
        const productExists =
            await mongoose.model("product").findById(
                productId
            );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const user =
            await userModel.findByIdAndUpdate(
                req.userId,
                {
                    $addToSet: {
                        favorites: productId,
                    },
                },
                {
                    new: true,
                }
            ).populate("favorites");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            message: "Added to favorites",
            favorites: user.favorites || [],
        });

    } catch (error) {
        console.error(
            "Add favorite error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to add favorite",
        });
    }
};


// ======================================
// REMOVE FAVORITE
// ======================================

const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const user =
            await userModel.findByIdAndUpdate(
                req.userId,
                {
                    $pull: {
                        favorites: productId,
                    },
                },
                {
                    new: true,
                }
            ).populate("favorites");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            message: "Removed from favorites",
            favorites: user.favorites || [],
        });

    } catch (error) {
        console.error(
            "Remove favorite error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to remove favorite",
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
    getFavorites,
    addFavorite,
    removeFavorite,
};
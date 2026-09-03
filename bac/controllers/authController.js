const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ===========================================================
// Register New User
// POST /api/auth/register
// Public
// ===========================================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            city,
            state,
            pincode,
        } = req.body;

        // ------------------------------------------
        // Validation
        // ------------------------------------------

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        // ------------------------------------------
        // Check Existing User
        // ------------------------------------------

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // ------------------------------------------
        // Create User
        // IMPORTANT:
        // Public registration = Citizen
        // ------------------------------------------

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            phone: phone.trim(),

            // Never trust role from public registration
            role: "Citizen",

            address: address || "",
            city: city || "",
            state: state || "",
            pincode: pincode || "",
        });

        // ------------------------------------------
        // Generate JWT
        // ------------------------------------------

        const token = generateToken(user._id);

        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user: user.toJSON(),
        });

    } catch (error) {

        console.error("========== REGISTER ERROR ==========");
        console.error(error);

        // Duplicate email race-condition
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "production"
                    ? "Registration failed"
                    : error.message,
        });
    }
};


// ===========================================================
// Login User
// POST /api/auth/login
// Public
// ===========================================================

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // ------------------------------------------
        // Validation
        // ------------------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }

        // ------------------------------------------
        // Find User
        // password normally has select:false
        // ------------------------------------------

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // ------------------------------------------
        // Check Account Active
        // ------------------------------------------

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been disabled.",
            });
        }

        // ------------------------------------------
        // Compare Password
        // ------------------------------------------

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // ------------------------------------------
        // Update Last Login
        // ------------------------------------------

        user.lastLogin = new Date();

        await user.save();

        // ------------------------------------------
        // Generate JWT
        // ------------------------------------------

        const token = generateToken(user._id);

        // ------------------------------------------
        // Remove Password
        // ------------------------------------------

        const userResponse = user.toJSON();

        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: userResponse,
        });

    } catch (error) {

        console.error("========== LOGIN ERROR ==========");
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                process.env.NODE_ENV === "production"
                    ? "Login failed"
                    : error.message,
        });
    }
};


// ===========================================================
// Get Currently Logged-In User
// GET /api/auth/me
// Private
// ===========================================================

const getMe = async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            data: req.user,
        });

    } catch (error) {

        console.error("========== GET ME ERROR ==========");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch user information",
        });
    }
};


// ===========================================================
// Export
// ===========================================================

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
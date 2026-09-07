const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================================
// Protect Routes
// Verify JWT Token
// ======================================================

const protect = async (req, res, next) => {
    try {
        let token;

        // ------------------------------------------
        // Check Authorization Header
        // ------------------------------------------

        const authHeader = req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            token = authHeader.split(" ")[1];
        }

        // ------------------------------------------
        // Token Missing
        // ------------------------------------------

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });
        }

        // ------------------------------------------
        // JWT Secret Check
        // ------------------------------------------

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env");

            return res.status(500).json({
                success: false,
                message: "Server authentication configuration error."
            });
        }

        // ------------------------------------------
        // Verify Token
        // ------------------------------------------

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ------------------------------------------
        // Find User
        // ------------------------------------------

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found."
            });
        }

        // ------------------------------------------
        // Check Account Status
        // ------------------------------------------

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been disabled."
            });
        }

        // ------------------------------------------
        // Store User In Request
        // ------------------------------------------

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );

        // ------------------------------------------
        // JWT Errors
        // ------------------------------------------

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token."
            });
        }

        // ------------------------------------------
        // General Authentication Error
        // ------------------------------------------

        return res.status(401).json({
            success: false,
            message: "Authentication failed."
        });
    }
};


// ======================================================
// Role Based Authorization
// ======================================================

const authorize = (...roles) => {

    return (req, res, next) => {

        // User should already be added by protect()
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        // Check Role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource.",
                requiredRoles: roles,
                currentRole: req.user.role
            });
        }

        next();
    };
};


// ======================================================
// Export
// ======================================================

module.exports = {
    protect,
    authorize
};
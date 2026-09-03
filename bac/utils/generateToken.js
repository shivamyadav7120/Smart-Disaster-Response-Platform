
const jwt = require("jsonwebtoken");

// ==========================================
// Generate JWT Token
// ==========================================

const generateToken = (userId) => {

    // ==========================================
    // Check JWT Secret
    // ==========================================

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    // ==========================================
    // Generate Token
    // ==========================================

    const token = jwt.sign(
        {
            id: userId.toString(),
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        }
    );

    return token;
};


// ==========================================
// Export Function
// ==========================================

module.exports = generateToken;


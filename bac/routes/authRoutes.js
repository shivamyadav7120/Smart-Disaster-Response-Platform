const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private Route — used by AuthContext.jsx on app load to restore the session
router.get("/me", protect, getMe);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
    getMyProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// ========================================
// Logged In User
// ========================================

// Get My Profile
router.get("/profile", protect, getMyProfile);

// ========================================
// Admin Routes
// ========================================

// Get All Users
router.get(
    "/",
    protect,
    authorize("SuperAdmin", "DistrictAdmin"),
    getAllUsers
);

// Get User By ID
router.get(
    "/:id",
    protect,
    authorize("SuperAdmin", "DistrictAdmin"),
    getUserById
);

// Update User
router.put(
    "/:id",
    protect,
    authorize("SuperAdmin", "DistrictAdmin"),
    updateUser
);

// Delete User
router.delete(
    "/:id",
    protect,
    authorize("SuperAdmin"),
    deleteUser
);

module.exports = router;
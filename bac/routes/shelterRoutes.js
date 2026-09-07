const express = require("express");
const router = express.Router();

const {
    createShelter,
    getAllShelters,
    getShelterById,
    updateShelter,
    deleteShelter
} = require("../controllers/shelterController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// =========================================
// Public Routes
// =========================================

// Get All Shelters
router.get("/", protect, getAllShelters);

// Get Shelter By ID
router.get("/:id", protect, getShelterById);

// =========================================
// Admin Routes
// =========================================

// Create Shelter
router.post(
    "/",
    protect,
    authorize("DistrictAdmin", "SuperAdmin"),
    createShelter
);

// Update Shelter
router.put(
    "/:id",
    protect,
    authorize("DistrictAdmin", "SuperAdmin"),
    updateShelter
);

// Delete Shelter
router.delete(
    "/:id",
    protect,
    authorize("SuperAdmin"),
    deleteShelter
);

module.exports = router;
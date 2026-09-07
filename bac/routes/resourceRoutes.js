const express = require("express");
const router = express.Router();

// ==========================================
// Controllers
// ==========================================

const {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
} = require("../controllers/resourceController");

// ==========================================
// Middleware
// ==========================================

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// ==========================================
// Resource CRUD Routes
// ==========================================

// Create Resource
// POST /api/resources
router.post(
    "/",
    protect,
    authorize("SuperAdmin", "DistrictAdmin"),
    createResource
);

// Get All Resources
// GET /api/resources
router.get(
    "/",
    protect,
    getAllResources
);

// Get Resource By ID
// GET /api/resources/:id
router.get(
    "/:id",
    protect,
    getResourceById
);

// Update Resource
// PUT /api/resources/:id
router.put(
    "/:id",
    protect,
    authorize("SuperAdmin", "DistrictAdmin"),
    updateResource
);

// Delete Resource
// DELETE /api/resources/:id
router.delete(
    "/:id",
    protect,
    authorize("SuperAdmin"),
    deleteResource
);

module.exports = router;
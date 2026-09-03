const express = require("express");
const router = express.Router();

const {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitalController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");


// ========================================
// Get All Hospitals
// ========================================
router.get(
  "/",
  protect,
  getAllHospitals
);


// ========================================
// Get Hospital By ID
// ========================================
router.get(
  "/:id",
  protect,
  getHospitalById
);


// ========================================
// Create Hospital
// ========================================
router.post(
  "/",
  protect,
  authorize("SuperAdmin", "DistrictAdmin", "Hospital"),
  createHospital
);


// ========================================
// Update Hospital
// ========================================
router.put(
  "/:id",
  protect,
  authorize("SuperAdmin", "DistrictAdmin", "Hospital"),
  updateHospital
);


// ========================================
// Delete Hospital
// ========================================
router.delete(
  "/:id",
  protect,
  authorize("SuperAdmin"),
  deleteHospital
);


// IMPORTANT
// Export Router
module.exports = router;
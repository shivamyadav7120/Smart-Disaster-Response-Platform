const express = require("express");
const router = express.Router();


const {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
} = require("../controllers/volunteerController");


const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");



// ========================================
// Volunteer Routes
// ========================================


// Get All Volunteers
router.get(
  "/",
  protect,
  getAllVolunteers
);


// Get Volunteer By ID
router.get(
  "/:id",
  protect,
  getVolunteerById
);



// ========================================
// Admin Routes
// ========================================


// Create Volunteer
router.post(
  "/",
  protect,
  authorize(
    "SuperAdmin",
    "DistrictAdmin",
    "NGO"
  ),
  createVolunteer
);



// Update Volunteer
router.put(
  "/:id",
  protect,
  authorize(
    "SuperAdmin",
    "DistrictAdmin",
    "NGO"
  ),
  updateVolunteer
);



// Delete Volunteer
router.delete(
  "/:id",
  protect,
  authorize(
    "SuperAdmin"
  ),
  deleteVolunteer
);



module.exports = router;
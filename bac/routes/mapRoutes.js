const express = require("express");

const router = express.Router();


// Controllers
const {
    updateLocation,
    getLiveVolunteers,
    getLiveRescueTeams,
    getNearbyVolunteers,
    getNearbyHospitals,
    getNearbyShelters

} = require("../controllers/mapController");


// Middleware
const {
    protect

} = require("../middleware/authMiddleware");




// ==========================================
// Update User / Volunteer Location
// POST /api/map/update-location
// ==========================================

router.post(
    "/update-location",
    protect,
    updateLocation
);




// ==========================================
// Live Volunteer Tracking
// GET /api/map/live-volunteers
// ==========================================

router.get(
    "/live-volunteers",
    protect,
    getLiveVolunteers
);

// Live Rescue Team Tracking
router.get(
    "/live-rescue-teams",
    protect,
    getLiveRescueTeams
);




// ==========================================
// Nearby Volunteers With Distance
// GET /api/map/volunteers
// ==========================================

router.get(
    "/volunteers",
    protect,
    getNearbyVolunteers
);




// ==========================================
// Nearby Hospitals With Distance
// GET /api/map/hospitals
// ==========================================

router.get(
    "/hospitals",
    protect,
    getNearbyHospitals
);




// ==========================================
// Nearby Shelters With Distance
// GET /api/map/shelters
// ==========================================

router.get(
    "/shelters",
    protect,
    getNearbyShelters
);



module.exports = router;
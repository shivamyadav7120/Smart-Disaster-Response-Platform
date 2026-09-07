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
const { protect, authorize } = require("../middleware/authMiddleware");
const { listRiskZones, createRiskZone, updateRiskZone, deleteRiskZone, listBlockedRoads, createBlockedRoad, updateBlockedRoad, deleteBlockedRoad } = require("../controllers/mapDataController");




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




router.get("/risk-zones", protect, listRiskZones);
router.post("/risk-zones", protect, authorize("SuperAdmin","DistrictAdmin"), createRiskZone);
router.put("/risk-zones/:id", protect, authorize("SuperAdmin","DistrictAdmin"), updateRiskZone);
router.delete("/risk-zones/:id", protect, authorize("SuperAdmin","DistrictAdmin"), deleteRiskZone);
router.get("/blocked-roads", protect, listBlockedRoads);
router.post("/blocked-roads", protect, authorize("SuperAdmin","DistrictAdmin"), createBlockedRoad);
router.put("/blocked-roads/:id", protect, authorize("SuperAdmin","DistrictAdmin"), updateBlockedRoad);
router.delete("/blocked-roads/:id", protect, authorize("SuperAdmin","DistrictAdmin"), deleteBlockedRoad);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
    getRescueTeams, getLiveRescueTeams, getRescueTeamById, createRescueTeam,
    updateRescueTeam, deleteRescueTeam, updateRescueTeamLocation, stopRescueTeamLocation, getMyRescueTeam,
    getMyAssignments, assignRescueTeam, trackMyRescueTeam, updateAssignedSOSStatus,
} = require("../controllers/rescueTeamController");
const { protect, authorize } = require("../middleware/authMiddleware");
router.use(protect);
router.get("/my", authorize("RescueTeam"), getMyRescueTeam);
router.get("/my/assignments", authorize("RescueTeam"), getMyAssignments);
router.get("/track/my", authorize("Citizen"), trackMyRescueTeam);
router.post("/my/location", authorize("RescueTeam"), updateRescueTeamLocation);
router.post("/my/location/stop", authorize("RescueTeam"), stopRescueTeamLocation);
router.patch("/my/assignments/:sosId/status", authorize("RescueTeam"), updateAssignedSOSStatus);
router.get("/live", authorize("SuperAdmin", "DistrictAdmin", "NGO", "Police", "Volunteer"), getLiveRescueTeams);
router.get("/", authorize("SuperAdmin", "DistrictAdmin", "NGO", "Police", "Volunteer"), getRescueTeams);
router.get("/:id", authorize("SuperAdmin", "DistrictAdmin", "NGO", "Police", "Volunteer"), getRescueTeamById);
router.post("/", authorize("SuperAdmin", "DistrictAdmin", "NGO"), createRescueTeam);
router.patch("/assign/:sosId", authorize("SuperAdmin", "DistrictAdmin", "NGO"), assignRescueTeam);
router.put("/:id", authorize("SuperAdmin", "DistrictAdmin", "NGO"), updateRescueTeam);
router.delete("/:id", authorize("SuperAdmin"), deleteRescueTeam);
module.exports = router;

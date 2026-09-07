const express = require("express");

const router = express.Router();

const { getStats, getAnalytics } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getStats);
router.get("/analytics", protect, getAnalytics);

module.exports = router;
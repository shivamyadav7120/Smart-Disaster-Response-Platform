const express = require("express");
const { getCurrentWeather } = require("../controllers/weatherController");

const router = express.Router();

router.get("/", getCurrentWeather);

module.exports = router;

const { getWeather } = require("../services/weatherService");

// GET /api/weather?lat=..&lon=..
// Defaults to Ghaziabad/Delhi-NCR coordinates when no lat/lon supplied.
const getCurrentWeather = async (req, res) => {
    try {
        const lat = req.query.lat;
        const lon = req.query.lon;
        if (lat == null || lon == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
            return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
        }

        const weather = await getWeather(lat, lon);

        res.status(200).json({
            success: true,
            data: weather
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCurrentWeather
};

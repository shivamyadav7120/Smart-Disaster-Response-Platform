const { getWeather } = require("../services/weatherService");

// GET /api/weather?lat=..&lon=..
// Defaults to Ghaziabad/Delhi-NCR coordinates when no lat/lon supplied.
const getCurrentWeather = async (req, res) => {
    try {
        const lat = req.query.lat || 28.6692;
        const lon = req.query.lon || 77.4538;

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

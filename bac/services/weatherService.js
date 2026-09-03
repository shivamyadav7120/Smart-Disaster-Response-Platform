const axios = require("axios");

const getWeather = async (lat, lon) => {
    try {
        // Default location: Ghaziabad
        const latitude = Number(lat ?? 28.6692);
        const longitude = Number(lon ?? 77.4538);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            throw new Error("Invalid latitude or longitude");
        }

        if (!process.env.WEATHER_API_KEY) {
            throw new Error("WEATHER_API_KEY is missing");
        }

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: process.env.WEATHER_API_KEY,
                    units: "metric",
                },
                timeout: 10000,
            }
        );

        const data = response.data;

        return {
            location: data?.name || "Unknown location",

            temperature:
                data?.main?.temp ?? null,

            feelsLike:
                data?.main?.feels_like ?? null,

            humidity:
                data?.main?.humidity ?? null,

            pressure:
                data?.main?.pressure ?? null,

            windSpeed:
                data?.wind?.speed ?? null,

            weather:
                data?.weather?.[0]?.main || "Unknown",

            description:
                data?.weather?.[0]?.description || "",

            icon:
                data?.weather?.[0]?.icon || null,
        };
    } catch (error) {
        console.error(
            "Weather API Error:",
            error.response?.data || error.message
        );

        throw new Error("Unable to fetch weather data");
    }
};

module.exports = {
    getWeather,
};
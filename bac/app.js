// ==========================================
// Smart Disaster Response Platform
// app.js
// ==========================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

// ==========================================
// Routes
// ==========================================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sosRoutes = require("./routes/sosRoutes");
const shelterRoutes = require("./routes/shelterRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

const hospitalRoutes = require("./routes/hospitalRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const mapRoutes = require("./routes/mapRoutes");
const rescueTeamRoutes = require("./routes/rescueTeamRoutes");
const gisRoutes = require("./routes/gisRoutes");

const weatherRoutes = require("./routes/weatherRoutes");
const statsRoutes = require("./routes/statsRoutes");

// ==========================================
// Middlewares
// ==========================================

// CORS
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header
            // such as Postman/server-to-server requests.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

// ==========================================
// Body Parsers
// ==========================================

app.use(
    express.json({
        limit: "10mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

// ==========================================
// Logger
// ==========================================

app.use(morgan("dev"));

// ==========================================
// Static Upload Folder
// ==========================================

// Files inside:
// uploads/
//
// Accessible as:
// http://localhost:5000/uploads/filename.jpg

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,

        project:
            "Smart Disaster Response Platform",

        message:
            "Backend Running Successfully",

        version: "1.0.0",

        services: {
            database: "MongoDB",
            socket: "Socket.IO",
            upload: "Multer",
            weather: "OpenWeather",
            gis: "Nominatim + OSRM",
        },
    });
});

// ==========================================
// API ROUTES
// ==========================================

// ------------------------------------------
// Authentication
// ------------------------------------------

app.use(
    "/api/auth",
    authRoutes
);

// ------------------------------------------
// Users
// ------------------------------------------

app.use(
    "/api/users",
    userRoutes
);

// ------------------------------------------
// SOS
// ------------------------------------------

app.use(
    "/api/sos",
    sosRoutes
);

// ------------------------------------------
// Shelters
// ------------------------------------------

app.use(
    "/api/shelters",
    shelterRoutes
);

// ------------------------------------------
// Resources
// ------------------------------------------

app.use(
    "/api/resources",
    resourceRoutes
);

// ==========================================
// PHASE 5
// ==========================================

// ------------------------------------------
// Hospitals
// ------------------------------------------

app.use(
    "/api/hospitals",
    hospitalRoutes
);

// ------------------------------------------
// Volunteers
// ------------------------------------------

app.use(
    "/api/volunteers",
    volunteerRoutes
);

// ==========================================
// DASHBOARD STATS
// ==========================================

app.use(
    "/api/stats",
    statsRoutes
);

// ==========================================
// PHASE 6
// ==========================================

// ------------------------------------------
// Notifications
// ------------------------------------------

app.use(
    "/api/notifications",
    notificationRoutes
);

// ------------------------------------------
// Live Map
// ------------------------------------------

app.use(
    "/api/map",
    mapRoutes
);

// ------------------------------------------
// Rescue Team Tracking
// ------------------------------------------

app.use(
    "/api/rescue-teams",
    rescueTeamRoutes
);

// ==========================================
// GIS
// ==========================================

// Search + routing
// Nominatim + OSRM

app.use(
    "/api/gis",
    gisRoutes
);

// ==========================================
// WEATHER
// ==========================================

app.use(
    "/api/weather",
    weatherRoutes
);

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.originalUrl,
        method: req.method,
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error(
        "❌ ERROR:",
        err
    );

    // ======================================
    // CORS Error
    // ======================================

    if (
        err.message ===
        "Not allowed by CORS"
    ) {
        return res.status(403).json({
            success: false,
            message: "CORS origin not allowed",
        });
    }

    // ======================================
    // Multer Error
    // ======================================

    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message:
                `Upload Error: ${err.message}`,
        });
    }

    // ======================================
    // File Type Error
    // ======================================

    if (
        err.message &&
        err.message.includes("Only JPG")
    ) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // ======================================
    // General Error
    // ======================================

    return res.status(
        err.statusCode || 500
    ).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error",
    });
});

// ==========================================
// Export App
// ==========================================

module.exports = app;
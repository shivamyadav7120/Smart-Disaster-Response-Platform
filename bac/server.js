// ==========================================
// Smart Disaster Response Platform
// server.js
// ==========================================

// ==========================================
// Load Environment Variables
// ==========================================

require("dotenv").config();

// ==========================================
// Core Modules
// ==========================================

const http = require("http");

// ==========================================
// Express App
// ==========================================

const app = require("./app");

// ==========================================
// Database Connection
// ==========================================

const connectDB = require("./config/db");

// ==========================================
// Socket.IO Service
// ==========================================

const {
    initializeSocket,
} = require("./services/socketService");

// ==========================================
// Configuration
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
    try {
        // --------------------------------------
        // Connect MongoDB first
        // --------------------------------------

        await connectDB();

        console.log("✅ MongoDB connected successfully");

        // --------------------------------------
        // Create HTTP Server
        // --------------------------------------

        const server = http.createServer(app);

        // --------------------------------------
        // Initialize Socket.IO
        // --------------------------------------

        initializeSocket(server);

        console.log("✅ Socket.IO initialized");

        // --------------------------------------
        // Start HTTP Server
        // --------------------------------------

        server.listen(PORT, () => {
            console.log("====================================");

            console.log(
                " Smart Disaster Response Platform"
            );

            console.log(
                " Backend Started Successfully"
            );

            console.log(
                ` Server : http://localhost:${PORT}`
            );

            console.log(
                ` Environment : ${
                    process.env.NODE_ENV ||
                    "development"
                }`
            );

            console.log(
                " Socket.IO : Enabled"
            );

            console.log("====================================");
        });

        // --------------------------------------
        // Graceful Shutdown
        // --------------------------------------

        const shutdown = () => {
            console.log(
                "\n🛑 Shutting down server..."
            );

            server.close(() => {
                console.log(
                    "✅ HTTP server closed"
                );

                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error(
            "❌ Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

// ==========================================
// Run Server
// ==========================================

startServer();
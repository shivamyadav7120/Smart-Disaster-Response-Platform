
// ==========================================
// Smart Disaster Response Platform
// server.js
// ==========================================

// ==========================================
// Load Environment Variables FIRST
// ==========================================

require("dotenv").config();

// ==========================================
// Verify Environment Variables
// ==========================================

console.log(
    "JWT_SECRET loaded:",
    !!process.env.JWT_SECRET
);

console.log(
    "JWT_EXPIRE loaded:",
    !!process.env.JWT_EXPIRE
);

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
        // Check JWT Configuration
        // --------------------------------------

        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is missing from .env file"
            );
        }

        // --------------------------------------
        // Connect MongoDB First
        // --------------------------------------

        await connectDB();

        console.log(
            "✅ MongoDB connected successfully"
        );

        // --------------------------------------
        // Create HTTP Server
        // --------------------------------------

        const server = http.createServer(app);

        // --------------------------------------
        // Initialize Socket.IO
        // --------------------------------------

        initializeSocket(server);

        console.log(
            "✅ Socket.IO initialized"
        );

        // --------------------------------------
        // Start HTTP Server
        // --------------------------------------

        server.listen(PORT, () => {

            console.log(
                "===================================="
            );

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
                ` JWT : Configured`
            );

            console.log(
                ` JWT Expiry : ${
                    process.env.JWT_EXPIRE || "7d"
                }`
            );

            console.log(
                " Socket.IO : Enabled"
            );

            console.log(
                "===================================="
            );
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

        process.on(
            "SIGINT",
            shutdown
        );

        process.on(
            "SIGTERM",
            shutdown
        );

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



const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"]
});


// ==========================================
// Socket Connected
// ==========================================

socket.on("connect", () => {

    console.log("====================================");
    console.log("✅ Socket Connected");
    console.log("Socket ID:", socket.id);
    console.log("====================================");


    // Join SuperAdmin room
    socket.emit(
        "joinResponder",
        "SuperAdmin"
    );

    console.log(
        "👤 Joined SuperAdmin room"
    );

});


// ==========================================
// New SOS Event
// ==========================================

socket.on("newSOS", (sos) => {

    console.log("====================================");
    console.log("🚨 NEW SOS RECEIVED");
    console.log("SOS ID:", sos._id);
    console.log("Disaster:", sos.disasterType);
    console.log("Severity:", sos.severity);
    console.log("Full SOS:", sos);
    console.log("====================================");

});


// ==========================================
// SOS Status Update
// ==========================================

socket.on("sosStatusUpdate", (sos) => {

    console.log("====================================");
    console.log("🔄 SOS STATUS UPDATED");
    console.log(sos);
    console.log("====================================");

});


// ==========================================
// Notification
// ==========================================

socket.on("notification", (notification) => {

    console.log("====================================");
    console.log("🔔 NOTIFICATION RECEIVED");
    console.log(notification);
    console.log("====================================");

});


// ==========================================
// Connection Error
// ==========================================

socket.on("connect_error", (error) => {

    console.log("❌ SOCKET ERROR:");
    console.log(error.message);

});


// ==========================================
// Disconnect
// ==========================================

socket.on("disconnect", (reason) => {

    console.log(
        "❌ Socket Disconnected:",
        reason
    );

});


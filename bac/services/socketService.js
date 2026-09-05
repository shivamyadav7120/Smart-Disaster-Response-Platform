// ==========================================
// Smart Disaster Response Platform
// Socket.IO Service
// ==========================================

const { Server } = require("socket.io");

let io = null;

// ==========================================
// Initialize Socket.IO
// ==========================================

const initializeSocket = (server) => {
    if (io) {
        console.warn("⚠️ Socket.IO is already initialized");
        return io;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    io = new Server(server, {
        cors: {
            origin: clientUrl,
            methods: [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
            ],
            credentials: true,
        },

        transports: ["websocket", "polling"],
    });

    console.log("🔌 Socket.IO Initialized");


    // ==========================================
    // CLIENT CONNECTION
    // ==========================================

    io.on("connection", (socket) => {

        console.log(
            `🔌 Socket Connected: ${socket.id}`
        );


        // ==========================================
        // JOIN USER ROOM
        // ==========================================

        socket.on("joinUser", (userId) => {

            if (!userId) {
                console.warn("⚠️ User ID missing");
                return;
            }

            const room = `user_${String(userId)}`;

            socket.join(room);

            console.log(
                `👤 User joined room: ${room}`
            );
        });


        // ==========================================
        // JOIN RESPONDER ROOM
        // ==========================================

        socket.on("joinResponder", (roleData) => {

            if (!roleData) {
                console.warn(
                    "⚠️ Responder role missing"
                );

                return;
            }

            let role = "";

            // --------------------------------------
            // Object
            // { role: "SuperAdmin" }
            // --------------------------------------

            if (
                typeof roleData === "object" &&
                roleData !== null
            ) {
                role = roleData.role;
            }

            // --------------------------------------
            // String
            // "SuperAdmin"
            // --------------------------------------

            else if (
                typeof roleData === "string"
            ) {
                role = roleData;
            }

            // --------------------------------------
            // Validate
            // --------------------------------------

            if (
                typeof role !== "string" ||
                !role.trim()
            ) {
                console.warn(
                    "⚠️ Invalid responder role:",
                    roleData
                );

                return;
            }

            role = role.trim();

            const room = `role_${role}`;

            socket.join(room);

            console.log(
                `🚨 Responder joined room: ${room}`
            );
        });


        // ==========================================
        // JOIN SOS ROOM
        // ==========================================

        socket.on("joinSOS", (sosId) => {

            if (!sosId) {
                console.warn("⚠️ SOS ID missing");
                return;
            }

            const room = `sos_${String(sosId)}`;

            socket.join(room);

            console.log(
                `🚨 Socket ${socket.id} joined ${room}`
            );
        });


        // ==========================================
        // LEAVE SOS ROOM
        // ==========================================

        socket.on("leaveSOS", (sosId) => {

            if (!sosId) {
                console.warn("⚠️ SOS ID missing");
                return;
            }

            const room = `sos_${String(sosId)}`;

            socket.leave(room);

            console.log(
                `🚪 Socket ${socket.id} left ${room}`
            );
        });


        // ==========================================
        // OPTIONAL: JOIN LIVE MAP ROOM
        // ==========================================

        socket.on("joinMap", () => {

            socket.join("live_map");

            console.log(
                `🗺️ Socket ${socket.id} joined live map`
            );
        });


        // ==========================================
        // DISCONNECT
        // ==========================================

        socket.on("disconnect", (reason) => {

            console.log(
                `❌ Socket Disconnected: ${socket.id}`
            );

            console.log(
                `Reason: ${reason}`
            );
        });

    });

    return io;
};


// ==========================================
// GET SOCKET.IO INSTANCE
// ==========================================

const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
};


// ==========================================
// EMIT NEW SOS
// ==========================================

const emitSOSUpdate = (sos) => {

    if (!io) {
        console.warn(
            "⚠️ Socket.IO not initialized"
        );

        return;
    }

    if (!sos) {
        return;
    }

    // --------------------------------------
    // Broadcast to every connected client
    // --------------------------------------

    io.emit(
        "newSOS",
        sos
    );


    // --------------------------------------
    // Also notify responders
    // --------------------------------------

    const responderRoles = [
        "Volunteer",
        "Police",
        "DistrictAdmin",
        "SuperAdmin",
        "NGO",
        "RescueTeam",
    ];

    responderRoles.forEach((role) => {

        io.to(`role_${role}`).emit(
            "newSOS",
            sos
        );

    });

    console.log(
        `🚨 New SOS broadcasted: ${
            sos._id || sos.id || "unknown"
        }`
    );
};


// ==========================================
// EMIT SOS STATUS UPDATE
// ==========================================

const emitSOSStatusUpdate = (sos) => {

    if (!io) {
        console.warn(
            "⚠️ Socket.IO not initialized"
        );

        return;
    }

    if (!sos) {
        return;
    }

    const sosId =
        sos._id ||
        sos.id;


    // --------------------------------------
    // Global update
    // --------------------------------------

    io.emit(
        "sosStatusUpdate",
        sos
    );


    // --------------------------------------
    // SOS specific room
    // --------------------------------------
    //
    // Do NOT emit the same event to the room
    // again if the global event already reaches
    // those clients.
    //
    // We use a separate event for room clients.
    // --------------------------------------

    if (sosId) {

        io
            .to(`sos_${String(sosId)}`)
            .emit(
                "sosRoomUpdate",
                sos
            );

    }

    console.log(
        `🔄 SOS status updated: ${
            sosId || "unknown"
        }`
    );
};


// ==========================================
// SEND NOTIFICATION TO USER
// ==========================================

const emitUserNotification = (
    userId,
    notification
) => {

    if (!io || !userId) {
        return;
    }

    const room =
        `user_${String(userId)}`;

    io
        .to(room)
        .emit(
            "notification",
            notification
        );

    console.log(
        `🔔 Notification sent to user: ${userId}`
    );
};


// ==========================================
// SEND NOTIFICATION TO RESPONDERS
// ==========================================

const emitResponderNotification = (
    notification
) => {

    if (!io) {
        return;
    }

    const responderRoles = [
        "Volunteer",
        "Police",
        "DistrictAdmin",
        "SuperAdmin",
        "NGO",
        "RescueTeam",
    ];

    responderRoles.forEach((role) => {

        io
            .to(`role_${role}`)
            .emit(
                "notification",
                notification
            );

    });

    console.log(
        "🚨 Responder notification broadcasted"
    );
};


// ==========================================
// LIVE LOCATION UPDATE
// ==========================================

const emitLocationUpdate = (locationData) => {
    if (!io || !locationData) return;

    io.to("live_map").emit("locationUpdate", locationData);

    if (locationData.sosId) {
        io.to(`sos_${String(locationData.sosId)}`).emit(
            "rescueLocationUpdate",
            locationData
        );
    }

    if (locationData.teamUserId) {
        io.to(`user_${String(locationData.teamUserId)}`).emit(
            "rescueLocationUpdate",
            locationData
        );
    }
};

const emitRescueAssignment = (sos, team) => {
    if (!io || !sos || !team) return;
    const payload = {
        sosId: String(sos._id || sos.id),
        teamId: String(team._id || team.id),
        teamName: team.name,
        status: sos.status,
        location: sos.location,
    };
    if (team.user) {
        io.to(`user_${String(team.user._id || team.user)}`).emit(
            "rescueAssignment",
            payload
        );
    }
    io.to(`sos_${payload.sosId}`).emit("rescueAssignment", payload);
    io.to("live_map").emit("rescueAssignment", payload);
};

const emitRescueStatusUpdate = (sos) => {
    if (!io || !sos) return;
    const payload = {
        sosId: String(sos._id || sos.id),
        status: sos.status,
        assignedRescueTeam: sos.assignedRescueTeam || null,
        assignedRescueTeams: sos.assignedRescueTeams || (sos.assignedRescueTeam ? [sos.assignedRescueTeam] : []),
        reachedAt: sos.reachedAt || null,
        resolvedAt: sos.resolvedAt || null,
    };
    io.to(`sos_${payload.sosId}`).emit("rescueStatusUpdate", payload);
    io.emit("rescueStatusUpdate", payload);
};

// ==========================================
// SHELTER UPDATE
// ==========================================

const emitShelterUpdate = (
    shelter
) => {

    if (!io || !shelter) {
        return;
    }

    io.emit(
        "shelterUpdate",
        shelter
    );

    console.log(
        `🏠 Shelter update broadcasted: ${
            shelter._id ||
            shelter.id ||
            shelter.name ||
            "unknown"
        }`
    );
};


// ==========================================
// HOSPITAL UPDATE
// ==========================================

const emitHospitalUpdate = (
    hospital
) => {

    if (!io || !hospital) {
        return;
    }

    io.emit(
        "hospitalUpdate",
        hospital
    );

    console.log(
        `🏥 Hospital update broadcasted: ${
            hospital._id ||
            hospital.id ||
            hospital.name ||
            "unknown"
        }`
    );
};


// ==========================================
// RESOURCE UPDATE
// ==========================================

const emitResourceUpdate = (
    resource
) => {

    if (!io || !resource) {
        return;
    }

    io.emit(
        "resourceUpdate",
        resource
    );

    console.log(
        `📦 Resource update broadcasted: ${
            resource._id ||
            resource.id ||
            resource.name ||
            "unknown"
        }`
    );
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    initializeSocket,

    getIO,

    emitSOSUpdate,

    emitSOSStatusUpdate,

    emitUserNotification,

    emitResponderNotification,

    emitLocationUpdate,

    emitRescueAssignment,

    emitRescueStatusUpdate,

    emitShelterUpdate,

    emitHospitalUpdate,

    emitResourceUpdate,

};
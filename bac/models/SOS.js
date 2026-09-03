const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
    {
        // ==========================================
        // User Who Created SOS
        // ==========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // ==========================================
        // Disaster Type
        // ==========================================

        disasterType: {
            type: String,
            enum: [
                "Flood",
                "Earthquake",
                "Fire",
                "Cyclone",
                "Landslide",
                "Medical",
                "Accident",
                "Other",
            ],
            required: true,
        },

        // ==========================================
        // Emergency Severity
        // ==========================================

        severity: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical",
            ],
            default: "High",
        },

        // ==========================================
        // Description
        // ==========================================

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // ==========================================
        // Address
        // ==========================================

        address: {
            type: String,
            default: "",
            trim: true,
        },

        city: {
            type: String,
            default: "",
            trim: true,
        },

        state: {
            type: String,
            default: "",
            trim: true,
        },

        pincode: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // GPS Location
        // ==========================================

        location: {
            latitude: {
                type: Number,
                required: true,
            },

            longitude: {
                type: Number,
                required: true,
            },
        },

        // ==========================================
        // SOS Status
        // ==========================================

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Dispatched",
                "Rescue On Way",
                "Reached",
                "Resolved",
                "Cancelled",
            ],
            default: "Pending",
        },

        // ==========================================
        // Assigned Rescue Team
        // ==========================================

        assignedRescueTeam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RescueTeam",
            default: null,
        },

        assignedAt: {
            type: Date,
            default: null,
        },

        reachedAt: {
            type: Date,
            default: null,
        },

        // ==========================================
        // Assigned Volunteer
        // ==========================================

        assignedVolunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        // ==========================================
        // Assigned Hospital
        // ==========================================

        assignedHospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            default: null,
        },

        // ==========================================
        // Emergency Contact
        // ==========================================

        contactName: {
            type: String,
            default: "",
            trim: true,
        },

        contactPhone: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // People Affected
        // ==========================================

        peopleAffected: {
            type: Number,
            default: 1,
            min: 1,
        },

        // ==========================================
        // Rescue Notes
        // ==========================================

        rescueNotes: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // Uploaded Images
        // ==========================================

        images: [
            {
                type: String,
            },
        ],

        // ==========================================
        // AI Risk Score
        // ==========================================

        aiRiskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        // ==========================================
        // Weather Snapshot
        // ==========================================

        weather: {
            temperature: {
                type: Number,
                default: null,
            },

            condition: {
                type: String,
                default: "",
            },

            rainfall: {
                type: Number,
                default: null,
            },

            windSpeed: {
                type: Number,
                default: null,
            },
        },

        // ==========================================
        // Active SOS
        // ==========================================

        isActive: {
            type: Boolean,
            default: true,
        },

        // ==========================================
        // Resolved Time
        // ==========================================

        resolvedAt: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);


// ==========================================
// Indexes
// ==========================================

// Latest SOS first
sosSchema.index({
    createdAt: -1,
});

// Status filtering
sosSchema.index({
    status: 1,
});

// Active emergency search
sosSchema.index({
    isActive: 1,
});

// User's SOS search
sosSchema.index({
    user: 1,
});

// Location-based queries
sosSchema.index({
    "location.latitude": 1,
    "location.longitude": 1,
});


// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model("SOS", sosSchema);
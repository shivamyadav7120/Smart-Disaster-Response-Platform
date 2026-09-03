const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
{
    // User / Volunteer reference
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },


    // Tracking person type
    type: {
        type: String,
        enum: [
            "Citizen",
            "Volunteer",
            "Police",
            "Hospital",
            "RescueTeam"
        ],
        default: "Citizen",
    },


    // Rescue/SOS context for live tracking
    rescueTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RescueTeam",
        default: null,
    },

    sos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SOS",
        default: null,
    },

    // Live Location
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


    // Current Status
    status: {
        type: String,
        enum: [
            "Available",
            "Busy",
            "Emergency",
            "Offline"
        ],
        default: "Available",
    },


    // Last update time
    lastUpdated: {
        type: Date,
        default: Date.now,
    },


    isActive: {
        type: Boolean,
        default: true,
    },

},
{
    timestamps: true,
}
);


// Update location time automatically
trackingSchema.pre("save", function(next){

    this.lastUpdated = new Date();

    next();

});


module.exports = mongoose.model("Tracking", trackingSchema);
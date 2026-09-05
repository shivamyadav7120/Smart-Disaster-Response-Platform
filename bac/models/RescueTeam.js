const mongoose = require("mongoose");

const rescueTeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Team name is required"],
            trim: true,
            maxlength: 100,
        },

        leaderName: {
            type: String,
            required: [true, "Team leader name is required"],
            trim: true,
        },

        phone: {
            type: String,
            required: [true, "Team phone is required"],
            trim: true,
        },

        members: {
            type: Number,
            default: 1,
            min: 1,
        },

        skills: {
            type: [String],
            default: [],
        },

        assignedArea: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["Available", "Busy", "Emergency", "Offline"],
            default: "Available",
        },

        assignedSOS: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SOS",
            default: null,
        },

        // A team may be dispatched to more than one SOS. The singular field
        // above is retained for backward compatibility and stores the primary SOS.
        assignedSOSs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SOS",
        }],

        currentLocation: {
            latitude: { type: Number, default: null },
            longitude: { type: Number, default: null },
            accuracy: { type: Number, default: null },
        },

        lastLocationUpdate: {
            type: Date,
            default: null,
        },

        // Login account used by the rescue team device.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            unique: true,
            sparse: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("RescueTeam", rescueTeamSchema);

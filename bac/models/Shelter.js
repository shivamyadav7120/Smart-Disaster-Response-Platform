const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    location: {
        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        }
    },

    capacity: {
        type: Number,
        required: true,
        min: 1
    },

    availableBeds: {
        type: Number,
        required: true,
        min: 0
    },

    contactPerson: {
        type: String,
        required: true
    },

    contactPhone: {
        type: String,
        required: true
    },

    facilities: [
        {
            type: String
        }
    ],

    status: {
        type: String,
        enum: [
            "Open",
            "Full",
            "Closed"
        ],
        default: "Open"
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Shelter", shelterSchema);
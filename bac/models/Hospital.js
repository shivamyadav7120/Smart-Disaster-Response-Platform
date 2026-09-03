const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

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

    contactPerson: {
      type: String,
      required: true,
    },

    contactPhone: {
      type: String,
      required: true,
    },

    emergencyPhone: {
      type: String,
      default: "",
    },

    totalBeds: {
      type: Number,
      default: 0,
    },

    availableBeds: {
      type: Number,
      default: 0,
    },

    icuBeds: {
      type: Number,
      default: 0,
    },

    ventilators: {
      type: Number,
      default: 0,
    },

    bloodBank: {
      type: Boolean,
      default: false,
    },

    ambulanceAvailable: {
      type: Boolean,
      default: false,
    },

    specialties: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["Open", "Busy", "Closed"],
      default: "Open",
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

module.exports = mongoose.model("Hospital", hospitalSchema);
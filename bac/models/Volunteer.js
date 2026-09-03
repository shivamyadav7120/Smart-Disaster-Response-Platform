const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
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


    // Volunteer Details

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },


    skills: [
      {
        type: String,
      },
    ],


    availability: {
      type: String,
      enum: [
        "Available",
        "Busy",
        "Offline"
      ],
      default: "Available",
    },


    bloodGroup: {
      type: String,
      default: "",
    },


    emergencyContact: {
      name: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },
    },


    assignedArea: {
      type: String,
      default: "",
    },


    experience: {
      type: String,
      default: "",
    },


    status: {
      type: String,
      enum: [
        "Active",
        "Inactive"
      ],
      default: "Active",
    },


    isVerified: {
      type: Boolean,
      default: false,
    },


    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Volunteer", volunteerSchema);
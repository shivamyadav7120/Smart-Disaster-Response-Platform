const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    district: { type: String, default: "", trim: true, index: true },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Water",
        "Medicine",
        "Clothes",
        "Blankets",
        "Rescue Equipment",
        "Other",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      default: "Units",
    },

    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      latitude: Number,
      longitude: Number,
<<<<<<< HEAD
=======
      accuracy: Number,
>>>>>>> 729b613 (Fix rescue team and analytics)
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    contactPerson: {
      type: String,
      required: true,
    },

    contactPhone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Reserved", "Distributed"],
      default: "Available",
    },

    notes: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Resource", resourceSchema);
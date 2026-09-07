const mongoose = require("mongoose");

const locationHistorySchema = new mongoose.Schema({
  district: { type: String, default: "", trim: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rescueTeam: { type: mongoose.Schema.Types.ObjectId, ref: "RescueTeam", required: true },
  sos: { type: mongoose.Schema.Types.ObjectId, ref: "SOS", default: null },
  location: {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    accuracy: { type: Number, default: null, min: 0 },
  },
  confidence: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
  speedKmh: { type: Number, default: null, min: 0 },
  recordedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

locationHistorySchema.index({ rescueTeam: 1, recordedAt: -1 });
locationHistorySchema.index({ user: 1, recordedAt: -1 });

module.exports = mongoose.model("LocationHistory", locationHistorySchema);

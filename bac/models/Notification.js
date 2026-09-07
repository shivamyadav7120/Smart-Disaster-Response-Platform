const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    // Notification Receiver
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },


    // Notification Title
    title: {
        type: String,
        required: true,
        trim: true,
    },


    // Notification Message
    message: {
        type: String,
        required: true,
    },


    // Notification Type
    type: {
        type: String,
        enum: [
            "SMS",
            "EMAIL",
            "SOS_ALERT",
            "EMERGENCY_BROADCAST",
            "SYSTEM"
        ],
        default: "SYSTEM",
    },


    // Delivery Status
    status: {
        type: String,
        enum: [
            "Pending",
            "Sent",
            "Failed"
        ],
        default: "Pending",
    },


    // Priority Level
    priority: {
        type: String,
        enum: [
            "Low",
            "Medium",
            "High",
            "Critical"
        ],
        default: "Medium",
    },


    // Contact Details
    phone: {
        type: String,
        default: "",
    },


    email: {
        type: String,
        default: "",
    },


    // Related SOS
    sos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SOS",
        default: null,
    },


    // Read Status
    isRead: {
        type: Boolean,
        default: false,
    },


},
{
    timestamps:true
}
);


module.exports = mongoose.model(
    "Notification",
    notificationSchema
);
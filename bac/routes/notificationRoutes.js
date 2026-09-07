const express = require("express");

const router = express.Router();


const {
    createNotification,
    getAllNotifications,
    getUserNotifications,
    markNotificationRead,
    deleteNotification,

} = require("../controllers/notificationController");



const {
    protect,
    authorize,

} = require("../middleware/authMiddleware");



// ========================================
// Notification Routes
// ========================================


// Create Notification
// Admin / System
router.post(
    "/",
    protect,
    authorize("SuperAdmin","DistrictAdmin"),
    createNotification
);



// Get All Notifications
router.get(
    "/",
    protect,
    getAllNotifications
);



// Get User Notifications
router.get(
    "/user/:id",
    protect,
    getUserNotifications
);



// Mark Notification Read
router.put(
    "/:id/read",
    protect,
    markNotificationRead
);



// Delete Notification
router.delete(
    "/:id",
    protect,
    authorize("SuperAdmin"),
    deleteNotification
);



module.exports = router;
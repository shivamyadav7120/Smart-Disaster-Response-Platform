const express = require("express");

const router = express.Router();


// ==========================================
// Controllers
// ==========================================

const {
    createSOS,
    getAllSOS,
    getMySOS,
    getSOSById,
    updateSOS,
    deleteSOS,
    updateSOSStatus
} = require("../controllers/sosController");


// ==========================================
// Authentication / Authorization
// ==========================================

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// ==========================================
// Multer Upload Middleware
// ==========================================

const upload = require("../middleware/uploadMiddleware");


// ==========================================
// CREATE SOS
// POST /api/sos
// ==========================================

router.post(
    "/",
    protect,
    upload.array("images", 5),
    createSOS
);


// ==========================================
// GET ALL SOS
// GET /api/sos
// ==========================================

router.get(
    "/",
    protect,
    getAllSOS
);


// ==========================================
// GET MY SOS
// GET /api/sos/my
// ==========================================

router.get(
    "/my",
    protect,
    getMySOS
);


// ==========================================
// GET SOS BY ID
// GET /api/sos/:id
// ==========================================

router.get(
    "/:id",
    protect,
    getSOSById
);


// ==========================================
// UPDATE SOS
// PUT /api/sos/:id
// ==========================================

router.put(
    "/:id",
    protect,
    upload.array("images", 5),
    updateSOS
);


// ==========================================
// DELETE SOS
// DELETE /api/sos/:id
// ==========================================

router.delete(
    "/:id",
    protect,
    deleteSOS
);


// ==========================================
// UPDATE SOS STATUS
// PATCH /api/sos/status/:id
// ==========================================
//
// Allowed statuses:
//
// Pending
// Accepted
// Dispatched
// Rescue On Way
// Resolved
// Cancelled
//
// Allowed roles:
//
// Volunteer
// Police
// DistrictAdmin
// SuperAdmin
// ==========================================

router.patch(
    "/status/:id",
    protect,
    authorize(
        "Volunteer",
        "Police",
        "DistrictAdmin",
        "SuperAdmin",
        "NGO"
    ),
    updateSOSStatus
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
const SOS = require("../models/SOS");

const {
    emitSOSUpdate,
    emitSOSStatusUpdate,
    emitUserNotification,
    emitResponderNotification
} = require("../services/socketService");


// ==========================================
// Parse Location Helper
// ==========================================

const parseLocation = (location) => {

    if (!location) {
        return undefined;
    }

    if (typeof location === "object") {
        return location;
    }

    try {
        return JSON.parse(location);
    } catch (error) {
        console.log("⚠️ Invalid location JSON");
        return undefined;
    }
};


// ==========================================
// Create SOS
// POST /api/sos
// ==========================================

const createSOS = async (req, res) => {

    try {

        const images = req.files
            ? req.files.map(
                (file) => `/uploads/sos/${file.filename}`
            )
            : [];

        const sos = await SOS.create({

            user: req.user._id,

            disasterType: req.body.disasterType,

            severity:
                req.body.severity || "High",

            description:
                req.body.description || "",

            address:
                req.body.address || "",

            city:
                req.body.city || "",

            state:
                req.body.state || "",

            pincode:
                req.body.pincode || "",

            location:
                parseLocation(req.body.location),

            contactName:
                req.body.contactName || "",

            contactPhone:
                req.body.contactPhone || "",

            peopleAffected:
                Number(req.body.peopleAffected) || 1,

            images
        });


        // Real-time new SOS
        emitSOSUpdate(sos);


        // Notify responders
        emitResponderNotification({

            type: "NEW_SOS",

            title: "New Emergency SOS",

            message:
                `${sos.disasterType} SOS received`,

            sosId:
                sos._id.toString(),

            severity:
                sos.severity
        });


        res.status(201).json({

            success: true,

            message:
                "SOS Created Successfully",

            data:
                sos
        });

    } catch (error) {

        console.error(
            "❌ Create SOS Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Get All SOS
// GET /api/sos
// ==========================================

const getAllSOS = async (req, res) => {

    try {

        const sos = await SOS.find()

            .populate(
                "user",
                "name email phone role"
            )

            .populate(
                "assignedVolunteer",
                "name email phone role"
            )

            .populate(
                "assignedHospital",
                "name phone address city"
            )
            .populate(
                "assignedRescueTeam",
                "name leaderName phone status currentLocation lastLocationUpdate"
            )

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count:
                sos.length,

            data:
                sos
        });

    } catch (error) {

        console.error(
            "❌ Get All SOS Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Get My SOS
// GET /api/sos/my
// ==========================================

const getMySOS = async (req, res) => {

    try {

        const sos = await SOS.find({

            user:
                req.user._id

        })

            .populate(
                "assignedVolunteer",
                "name email phone role"
            )

            .populate(
                "assignedHospital",
                "name phone address city"
            )
            .populate(
                "assignedRescueTeam",
                "name leaderName phone status currentLocation lastLocationUpdate"
            )

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count:
                sos.length,

            data:
                sos
        });

    } catch (error) {

        console.error(
            "❌ Get My SOS Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Get SOS By ID
// GET /api/sos/:id
// ==========================================

const getSOSById = async (req, res) => {

    try {

        const sos = await SOS.findById(
            req.params.id
        )

            .populate(
                "user",
                "name email phone role"
            )

            .populate(
                "assignedVolunteer",
                "name email phone role"
            )

            .populate(
                "assignedHospital",
                "name phone address city"
            )
            .populate(
                "assignedRescueTeam",
                "name leaderName phone status currentLocation lastLocationUpdate"
            );


        if (!sos) {

            return res.status(404).json({

                success: false,

                message:
                    "SOS Not Found"
            });
        }


        res.status(200).json({

            success: true,

            data:
                sos
        });

    } catch (error) {

        console.error(
            "❌ Get SOS By ID Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Update SOS
// PUT /api/sos/:id
// ==========================================

const updateSOS = async (req, res) => {

    try {

        const sos =
            await SOS.findById(
                req.params.id
            );


        if (!sos) {

            return res.status(404).json({

                success: false,

                message:
                    "SOS Not Found"
            });
        }


        // Uploaded images
        if (req.files && req.files.length > 0) {

            const newImages = req.files.map(
                (file) =>
                    `/uploads/sos/${file.filename}`
            );

            sos.images = [
                ...(sos.images || []),
                ...newImages
            ];
        }


        // Allowed fields
        const allowedFields = [

            "disasterType",
            "severity",
            "description",
            "address",
            "city",
            "state",
            "pincode",
            "contactName",
            "contactPhone",
            "peopleAffected",
            "rescueNotes",
            "assignedVolunteer",
            "assignedHospital",
            "isActive"

        ];


        allowedFields.forEach((field) => {

            if (
                req.body[field] !== undefined
            ) {

                sos[field] =
                    req.body[field];

            }

        });


        // Location
        if (
            req.body.location !== undefined
        ) {

            const location =
                parseLocation(
                    req.body.location
                );

            if (location) {
                sos.location = location;
            }
        }


        const updatedSOS =
            await sos.save();


        // Real-time update
        emitSOSUpdate(updatedSOS);


        // Notify responders
        emitResponderNotification({

            type:
                "SOS_UPDATED",

            title:
                "SOS Updated",

            message:
                `SOS ${updatedSOS._id} has been updated`,

            sosId:
                updatedSOS._id.toString()
        });


        res.status(200).json({

            success: true,

            message:
                "SOS Updated Successfully",

            data:
                updatedSOS
        });

    } catch (error) {

        console.error(
            "❌ Update SOS Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Delete SOS
// DELETE /api/sos/:id
// ==========================================

const deleteSOS = async (req, res) => {

    try {

        const sos =
            await SOS.findById(
                req.params.id
            );


        if (!sos) {

            return res.status(404).json({

                success: false,

                message:
                    "SOS Not Found"
            });
        }


        await sos.deleteOne();


        // Real-time delete event
        emitSOSUpdate({

            type:
                "SOS_DELETED",

            sosId:
                sos._id.toString()
        });


        // Notify responders
        emitResponderNotification({

            type:
                "SOS_DELETED",

            title:
                "SOS Deleted",

            message:
                `SOS ${sos._id} has been deleted`,

            sosId:
                sos._id.toString()
        });


        res.status(200).json({

            success: true,

            message:
                "SOS Deleted Successfully"
        });

    } catch (error) {

        console.error(
            "❌ Delete SOS Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Update SOS Status
// PATCH /api/sos/status/:id
// ==========================================

const updateSOSStatus = async (req, res) => {

    try {

        const sos =
            await SOS.findById(
                req.params.id
            );


        if (!sos) {

            return res.status(404).json({

                success: false,

                message:
                    "SOS Not Found"
            });
        }


        // ==========================================
        // Allowed Statuses
        // ==========================================

        const allowedStatuses = [

            "Pending",
            "Accepted",
            "Dispatched",
            "Rescue On Way",
            "Reached",
            "Resolved",
            "Cancelled"

        ];


        // ==========================================
        // Validate Status
        // ==========================================

        if (
            !req.body.status ||
            !allowedStatuses.includes(
                req.body.status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid SOS status",

                allowedStatuses
            });
        }


        // ==========================================
        // Update Status
        // ==========================================

        sos.status =
            req.body.status;


        // ==========================================
        // Resolved
        // ==========================================

        if (req.body.status === "Reached") {
            sos.reachedAt = new Date();
            sos.isActive = true;
        } else if (req.body.status === "Resolved") {
            sos.resolvedAt = new Date();
            sos.isActive = false;
        }


        // ==========================================
        // Cancelled
        // ==========================================

        else if (
            req.body.status === "Cancelled"
        ) {

            sos.resolvedAt =
                null;

            sos.isActive = false;

        }


        // ==========================================
        // Active Status
        // ==========================================

        else {

            sos.resolvedAt =
                null;
            if (req.body.status !== "Reached") sos.reachedAt = null;
            sos.isActive = true;

        }


        await sos.save();


        // ==========================================
        // Socket.IO Status Update
        // ==========================================

        emitSOSStatusUpdate(sos);


        // ==========================================
        // Notify SOS User
        // ==========================================

        if (sos.user) {

            emitUserNotification(

                sos.user.toString(),

                {

                    type:
                        "SOS_STATUS_UPDATE",

                    title:
                        "SOS Status Updated",

                    message:
                        `Your SOS status is now ${sos.status}`,

                    sosId:
                        sos._id.toString(),

                    status:
                        sos.status
                }
            );
        }


        // ==========================================
        // Notify Responders
        // ==========================================

        emitResponderNotification({

            type:
                "SOS_STATUS_UPDATE",

            title:
                "SOS Status Updated",

            message:
                `SOS ${sos._id} status changed to ${sos.status}`,

            sosId:
                sos._id.toString(),

            status:
                sos.status
        });


        // ==========================================
        // Response
        // ==========================================

        res.status(200).json({

            success: true,

            message:
                "Status Updated Successfully",

            data:
                sos
        });

    } catch (error) {

        console.error(
            "❌ Update SOS Status Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


// ==========================================
// Export Controllers
// ==========================================

module.exports = {

    createSOS,
    getAllSOS,
    getMySOS,
    getSOSById,
    updateSOS,
    deleteSOS,
    updateSOSStatus

};
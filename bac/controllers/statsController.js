const SOS = require("../models/SOS");
const Volunteer = require("../models/Volunteer");
const Hospital = require("../models/Hospital");
const Resource = require("../models/Resource");
const Shelter = require("../models/Shelter");


// ==========================================================
// Get Dashboard Statistics
// GET /api/stats
// ==========================================================

const getStats = async (req, res) => {
    try {

        const [
            totalSOS,
            activeSOS,
            volunteers,
            hospitals,
            resources,
            shelters,
        ] = await Promise.all([

            // ------------------------------------------
            // Total SOS
            // ------------------------------------------

            SOS.countDocuments(),

            // ------------------------------------------
            // Active SOS
            // Pending / Accepted / Rescue On Way
            // ------------------------------------------

            SOS.countDocuments({
                status: {
                    $in: [
                        "Pending",
                        "Accepted",
                        "Rescue On Way",
                    ],
                },
                isActive: true,
            }),

            // ------------------------------------------
            // Volunteers
            // ------------------------------------------

            Volunteer.countDocuments(),

            // ------------------------------------------
            // Hospitals
            // ------------------------------------------

            Hospital.countDocuments(),

            // ------------------------------------------
            // Resources
            // ------------------------------------------

            Resource.countDocuments(),

            // ------------------------------------------
            // Shelters
            // ------------------------------------------

            Shelter.countDocuments(),
        ]);


        // ==================================================
        // Response
        // ==================================================

        res.status(200).json({

            success: true,

            data: {

                totalSOS,

                activeSOS,

                volunteers,

                hospitals,

                resources,

                shelters,

                // Frontend compatibility
                rescueTeams: volunteers,
            },
        });

    } catch (error) {

        console.error(
            "❌ Stats Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch dashboard statistics",

            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message,
        });
    }
};


// ==========================================================
// Export
// ==========================================================

module.exports = {
    getStats,
};
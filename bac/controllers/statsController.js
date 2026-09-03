const SOS = require("../models/SOS");
const Volunteer = require("../models/Volunteer");
const Hospital = require("../models/Hospital");
const Resource = require("../models/Resource");
const Tracking = require("../models/Tracking");
const Shelter = require("../models/Shelter");
const RescueTeam = require("../models/RescueTeam");


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
            rescueTeamsTotal,
            activeRescueTeams,
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
            RescueTeam.countDocuments({ isActive: true }),
            (async () => {
                const cutoff = new Date(Date.now() - 45 * 1000);
                const teams = await RescueTeam.find({ isActive: true }).select("user").lean();
                const ids = teams.map(t => t.user).filter(Boolean);
                if (!ids.length) return 0;
                return Tracking.countDocuments({
                    user: { $in: ids },
                    type: "RescueTeam",
                    isActive: true,
                    lastUpdated: { $gte: cutoff },
                });
            })(),
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

                rescueTeams: rescueTeamsTotal,
                activeRescueTeams,
                inactiveRescueTeams: Math.max(0, rescueTeamsTotal - activeRescueTeams),
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
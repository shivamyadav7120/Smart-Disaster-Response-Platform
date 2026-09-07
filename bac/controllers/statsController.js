const { scopedFilter } = require("../utils/areaScope");
const SOS = require("../models/SOS");
const Volunteer = require("../models/Volunteer");
const Hospital = require("../models/Hospital");
const Resource = require("../models/Resource");
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
            rescueTeams,
        ] = await Promise.all([

            // ------------------------------------------
            // Total SOS
            // ------------------------------------------

            SOS.countDocuments(scopedFilter(req)),

            // ------------------------------------------
            // Active SOS
            // Pending / Accepted / Rescue On Way
            // ------------------------------------------

            SOS.countDocuments({
                ...scopedFilter(req),
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

            Volunteer.countDocuments(scopedFilter(req)),

            // ------------------------------------------
            // Hospitals
            // ------------------------------------------

            Hospital.countDocuments(scopedFilter(req)),

            // ------------------------------------------
            // Resources
            // ------------------------------------------

            Resource.countDocuments(scopedFilter(req)),

            // ------------------------------------------
            // Shelters
            // ------------------------------------------

            Shelter.countDocuments(scopedFilter(req)),
            RescueTeam.countDocuments(scopedFilter(req, { isActive: true })),
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
                rescueTeams,
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

const getAnalytics = async (req,res)=>{
 try {
  const since=new Date(); since.setDate(since.getDate()-6);
  const trend=await SOS.aggregate([{$match:{...scopedFilter(req),createdAt:{$gte:since}}},{$group:{_id:{$dateToString:{format:"%a",date:"$createdAt"}},sos:{$sum:1},resolved:{$sum:{$cond:[{$in:["$status",["Resolved","Cancelled"]]},1,0]}}}},{$project:{_id:0,day:"$_id",sos:1,resolved:1}}]);
  const priority=await SOS.aggregate([{$match:scopedFilter(req)},{$group:{_id:"$severity",value:{$sum:1}}},{$project:{_id:0,name:"$_id",value:1}}]);
  res.json({success:true,data:{trend,priority}});
 } catch(e){res.status(500).json({success:false,message:e.message});}
};
module.exports = { getStats, getAnalytics };
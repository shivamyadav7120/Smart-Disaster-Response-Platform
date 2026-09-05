const Tracking = require("../models/Tracking");
const Hospital = require("../models/Hospital");
const Shelter = require("../models/Shelter");
const RescueTeam = require("../models/RescueTeam");

const calculateDistance = require("../utils/distanceCalculator");



// =====================================================
// Update Live Location
// POST /api/map/update-location
// =====================================================

const updateLocation = async (req, res) => {

    try {

        const {
            user,
            type,
            latitude,
            longitude,
            status
        } = req.body;


        const tracking = await Tracking.findOneAndUpdate(
            { user },

            {
                user,
                type,

                location:{
                    latitude,
                    longitude
                },

                status,

                isActive:true,

                lastUpdated:new Date()
            },

            {
                new:true,
                upsert:true
            }
        );


        res.status(200).json({

            success:true,

            message:"Location Updated Successfully",

            data:tracking

        });


    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};




// =====================================================
// Get Live Volunteers
// GET /api/map/live-volunteers
// =====================================================

const getLiveVolunteers = async(req,res)=>{

    try{


        const volunteers = await Tracking.find({

            type:"Volunteer",

            isActive:true

        })
        .populate(
            "user",
            "name phone"
        );


        res.status(200).json({

            success:true,

            count:volunteers.length,

            data:volunteers

        });


    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





// =====================================================
// Get Live Rescue Teams
// GET /api/map/live-rescue-teams
// =====================================================

const getLiveRescueTeams = async (req, res) => {
    try {
        const teams = await RescueTeam.find({ isActive: true })
            .populate("user", "name email phone role")
            .populate("assignedSOS", "status priority location createdAt description")
            .populate("assignedSOSs", "status priority location createdAt description disasterType severity")
            .lean();

        const userIds = teams.map((t) => t.user?._id).filter(Boolean);
        const tracking = await Tracking.find({
            user: { $in: userIds },
            type: "RescueTeam",
            isActive: true,
        }).lean();

        const byUser = new Map(tracking.map((t) => [String(t.user), t]));

        const data = teams
            .map((team) => {
                const current = team.user?._id ? byUser.get(String(team.user._id)) : null;
                if (!current?.location) return null;
                const assigned = (Array.isArray(team.assignedSOSs) && team.assignedSOSs.length) ? team.assignedSOSs : (team.assignedSOS ? [team.assignedSOS] : []);
                const assignments = assigned.map(sos => {
                    if (!sos?.location) return { sos, distanceKm: null, distanceMeters: null };
                    const distanceKm = Number(calculateDistance(sos.location.latitude, sos.location.longitude, current.location.latitude, current.location.longitude));
                    return { sos, distanceKm, distanceMeters: Math.round(distanceKm * 1000), distanceText: distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(2)} km` };
                });
                return {
                    ...team,
                    assignedSOSs: assigned,
                    assignments,
                    trackingId: current._id,
                    location: current.location,
                    lat: current.location.latitude,
                    lng: current.location.longitude,
                    lastUpdated: current.lastUpdated,
                    trackingStatus: current.status,
                };
            })
            .filter(Boolean);

        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// =====================================================
// Get Nearby Volunteers
// GET /api/map/volunteers
// =====================================================

const getNearbyVolunteers = async(req,res)=>{

    try{


        const {
            latitude,
            longitude
        } = req.query;


        if(!latitude || !longitude){

            return res.status(400).json({

                success:false,

                message:"Latitude and Longitude required"

            });

        }



        const volunteers = await Tracking.find({

            type:"Volunteer",

            isActive:true

        })
        .populate(
            "user",
            "name phone"
        );



        const data = volunteers.map((volunteer)=>{


            const distance = calculateDistance(

                Number(latitude),

                Number(longitude),

                volunteer.location.latitude,

                volunteer.location.longitude

            );


            return {

                ...volunteer.toObject(),

                distance:`${distance} km`

            };


        });



        data.sort(
            (a,b)=>parseFloat(a.distance)-parseFloat(b.distance)
        );



        res.status(200).json({

            success:true,

            count:data.length,

            data

        });



    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





// =====================================================
// Get Nearby Hospitals
// GET /api/map/hospitals
// =====================================================

const getNearbyHospitals = async(req,res)=>{

    try{


        const {
            latitude,
            longitude
        } = req.query;


        const hospitals = await Hospital.find({

            isActive:true

        });



        const data = hospitals.map((hospital)=>{


            const distance = calculateDistance(

                Number(latitude),

                Number(longitude),

                hospital.location.latitude,

                hospital.location.longitude

            );


            return {

                ...hospital.toObject(),

                distance:`${distance} km`

            };


        });



        data.sort(
            (a,b)=>parseFloat(a.distance)-parseFloat(b.distance)
        );



        res.status(200).json({

            success:true,

            count:data.length,

            data

        });


    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





// =====================================================
// Get Nearby Shelters
// GET /api/map/shelters
// =====================================================

const getNearbyShelters = async(req,res)=>{

    try{


        const {
            latitude,
            longitude
        } = req.query;



        const shelters = await Shelter.find({

            isActive:true

        });



        const data = shelters.map((shelter)=>{


            const distance = calculateDistance(

                Number(latitude),

                Number(longitude),

                shelter.location.latitude,

                shelter.location.longitude

            );


            return {

                ...shelter.toObject(),

                distance:`${distance} km`

            };


        });



        data.sort(
            (a,b)=>parseFloat(a.distance)-parseFloat(b.distance)
        );



        res.status(200).json({

            success:true,

            count:data.length,

            data

        });



    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





module.exports = {

    updateLocation,

    getLiveVolunteers,
    getLiveRescueTeams,

    getNearbyVolunteers,

    getNearbyHospitals,

    getNearbyShelters

};
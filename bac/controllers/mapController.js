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
        const cutoff = new Date(Date.now() - 45 * 1000);

        // Return every active registered team that has a known location.
        // A team can therefore remain visible on the admin map even when
        // its GPS heartbeat is temporarily offline; isLive tells the UI
        // whether the last heartbeat is fresh.
        const teams = await RescueTeam.find({ isActive: true })
            .populate("user", "name email phone role")
            .populate("assignedSOS", "status priority severity disasterType location createdAt user")
            .lean();

        const userIds = teams.map((team) => team.user?._id).filter(Boolean);
        const tracking = await Tracking.find({
            user: { $in: userIds },
            type: "RescueTeam",
            isActive: true,
        }).sort({ lastUpdated: -1 }).lean();

        const latestByUser = new Map();
        tracking.forEach((item) => {
            const key = String(item.user);
            if (!latestByUser.has(key)) latestByUser.set(key, item);
        });

        const data = teams.map((team) => {
            const current = team.user?._id
                ? latestByUser.get(String(team.user._id))
                : null;
            const location = current?.location || team.currentLocation || null;
            if (!location || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) {
                return null;
            }

            const lastUpdated = current?.lastUpdated || team.lastLocationUpdate || null;
            const isLive = Boolean(lastUpdated && new Date(lastUpdated) >= cutoff);
            const sosLocation = team.assignedSOS?.location;
            let distanceKm = null;
            if (sosLocation && Number.isFinite(Number(sosLocation.latitude)) && Number.isFinite(Number(sosLocation.longitude))) {
                distanceKm = calculateDistance(
                    Number(location.latitude), Number(location.longitude),
                    Number(sosLocation.latitude), Number(sosLocation.longitude)
                );
            }

            return {
                ...team,
                trackingId: current?._id || null,
                location,
                lat: Number(location.latitude),
                lng: Number(location.longitude),
                accuracy: Number.isFinite(Number(location.accuracy)) ? Number(location.accuracy) : null,
                lastUpdated,
                trackingStatus: current?.status || team.status,
                isLive,
                distanceToAssignedSOSKm: distanceKm,
            };
        }).filter(Boolean);

        res.json({ success: true, count: data.length, data });
    } catch (error) {
        console.error("Live rescue teams map error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

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
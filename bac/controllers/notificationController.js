const Notification = require("../models/Notification");


// ==========================================
// @desc    Create Notification
// @route   POST /api/notifications
// ==========================================
const createNotification = async (req, res) => {
    try {

        const notification = await Notification.create(req.body);

        res.status(201).json({
            success: true,
            message: "Notification Created Successfully",
            data: notification,
        });


    } catch (error) {

        res.status(500).json({
            success:false,
            message:error.message,
        });

    }
};



// ==========================================
// @desc    Get All Notifications
// @route   GET /api/notifications
// ==========================================
const getAllNotifications = async (req,res)=>{

    try {

        const notifications = await Notification.find()
        .populate("user")
        .populate("sos");


        res.status(200).json({

            success:true,
            count:notifications.length,
            data:notifications,

        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message,
        });

    }

};



// ==========================================
// @desc    Get User Notifications
// @route   GET /api/notifications/user/:id
// ==========================================
const getUserNotifications = async(req,res)=>{

    try{

        const notifications = await Notification.find({
            user:req.params.id
        })
        .populate("user");


        res.status(200).json({

            success:true,
            count:notifications.length,
            data:notifications,

        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message,
        });

    }

};



// ==========================================
// @desc    Mark Notification Read
// @route   PUT /api/notifications/:id/read
// ==========================================
const markNotificationRead = async(req,res)=>{

    try{

        const notification =
        await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead:true,
                status:"Sent"
            },
            {
                new:true,
                runValidators:true
            }
        );


        if(!notification){

            return res.status(404).json({
                success:false,
                message:"Notification not found"
            });

        }


        res.status(200).json({

            success:true,
            message:"Notification Marked As Read",
            data:notification,

        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message,
        });

    }

};



// ==========================================
// @desc    Delete Notification
// @route   DELETE /api/notifications/:id
// ==========================================
const deleteNotification = async(req,res)=>{

    try{


        const notification =
        await Notification.findById(req.params.id);



        if(!notification){

            return res.status(404).json({

                success:false,
                message:"Notification not found"

            });

        }



        await notification.deleteOne();



        res.status(200).json({

            success:true,
            message:"Notification Deleted Successfully"

        });



    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message,

        });

    }

};



module.exports = {

    createNotification,
    getAllNotifications,
    getUserNotifications,
    markNotificationRead,
    deleteNotification,

};
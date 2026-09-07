const { scopedFilter, setDistrictOnCreate } = require("../utils/areaScope");
const Volunteer = require("../models/Volunteer");


// ==========================================
// @desc    Create Volunteer
// @route   POST /api/volunteers
// ==========================================
const createVolunteer = async (req, res) => {
  try {

    const volunteer = await Volunteer.create(setDistrictOnCreate(req, req.body));

    res.status(201).json({
      success: true,
      message: "Volunteer Created Successfully",
      data: volunteer,
    });


  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;

    res.status(status).json({
      success: false,
      message: error.message,
      errors: error.errors
        ? Object.fromEntries(
            Object.entries(error.errors).map(([key, value]) => [key, value.message])
          )
        : undefined,
    });
  }
};



// ==========================================
// @desc    Get All Volunteers
// @route   GET /api/volunteers
// ==========================================
const getAllVolunteers = async (req, res) => {
  try {

    const volunteers = await Volunteer.find(scopedFilter(req));

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// @desc    Get Volunteer By ID
// @route   GET /api/volunteers/:id
// ==========================================
const getVolunteerById = async (req, res) => {
  try {

    const volunteer = await Volunteer.findOne({ _id: req.params.id, ...scopedFilter(req) });


    if (!volunteer) {

      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });

    }


    res.status(200).json({
      success: true,
      data: volunteer,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// @desc    Update Volunteer
// @route   PUT /api/volunteers/:id
// ==========================================
const updateVolunteer = async (req, res) => {
  try {


    // Debug body check
    console.log("UPDATE VOLUNTEER DATA:", req.body);



    const volunteer = await Volunteer.findOneAndUpdate(
      { _id: req.params.id, ...scopedFilter(req) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );



    if (!volunteer) {

      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });

    }



    res.status(200).json({
      success: true,
      message: "Volunteer Updated Successfully",
      data: volunteer,
    });



  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// @desc    Delete Volunteer
// @route   DELETE /api/volunteers/:id
// ==========================================
const deleteVolunteer = async (req, res) => {
  try {


    const volunteer = await Volunteer.findOne({ _id: req.params.id, ...scopedFilter(req) });



    if (!volunteer) {

      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });

    }



    await volunteer.deleteOne();



    res.status(200).json({
      success: true,
      message: "Volunteer Deleted Successfully",
    });



  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



module.exports = {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
};
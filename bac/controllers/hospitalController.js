const Hospital = require("../models/Hospital");


// ==========================================
// @desc    Create Hospital
// @route   POST /api/hospitals
// ==========================================
const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hospital Created Successfully",
      data: hospital,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// @desc    Get All Hospitals
// @route   GET /api/hospitals
// ==========================================
const getAllHospitals = async (req, res) => {
  try {

    const hospitals = await Hospital.find();

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// @desc    Get Hospital By ID
// @route   GET /api/hospitals/:id
// ==========================================
const getHospitalById = async (req, res) => {
  try {

    const hospital = await Hospital.findById(req.params.id);


    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }


    res.status(200).json({
      success: true,
      data: hospital,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// @desc    Update Hospital
// @route   PUT /api/hospitals/:id
// ==========================================
const updateHospital = async (req, res) => {

  try {

    // Debug purpose
    console.log("UPDATE DATA:", req.body);


    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "Hospital Updated Successfully",
      data: hospital,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ==========================================
// @desc    Delete Hospital
// @route   DELETE /api/hospitals/:id
// ==========================================
const deleteHospital = async (req, res) => {

  try {

    const hospital = await Hospital.findById(req.params.id);


    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }


    await hospital.deleteOne();


    res.status(200).json({
      success: true,
      message: "Hospital Deleted Successfully",
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



module.exports = {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
};
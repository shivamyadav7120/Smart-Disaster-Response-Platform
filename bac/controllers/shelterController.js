const Shelter = require("../models/Shelter");

// ===================================================
// @desc    Create Shelter
// @route   POST /api/shelters
// @access  Private (Admin)
// ===================================================
const createShelter = async (req, res) => {
    try {

        const shelter = await Shelter.create(req.body);

        res.status(201).json({
            success: true,
            message: "Shelter Created Successfully",
            data: shelter
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===================================================
// @desc    Get All Shelters
// @route   GET /api/shelters
// @access  Public
// ===================================================
const getAllShelters = async (req, res) => {
    try {

        const shelters = await Shelter.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: shelters.length,
            data: shelters
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===================================================
// @desc    Get Shelter By ID
// @route   GET /api/shelters/:id
// @access  Public
// ===================================================
const getShelterById = async (req, res) => {
    try {

        const shelter = await Shelter.findById(req.params.id);

        if (!shelter) {
            return res.status(404).json({
                success: false,
                message: "Shelter Not Found"
            });
        }

        res.status(200).json({
            success: true,
            data: shelter
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===================================================
// @desc    Update Shelter
// @route   PUT /api/shelters/:id
// @access  Private (Admin)
// ===================================================
const updateShelter = async (req, res) => {
    try {

        const shelter = await Shelter.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!shelter) {
            return res.status(404).json({
                success: false,
                message: "Shelter Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Shelter Updated Successfully",
            data: shelter
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===================================================
// @desc    Delete Shelter
// @route   DELETE /api/shelters/:id
// @access  Private (SuperAdmin)
// ===================================================
const deleteShelter = async (req, res) => {
    try {

        const shelter = await Shelter.findById(req.params.id);

        if (!shelter) {
            return res.status(404).json({
                success: false,
                message: "Shelter Not Found"
            });
        }

        await shelter.deleteOne();

        res.status(200).json({
            success: true,
            message: "Shelter Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createShelter,
    getAllShelters,
    getShelterById,
    updateShelter,
    deleteShelter
};
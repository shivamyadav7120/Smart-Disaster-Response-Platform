const mongoose = require("mongoose");
const Resource = require("../models/Resource");

// ==========================================
// Create Resource
// POST /api/resources
// ==========================================

const createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);

        res.status(201).json({
            success: true,
            message: "Resource Created Successfully",
            data: resource
        });

    } catch (error) {
        console.error("Create Resource Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Get All Resources
// GET /api/resources
// ==========================================

const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find()
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources
        });

    } catch (error) {
        console.error("Get All Resources Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Get Resource By ID
// GET /api/resources/:id
// ==========================================

const getResourceById = async (req, res) => {
    try {

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Resource ID"
            });
        }

        const resource = await Resource.findById(
            req.params.id
        );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource Not Found"
            });
        }

        res.status(200).json({
            success: true,
            data: resource
        });

    } catch (error) {
        console.error("Get Resource By ID Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Update Resource
// PUT /api/resources/:id
// ==========================================

const updateResource = async (req, res) => {
    try {

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Resource ID"
            });
        }

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resource Updated Successfully",
            data: resource
        });

    } catch (error) {
        console.error("Update Resource Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Delete Resource
// DELETE /api/resources/:id
// ==========================================

const deleteResource = async (req, res) => {
    try {

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Resource ID"
            });
        }

        const resource = await Resource.findById(
            req.params.id
        );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource Not Found"
            });
        }

        await resource.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resource Deleted Successfully"
        });

    } catch (error) {
        console.error("Delete Resource Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Export Controllers
// ==========================================

module.exports = {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
};
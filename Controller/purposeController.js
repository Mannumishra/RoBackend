const LookingModel = require("../Model/LookingForModel");
const PurposeModel = require("../Model/PurposeOfVisitModel");


// Create Purpose of Visit
const createPurpose = async (req, res) => {
    try {
        const { lookingFor, visitePurpose } = req.body;

        // Check if lookingFor and visitePurpose are provided
        if (!lookingFor || !visitePurpose) {
            return res.status(400).json({
                success: false,
                message: "lookingFor and visitePurpose are required"
            });
        }

        // Check if the lookingFor exists in the Looking collection
        const lookingForRecord = await LookingModel.findById(lookingFor);
        if (!lookingForRecord) {
            return res.status(404).json({
                success: false,
                message: "LookingFor record not found"
            });
        }

        const newPurpose = new PurposeModel({
            lookingFor,
            visitePurpose
        });

        await newPurpose.save();
        res.status(200).json({
            success: true,
            message: "Purpose of Visit created successfully",
            data: newPurpose
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get all Purposes
const getAllPurposes = async (req, res) => {
    try {
        const purposes = await PurposeModel.find().populate('lookingFor'); // Populate with Looking data
        res.status(200).json({
            success: true,
            data: purposes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get a single Purpose by ID
const getPurposeById = async (req, res) => {
    try {
        const purpose = await PurposeModel.findById(req.params.id).populate('lookingFor');
        if (!purpose) {
            return res.status(404).json({
                success: false,
                message: "Purpose not found"
            });
        }
        res.status(200).json({
            success: true,
            data: purpose
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update Purpose of Visit
const updatePurpose = async (req, res) => {
    try {
        const { lookingFor, visitePurpose } = req.body;
        const purpose = await PurposeModel.findById(req.params.id);

        if (!purpose) {
            return res.status(404).json({
                success: false,
                message: "Purpose not found"
            });
        }

        if (lookingFor) {
            const lookingForRecord = await LookingModel.findById(lookingFor);
            if (!lookingForRecord) {
                return res.status(404).json({
                    success: false,
                    message: "LookingFor record not found"
                });
            }
            purpose.lookingFor = lookingFor;
        }

        purpose.visitePurpose = visitePurpose || purpose.visitePurpose;

        await purpose.save();
        res.status(200).json({
            success: true,
            message: "Purpose of Visit updated successfully",
            data: purpose
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete Purpose of Visit
const deletePurpose = async (req, res) => {
    try {
        const purpose = await PurposeModel.findById(req.params.id);
        if (!purpose) {
            return res.status(404).json({
                success: false,
                message: "Purpose not found"
            });
        }

        await purpose.deleteOne();
        res.status(200).json({
            success: true,
            message: "Purpose of Visit deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createPurpose,
    getAllPurposes,
    getPurposeById,
    updatePurpose,
    deletePurpose
};

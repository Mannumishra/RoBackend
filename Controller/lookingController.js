const LookingModel = require("../Model/LookingForModel");


// Create a new "Looking For" entry
const createLookingFor = async (req, res) => {
    try {
        const { lookingFor } = req.body;
        if (!lookingFor) {
            return res.status(400).json({
                success: false,
                message: "lookingFor field is required"
            });
        }

        const newLookingFor = new LookingModel({
            lookingFor
        });

        await newLookingFor.save();
        res.status(200).json({
            success: true,
            message: "LookingFor entry created successfully",
            data: newLookingFor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get all "Looking For" entries
const getAllLookingFor = async (req, res) => {
    try {
        const lookingForEntries = await LookingModel.find();
        const reverseData = lookingForEntries.reverse()
        res.status(200).json({
            success: true,
            data: reverseData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get a single "Looking For" entry by ID
const getLookingForById = async (req, res) => {
    try {
        const lookingForEntry = await LookingModel.findById(req.params.id);
        if (!lookingForEntry) {
            return res.status(404).json({
                success: false,
                message: "LookingFor entry not found"
            });
        }
        res.status(200).json({
            success: true,
            data: lookingForEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update a "Looking For" entry
const updateLookingFor = async (req, res) => {
    try {
        const { lookingFor } = req.body;
        const lookingForEntry = await LookingModel.findById(req.params.id);

        if (!lookingForEntry) {
            return res.status(404).json({
                success: false,
                message: "LookingFor entry not found"
            });
        }

        lookingForEntry.lookingFor = lookingFor || lookingForEntry.lookingFor;
        await lookingForEntry.save();

        res.status(200).json({
            success: true,
            message: "LookingFor entry updated successfully",
            data: lookingForEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete a "Looking For" entry
const deleteLookingFor = async (req, res) => {
    try {
        const lookingForEntry = await LookingModel.findById(req.params.id);
        if (!lookingForEntry) {
            return res.status(404).json({
                success: false,
                message: "LookingFor entry not found"
            });
        }

        await lookingForEntry.deleteOne();
        res.status(200).json({
            success: true,
            message: "LookingFor entry deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createLookingFor,
    getAllLookingFor,
    getLookingForById,
    updateLookingFor,
    deleteLookingFor
};

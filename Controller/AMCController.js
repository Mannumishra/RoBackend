const amcModel = require('../Model/AMCModel');


// Create AMC
const createAMC = async (req, res) => {
    try {
        const { clientName, service, fromDate, toDate } = req.body;
        if (!clientName || !service || !fromDate || !toDate) {
            return res.status(400).json({
                success: false,
                message: "clientName, service, fromDate, and toDate are required"
            });
        }

        const newAmc = new amcModel({
            clientName,
            service,
            fromDate,
            toDate
        });

        await newAmc.save();
        res.status(200).json({
            success: true,
            message: "AMC record created successfully",
            data: newAmc
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get All AMC Records
const getAllAMC = async (req, res) => {
    try {
        const amcRecords = await amcModel.find();
        res.status(200).json({
            success: true,
            data: amcRecords
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Single AMC by ID
const getAMCById = async (req, res) => {
    try {
        const amcRecord = await amcModel.findById(req.params.id);
        if (!amcRecord) {
            return res.status(404).json({
                success: false,
                message: "AMC record not found"
            });
        }
        res.status(200).json({
            success: true,
            data: amcRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update AMC
const updateAMC = async (req, res) => {
    try {
        const { clientName, service, fromDate, toDate } = req.body;
        const amcRecord = await amcModel.findById(req.params.id);

        if (!amcRecord) {
            return res.status(404).json({
                success: false,
                message: "AMC record not found"
            });
        }

        amcRecord.clientName = clientName || amcRecord.clientName;
        amcRecord.service = service || amcRecord.service;
        amcRecord.fromDate = fromDate || amcRecord.fromDate;
        amcRecord.toDate = toDate || amcRecord.toDate;

        await amcRecord.save();
        res.status(200).json({
            success: true,
            message: "AMC record updated successfully",
            data: amcRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete AMC
const deleteAMC = async (req, res) => {
    try {
        const amcRecord = await amcModel.findById(req.params.id);
        if (!amcRecord) {
            return res.status(404).json({
                success: false,
                message: "AMC record not found"
            });
        }

        await amcRecord.deleteOne();
        res.status(200).json({
            success: true,
            message: "AMC record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createAMC,
    getAllAMC,
    getAMCById,
    updateAMC,
    deleteAMC
};

const amcModel = require('../Model/AMCModel');
const moment = require('moment');



const createAMC = async (req, res) => {
    try {
        const { clientName, service, fromDate, toDate } = req.body;

        if (!clientName || !service || !fromDate || !toDate) {
            return res.status(400).json({
                success: false,
                message: "clientName, service, fromDate, and toDate are required"
            });
        }
        // Parse the dates in DD/MM/YYYY format using moment.js
        const formattedFromDate = moment(fromDate, "DD/MM/YYYY").format("DD/MM/YYYY");
        const formattedToDate = moment(toDate, "DD/MM/YYYY").format("DD/MM/YYYY");
        // Check if the dates are valid
        if (!moment(formattedFromDate, "DD/MM/YYYY", true).isValid() || !moment(formattedToDate, "DD/MM/YYYY", true).isValid()) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Please use DD/MM/YYYY."
            });
        }

        const newAmc = new amcModel({
            clientName,
            service,
            fromDate: formattedFromDate,
            toDate: formattedToDate,
        });

        await newAmc.save();
        res.status(200).json({
            success: true,
            message: "AMC record created successfully",
            data: newAmc
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get All AMC Records
const getAllAMC = async (req, res) => {
    try {
        const amcRecords = await amcModel.find().populate('clientName');
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
        const amcRecord = await amcModel.findById(req.params.id).populate('clientName');
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


const getAllBYDateAMC = async (req, res) => {
    try {
        const { month, year } = req.body;
        let amcRecords = await amcModel.find().populate('clientName');

        if (month && year) {
            const monthInt = parseInt(month, 10);
            const yearInt = parseInt(year, 10);
            if (isNaN(monthInt) || monthInt < 1 || monthInt > 12 || isNaN(yearInt)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid month or year. Please provide valid values."
                });
            }
            amcRecords = amcRecords.filter(record => {
                const fromDate = moment(record.fromDate, "DD/MM/YYYY");
                return fromDate.month() + 1 === monthInt && fromDate.year() === yearInt;
            });
        }
        res.status(200).json({
            success: true,
            data: amcRecords
        });
    } catch (error) {
        console.log(error);
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
    deleteAMC,
    getAllBYDateAMC
    // getAMCByMonthYear
};

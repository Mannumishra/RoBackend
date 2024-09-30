const amcModel = require('../Model/AMCModel');
const moment = require('moment');

const getAMCByMonthYear = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and year are required"
            });
        }
        console.log("Received Month:", month);
        console.log("Received Year:", year);

        // Create start and end dates for the exact month and year
        const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf('month'); 
        const endDate = moment(startDate).endOf('month'); 

        // Log the computed dates
        console.log("Start Date:", startDate.format("DD-MM-YYYY"));
        console.log("End Date:", endDate.format("DD-MM-YYYY"));

        // Query to find AMC records that have both fromDate and toDate within the specified month and year
        const filteredAMCRecords = await amcModel.find({
            fromDate: {
                $gte: startDate,
                $lt: endDate // Ensure it is strictly less than the first day of next month
            },
            toDate: {
                $gte: startDate,
                $lt: endDate.add(1, 'days').toDate()
            }
        }).populate('clientName'); 

        console.log("Filtered AMC Records Count:", filteredAMCRecords.length);

        if (filteredAMCRecords.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No AMC records found for the given month and year"
            });
        }

        res.status(200).json({
            success: true,
            data: filteredAMCRecords
        });
    } catch (error) {
        console.error("Error fetching AMC records:", error); 
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
   

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
            fromDate: formattedFromDate, // Save in DD/MM/YYYY format
            toDate: formattedToDate,     // Save in DD/MM/YYYY format
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

module.exports = {
    createAMC,
    getAllAMC,
    getAMCById,
    updateAMC,
    deleteAMC,
    getAMCByMonthYear
};

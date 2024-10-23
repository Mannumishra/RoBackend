// server/Controller/DetailsController.js
const fs = require('fs');
const DetailsModel = require('../Model/DetailsModel');
const { uploadImage, deleteImage } = require('../utils/Cloudnary');
const CustmorModel = require("../Model/CustmorModel");
const LookingModel = require("../Model/LookingForModel");
const PurposeModel = require("../Model/PurposeOfVisitModel");
const TaskModel = require("../Model/TaskModel");
const VenderModel = require("../Model/VenderModel");

// Create a new record with images
const createDetails = async (req, res) => {
    try {
        const { customerDetails, nextpurposeOfVisit, nextVisit, remark, onlyCustomerId } = req.body;
        const errorMessage = [];

        // Validate required fields
        if (!customerDetails) errorMessage.push("Customer details (Task ID) are required.");
        if (!nextpurposeOfVisit) errorMessage.push("Purpose of visit is required.");
        if (!nextVisit) errorMessage.push("Next visit date is required.");

        // If there are validation errors, respond with an error message
        if (errorMessage.length > 0) {
            return res.status(400).json({ errors: errorMessage });
        }

        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "Image is required."
            });
        }

        // Handle image uploads
        const images = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                try {
                    const imageUrl = await uploadImage(file.path);
                    images.push(imageUrl);
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error("Error uploading image:", err);
                    return res.status(500).json({ error: "Error uploading image" });
                }
            }
        }

        const details = new DetailsModel({
            customerDetails,
            nextpurposeOfVisit,
            onlyCustomerId,
            nextVisit,
            remark, // Optional field
            images // Added the uploaded images array
        });

        // Save the details in MongoDB
        const savedDetails = await details.save();
        // Find the associated task by its ID (customerDetails is the task id)
        const task = await TaskModel.findById(customerDetails);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        // Update the task's status to "Completed" or another status
        task.status = "Completed"
        await task.save();
        res.status(200).json({
            success: true,
            data: savedDetails
        });

    } catch (error) {
        console.error("Error creating details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getDetails = async (req, res) => {
    try {
        const details = await DetailsModel.find().populate({
            path: 'customerDetails',
            populate: [
                {
                    path: 'customerName',
                    model: 'Custmor', // Correct model name for Customer 
                },
                {
                    path: 'fieldExecutiveName',
                    model: 'Vender', // Correct model name for Vendor 
                },
                {
                    path: 'lookingFor',
                    model: 'Looking', // Correct model name for LookingFor 
                },
                {
                    path: 'visitePurpose',
                    model: 'Purpose'  // Correct model name for PurposeOfVisit 
                }
            ]
        }).populate({
            path: 'onlyCustomerId',
            model: 'Custmor', // Populating onlyCustomerId field
        });

        if (!details) {
            return res.status(404).json({
                success: false,
                message: "Record Not Found"
            });
        }

        // Transforming details to remove unwanted fields
        const sanitizedDetails = details.map(detail => {
            return {
                ...detail._doc,
                customerDetails: {
                    ...detail.customerDetails._doc,
                    customerName: {
                        customerName: detail.customerDetails.customerName.customerName,
                        customerId: detail.customerDetails.customerName.customerId,
                        mobileNumber: detail.customerDetails.customerName.mobileNumber,
                        state: detail.customerDetails.customerName.state
                    },
                    fieldExecutiveName: {
                        name: detail.customerDetails.fieldExecutiveName.name,
                        feuid: detail.customerDetails.fieldExecutiveName.feuid,
                        phoneNumber: detail.customerDetails.fieldExecutiveName.phoneNumber
                    },
                    lookingFor: detail.customerDetails.lookingFor.lookingFor,
                    visitePurpose: detail.customerDetails.visitePurpose.visitePurpose,
                    date: detail.customerDetails.date,
                    time: detail.customerDetails.time
                },
                nextpurposeOfVisit: detail.nextpurposeOfVisit,
                nextVisit: detail.nextVisit,
                remark: detail.remark,
                images: detail.images
            };
        });

        const reverseData = sanitizedDetails.reverse()
        res.status(200).json({
            success: true,
            data: reverseData
        });
    } catch (error) {
        console.error("Error Fetching Details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// Get a single detail by ID
const getDetailsById = async (req, res) => {
    try {
        const detail = await DetailsModel.findById(req.params.id).populate({
            path: 'customerDetails',
            populate: [
                {
                    path: 'customerName',
                    model: 'Custmor',  // Correct model name for Customer 
                },
                {
                    path: 'fieldExecutiveName',
                    model: 'Vender',  // Correct model name for Vendor 
                },
                {
                    path: 'lookingFor',
                    model: 'Looking',  // Correct model name for LookingFor 
                },
                {
                    path: 'visitePurpose',
                    model: 'Purpose'  // Correct model name for PurposeOfVisit 
                }
            ]
        });

        if (!detail) {
            return res.status(404).json({
                success: false,
                message: "Detail not found"
            });
        }

        // Transforming detail to remove unwanted fields
        const sanitizedDetail = {
            ...detail._doc,
            customerDetails: {
                ...detail.customerDetails._doc,
                customerName: {
                    customerName: detail.customerDetails.customerName.customerName,
                    customerId: detail.customerDetails.customerName.customerId,
                    mobileNumber: detail.customerDetails.customerName.mobileNumber,
                    state: detail.customerDetails.customerName.state
                },
                fieldExecutiveName: {
                    name: detail.customerDetails.fieldExecutiveName.name,
                    feuid: detail.customerDetails.fieldExecutiveName.feuid,
                    phoneNumber: detail.customerDetails.fieldExecutiveName.phoneNumber
                },
                lookingFor: detail.customerDetails.lookingFor.lookingFor,
                visitePurpose: detail.customerDetails.visitePurpose.visitePurpose,
                date: detail.customerDetails.date,
                time: detail.customerDetails.time
            },
            nextpurposeOfVisit: detail.nextpurposeOfVisit,
            nextVisit: detail.nextVisit,
            remark: detail.remark,
            images: detail.images
        };

        res.status(200).json({
            success: true,
            data: sanitizedDetail
        });
    } catch (error) {
        console.error("Error Fetching Detail:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Update details
const updateDetails = async (req, res) => {
    try {
        const detail = await DetailsModel.findById(req.params.id);
        if (!detail) {
            return res.status(404).json({ message: "Detail not found" });
        }

        // Handle image updates if files are provided
        if (req.files && req.files.length > 0) {
            // Delete old images from Cloudinary
            for (let image of detail.images) {
                const publicId = image.split('/').pop().split('.')[0];
                await deleteImage(publicId);
            }

            const newImages = [];
            for (let file of req.files) {
                const imageUrl = await uploadImage(file.path);
                newImages.push(imageUrl);
                fs.unlinkSync(file.path); // Remove locally saved image
            }

            detail.images = newImages;
        }

        // Update other fields
        Object.assign(detail, req.body);
        const updatedDetail = await detail.save();
        res.status(200).json({
            success: true,
            data: updatedDetail
        });

    } catch (error) {
        console.error("Error Updating Details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete details
const deleteDetails = async (req, res) => {
    try {
        const detail = await DetailsModel.findById(req.params.id);
        if (!detail) {
            return res.status(404).json({ message: "Detail not found" });
        }

        // Delete associated images from Cloudinary
        for (let image of detail.images) {
            const publicId = image.split('/').pop().split('.')[0];
            await deleteImage(publicId);
        }

        await detail.remove();
        res.status(200).json({ message: "Detail deleted successfully" });

    } catch (error) {
        console.error("Error Deleting Details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createDetails,
    getDetails,
    getDetailsById,
    updateDetails,
    deleteDetails
};

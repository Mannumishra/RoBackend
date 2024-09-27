const fs = require('fs');
const DetailsModel = require('../Model/DetailsModel');
const { uploadImage, deleteImage } = require('../utils/Cloudnary');

// Create a new record with images
const createDetails = async (req, res) => {
    try {
        const { customerName, address, date, time, purposeOfVisit, nextVisit, remark } = req.body;
        const errorMessage = [];

        // Validate required fields
        if (!customerName) errorMessage.push("Customer name is required.");
        if (!address) errorMessage.push("Address is required.");
        if (!date) errorMessage.push("Date is required.");
        if (!time) errorMessage.push("Time is required.");
        if (!purposeOfVisit) errorMessage.push("Purpose of visit is required.");
        if (!nextVisit) errorMessage.push("Next visit date is required.");
        if (!remark) errorMessage.push("Remark is required.");

        // If there are validation errors, respond with an error message
        if (errorMessage.length > 0) {
            return res.status(400).json({ errors: errorMessage });
        }

        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "Image is must required"
            })
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
            customerName,
            address,
            date,
            time,
            purposeOfVisit,
            nextVisit,
            remark,
            images
        });

        // Save the details in MongoDB
        const savedDetails = await details.save();
        res.status(200).json({
            success: true,
            data: savedDetails
        });

    } catch (error) {
        console.error("Error creating details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all details
const getDetails = async (req, res) => {
    try {
        const details = await DetailsModel.find();
        res.status(200).json(details);
    } catch (error) {
        console.error("Error Fetching Details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get a single detail by ID
const getDetailsById = async (req, res) => {
    try {
        const detail = await DetailsModel.findById(req.params.id);
        if (!detail) {
            return res.status(404).json({ message: "Detail not found" });
        }
        res.status(200).json(detail);
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
        res.status(200).json(updatedDetail);

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

const ItemServiceModel = require("../Model/ItemServiceModel")


const createService = async (req, res) => {
    try {
        const { serviceNames, itemCode, boxNumber, hsnCode, purchaseAmount, discountPercentage, salePrice } = req.body;
        const errorMessage = [];

        if (!serviceNames) errorMessage.push("Service Name is required");
        if (!itemCode) errorMessage.push("Item Code is required");
        if (!boxNumber) errorMessage.push("Box Number is required");
        if (!hsnCode) errorMessage.push("HSN Code is required");
        if (!purchaseAmount) errorMessage.push("Purchase Amount is required");
        if (!discountPercentage) errorMessage.push("Discount Percentage is required");
        if (!salePrice) errorMessage.push("Sale Price is required");

        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(", "),
            });
        }

        const newServiceItem = new ItemServiceModel({
            serviceNames,
            itemCode,
            boxNumber,
            hsnCode,
            purchaseAmount,
            discountPercentage,
            salePrice,
        });

        const savedServiceItem = await newServiceItem.save();
        res.status(200).json({
            success: true,
            message: "Service created successfully",
            data: savedServiceItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the service",
        });
    }
};


// READ: Get all service items
const getAllServices = async (req, res) => {
    try {
        const services = await ItemServiceModel.find();
        const reverseData = services.reverse()
        res.status(200).json({
            success: true,
            data: reverseData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching services",
        });
    }
};

// READ: Get a single service item by ID
const getServiceById = async (req, res) => {
    try {
        const service = await ItemServiceModel.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the service",
        });
    }
};


// UPDATE: Update a service item by ID
const updateService = async (req, res) => {
    try {
        const updatedService = await ItemServiceModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: updatedService,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the service",
        });
    }
};


// DELETE: Delete a service item by ID
const deleteService = async (req, res) => {
    try {
        const deletedService = await ItemServiceModel.findByIdAndDelete(req.params.id);

        if (!deletedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the service",
        });
    }
};



module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};
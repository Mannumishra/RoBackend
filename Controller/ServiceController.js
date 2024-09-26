const MyServiceModel = require("../Model/ServiceModel");



// Create a new service
const createService = async (req, res) => {
    try {
        const { serviceName, quantity, rate, primaryUnits, subtotal, taxPrice, totalAmount } = req.body;
        const errorMessage = [];

        if (!serviceName) errorMessage.push("Service name is required.");
        if (quantity === undefined || quantity < 0) errorMessage.push("Quantity must be a non-negative number.");
        if (rate === undefined || rate < 0) errorMessage.push("Rate must be a non-negative number.");
        if (primaryUnits === undefined || primaryUnits < 0) errorMessage.push("Primary units must be a non-negative number.");
        if (subtotal === undefined || subtotal < 0) errorMessage.push("Subtotal must be a non-negative number.");
        if (taxPrice === undefined || taxPrice < 0) errorMessage.push("Tax price must be a non-negative number.");
        if (totalAmount === undefined || totalAmount < 0) errorMessage.push("Total amount must be a non-negative number.");

        if (errorMessage.length > 0) {
            return res.status(400).json({ errors: errorMessage.join(",") });
        }

        const newService = new MyServiceModel({
            serviceName,
            quantity,
            rate,
            primaryUnits,
            subtotal,
            taxPrice,
            totalAmount,
        });

        const savedService = await newService.save();
        return res.status(200).json(
            {
                success: true,
                data: savedService
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

// Read all services
const getAllServices = async (req, res) => {
    try {
        const services = await MyServiceModel.find().populate({path :"serviceName" ,select:"-__v "});
        return res.status(200).json(services);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

// Read a single service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await MyServiceModel.findById(req.params.id).populate({path :"serviceName" ,select:"-__v "});
        if (!service) {
            return res.status(404).json({ message: "Service not found." });
        }
        return res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const { serviceName, quantity, rate, primaryUnits, subtotal, taxPrice, totalAmount } = req.body;

        const updatedService = await MyServiceModel.findByIdAndUpdate(
            req.params.id,
            {
                serviceName,
                quantity,
                rate,
                primaryUnits,
                subtotal,
                taxPrice,
                totalAmount,
            },
            { new: true }
        ).populate({path :"serviceName" ,select:"-__v "});

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found." });
        }
        return res.status(200).json(updatedService);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const deletedService = await MyServiceModel.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found." });
        }
        return res.status(200).json({
            success: true,
            message: "Service Delete Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};

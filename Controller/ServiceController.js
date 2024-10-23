const saleModel = require("../Model/SaleModel");
const MyServiceModel = require("../Model/ServiceModel");



// Create a new service
const createService = async (req, res) => {
    try {
        const { serviceName, quantity, rate, primaryUnits, subtotal, taxPrice, totalAmount, discount, afterDiscountAmount } = req.body;
        const errorMessage = [];

        if (!serviceName) errorMessage.push("Service name is required.");
        if (quantity === undefined || quantity < 0) errorMessage.push("Quantity must be a non-negative number.");
        if (rate === undefined || rate < 0) errorMessage.push("Rate must be a non-negative number.");
        if (primaryUnits === undefined || primaryUnits < 0) errorMessage.push("Primary units must be a non-negative number.");
        if (subtotal === undefined || subtotal < 0) errorMessage.push("Subtotal must be a non-negative number.");
        if (taxPrice === undefined || taxPrice < 0) errorMessage.push("Tax price must be a non-negative number.");
        if (totalAmount === undefined || totalAmount < 0) errorMessage.push("Total amount must be a non-negative number.");
        if (discount === undefined || discount < 0) errorMessage.push("discount must be a non-negative number.");
        if (afterDiscountAmount === undefined || afterDiscountAmount < 0) errorMessage.push("afterDiscountAmount must be a non-negative number.");

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
            discount,
            afterDiscountAmount
        });

        const savedService = await newService.save();
        return res.status(200).json(
            {
                success: true,
                message: "Bill Genrate Successfully",
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
        // Get all sold services from sales
        const sales = await saleModel.find().select('services'); // Get only the 'services' field from sales
        const soldServiceIds = sales.flatMap(sale => sale.services.map(service => service.toString())); // Get all sold service IDs as strings

        // Fetch all services that are not part of a sale
        const services = await MyServiceModel.find({
            _id: { $nin: soldServiceIds }  // Exclude services that are sold
        }).populate({ path: "serviceName", select: "-__v" });

        const reverseData = services.reverse()
        return res.status(200).json({
            success: true,
            data: reverseData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

const getTotalServices = async (req, res) => {
    try {
        const data = await MyServiceModel.find().populate({ path: "serviceName", select: "-__v " })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Services Not Found"
            })
        }
        const reverseData = data.reverse()
        res.status(200).json({
            success: true,
            message: "Record Found Successfully",
            data: reverseData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// Read a single service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await MyServiceModel.findById(req.params.id).populate({ path: "serviceName", select: "-__v " });
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
                afterDiscountAmount,
                discount
            },
            { new: true }
        ).populate({ path: "serviceName", select: "-__v " });

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
    getTotalServices
};

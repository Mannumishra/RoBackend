const CustmorModel = require("../Model/CustmorModel");
const MyServiceModel = require("../Model/ServiceModel");
const saleModel = require("../Model/SaleModel");

// Create a new sale
exports.createSale = async (req, res) => {
    try {
        const { customer, mobileNumber, services, totalAmount, reciveAmount } = req.body;

        // Validate if customer exists
        const existingCustomer = await CustmorModel.findById(customer);
        if (!existingCustomer) {
            return res.status(400).json({ message: "Customer not found" });
        }

        // Validate if all services exist
        const serviceObjects = await MyServiceModel.find({ _id: { $in: services } });
        if (serviceObjects.length !== services.length) {
            return res.status(400).json({ message: "One or more services not found" });
        }

        // Create new sale
        const newSale = new saleModel({
            customer,
            mobileNumber,
            services,
            totalAmount,
            reciveAmount
        });

        const savedSale = await newSale.save();
        res.status(200).json({
            success: true,
            message: "Sale Created Successfully",
            data: savedSale,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get all sales
exports.getSales = async (req, res) => {
    try {
        const sales = await saleModel.find().populate("customer").populate({
            path: "services",
            populate: {
                path: "serviceName",
                model: "ItemService" // Make sure this matches your ItemService model name
            }
        });;
        res.status(200).json({
            success: true,
            message: "Sales Found Successfully",
            data: sales
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
    try {
        const sale = await saleModel.findById(req.params.id).populate("customer").populate("services");
        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }
        res.status(200).json({
            success: ture,
            message: "Sales Found Successfully",
            data: sale
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update a sale
exports.updateSale = async (req, res) => {
    try {
        const { customer, mobileNumber, services, totalAmount, reciveAmount } = req.body;

        // Validate if customer exists
        const existingCustomer = await CustmorModel.findById(customer);
        if (!existingCustomer) {
            return res.status(400).json({ message: "Customer not found" });
        }

        // Validate if all services exist
        const serviceObjects = await MyServiceModel.find({ _id: { $in: services } });
        if (serviceObjects.length !== services.length) {
            return res.status(400).json({ message: "One or more services not found" });
        }

        // Update sale
        const updatedSale = await saleModel.findByIdAndUpdate(req.params.id, {
            customer,
            mobileNumber,
            services,
            totalAmount,
            reciveAmount
        }, { new: true });

        if (!updatedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
    try {
        const deletedSale = await saleModel.findByIdAndDelete(req.params.id);
        if (!deletedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }
        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

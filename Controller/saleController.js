const CustmorModel = require("../Model/CustmorModel");
const MyServiceModel = require("../Model/ServiceModel");
const saleModel = require("../Model/SaleModel");
const { generatePDF } = require("../utils/generatePDF");
const fs = require('fs'); // Add this line



exports.createSale = async (req, res) => {
    try {
        console.log(req.body)
        const { customer, mobileNumber, services, totalAmount, reciveAmount } = req.body;

        // Validate if customer exists
        const existingCustomer = await CustmorModel.findById(customer);
        console.log(existingCustomer)
        if (!existingCustomer) {
            return res.status(400).json({ message: "Customer not found" });
        }

        // Fetching services and populating necessary fields
        const serviceObjects = await MyServiceModel.find({ _id: { $in: services } }).populate('serviceName');
        console.log(serviceObjects)
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

        // res.status(200).json({
        //     success: true,
        //     message: "Successfull",
        //     data: savedSale
        // })

        console.log("Save Sales", savedSale)

        // Generate PDF
        const pdfBuffer = await generatePDF(savedSale);


        // Debugging: Save PDF to local filesystem for verification
        fs.writeFileSync(`./${savedSale._id}.pdf`, pdfBuffer); // Save to current directory


        // Send the PDF as a response
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=sale-invoice-${savedSale._id}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        // Send the PDF buffer as the response
        res.send(pdfBuffer);

        // // Generate PDF
        // const pdfBuffer = await generatePDF(savedSale);

        // // Send the PDF as a response
        // res.set({
        //     'Content-Type': 'application/pdf',
        //     'Content-Disposition': `attachment; filename=sale-invoice-${savedSale._id}.pdf`,
        //     'Content-Length': pdfBuffer.length
        // });
        // res.send(pdfBuffer);

    } catch (error) {
        console.log("My Error", error);
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
        const sale = await saleModel.findById(req.params.id).populate("customer").populate({
            path: "services",
            populate: {
                path: "serviceName",
                model: "ItemService" // Make sure this matches your ItemService model name
            }
        });;
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

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const CustmorModel = require("../Model/CustmorModel");
const MyServiceModel = require("../Model/ServiceModel");
const saleModel = require("../Model/SaleModel");
const VenderModel = require("../Model/VenderModel");
const { generatePDF } = require("../utils/generatePDF"); // Assuming generatePDF is exported from another file

exports.createSale = async (req, res) => {
    try {
        const { customer, mobileNumber, fieldExcutive, services, totalAmount, reciveAmount, refNumber } = req.body;

        // Check if the customer exists
        const existingCustomer = await CustmorModel.findById(customer);
        if (!existingCustomer) {
            return res.status(400).json({ message: "Customer not found" });
        }

        // Check if the field executive exists
        const existingFieldExecutive = await VenderModel.findById(fieldExcutive);
        if (!existingFieldExecutive) {
            return res.status(400).json({ message: "Field Executive not found" });
        }

        // Fetch services
        const serviceObjects = await MyServiceModel.find({ _id: { $in: services } }).populate('serviceName');
        if (serviceObjects.length !== services.length) {
            return res.status(400).json({ message: "One or more services not found" });
        }

        // Generate bill number using countDocuments()
        const saleCount = await saleModel.countDocuments();  // Get the count of sales
        const billNo = 1000 + saleCount;  // Start bill number from 1000 and increment by the number of sales

        // Create new sale record
        const newSale = new saleModel({
            customer,
            fieldExcutive,
            mobileNumber,
            services,
            totalAmount,
            reciveAmount,
            refNumber,
            billNo: billNo.toString()
        });
        const savedSale = await newSale.save();

        // Populate sale details
        const populatedSale = await saleModel
            .findById(savedSale._id)
            .populate('customer')
            .populate('fieldExcutive')
            .populate({
                path: 'services',
                populate: {
                    path: 'serviceName',
                    model: 'ItemService'
                }
            });

        // Generate PDF invoice
        const pdfBuffer = await generatePDF(populatedSale);
        const pdfFileName = `sale_invoice_${savedSale._id}.pdf`;
        const pdfPath = path.join(__dirname, "../public", pdfFileName);

        // Save the PDF to the public folder
        fs.writeFileSync(pdfPath, pdfBuffer);

        // Update sale record with PDF path
        populatedSale.pdfPath = pdfFileName;
        await populatedSale.save();

        // Send response
        res.status(200).json({
            success: true,
            message: "Successfully created sale",
            data: populatedSale,
            pdfUrl: `/public/${pdfFileName}` // URL to download PDF
        });

    } catch (error) {
        console.log("Error:", error);
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
        }).populate("fieldExcutive", "name email phoneNumber feuid");
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

exports.filterSales = async (req, res) => {
    try {
        const { customer, fieldExcutive, fromDate, toDate } = req.body;

        // Function to convert 'DD-MM-YYYY' to a JavaScript Date object
        const convertToDate = (dateStr) => {
            const [day, month, year] = dateStr.split('-');
            return new Date(`${year}-${month}-${day}`);
        };

        const from = convertToDate(fromDate);
        const to = convertToDate(toDate);

        // Check if the conversion resulted in valid dates
        if (isNaN(from.getTime()) || isNaN(to.getTime())) {
            return res.status(400).json({ message: "Invalid date format. Please use DD-MM-YYYY." });
        }

        // Correctly set 'to' to the end of the last day
        to.setHours(23, 59, 59, 999);

        console.log('From date:', from);
        console.log('To date:', to);

        const filterQuery = {
            customer: customer,
            fieldExcutive: fieldExcutive,
            createdAt: {
                $gte: from,
                $lte: to
            }
        };

        console.log('Filter Query:', filterQuery);

        const sales = await saleModel.find(filterQuery)
            .populate("customer", "customerName customerId mobileNumber whatsappNumber email address state modelName brandName")
            .populate("fieldExcutive", "name feuid email phoneNumber")
            .populate({
                path: "services",
                populate: {
                    path: "serviceName",
                    model: "ItemService"
                }
            });

        if (sales.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sales found for the given filters."
            });
        }

        res.status(200).json({
            success: true,
            message: "Sales filtered successfully",
            data: sales
        });

    } catch (error) {
        console.error("Error filtering sales:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};




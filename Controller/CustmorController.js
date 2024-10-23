const CustmorModel = require("../Model/CustmorModel");
const DetailsModel = require("../Model/DetailsModel");

const createCustomer = async (req, res) => {
    try {
        const { customerName, mobileNumber, whatsappNumber, email, address, state, modelName, brandName } = req.body;
        const errorMessage = [];

        if (!customerName) errorMessage.push("Customer Name is required");
        if (!mobileNumber) errorMessage.push("Mobile Number is required");
        if (!whatsappNumber) errorMessage.push("WhatsApp Number is required");
        if (!email) errorMessage.push("Email is required");
        if (!address) errorMessage.push("Address is required");
        if (!state) errorMessage.push("State is required");
        if (!modelName) errorMessage.push("Model Name Name Is Must Required")
        if (!brandName) errorMessage.push("Brand Name is Must Required")

        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(", "),
            });
        }

        const totalcust = await CustmorModel.countDocuments();
        const customerId = `DRPC001${totalcust + 1}`;

        const newCustomer = new CustmorModel({
            customerName,
            mobileNumber,
            whatsappNumber,
            email,
            address,
            state,
            customerId: customerId,
            brandName,
            modelName
        });

        await newCustomer.save();

        res.status(200).json({
            success: true,
            message: "Customer created successfully",
            data: newCustomer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const getCustomers = async (req, res) => {
    try {
        // Fetch all customers
        const customers = await CustmorModel.find();

        // Fetch corresponding details for each customer to get all 'nextVisit' dates
        const customersWithNextVisits = await Promise.all(
            customers.map(async (customer) => {
                // Find all the corresponding details records for this customer
                const details = await DetailsModel.find({ onlyCustomerId: customer._id });

                // Extract all the 'nextVisit' dates from the details records
                const nextVisitDates = details.map(detail => detail.nextVisit);

                // Concatenate state with address
                const fullAddress = `${customer.address}${customer.state}`;

                // Convert the customer to a plain object and remove the state field
                const customerData = {
                    ...customer.toObject(),
                    address: fullAddress,   // Concatenate state with address
                    nextVisit: nextVisitDates.length > 0 ? nextVisitDates : null  // Add array of 'nextVisit' dates
                };

                // Delete the state field before returning the object
                delete customerData.state;

                return customerData;
            })
        );

        // Return the modified customer data with 'nextVisit' dates
        const reverseData = customersWithNextVisits.reverse();
        res.status(200).json({
            success: true,
            data: reverseData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// Get a single customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params
        const customer = await CustmorModel.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const updateCustomer = async (req, res) => {
    try {
        const { customerName, mobileNumber, whatsappNumber, email, address, state, brandName, modelName } = req.body;

        const customer = await CustmorModel.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        customer.customerName = customerName || customer.customerName;
        customer.mobileNumber = mobileNumber || customer.mobileNumber;
        customer.whatsappNumber = whatsappNumber || customer.whatsappNumber;
        customer.email = email || customer.email;
        customer.address = address || customer.address;
        customer.state = state || customer.state;
        customer.brandName = brandName || customer.brandName;
        customer.modelName = modelName || customer.modelName;

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
const deleteCustomer = async (req, res) => {
    try {
        const customer = await CustmorModel.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        await customer.deleteOne();
        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
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
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer
}
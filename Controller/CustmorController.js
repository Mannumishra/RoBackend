const CustmorModel = require("../Model/CustmorModel");

const createCustomer = async (req, res) => {
    try {
        const { customerName, mobileNumber, whatsappNumber, email, address, state } = req.body;
        const errorMessage = [];

        if (!customerName) errorMessage.push("Customer Name is required");
        if (!mobileNumber) errorMessage.push("Mobile Number is required");
        if (!whatsappNumber) errorMessage.push("WhatsApp Number is required");
        if (!email) errorMessage.push("Email is required");
        if (!address) errorMessage.push("Address is required");
        if (!state) errorMessage.push("State is required");

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
            customerId:customerId
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


// Get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await CustmorModel.find();
        res.status(200).json({
            success: true,
            data: customers
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
        const { customerName, mobileNumber, whatsappNumber, email, address, state } = req.body;

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
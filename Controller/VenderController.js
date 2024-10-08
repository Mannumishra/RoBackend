const VenderModel = require("../Model/VenderModel")
const bcrypt = require("bcrypt")
const saltRound = 12
const jwt = require("jsonwebtoken")

const createVender = async (req, res) => {
    try {
        const { name, email, phoneNumber, whatsappNumber, address, password } = req.body;
        const lowerCaseEmail = email.toLowerCase();

        const errorMessage = []
        if (!name) errorMessage.push("Name is required");
        if (!email) errorMessage.push("Email is required");
        if (!phoneNumber) errorMessage.push("Phone number is required");
        if (!whatsappNumber) errorMessage.push("WhatsApp number is required");
        if (!address) errorMessage.push("Address is required");
        if (!password) errorMessage.push("Password is required");
        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(",")
            })
        }

        const existingVender = await VenderModel.findOne({
            $or: [{ email: lowerCaseEmail }, { phoneNumber }]
        });

        if (existingVender) {
            let message = "";
            if (existingVender.email === lowerCaseEmail) {
                message = "Email is already registered with us.";
            }
            if (existingVender.phoneNumber === phoneNumber) {
                message += message ? " Phone number is already registered with us." : "Phone number is already registered with us.";
            }
            return res.status(400).json({
                success: false,
                message: "phone number is already registered with us"
            });
        }

        // Count total existing vendors to generate a new ID
        const totalVendors = await VenderModel.countDocuments();
        const feuid = `DRPP001${totalVendors + 1}`;

        const hashPassword = await bcrypt.hash(password, saltRound)

        const data = new VenderModel({ name, email: lowerCaseEmail, phoneNumber, whatsappNumber, address, password: hashPassword, feuid: feuid })
        await data.save()
        res.status(200).json({
            success: true,
            message: "New Vender Created Successfully",
            data:data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

// Get All Vendors
const getAllVenders = async (req, res) => {
    try {
        const venders = await VenderModel.find();
        if (!venders) {
            return res.status(404).json({
                success: false,
                message: "Vender Not Found Successfully"
            })
        }
        res.status(200).json({
            success: true,
            data: venders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Get a Vendor by ID
const getVenderById = async (req, res) => {
    try {
        const { id } = req.params;
        const vender = await VenderModel.findById(id);
        if (!vender) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        res.status(200).json({
            success: true,
            data: vender,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Update Vendor
const updateVender = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, whatsappNumber, address, password } = req.body;

        const updatedData = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;
        if (whatsappNumber) updatedData.whatsappNumber = whatsappNumber;
        if (address) updatedData.address = address;
        if (password) updatedData.password = password;

        const vender = await VenderModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!vender) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            data: vender,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Delete Vendor
const deleteVender = async (req, res) => {
    try {
        const { id } = req.params;
        const vender = await VenderModel.findByIdAndDelete(id);

        if (!vender) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is must required"
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Invaild Password"
            })
        }
        const fieldExcutiveKey = "qwertyuiopoiuytrewqwertyuiopiuytrasdlkjhgfdsasdfghj"
        const exitdata = await VenderModel.findOne({ email: email })
        if (!exitdata) {
            return res.status(404).json({
                success: false,
                message: "Invaild Email Address"
            })
        }
        const checkpassword = await bcrypt.compare(password, exitdata.password)
        const token = jwt.sign(
            { id: exitdata._id, email: exitdata.email },
            fieldExcutiveKey,
            { expiresIn: '1d' } // Token expires in 1 day
        );
        if (!checkpassword) {
            return res.status(400).json({
                success: false,
                message: "Invaild Password"
            })
        }
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            data: exitdata,
            token: token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createVender, getAllVenders, getVenderById, updateVender, deleteVender,login
}
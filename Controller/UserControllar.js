const userModel = require("../Model/UserModel")
var passwordValidator = require('password-validator');
var jwt = require('jsonwebtoken');

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols(1)


const bcrypt = require('bcrypt');
const TokenModel = require("../Model/TokenModel");
const saltRounds = 12;

const createRecord = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, password } = req.body
        console.log(req.body)
        const errorMessage = []
        if (!fullName) errorMessage.push("Name is must Required")
        if (!email) errorMessage.push("Name is must Required")
        if (!mobileNumber) errorMessage.push("Name is must Required")
        if (!password || !schema.validate(password)) errorMessage.push("Password is required and must be valid");

        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errorMessage
            });
        }

        const existingUser = await userModel.findOne({
            $or: [{ email: email }, { mobileNumber: mobileNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? "Email already exists" : "Phone number already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, saltRounds)
        const data = new userModel({ fullName, email, mobileNumber, password: hashPassword })
        await data.save()
        res.status(200).json({
            success: true,
            message: "New User Added Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getUserRecord = async (req, res) => {
    try {
        const data = await userModel.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Record Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "User Record Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: !email ? "Email Id Is Must Required" : "Password Is must Required"
            })
        }
        const data = await userModel.findOne({ email: email })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Invaild User Name"
            })
        }
        const checkPassword = await bcrypt.compare(password, data.password)
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invaild Password"
            })
        }
        const payload = {
            id: data._id,
            email: data.email,
            role: data.role
        };

        // Choose secret key based on role
        const secretKey = data.role === 'User' ? process.env.JWT_KEY_FOR_USER : process.env.JWT_KEY_FOR_ADMIN;

        // Generate token
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Store token in the database
        const tokenData = new TokenModel({ userId: data._id, token });
        await tokenData.save();

        return res.status(200).json({
            success: true,
            data: data,
            message: "Login Successfully",
            token: token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const logout = async (req, res) => {
    try {
        const { token } = req.body;  

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required for logout"
            });
        }

        // Remove the token from the database
        const deletedToken = await TokenModel.findOneAndDelete({ token: token });

        if (!deletedToken) {
            return res.status(404).json({
                success: false,
                message: "Token not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createRecord, login, logout, getUserRecord
}
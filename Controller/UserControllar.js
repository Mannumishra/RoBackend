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
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols(1)
    .is().not().oneOf(['Passw0rd', 'Password123']);


const bcrypt = require('bcrypt');
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
                message: existingUser.email ? "Email is already exit " : " Phone number is already exit "
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
        return res.status(200).json({
            success: false,
            message: "Login Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createRecord, login
}
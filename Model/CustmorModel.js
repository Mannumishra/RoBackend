const mongoose = require("mongoose")

const custmorSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    whatsappNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    }
}, { timestamps: true })

const CustmorModel = mongoose.model("Custmor", custmorSchema)

module.exports = CustmorModel
const mongoose = require("mongoose")

const saleSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: "Custmor",
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    services: {
        type: [mongoose.Schema.ObjectId],
        ref: "Service",
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    reciveAmount: {
        type: String,
        required: true
    }
}, { timestamps: true })

const saleModel = mongoose.model("Sale", saleSchema)

module.exports = saleModel
const mongoose = require("mongoose");

const DetailsSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    purposeOfVisit: {
        type: String,
        required: true
    },
    nextVisit: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Stores array of image URLs
        required: true
    }
});

const DetailsModel = mongoose.model("Details", DetailsSchema);

module.exports = DetailsModel;

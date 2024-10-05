// server/Model/CustomerModel.js
const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
    customerDetails: {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
        required: true,
    },
    nextpurposeOfVisit: {
        type: String,
        required: true,
    },
    nextVisit: {
        type: Date,
        required: true
    },
    remark: {
        type: String,
    },
    images: {
        type: [String],
        required: true
    }
});

const DetailsModel = mongoose.model('Detail', detailsSchema);

module.exports = DetailsModel;

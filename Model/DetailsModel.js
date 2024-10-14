// server/Model/CustomerModel.js
const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
    customerDetails: {    // task id 
        type: mongoose.Schema.ObjectId,
        ref: "Task",
        required: true,
    },
    onlyCustomerId:{
        type: mongoose.Schema.ObjectId, // customer id
        ref: "Custmor",
        required: true,
    },
    nextpurposeOfVisit: {
        type: String,
        required: true,
    },
    nextVisit: {
        type: String,
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

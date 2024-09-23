const mongoose = require("mongoose");

const amcSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    }
});

const amcModel = mongoose.model("AMC", amcSchema);

module.exports = amcModel;

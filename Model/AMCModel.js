    const mongoose = require("mongoose");

    const amcSchema = new mongoose.Schema({
        clientName: {
            type: mongoose.Schema.ObjectId,
            ref: "Custmor",
            required: true
        },
        userID: {
            type: mongoose.Schema.ObjectId,
            ref: "Vender",
            required: true
        },
        services: {
            type: mongoose.Schema.ObjectId,
            ref: "Service",
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

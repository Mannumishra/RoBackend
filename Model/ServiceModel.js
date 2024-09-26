const mongoose = require("mongoose");

// Define the schema
const ServiceSchema = new mongoose.Schema({
    serviceName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemService", // Ensure this reference model is defined
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    primaryUnits: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    taxPrice: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

// Register the schema
const MyServiceModel = mongoose.model("Service", ServiceSchema);

module.exports = MyServiceModel;

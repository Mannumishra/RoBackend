const mongoose = require("mongoose");

// Define the schema
const ServiceSchema = new mongoose.Schema({
    serviceName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemService", 
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    primaryUnits: {
        type: String,
        required: true
    },
    subtotal: {
        type: String,
        required: true
    },
    taxPrice: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    discount:{
        type:String,
        required:true
    },
    afterDiscountAmount:{
        type:String,
        required:true
    }
});

// Register the schema
const MyServiceModel = mongoose.model("Service", ServiceSchema);

module.exports = MyServiceModel;

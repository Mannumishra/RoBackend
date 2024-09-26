const mongoose = require("mongoose");

const venderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    vendorId: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
    },
    whatsappNumber: {
        type: Number,
        required: [true, "WhatsApp number is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
}, {
    timestamps: true
});

const VenderModel = mongoose.model("Vender", venderSchema);

module.exports = VenderModel;

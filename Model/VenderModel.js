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
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: "Phone number must be a 10-digit number",
        },
    },
    whatsappNumber: {
        type: Number,
        required: [true, "WhatsApp number is required"],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: "WhatsApp number must be a 10-digit number",
        },
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

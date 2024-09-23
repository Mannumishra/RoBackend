const mongoose = require("mongoose");

const lookingForSchema = new mongoose.Schema({
    lookingFor: {
        type: String,
        required: true
    }
});

const LookingModel = mongoose.model("Looking", lookingForSchema);

module.exports = LookingModel;

const mongoose = require("mongoose");

const purposeOfVisitSchema = new mongoose.Schema({
    lookingFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Looking",
        required: true
    },
    visitePurpose: {
        type: String,
        required: true
    }
});

const PurposeModel = mongoose.model("Purpose", purposeOfVisitSchema);

module.exports = PurposeModel;

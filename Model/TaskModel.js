const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Custmor",
        required: true
    },
    fieldExecutiveName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vender",
        required: true
    },
    lookingFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Looking",
        required: true
    },
    visitePurpose: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purpose",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }
})

const TaskModel = mongoose.model("Task", taskSchema)

module.exports = TaskModel
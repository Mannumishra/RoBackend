const CustmorModel = require("../Model/CustmorModel");
const LookingModel = require("../Model/LookingForModel");
const PurposeModel = require("../Model/PurposeOfVisitModel");
const TaskModel = require("../Model/TaskModel");
const userModel = require("../Model/UserModel");


// Create a new Task
const createTask = async (req, res) => {
    try {
        const { customerName, fieldExecutiveName, lookingFor, visitePurpose, date, time } = req.body;

        // Check if the customer, field executive, lookingFor, and visitePurpose exist
        const customer = await CustmorModel.findById(customerName);
        const fieldExecutive = await userModel.findById(fieldExecutiveName);
        const lookingForRecord = await LookingModel.findById(lookingFor);
        const purpose = await PurposeModel.findById(visitePurpose);

        if (!customer || !fieldExecutive || !lookingForRecord || !purpose) {
            return res.status(404).json({ message: 'Invalid reference in task data' });
        }

        const newTask = new TaskModel({
            customerName,
            fieldExecutiveName,
            lookingFor,
            visitePurpose,
            date,
            time
        });

        await newTask.save();
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find()
            .populate('customerName')
            .populate('fieldExecutiveName')
            .populate('lookingFor')
            .populate('visitePurpose');
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskModel.findById(id)
            .populate('customerName')
            .populate('fieldExecutiveName')
            .populate('lookingFor')
            .populate('visitePurpose');

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, fieldExecutiveName, lookingFor, visitePurpose, date, time } = req.body;

        // Check if references are valid
        const customer = await CustmorModel.findById(customerName);
        const fieldExecutive = await userModel.findById(fieldExecutiveName);
        const lookingForRecord = await LookingModel.findById(lookingFor);
        const purpose = await PurposeModel.findById(visitePurpose);

        if (!customer || !fieldExecutive || !lookingForRecord || !purpose) {
            return res.status(404).json({ message: 'Invalid reference in task data' });
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            {
                customerName,
                fieldExecutiveName,
                lookingFor,
                visitePurpose,
                date,
                time
            },
            { new: true }
        ).populate('customerName')
            .populate('fieldExecutiveName')
            .populate('lookingFor')
            .populate('visitePurpose');

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await TaskModel.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };

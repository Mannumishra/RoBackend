const CustmorModel = require("../Model/CustmorModel");
const DetailsModel = require("../Model/DetailsModel");
const LookingModel = require("../Model/LookingForModel");
const PurposeModel = require("../Model/PurposeOfVisitModel");
const TaskModel = require("../Model/TaskModel");
const VenderModel = require("../Model/VenderModel");



// Create a new Task
const createTask = async (req, res) => {
    try {
        const { customerName, fieldExecutiveName, lookingFor, visitePurpose, date, time } = req.body;

        // Check if the customer, field executive, lookingFor, and visitePurpose exist
        const customer = await CustmorModel.findById(customerName);
        const fieldExecutive = await VenderModel.findById(fieldExecutiveName);
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
        res.status(200).json({
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
            .populate({ path: 'customerName', select: "-__v -email -_id" })
            .populate({ path: "fieldExecutiveName", select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskModel.findById(id)
            .populate({ path: 'customerName', select: "-__v -email" })
            .populate({ path: "fieldExecutiveName", select: '-__v -password -createdAt -updatedAt -email' })
            .populate({ path: 'lookingFor', select: '-__v' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v' });

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
        const fieldExecutive = await VenderModel.findById(fieldExecutiveName);
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
        ).populate({ path: 'customerName', select: "-__v -email" })
            .populate({ path: "fieldExecutiveName", select: '-__v -password -createdAt -updatedAt -email' })
            .populate({ path: 'lookingFor', select: '-__v' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v' });

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


const getTasksByFieldExecutivePhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const fieldExecutive = await VenderModel.findOne({ phoneNumber });

        if (!fieldExecutive) {
            return res.status(404).json({ success: false, message: "Field executive not found" });
        }

        const tasks = await TaskModel.find({ fieldExecutiveName: fieldExecutive._id })
            .populate({ path: 'customerName', select: '-__v -email -_id' })
            .populate({ path: 'fieldExecutiveName', select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this field executive" });
        }

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getTasksByCoustmorePhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const coustmore = await CustmorModel.findOne({ mobileNumber: phoneNumber });
        // Find the details associated with the customer
        // Find the details associated with the customer
        const details = await DetailsModel.find({ onlyCustomerId: coustmore._id })
            .populate({ path: 'onlyCustomerId', select: 'customerName mobileNumber whatsappNumber email address state modelName brandName' });

        console.log("My", details)
        if (!coustmore) {
            return res.status(404).json({ success: false, message: "Coustmore not found" });
        }

        const tasks = await TaskModel.find({ customerName: coustmore._id })
            .populate({ path: 'customerName', select: '-__v -email -_id' })
            .populate({ path: 'fieldExecutiveName', select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this field executive" });
        }

        const responseData = {
            success: true,
            data: tasks,
            details: details.length > 0 ? details.map(detail => ({
                nextpurposeOfVisit: detail.nextpurposeOfVisit,
                nextVisit: detail.nextVisit,
                remark: detail.remark,
                images: detail.images
            })) : null // If no details found, set to null
        };
        res.status(200).json(responseData)
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTasksByDate = async (req, res) => {
    try {
        const { date } = req.body;

        // Find tasks that match the specified date
        const tasks = await TaskModel.find({ date: date })
            .populate({ path: 'customerName', select: '-__v -email -_id' })
            .populate({ path: 'fieldExecutiveName', select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this date" });
        }

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTasksByFieldExecutivePhone, getTasksByDate, getTasksByCoustmorePhone };

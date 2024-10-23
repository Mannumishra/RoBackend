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

            const reverseData = tasks.reverse()
        res.status(200).json({ success: true, data: reverseData });
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
        const reverseData = tasks.reverse()
        res.status(200).json({ success: true, data: reverseData });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};


const getTasksByCoustmorePhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Find the customer by their phone number
        const coustmore = await CustmorModel.findOne({ mobileNumber: phoneNumber });

        if (!coustmore) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Find details associated with the customer
        const details = await DetailsModel.find({ onlyCustomerId: coustmore._id })
            .populate({ path: 'onlyCustomerId', select: 'customerName mobileNumber whatsappNumber email address state modelName brandName' });

        // Find tasks associated with the customer
        const tasks = await TaskModel.find({ customerName: coustmore._id })
            .populate({ path: 'customerName', select: '-__v -email -_id' })
            .populate({ path: 'fieldExecutiveName', select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this customer" });
        }

        // Combine both tasks and details into one response
        const responseData = {
            success: true,
            data: {
                customer: {
                    customerName: coustmore.customerName,
                    mobileNumber: coustmore.mobileNumber,
                    whatsappNumber: coustmore.whatsappNumber,
                    customerId:coustmore.customerId,
                    email: coustmore.email,
                    address: coustmore.address,
                    state: coustmore.state,
                    modelName: coustmore.modelName,
                    brandName: coustmore.brandName
                },
                tasks: tasks.map(task => ({
                    taskId: task._id,
                    fieldExecutiveName: task.fieldExecutiveName,
                    lookingFor: task.lookingFor,
                    visitePurpose: task.visitePurpose,
                    taskDetails: task.taskDetails, // Add any additional task-related fields you want to return
                })),
                details: details.length > 0 ? details.map(detail => ({
                    nextpurposeOfVisit: detail.nextpurposeOfVisit,
                    nextVisit: detail.nextVisit,
                    remark: detail.remark,
                    images: detail.images
                })) : [] // If no details found, return an empty array
            }
        };

        // Send the combined response
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTasksByDate = async (req, res) => {
    try {
        const { date } = req.body;

        // Find tasks that match the specified date
        const tasks = await TaskModel.find({ date: date })
            .populate({ path: 'customerName', select: '-__v -email' })
            .populate({ path: 'fieldExecutiveName', select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this date" });
        }

        const reverseData = tasks.reverse()

        res.status(200).json({ success: true, data: reverseData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getPendingData = async (req, res) => {
    try {
        const { date } = req.body; // Assume the frontend sends the date in the body of the request

        // Check if date is provided
        if (!date) {
            return res.status(400).json({ success: false, message: "Date is required" });
        }

        // Find tasks with 'Pending' status and the same date
        const pendingTasks = await TaskModel.find({ status: "Pending", date: date })
            .populate({ path: 'customerName', select: "-__v -email -_id" })
            .populate({ path: "fieldExecutiveName", select: '-__v -password -createdAt -updatedAt -email -_id' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        // Check if there are any tasks found
        if (pendingTasks.length === 0) {
            return res.status(404).json({ success: false, message: "No pending tasks found for the provided date." });
        }

        const reverseData = pendingTasks.reverse()

        // Return the pending tasks
        return res.status(200).json({ success: true, data: reverseData });

    } catch (error) {
        console.log("Error fetching pending tasks:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


const getTasksByDateFE = async (req, res) => {
    try {
        const { date, feid } = req.body;

        // Check if both date and feid are provided
        if (!date || !feid) {
            return res.status(400).json({ success: false, message: "Date and Field Executive ID are required." });
        }

        // Find tasks that match the specified date and Field Executive ID
        const tasks = await TaskModel.find({ date: date, fieldExecutiveName: feid })
            .populate({ path: 'customerName', select: '-__v -email' })
            .populate({ path: 'fieldExecutiveName', select: '-__v -password -createdAt -updatedAt -email ' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this date and Field Executive ID." });
        }

        const reverseData = tasks.reverse()

        res.status(200).json({ success: true, data: reverseData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const getPendingDataFE = async (req, res) => {
    try {
        const { date, feid } = req.body;

        // Check if both date and feid are provided
        if (!date || !feid) {
            return res.status(400).json({ success: false, message: "Date and Field Executive ID are required." });
        }

        // Find tasks with 'Pending' status, matching date, and Field Executive ID
        const pendingTasks = await TaskModel.find({ status: "Pending", date: date, fieldExecutiveName: feid })
            .populate({ path: 'customerName', select: "-__v -email -_id" })
            .populate({ path: "fieldExecutiveName", select: '-__v -password -createdAt -updatedAt -email ' })
            .populate({ path: 'lookingFor', select: '-__v -_id' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v -_id' });

        // Check if there are any tasks found
        if (pendingTasks.length === 0) {
            return res.status(404).json({ success: false, message: "No pending tasks found for the provided date and Field Executive ID." });
        }

        const reverseData = pendingTasks.reverse()

        // Return the pending tasks
        return res.status(200).json({ success: true, data: reverseData });
    } catch (error) {
        console.log("Error fetching pending tasks:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};




const updateFieldExecutiveInTask = async (req, res) => {
    try {
        const { fieldExecutiveName ,taskId } = req.body; 

        // Check if the new field executive exists

        const fieldExecutive = await VenderModel.findById(fieldExecutiveName);
        if (!fieldExecutive) {
            return res.status(404).json({ message: 'Field executive not found' });
        }

        // Update the task by changing only the field executive name
        const updatedTask = await TaskModel.findByIdAndUpdate(
            taskId,
            { fieldExecutiveName },
            { new: true }
        )
            .populate({ path: 'customerName', select: "-__v -email" })
            .populate({ path: "fieldExecutiveName", select: '-__v -password -createdAt -updatedAt -email' })
            .populate({ path: 'lookingFor', select: '-__v' })
            .populate({ path: 'visitePurpose', select: '-lookingFor -__v' });

        // Check if the task was found and updated
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Return success response with the updated task
        res.status(200).json({ success: true, message: "Field executive updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTasksByFieldExecutivePhone, getTasksByDate,
     getTasksByCoustmorePhone, getPendingData, updateFieldExecutiveInTask ,getTasksByDateFE ,getPendingDataFE};

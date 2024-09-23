const express = require('express');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../Controller/TaskController');

const TaskRouter = express.Router();

// Task Routes
TaskRouter.post('/create-task', createTask); // Create Task
TaskRouter.get('/get-task', getAllTasks); // Get All Tasks
TaskRouter.get('/get-single-task/:id', getTaskById); // Get Task by ID
TaskRouter.put('/update-task/:id', updateTask); // Update Task
TaskRouter.delete('/delete-task/:id', deleteTask); // Delete Task

module.exports = TaskRouter;

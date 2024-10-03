const express = require('express');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTasksByFieldExecutivePhone, getTasksByDate } = require('../Controller/TaskController');

const TaskRouter = express.Router();

// Task Routes
TaskRouter.post('/create-task', createTask);
TaskRouter.get('/get-task', getAllTasks);
TaskRouter.get('/get-single-task/:id', getTaskById);
TaskRouter.put('/update-task/:id', updateTask);
TaskRouter.delete('/delete-task/:id', deleteTask);


TaskRouter.post('/tasks/field-executive', getTasksByFieldExecutivePhone);
TaskRouter.post('/tasks/date', getTasksByDate);

module.exports = TaskRouter;

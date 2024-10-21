const express = require('express');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTasksByFieldExecutivePhone, getTasksByDate, getTasksByCoustmorePhone, getPendingData, updateFieldExecutiveInTask, getTasksByDateFE, getPendingDataFE } = require('../Controller/TaskController');

const TaskRouter = express.Router();

// Task Routes
TaskRouter.post('/create-task', createTask);
TaskRouter.get('/get-task', getAllTasks);
TaskRouter.get('/get-single-task/:id', getTaskById);
TaskRouter.put('/update-task/:id', updateTask);
TaskRouter.delete('/delete-task/:id', deleteTask);


TaskRouter.post('/tasks/field-executive', getTasksByFieldExecutivePhone);
TaskRouter.post('/customer/record', getTasksByCoustmorePhone);

TaskRouter.post('/tasks/date', getTasksByDate);
TaskRouter.post('/tasks/date/fe', getTasksByDateFE);

TaskRouter.post('/pending-task', getPendingData);
TaskRouter.post('/pending-task/fe', getPendingDataFE);

TaskRouter.put('/tasks-update/field-executive', updateFieldExecutiveInTask);

module.exports = TaskRouter;

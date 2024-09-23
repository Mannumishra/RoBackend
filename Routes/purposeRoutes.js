const express = require('express');
const { createPurpose, getAllPurposes, getPurposeById, updatePurpose, deletePurpose } = require('../Controller/purposeController');
const PurposeRouter = express.Router();

PurposeRouter.post('/create-purpose', createPurpose);
PurposeRouter.get('/get-purpose', getAllPurposes);
PurposeRouter.get('/get-single-purpose/:id', getPurposeById);
PurposeRouter.put('/update-purpose/:id', updatePurpose);
PurposeRouter.delete('/delete-purpose/:id', deletePurpose);

module.exports = PurposeRouter;

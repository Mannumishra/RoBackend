const express = require('express');
const { createLookingFor, getAllLookingFor, getLookingForById, updateLookingFor, deleteLookingFor } = require('../Controller/lookingController');
const LookingRouter = express.Router();


LookingRouter.post('/create-looking-for', createLookingFor);
LookingRouter.get('/get-looking-for', getAllLookingFor);
LookingRouter.get('/get-single-looking-for/:id', getLookingForById);
LookingRouter.put('/update-looking-for/:id', updateLookingFor);
LookingRouter.delete('/delete-looking-for/:id', deleteLookingFor);

module.exports = LookingRouter;

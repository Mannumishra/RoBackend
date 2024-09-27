const express = require("express");
const upload = require("../Middleware/Multer");
const { createDetails, getDetails, getDetailsById, updateDetails, deleteDetails } = require("../Controller/DetailsController");
const DetailsRouter = express.Router();



DetailsRouter.post("/create-details", upload.array('images', 4), createDetails);
DetailsRouter.get("/all-details", getDetails);
DetailsRouter.get("/get-single-details/:id", getDetailsById);
DetailsRouter.put("/update-details/:id", upload.array('images', 4), updateDetails);
DetailsRouter.delete("/delete-details/:id", deleteDetails);

module.exports = DetailsRouter;

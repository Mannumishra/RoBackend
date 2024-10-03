const { createAMC, getAllAMC, getAMCById, updateAMC, deleteAMC, getAllBYDateAMC } = require("../Controller/AMCController")

const amcRouter = require("express").Router()

amcRouter.post("/create-amc", createAMC)
amcRouter.get("/get-amc", getAllAMC)
amcRouter.get("/get-single-amc/:id", getAMCById)
amcRouter.put("/update-amc/:id", updateAMC)
amcRouter.delete("/delete-amc/:id", deleteAMC)
amcRouter.post('/filter-amc', getAllBYDateAMC)

module.exports = amcRouter
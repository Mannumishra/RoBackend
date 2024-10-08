const { createVender, getAllVenders, getVenderById, updateVender, deleteVender, login } = require("../Controller/VenderController")

const VenderRouter = require("express").Router()

VenderRouter.post("/create-new-FieldExecutive", createVender)
VenderRouter.get("/get-FieldExecutive", getAllVenders)
VenderRouter.get("/get-single-FieldExecutive/:id", getVenderById)
VenderRouter.put("/update-FieldExecutive/:id", updateVender)
VenderRouter.delete("/delete-FieldExecutive/:id", deleteVender)
VenderRouter.post("/field-excutive/log-in", login)

module.exports = VenderRouter
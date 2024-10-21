const { createService, getAllServices, getServiceById, updateService, deleteService } = require("../Controller/ItemServiceController")

const itemServiceRoutes = require("express").Router()

itemServiceRoutes.post("/create-service", createService)
itemServiceRoutes.get("/get-all-service", getAllServices)
itemServiceRoutes.get("/get-single-service/:id", getServiceById)
itemServiceRoutes.put("/update-service/:id", updateService)
itemServiceRoutes.delete("/delete-servic/:id", deleteService)

module.exports = itemServiceRoutes

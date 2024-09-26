const { createService, getAllServices, getServiceById, updateService, deleteService } = require("../Controller/ServiceController")

const ServiceRouter = require("express").Router()

ServiceRouter.post("/add-new-service" , createService)
ServiceRouter.get("/get-new-service" , getAllServices)
ServiceRouter.get("/get-single-new-service/:id" , getServiceById)
ServiceRouter.put("/update-new-service/:id" , updateService)
ServiceRouter.delete("/delete-new-service/:id" , deleteService)


module.exports = ServiceRouter
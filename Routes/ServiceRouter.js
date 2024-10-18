const { createService, getAllServices, getServiceById, updateService, deleteService, getTotalServices } = require("../Controller/ServiceController")

const ServiceRouter = require("express").Router()

ServiceRouter.post("/create-bill" , createService)
ServiceRouter.get("/get-bill" , getAllServices)
ServiceRouter.get("/get-bill-amc-work" , getTotalServices)
ServiceRouter.get("/get-single-bill/:id" , getServiceById)
ServiceRouter.put("/update-bill/:id" , updateService)
ServiceRouter.delete("/delete-bill/:id" , deleteService)


module.exports = ServiceRouter
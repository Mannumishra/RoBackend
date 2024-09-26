const { createService, getAllServices, getServiceById, updateService, deleteService } = require("../Controller/ServiceController")

const ServiceRouter = require("express").Router()

ServiceRouter.post("/create-bill" , createService)
ServiceRouter.get("/get-bill" , getAllServices)
ServiceRouter.get("/get-single-bill/:id" , getServiceById)
ServiceRouter.put("/update-bill/:id" , updateService)
ServiceRouter.delete("/delete-bill/:id" , deleteService)


module.exports = ServiceRouter
const { createService } = require("../Controller/ItemServiceController")

const itemServiceRoutes = require("express").Router()

itemServiceRoutes.post("/create-service", createService)
itemServiceRoutes.get("/get-all-service", createService)
itemServiceRoutes.get("/get-single-service/:id", createService)
itemServiceRoutes.put("/update-service/:id", createService)
itemServiceRoutes.delete("/delete-servic/:id", createService)

module.exports = itemServiceRoutes
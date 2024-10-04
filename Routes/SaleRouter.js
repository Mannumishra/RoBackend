const { createSale, getSales } = require("../Controller/saleController")

const saleRouter = require("express").Router()


saleRouter.post("/send-sale", createSale)
saleRouter.get("/get-sales", getSales)

module.exports = saleRouter
const { createSale, getSales, filterSales } = require("../Controller/saleController")

const saleRouter = require("express").Router()


saleRouter.post("/send-sale", createSale)
saleRouter.get("/get-sales", getSales)

saleRouter.post("/filter-sale-data", filterSales)




module.exports = saleRouter
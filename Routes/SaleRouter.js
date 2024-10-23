const { createSale, getSales, filterSales, getSaleByFEId } = require("../Controller/saleController")

const saleRouter = require("express").Router()


saleRouter.post("/send-sale", createSale)
saleRouter.get("/get-sales", getSales)

saleRouter.post("/filter-sale-data", filterSales)
saleRouter.post("/get-sale/fe-id", getSaleByFEId)




module.exports = saleRouter
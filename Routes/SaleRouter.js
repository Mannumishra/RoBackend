const { createSale, getSales, filterSales, getSaleByFEId, deleteSale } = require("../Controller/saleController")

const saleRouter = require("express").Router()


saleRouter.post("/send-sale", createSale)
saleRouter.get("/get-sales", getSales)
saleRouter.delete("/delete-sale/:id" ,deleteSale)
saleRouter.post("/filter-sale-data", filterSales)
saleRouter.post("/get-sale/fe-id", getSaleByFEId)




module.exports = saleRouter
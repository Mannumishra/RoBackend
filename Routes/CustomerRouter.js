const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require("../Controller/CustmorController")

const CustomerRouter = require("express").Router()


CustomerRouter.post("/create-admincustomer", createCustomer)
CustomerRouter.get("/get-admincustomer", getCustomers)
CustomerRouter.get("/get-single-admincustomer/:id", getCustomerById)
CustomerRouter.put("/update-admincustomer/:id", updateCustomer)
CustomerRouter.delete("/delete-admincustomer/:id", deleteCustomer)

module.exports = CustomerRouter



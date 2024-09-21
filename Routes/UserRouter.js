const { createRecord, login } = require("../Controller/UserControllar")

const UserRouter = require("express").Router()

UserRouter.post("/sign-up", createRecord)
UserRouter.post("/log-in", login)

module.exports = UserRouter
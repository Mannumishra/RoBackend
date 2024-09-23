const { createRecord, login, getUserRecord, logout } = require("../Controller/UserControllar")
const { verifyAdmin } = require("../Middleware/Authenticate")

const UserRouter = require("express").Router()

UserRouter.post("/sign-up", createRecord)
UserRouter.post("/log-in", login)
UserRouter.post("/log-out", logout)
UserRouter.get("/all-user-record", verifyAdmin, getUserRecord)

module.exports = UserRouter
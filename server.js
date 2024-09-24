const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const cors = require("cors")
const { connectDatabase } = require("./db/ConnectDB")
const UserRouter = require("./Routes/UserRouter")
const CustomerRouter = require("./Routes/CustomerRouter")
const amcRouter = require("./Routes/AmcRouter")
const LookingRouter = require("./Routes/lookingRoutes")
const PurposeRouter = require("./Routes/purposeRoutes")
const TaskRouter = require("./Routes/TaskRouter")
const VenderRouter = require("./Routes/VenderRouter")

const app = express()
app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server Is Running")
})


app.use("/api", UserRouter)
app.use("/api", CustomerRouter)
app.use("/api", amcRouter)
app.use("/api", LookingRouter)
app.use("/api", PurposeRouter)
app.use("/api", TaskRouter)
app.use("/api", VenderRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server Is Running At ${process.env.PORT}`)
})

connectDatabase()
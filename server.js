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
const itemServiceRoutes = require("./Routes/itemServiceRoutes")
const ServiceRouter = require("./Routes/ServiceRouter")
const DetailsRouter = require("./Routes/detailsRoutes")
const saleRouter = require("./Routes/SaleRouter")

const app = express()
app.use(cors())

app.use(express.json())
app.set(express.static("public"))
app.use("/public", express.static("public"))

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
app.use("/api", itemServiceRoutes)
app.use("/api", ServiceRouter)
app.use("/api", DetailsRouter)
app.use("/api", saleRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server Is Running At ${process.env.PORT}`)
})

connectDatabase()
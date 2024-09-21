const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const cors = require("cors")
const { connectDatabase } = require("./db/ConnectDB")
const UserRouter = require("./Routes/UserRouter")

const app = express()
app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server Is Running")
})


app.use("/api", UserRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server Is Running At ${process.env.PORT}`)
})

connectDatabase()
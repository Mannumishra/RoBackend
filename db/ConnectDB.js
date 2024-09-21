const mongoose = require("mongoose")

const connectDatabase = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    connectDatabase
}
const mongoose = require("mongoose")

const dbConnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        if (connection) {
            console.log("Connect to db " + connection)
        }
    } catch (err) {
        console.log("DB ERROR ", err)
        process.exit(1)
    }
}

module.exports = dbConnection
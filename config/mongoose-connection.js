const mongoose = require("mongoose")
const config = require("config")
require("dotenv").config()
const dbgr = require("debug")(`${process.env.NODE_ENV === "development" ? "development:mongoose" : "production:mongoose"}`)

const db = config.get("MONGODB_URI")

mongoose.connect(db)
    .then(() => {
        dbgr("Connected to MongoDB")
    })
    .catch((err) => {
        dbgr(err)
    })

module.exports = mongoose.connection;
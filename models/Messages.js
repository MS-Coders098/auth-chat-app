const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Messages", messageSchema)
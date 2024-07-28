const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,

        unique: true
    },
    password: {
        type: String,
    },
    fullname: {
        type: String
    },
    profilePic: Buffer,
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages"
        }
    ]
})

module.exports = mongoose.model("Users", userSchema)
const jwt = require("jsonwebtoken")
const Users = require("../models/Users")
const Messages = require("../models/Messages")

async function findUser(token) {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await Users.findOne({ _id: decoded.id }).select("-password -username -email")
    return user
}

module.exports = async (io) => {
    io.on("connection", async (socket) => {

        const user = await findUser(socket.request.session.encoded)
        socket.emit("send-user", {user})

        const messages = await Messages.find().populate('user');
        socket.emit("load-messages", messages);

        socket.on("send-message", async (data) => {
            const newMsg = await Messages.create({
                message: data.message,
                user: data.user._id,
            });
            user.messages.push(newMsg._id);
            await user.save();
    
            // Send message to the sender
            socket.emit("message-sender", { message: data.message, user: data.user });
    
            // Broadcast message to all other clients
            socket.broadcast.emit("message-receiver", { message: data.message, user: data.user });

            socket.on("delete-message", (msgId) => {
                console.log(msgId)
            })
        });
    
        socket.on("disconnect", () => {
            // handle disconnect
        });
    })
}
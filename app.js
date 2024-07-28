const express = require('express');
const http = require("http")
const socketio = require("socket.io")
const session = require("express-session")
const flash = require("connect-flash");
const cookieParser = require("cookie-parser")
const path = require("path")
const MongoStore = require("connect-mongo");

require('dotenv').config()
const app = express();
const server = http.createServer(app)
const io = socketio(server)

// Requiring Database
require("./config/mongoose-connection")

// Requiring Sockets and creating namespaces
const chatSocket = require("./sockets/chatSocket")
const chatNamespace = io.of("/chat")
// Requiring routes 
const indexRouter = require("./routes/indexRouter")
const authRouter = require("./routes/authRouter")

// Setting Up Middlewares
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 15,
        httpOnly: true,
        secure: false
    }
})
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "./views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(flash());

// Using Sockets
io.engine.use(sessionMiddleware);
chatSocket(chatNamespace)

// Using Routes
app.use("/", indexRouter)
app.use("/auth", authRouter)

// Listening app
server.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
})
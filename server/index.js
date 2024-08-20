import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoute from "./routes/messagesRoute.js";
import {Server} from "socket.io";
const app = express();
dotenv.config();

app.use(cors());    // We might have to request to various server so we need cors so that browser allow such request.

app.use(express.json());    // It is used to parse the request with json payload.

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

connectToMongo();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server started on PORT ${process.env.PORT}`)
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

global.onlineUsers = new Map(); // Store online users on Map

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    })
})
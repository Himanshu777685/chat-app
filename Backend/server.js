import express from "express"
import http from "http"
import "dotenv/config"
import cors from "cors"
import connectDB from "./src/db/db.js";
import userRouter from "./src/routes/userRoutes.js";
import messageRouter from "./src/routes/messageRoutes.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";



const app = express();
const server = http.createServer(app);


export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})

export const userSocketMap = {}


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    console.log("user connected", userId);

    if (userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


app.use(express.json({ limit: "10mb" }));

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}));

app.use(cookieParser());

app.use("/api/status", (req, res) => {
    res.send("server is live");
})

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


//connect to mongoDB;

await connectDB();


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server is running on port: " + PORT)
})

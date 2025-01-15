import express from "express";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import setupMiddlewares from "./config/middlewares.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5100;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5174",
            "https://nodetask01mobzway.netlify.app"
        ],
        methods: ["GET", "POST"],
    },
});


connectDB();
setupMiddlewares(app);

app.get("/health", (req, res) => {
    res.status(200).send({ message: "Server is healthy!" });
});

app.use("/", userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'Frontend')));


let liveUsers = {};

io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.on('joinRoom', (userData) => {
        const { email, name } = userData;

        liveUsers[socket.id] = { email, name, socketId: socket.id };

        socket.join('live users');
        
        io.to('live users').emit('updateUserList', Object.values(liveUsers));
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete liveUsers[socket.id];
        io.to('live users').emit('updateUserList', Object.values(liveUsers));
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
    console.log("Gracefully shutting down...");
    await mongoose.connection.close();
    process.exit(0);
});

export { liveUsers, io };

import express from "express";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import setupMiddlewares from "./config/middlewares.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5100;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

connectDB();
setupMiddlewares(app);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).send({ message: "Server is healthy!" });
});

// Serve static files
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, "Frontend")));

// API routes
app.use("/", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});

const updateUsersList = async () => {
    const allUsers = await User.find({}, 'firstName lastName email _id socketId');
    io.to("Mobzway_Chat Room").emit("allUsers", allUsers);
};

const setInactivityTimeout = (socket) => {
    return setTimeout(async () => {
        console.log(`User ${socket.id} is offline due to inactivity`);
        await User.updateOne({ socketId: socket.id }, { $set: { socketId: null } });
        await updateUsersList();
    }, 120000); // 2 minutes timeout
};

// Handle Socket Connection
io.on('connection', async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.join("Mobzway_Chat Room");
    console.log(`${socket.id} joined "Mobzway_Chat Room"`);

    const user = await User.findOneAndUpdate(
        { socketId: null },
        { $set: { socketId: socket.id } },
        { new: true }
    );

    socket.emit('connected', {
        socketId: socket.id,
        room: "Mobzway_Chat Room"
    });

    await updateUsersList();

    let inactivityTimeout = setInactivityTimeout(socket);

    socket.on('user-message', async (message) => {
        console.log("Message received:", message);
        
        clearTimeout(inactivityTimeout);

        io.to("Mobzway_Chat Room").emit("message", message);
        inactivityTimeout = setInactivityTimeout(socket);
    });

    socket.on("disconnect", async () => {
        console.log(`User Disconnected: ${socket.id}`);

        await User.updateOne({ socketId: socket.id }, { $set: { socketId: null } });
        await updateUsersList();
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Gracefully shutting down...");
    await mongoose.connection.close();
    io.close(() => {
        console.log("Socket.IO server closed");
        process.exit(0);
    });
});

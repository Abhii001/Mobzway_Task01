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
import cors from 'cors';

dotenv.config();

// Initialize the app, server, and socket.io
const app = express();
const PORT = process.env.PORT || 5100;
app.use(express.json());


const allowedOrigins = [
    "*",
  "http://localhost:5173",
  "https://chriagtechassigment.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
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

//socket.io
const activeUsers = {};

const updateUsersList = async () => {
    const allUsers = await User.find({ socketId: { $ne: null } }, 'firstName lastName email _id socketId');
    console.log("Updated Live Users List:", allUsers);
    io.emit("allUsers", allUsers);
};

const checkInactiveUsers = async () => {
    const now = Date.now();
    for (let userId in activeUsers) {
        const lastActive = activeUsers[userId];
        if (now - lastActive >= 2 * 60 * 1000) {
            await User.updateOne({ _id: userId }, { $set: { socketId: null } });
            console.log(`User ${userId} has been inactive for 2 minutes and is now offline.`);
            delete activeUsers[userId];
            await updateUsersList();
        }
    }
};

setInterval(checkInactiveUsers, 2 * 60 * 1000);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("authenticate", async (userId) => {
        try {
            const user = await User.findById(userId);
            if (user) {
                await User.updateMany({ _id: userId }, { $set: { socketId: null } });

                await User.updateOne({ _id: userId }, { $set: { socketId: socket.id } });

                console.log(`${user.firstName} (${user.email}) is now Online. Socket ID: ${socket.id}`);
                activeUsers[userId] = Date.now();
                await updateUsersList();

                socket.emit("connected", {
                    socketId: socket.id,
                    room: "Mobzway_Chat Room",
                });

                socket.on("disconnect", async () => {
                    console.log(`User Disconnected: ${socket.id}`);
                    await User.updateOne({ socketId: socket.id }, { $set: { socketId: null } });
                    delete activeUsers[userId];
                    await updateUsersList();
                });
            } else {
                console.log("Authentication failed: User not found");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    });
});

const resetSocketIds = async () => {
    try {
        await User.updateMany({}, { $set: { socketId: null } });
        console.log("Reset all socket IDs on server startup.");
    } catch (error) {
        console.error("Failed to reset socket IDs:", error);
    }
};
resetSocketIds();

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

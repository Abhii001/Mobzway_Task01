import express from "express";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import setupMiddlewares from "./config/middlewares.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5100;

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Connect to MongoDB
connectDB();

// Apply middleware
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

// Users Map
const users = new Map();

// Validation function
function validateUserData(userDetails) {
    const requiredFields = [
        "email", 
        "firstName", 
        "lastName", 
        "_id", 
        "mobile", 
        "address", 
        "loginId", 
        "password", 
        "updatedAt", 
        "createdAt"
    ];
    const errors = [];

    requiredFields.forEach((field) => {
        if (!userDetails[field]) {
            errors.push(`${field} is required`);
        }
    });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userDetails.email && !emailPattern.test(userDetails.email)) {
        errors.push("Invalid email format");
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (userDetails.mobile && !mobilePattern.test(userDetails.mobile)) {
        errors.push("Invalid mobile number: Must be 10 digits");
    }

    return errors;
}

// WebSocket connection
io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Handle user joining
    socket.on("joinRoom", (userDetails) => {
        console.log("Received user data:", userDetails);

        // Validate user data
        const validationErrors = validateUserData(userDetails);
        if (validationErrors.length > 0) {
            console.error("Validation errors:", validationErrors);
            io.to(socket.id).emit("validationError", { errors: validationErrors });
            return;
        }

        const user = {
            socketId: socket.id,
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            mobile: userDetails.mobile,
            address: userDetails.address,
            _id: userDetails._id,
            loginId: userDetails.loginId,
            password: userDetails.password,
            updatedAt: userDetails.updatedAt,
            createdAt: userDetails.createdAt,
        };
        users.set(socket.id, user);

        const roomName = "joinRoom";
        socket.join(roomName);

        io.to(roomName).emit("userJoined", {
            message: `${userDetails.firstName} ${userDetails.lastName} joined the room!`,
        });

        io.emit("updateUserList", Array.from(users.values()));
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        users.delete(socket.id);
        io.to("joinRoom").emit("userDisconnected", socket.id);
        io.emit("updateUserList", Array.from(users.values()));
    });

    // Handle request for users list
    socket.on("getUsers", () => {
        io.to(socket.id).emit("updateUserList", Array.from(users.values()));
    });

    // Handle WebSocket errors
    socket.on("error", (err) => {
        console.error("Socket.IO error:", err);
    });
});

// Start the server
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

// Export users and io for external usage
export { users, io };

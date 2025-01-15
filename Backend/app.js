import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import setupMiddlewares from "./config/middlewares.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 5100;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173" || "https://mobzway-task01.onrender.com",
    methods: ["GET", "POST"],
  },
});

let liveUsers = {};

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

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinRoom", (userData) => {
    if (!userData || !userData.email || !userData.name) {
      console.error("Invalid user data");
      return;
    }

    liveUsers[socket.id] = userData;
    socket.join("live users");
    console.log(`${userData.email} joined the room "live users"`);
    io.to("live users").emit("updateUserList", liveUsers);
  });

  socket.on("disconnect", () => {
    const disconnectedUser = liveUsers[socket.id];
    if (disconnectedUser) {
      console.log(`User disconnected: ${disconnectedUser.email}`);
      delete liveUsers[socket.id];
      io.to("live users").emit("updateUserList", liveUsers);
    }
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


export { liveUsers };
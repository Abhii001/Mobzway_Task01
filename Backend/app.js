import express from "express";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import setupMiddlewares from "./config/middlewares.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 5100;
const server = http.createServer(app);
const io = new Server(server);

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
    liveUsers[socket.id] = userData;
    socket.join("live users");
    console.log(`${userData.email} joined the room "live users"`);

    io.to("live users").emit("updateUserList", liveUsers);
  });

  //user disconnects
  socket.on("disconnect", () => {
    delete liveUsers[socket.id];
    io.to("live users").emit("updateUserList", liveUsers);
    console.log("User disconnected: " + socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server as socketIo } from "socket.io";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.port || 5100;
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use("/", userRoutes);

let liveUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (userData) => {
    const { email, name } = userData;

    socket.join("live users");

    const user = { email, name, socketId: socket.id };
    liveUsers.push(user);

    io.to("live users").emit("updateUserList", liveUsers);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    liveUsers = liveUsers.filter((user) => user.socketId !== socket.id);

    io.to("live users").emit("updateUserList", liveUsers);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import { io } from "socket.io-client";

const socket = io("http://localhost:5100");

const userId = localStorage.getItem("userId");

if (userId) {
    socket.emit("authenticate", userId);
}

socket.on("connected", (data) => {
    console.log("Connected to", data.room);
});

socket.on("allUsers", (users) => {
    console.log("Updated user list:", users);
});

socket.on("message", (message) => {
    console.log("New message:", message);
});

export default socket;

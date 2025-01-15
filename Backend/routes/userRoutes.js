import express from "express";
import User from "../models/userModel.js";
import { liveUsers, io } from "../app.js";

const router = express.Router();

router.post("/saveUser", async (req, res) => {
    try {
        const user = new User({ ...req.body, updatedAt: Date.now() });
        await user.save();
        
        liveUsers[user.socketId] = { email: user.email, name: user.name, socketId: user.socketId };
        
        io.to(user.socketId).emit('joinRoom', { email: user.email, name: user.name, socketId: user.socketId });

        res.status(201).send({ message: "User saved successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get("/Users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/User/:socketId', (req, res) => {
    const socketId = req.params.socketId;
    const user = liveUsers[socketId];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});
export default router;

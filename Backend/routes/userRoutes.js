import express from "express";
import User from "../models/userModel.js";
import { users, io } from "../app.js";

const router = express.Router();

// Route to save a user
router.post("/saveUser", async (req, res) => {
    try {
        const { email, name, socketId } = req.body;

        if (!email || !name || !socketId) {
            return res.status(400).json({ error: "Missing required fields: email, name, socketId" });
        }

        const user = new User({ ...req.body, updatedAt: Date.now() });
        await user.save();

        users[socketId] = { email, name, socketId };
        io.to(socketId).emit("joinRoom", { email, name, socketId });

        res.status(201).send({ message: "User saved successfully" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Route to get all users (DB + Socket.IO)
router.get("/Users", async (req, res) => {
    try {
        const dbUsers = await User.find();

        const socketUsers = Array.from(users.values());

        const combinedUsers = [
            ...dbUsers.map(({ _id, email, firstName, lastName, mobile, address, loginId, password, updatedAt, createdAt }) => ({
                _id,
                email,
                firstName,
                lastName,
                mobile,
                address,
                loginId,
                password,
                updatedAt,
                createdAt
            })),
            ...socketUsers,
        ];

        res.status(200).json(combinedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to fetch user by socketId (from DB and Map)
router.get('/User/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        if (users.has(userId)) {
            return res.json(users.get(userId));
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;

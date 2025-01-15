import express from "express";
import User from "../models/userModel.js";
import { liveUsers } from "../app.js";

const router = express.Router();

router.post("/saveUser", async (req, res) => {
    try {
        const user = new User({ ...req.body, updatedAt: Date.now() });
        await user.save();
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

router.get("/user/:socketId", (req, res) => {
    const { socketId } = req.params;

    if (liveUsers[socketId]) {
        res.status(200).send(liveUsers[socketId]);
    } else {
        res.status(404).send({ error: "User not found" });
    }
});

export default router;

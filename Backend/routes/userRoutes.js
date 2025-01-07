import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Save user data
router.post("/saveUser", async (req, res) => {
    try {
        const user = new User({ ...req.body, updatedAt: Date.now() });
        await user.save();
        res.status(201).send({ message: "User saved successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Read user data
router.get("/Users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

export default router;

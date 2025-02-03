import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Route to save a user
router.post("/saveUser", async (req, res) => {
    try {
        const user = new User({ ...req.body, updatedAt: Date.now() });
        await user.save();
        res.status(201).send({ message: "User saved successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Route to get all users
router.get("/Users", async (req, res) => {
    try {
        const dbUsers = await User.find();
        res.status(200).json(dbUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to get user details by ID
router.get('/getUserDetails/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching user details');
    }
});

export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = express.Router();

// Route to save a new user
router.post("/saveUser", async (req, res) => {
    try {
        const { password, ...otherFields } = req.body;

        const user = new User({
            ...otherFields,
            password,
            updatedAt: Date.now(),
        });

        await user.save();
        res.status(201).send({ message: "User saved successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Route to get all users
router.get("/users", async (req, res) => {
    try {
        const dbUsers = await User.find();
        res.status(200).json(dbUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to get user details by ID
router.get("/getUserDetails/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ error: "Error fetching user details" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { loginId, password } = req.body;

    try {
        const user = await User.findOne({ loginId });
        console.log('User Found:', user);

        if (!user) {
            return res.status(400).json({ error: "Invalid login ID or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid login ID or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        res.status(200).json({
            message: "Login successful",
            userId: user._id,
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});


export default router;

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.port || 5100;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/", userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

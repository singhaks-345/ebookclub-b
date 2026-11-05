
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import contactRoute from "./route/contect.route.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://ebookclub-f.vercel.app",
    "https://ebookclub-b.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// MongoDB connection
const URI = process.env.MongoDBURI_Data;

if (!URI) {
    console.error("MongoDB URI is missing!");
}

let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(URI);
        isConnected = true;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
}

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/contect", contactRoute);

// Home route
app.get("/", async (req, res) => {
    try {
        await connectDB();

        res.status(200).json({
            activeStatus: true,
            error: false,
            message: "BookClub Backend is Running"
        });
    } catch (error) {
        res.status(500).json({
            activeStatus: false,
            error: true,
            message: "Database connection failed"
        });
    }
});

// Export Express app for Vercel
export default app;

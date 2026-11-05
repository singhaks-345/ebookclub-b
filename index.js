
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import contactRoute from "./route/contect.route.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://ebookclub-f.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// MongoDB connection cache for Vercel
const URI = process.env.MongoDBURI_Data;

const cached = globalThis.mongooseCache ||
    (globalThis.mongooseCache = {
        promise: null
    });

async function connectDB() {
    if (!URI) {
        throw new Error("MongoDB URI is missing");
    }

    // Already connected
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // Connection already in progress
    if (
        mongoose.connection.readyState === 2 &&
        cached.promise
    ) {
        return cached.promise;
    }

    // Create a new connection
    cached.promise = mongoose.connect(URI, {
        serverSelectionTimeoutMS: 15000
    });

    try {
        await cached.promise;

        console.log("MongoDB Connected Successfully");

        return mongoose.connection;

    } catch (error) {
        cached.promise = null;

        console.error(
            "MongoDB Connection Error:",
            error.message
        );

        throw error;
    }
}

// Connect before executing any API route
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        return res.status(503).json({
            activeStatus: false,
            error: true,
            message: "Database connection failed",
            details: error.message
        });
    }
});

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/contect", contactRoute);

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        activeStatus: true,
        error: false,
        message: "BookClub Backend is Running",
        database: "Connected"
    });
});

export default app;

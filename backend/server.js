import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import courseRoutes from "./routes/courseRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import db from "./models/index.js";
import Redis from "ioredis";

dotenv.config();

export const { sequelize, User, Course, Assignment, Task, ChatLog } = db;

// Redis initialization
export const redis = new Redis(process.env.REDIS_URL); // Use REDIS_URL from .env

// Test Redis connection
redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});
redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

await sequelize.sync({ force: false }); //Setting to True will delete all data in the database

const app = express();
const PORT = 5001;

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"; // Default to "*" if not defined

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is allowed
      if (allowedOrigin === "*" || allowedOrigin === origin || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
  })
);
app.use(bodyParser.json());

// Initialize Google Gemini AI with your API key
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use("/courses", courseRoutes);
app.use("/chat", chatRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/reports", reportRoutes);

//This is for UptimeRobot to check if the server is running
app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World!" }); // Return JSON response
});

try {
  await sequelize.authenticate();
  console.log("Database connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

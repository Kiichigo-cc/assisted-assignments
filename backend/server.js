import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import moment from "moment";
import courseRoutes from "./routes/courseRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import { checkJwt } from "./middleware/checkJwt.js";
import { instructorScopes } from "./middleware/checkInstructorScopes.js";
import db from "./models/index.js";

dotenv.config();

export const { sequelize, User, Course, Assignment, Task, ChatLog } = db;

await sequelize.sync({ force: false });

let activeCodes = {};

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

// Endpoint to join a course using the access code
app.post("/join-course", checkJwt, async (req, res) => {
  const { accessCode } = req.body;
  const userId = req.body.user.sub;
  const name = req.body.user.nickname;
  const picture = req.body.user.picture;

  if (!accessCode) {
    return res.status(400).json({ error: "Access code is required" });
  }

  const course = await Course.findByPk(accessCode);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  try {
    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        userId,
        profilePicture: picture,
        name,
      });
    }

    await course.addUser(user, { through: { role: "student" } });

    return res.status(200).json({
      message: `Successfully joined course ${course.courseName}`,
      accessCode,
    });
  } catch (error) {
    console.error("Error joining course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

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

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sequelize } from "sequelize";
import { ChatLog } from "./models/chatlog.js";
import { Course } from "./models/course.js";
import { Task } from "./models/task.js";
import { Assignment } from "./models/assignment.js";
import { User } from "./models/user.js";
import crypto from "crypto";
import moment from "moment";
import courseRoutes from "./routes/courseRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import { checkJwt } from "./middleware/checkJwt.js";
import { instructorScopes } from "./middleware/checkInstructorScopes.js";

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === "production") {
  // Production: Use PostgreSQL
  console.log("Using PostgreSQL for production");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Ensures SSL is used
        rejectUnauthorized: false, // Allows self-signed certificates
      },
    },
  });
} else {
  // Development: Use SQLite
  console.log("Using SQLite for development");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
  });
}

const ChatLogModel = ChatLog(sequelize);
const CourseModel = Course(sequelize);
const AssignmentModel = Assignment(sequelize);
const TaskModel = Task(sequelize);
const UserModel = User(sequelize);

let activeCodes = {};

CourseModel.hasMany(AssignmentModel, {
  foreignKey: "courseId",
  as: "assignments",
});
AssignmentModel.belongsTo(CourseModel, {
  foreignKey: "courseId",
  as: "course",
});

AssignmentModel.hasMany(TaskModel, { foreignKey: "assignmentId", as: "tasks" });
TaskModel.belongsTo(AssignmentModel, {
  foreignKey: "assignmentId",
  as: "assignment",
});

CourseModel.belongsToMany(UserModel, {
  through: "UserCourses",
  as: "users",
});

UserModel.belongsToMany(CourseModel, {
  through: "UserCourses",
  as: "courses",
});

AssignmentModel.hasMany(ChatLogModel, {
  foreignKey: "assignmentId",
  as: "chatLogs",
});
ChatLogModel.belongsTo(AssignmentModel, {
  foreignKey: "assignmentId",
  as: "assignment",
});

export { ChatLogModel, CourseModel, AssignmentModel, TaskModel, UserModel };

sequelize
  .sync({ force: false }) //Set to true will delete the whole database
  .then(() => console.log("Database synced"))
  .catch((error) => console.error("Error syncing database:", error));

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

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

const generateAccessCode = () => {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
};

// Endpoint to generate an access code for joining a course
app.post("/generate-access-code", checkJwt, instructorScopes, (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "Course ID is required" });
  }

  // Check if there's already an access code for the course
  const existingCode = Object.entries(activeCodes).find(
    ([code, { courseId: existingCourseId, expiresAt }]) =>
      existingCourseId === courseId && moment(expiresAt).isAfter(moment())
  );

  if (existingCode) {
    // If the code exists and is not expired, return the existing code
    const [accessCode, { expiresAt }] = existingCode;
    return res.status(200).json({ accessCode, expiresAt });
  }

  // If no valid access code exists, generate a new one
  const accessCode = generateAccessCode();

  // Set expiration time (10 minutes from now)
  const expiresAt = moment().add(90, "days").toISOString();

  // Store the access code with the expiration time
  activeCodes[accessCode] = { courseId, expiresAt };

  // Send the new access code back to the client
  res.status(200).json({ accessCode, expiresAt });
});

// Endpoint to join a course using the access code
app.post("/join-course", checkJwt, async (req, res) => {
  const { accessCode } = req.body;
  const userId = req.body.user.sub;
  const name = req.body.user.nickname;
  const picture = req.body.user.picture;

  if (!accessCode || !activeCodes[accessCode]) {
    return res.status(400).json({ error: "Invalid or missing access code" });
  }

  const { courseId, expiresAt } = activeCodes[accessCode];

  // Check if the access code is expired
  if (moment().isAfter(expiresAt)) {
    delete activeCodes[accessCode]; // Delete expired code
    return res.status(400).json({ error: "Access code has expired" });
  }

  try {
    let user = await UserModel.findByPk(userId);

    if (!user) {
      user = await UserModel.create({
        userId,
        profilePicture: picture,
        name: name,
      });
    }

    const course = await CourseModel.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.addUser(user, { through: { role: "student" } });

    return res.status(200).json({
      message: `Successfully joined course ${course.courseName}`,
      courseId,
    });
  } catch (error) {
    console.error("Error joining course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World!" }); // Return JSON response
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

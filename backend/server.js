import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, claimIncludes } from "express-oauth2-jwt-bearer";
import { Sequelize } from "sequelize";
import { ChatLog } from "./models/chatlog.js";
import { Course, Assignment, Task, User } from "./models/courses.js";
import crypto from "crypto";
import moment from "moment";
import checkUser from "./middleware/checkUser.js";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

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
AssignmentModel.belongsTo(CourseModel, { foreignKey: "courseId" });

AssignmentModel.hasMany(TaskModel, { foreignKey: "assignmentId", as: "tasks" });
TaskModel.belongsTo(AssignmentModel, { foreignKey: "assignmentId" });

CourseModel.belongsToMany(UserModel, {
  through: "UserCourses",
});

UserModel.belongsToMany(CourseModel, {
  through: "UserCourses",
});

const instructorScopes = claimIncludes(
  "permissions",
  "create:courses",
  "create:assignments",
  "read:chatHistory"
);

sequelize
  .sync({ force: true })
  .then(() => console.log("Database synced"))
  .catch((error) => console.error("Error syncing database:", error));

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.TOKEN_SIGNING_ALG,
});

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Initialize Google Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/courses", checkJwt, instructorScopes, async (req, res) => {
  try {
    const { courseName, courseId, term, courseNumber } = req.body.newCourse;
    const userId = req.body.user.sub;
    const name = req.body.user.nickname;
    const picture = req.body.user.picture;

    if (!courseName || !courseId || !term || !courseNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await UserModel.findByPk(userId);
    if (!user) {
      user = await UserModel.create({
        userId,
        profilePicture: picture,
        name: name,
      });
    }

    const newCourse = await CourseModel.create({
      key: courseId, // Assuming courseId is unique
      courseName,
      courseId,
      term,
      courseNumber,
    });

    await newCourse.addUser(userId, {
      through: { role: "instructor" },
    });

    console.log("New Course Added:", newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
});

app.get("/courses/:id?", checkJwt, checkUser, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    console.log("THIS THE USERID", userId, id);
    if (id) {
      const course = await CourseModel.findOne({
        where: { id },
        include: [
          {
            model: UserModel,
            where: { userId },
            required: true,
          },
          {
            model: AssignmentModel,
            as: "assignments",
            include: [
              {
                model: TaskModel,
                as: "tasks",
              },
            ],
          },
          { model: UserModel },
        ],
      });

      const usersInCourse = await UserModel.findAll({
        include: [
          {
            model: CourseModel,
            where: {
              id: course.id,
            },
            required: true,
          },
        ],
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json({ course: course, users: usersInCourse });
    } else {
      const courses = await CourseModel.findAll({
        include: [
          {
            model: UserModel,
            where: { userId },
            required: true,
          },
          {
            model: AssignmentModel,
            as: "assignments",
            include: [
              {
                model: TaskModel,
                as: "tasks",
              },
            ],
          },
        ],
      });

      return res.status(200).json(courses);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.post("/chat", checkJwt, async (req, res) => {
  try {
    console.log("Received user data:", req.body.user); // Log the user object
    const userId = req.body.user.sub;
    const userName = req.body.user.name;
    const userMessage = req.body.message;

    // A test to try to get Gemini to remember previous responses. Arbitrarily set to 10.
    const previousMessages = await ChatLogModel.findAll({
      where: { userId },
      order: [["timestamp", "ASC"]],
      limit: 10,
    });

    // Format the previous messages.
    const history = previousMessages.map((log) => ({
      role: log.sender === "user" ? "user" : "assistant",
      parts: [{ text: log.message }],
    }));

    // Push the current user message onto the stack of messages.
    history.push({ role: "user", parts: [{ text: userMessage }] });

    //console.log("Sending to Gemini:", JSON.stringify(history, null, 2));

    // Generate response from Gemini
    const result = await model.generateContent({ contents: history });
    //const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    await ChatLogModel.create({
      chatId: `chat-${Date.now()}`,
      userId: userId,
      userName: userName,
      message: userMessage,
      sender: "user",
    });

    await ChatLogModel.create({
      chatId: `chat-${Date.now()}`,
      userId: userId,
      userName: "TD3A AI",
      message: reply,
      sender: "system",
    });

    res.json({ reply });
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

app.get("/chatlogs", checkJwt, instructorScopes, async (req, res) => {
  try {
    const { userId, limit = 10, offset = 0 } = req.query;

    // Build query options
    const queryOptions = {
      where: {},
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["timestamp", "ASC"]],
    };

    if (userId) {
      queryOptions.where.userId = userId;
    }

    const chatLogs = await ChatLogModel.findAll(queryOptions);

    res.json(chatLogs);
  } catch (error) {
    console.error("Error retrieving chat logs:", error);
    res.status(500).json({ error: "Failed to retrieve chat logs" });
  }
});

// Get all assignments for a course or a specific assignment within the course
app.get("/assignments/:courseId/:assignmentId?", checkJwt, async (req, res) => {
  const { courseId, assignmentId } = req.params;

  console.log(courseId, assignmentId);

  try {
    if (assignmentId != null) {
      // Get a single assignment within a course
      const assignment = await AssignmentModel.findOne({
        where: {
          id: assignmentId,
        },
        include: [
          {
            model: TaskModel,
            as: "tasks",
          },
        ],
      });
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      return res.status(200).json(assignment);
    } else {
      // Get all assignments within a course
      const assignments = await AssignmentModel.findAll({
        where: {
          courseId: courseId,
        },
        include: [
          {
            model: TaskModel,
            as: "tasks",
          },
        ],
      });
      return res.status(200).json(assignments);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Create an assignment with tasks for a specific course
app.post(
  "/assignments/:courseId",
  checkJwt,
  instructorScopes,
  async (req, res) => {
    const { courseId } = req.params;
    const {
      name,
      purpose,
      instructions,
      submission,
      grading,
      points,
      dueDate,
      tasks,
    } = req.body;

    try {
      // First, create the assignment
      const assignment = await AssignmentModel.create({
        name,
        purpose,
        instructions,
        submission,
        grading,
        points,
        dueDate,
        courseId, // Associate the assignment with the given courseId
      });

      if (tasks) {
        const taskPromises = tasks?.map((task) => {
          return TaskModel.create({
            ...task,
            assignmentId: assignment.id, // Link the task to the created assignment
          });
        });

        // Wait for all tasks to be created
        await Promise.all(taskPromises);
      }

      const assignments = await AssignmentModel.findAll({
        where: {
          courseId: courseId,
        },
        include: [
          {
            model: TaskModel,
            as: "tasks", // Include the tasks associated with each assignment
          },
        ],
      });

      return res.status(201).json(assignments);
    } catch (error) {
      console.error("Error creating assignment:", error);
      return res.status(500).json({ error: error });
    }
  }
);

// Delete an assignment and its tasks by assignmentId
app.delete(
  "/assignments/:courseId/:assignmentId",
  checkJwt,
  instructorScopes,
  async (req, res) => {
    const { courseId, assignmentId } = req.params;

    try {
      // Fetch the assignment along with its tasks
      const assignment = await AssignmentModel.findOne({
        where: {
          id: assignmentId,
          courseId: courseId,
        },
        include: [
          {
            model: TaskModel,
            as: "tasks", // Include tasks in case we want to delete them too
          },
        ],
      });

      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }

      // Delete the tasks associated with the assignment
      await TaskModel.destroy({
        where: {
          assignmentId: assignment.id,
        },
      });

      // Delete the assignment
      await assignment.destroy();

      const assignments = await AssignmentModel.findAll({
        where: {
          courseId: courseId,
        },
        include: [
          {
            model: TaskModel,
            as: "tasks", // Include the tasks associated with each assignment
          },
        ],
      });

      return res.status(200).json({
        message: "Assignment and tasks deleted successfully",
        assignments: assignments,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete assignment and tasks" });
    }
  }
);

app.get(
  "/assignments/:courseId/:assignmentId/:taskId",
  checkJwt,
  async (req, res) => {
    const { courseId, assignmentId, taskId } = req.params;

    console.log(courseId, assignmentId);

    try {
      const task = await TaskModel.findOne({
        where: {
          id: taskId,
        },
      });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

const generateAccessCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Example: "1A2B3C"
};

// Endpoint to generate an access code for joining a course
app.post("/generate-access-code", checkJwt, instructorScopes, (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "Course ID is required" });
  }

  // Generate the access code
  const accessCode = generateAccessCode();

  // Set expiration time (10 minutes from now)
  const expiresAt = moment().add(10, "minutes").toISOString();

  // Store the access code with the expiration time
  activeCodes[accessCode] = { courseId, expiresAt };

  console.log("ACCCESSCODES", activeCodes);

  // Send the access code back to the client
  res.status(200).json({ accessCode });
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// controllers/dashboardController.js

import { getUsersInCourse } from "../queries/courseQueries.js";
import { Assignment, ChatLog, model } from "../server.js";
import { redis } from "../server.js";

const CACHE_TTL = 60 * 60 * 24 * 7; // 1 week in seconds

// Main controller to get the dashboard report
export const getMetrics = async (req, res) => {
  try {
    // Extract courseId and assignmentId from the URL parameters
    const { courseId, assignmentId } = req.params;

    if (!courseId || !assignmentId) {
      return res
        .status(400)
        .json({ error: "courseId and assignmentId are required" });
    }

    const studentsData = [];
    const issuesReport = [];

    // Fetch all users who are enrolled in the given course
    const users = await getUsersInCourse(courseId);

    const assignment = await Assignment.findOne({
      where: { id: assignmentId, courseId },
    });

    for (let student of users) {
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }

      const chatLogs = await ChatLog.findAll({
        where: { userId: student.userId, assignmentId },
      });

      const userMessages = chatLogs.filter((log) => log.sender === "user");

      const responseCount = userMessages.length;

      const aggregateResponseLength = userMessages.reduce(
        (sum, log) => sum + log.message.split(" ").length,
        0
      );

      const avgResponseLength =
        responseCount > 0 ? aggregateResponseLength / responseCount : 0;

      const totalActiveTime = calculateActiveTime(chatLogs);

      const geminiAnalysis = await analyzeWithGemini(
        student,
        assignment,
        chatLogs
      );

      const assignmentStatus =
        geminiAnalysis.taskCompletion === 100
          ? "Completed"
          : geminiAnalysis.taskCompletion > 0
          ? "In Progress"
          : "Not Started";

      studentsData.push({
        user: student,
        taskCompletion: geminiAnalysis.taskCompletion,
        assignmentStatus,
        responseCount,
        avgResponseLength,
        aggregateResponseLength,
        totalActiveTime,
        estIndependentInput: geminiAnalysis.estIndependentInput,
        issues: geminiAnalysis.issues,
      });

      issuesReport.push(...geminiAnalysis.issues);
    }

    const retVals = {
      metrics: studentsData,
      issues: issuesReport,
      assignment: assignment,
    };

    res.json(retVals);
  } catch (error) {
    console.error("Error generating dashboard:", error);
    res.status(500).json({ error: "Failed to generate dashboard" });
  }
};

// Helper functions

// Function to calculate total active time based on chat logs
const calculateActiveTime = (chatLogs) => {
  const timestamps = chatLogs.map((log) => new Date(log.timestamp).getTime());
  let totalActiveTime = 0;

  for (let i = 1; i < timestamps.length; i++) {
    const gap = timestamps[i] - timestamps[i - 1];
    if (gap <= 600000) {
      // 10 minutes gap considered inactivity
      totalActiveTime += gap;
    }
  }

  return Math.round(totalActiveTime / 60000); // Convert ms to minutes
};

// Function to analyze chat logs using Gemini model
const analyzeWithGemini = async (student, assignment, chatLogs) => {
  const cacheKey = `gemini:${student.userId}:${assignment.id}`;
  const currentMessageCount = chatLogs.length;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("Gemini cache hit");
    const parsed = JSON.parse(cached);
    console.log("Parsed cache:", parsed);
    if (parsed.messageCount == currentMessageCount) {
      console.log("Using cached Gemini result");
      return parsed.analysis;
    }
  }

  try {
    const result = await model.generateContent(prompt(assignment, chatLogs));
    const response = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const analysis = JSON.parse(response);

    // Save to Redis cache with message count for overwrite comparison
    await redis.set(
      cacheKey,
      JSON.stringify({
        analysis,
        messageCount: currentMessageCount,
      }),
      "EX",
      CACHE_TTL
    );

    return analysis;
  } catch (err) {
    console.error("Error parsing Gemini response:", err);
    return {
      taskCompletion: 0,
      estIndependentInput: 0,
      issues: [],
    };
  }
};

// Prompt for Gemini model
const prompt = (assignment, chatLogs) => `
You are an AI education assistant.

Given:
- An **assignment JSON** describing the context and expectations of a student task
- A series of **chat logs** between a student and an AI assistant

Return **only** a JSON object with the following three fields:

---

1. **taskCompletion** (number from 0 to 100):
   Estimate the student's overall task completion percentage based on their interaction with the AI. An assignment element is considered complete when the student clearly finalizes discussion on that part/task.

---

2. **issues** (array):
   This should represent **student-side emotional or cognitive friction** during the conversation. Each entry should describe:
   - Confusion
   - Frustration
   - Dissatisfaction
   - The student correcting the AI
   - Moments where the student seeks clarification repeatedly

Each issue must have the following structure:

{
  "student": "<userName>",
  "issue": "<short issue type or summary>",
  "quote": "<direct student message indicating the issue>",
  "description": "<contextual explanation of what caused the issue>"
}

---

3. **estIndependentInput** (number from 0 to 100):
   Estimate the proportion of original content contributed by the student versus content accepted or lightly modified from the AI.
   - Look for instances where the student introduces **new ideas, perspectives, or content**.
   - Compare that to how often the student accepts or minimally edits AI suggestions.
   - Return the estimated percentage of student-originated content relative to the total content discussed in the chat.

---

### Assignment JSON:
${JSON.stringify(assignment, null, 2)}

---

### Chat Logs:
${JSON.stringify(chatLogs, null, 2)}

---

Return only a raw JSON object (no code block formatting like \`\`\`json) in this format:

{
  "taskCompletion": <number>,
  "issues": [ { ... }, { ... } ],
  "estIndependentInput": <number>
}
`;

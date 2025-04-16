import { getAssignmentById } from "../queries/assignmentQueries.js";
import { getAllCourses } from "../queries/courseQueries.js";
import { ChatLog } from "../server.js";
import { Assignment } from "../server.js";
import { genAI, model } from "../server.js";

export const chat = async (req, res) => {
  try {
    console.log("Received user data:", req.body.user); // Log the user object
    const userId = req.body.user.sub;
    const userName = req.body.user.name;
    const userMessage = req.body.message;
    const assignmentId = req.body.assignmentId;
    //const assignmentContext = req.body.assignmentContext;
    let assignmentContext, promptInstructions;
    console.log("Received assignment context:", assignmentContext);

    if (assignmentId) {
      // Fetch assignment details
      const assignment = await getAssignmentById(assignmentId);
      if (assignment) {
        assignmentContext = `Assignment: ${assignment.name}\nPurpose: ${
          assignment.purpose
        }\nInstructions: ${assignment.instructions}\n
        Submission Details: ${assignment.submission}\nGrading Criteria: ${
          assignment.grading
          // }\nPoints: ${assignment.points}\nDue Date: ${
          //   assignment.dueDate
        }\nTasks: ${assignment.tasks
          .map((task) => JSON.stringify(task))
          .join(", ")}`;
      }
      promptInstructions =
        assignment?.promptInstructions || "Answer the question.";
    }
    console.log("Received assignment context:", assignmentContext);

    // A test to try to get Gemini to remember previous responses. Arbitrarily set to 10.
    const previousMessages = await ChatLog.findAll({
      where: { userId, assignmentId },
      order: [["timestamp", "ASC"]],
      limit: 1000,
    });

    // Format the previous messages.
    const history = previousMessages.map((log) => ({
      role: log.sender === "user" ? "user" : "model",
      parts: [{ text: log.message }],
    }));

    if (assignmentContext) {
      const contextString =
        typeof assignmentContext === "string"
          ? assignmentContext
          : JSON.stringify(assignmentContext);
      const modifiedContextString = `This is the context of an assignment, answer any questions with this context: ${contextString}`;
      //history.unshift({ role: "user", parts: [{text: assignmentContext }] });
      history.push({
        role: "user",
        parts: [
          {
            text: `Follow these prompt instructions: ${promptInstructions}. ${contextString}. `,
          },
        ],
      });
    }

    // Push the current user message onto the stack of messages.
    history.push({ role: "user", parts: [{ text: userMessage }] });

    //console.log("Sending to Gemini:", JSON.stringify(history, null, 2));

    // Generate response from Gemini
    const result = await model.generateContent({ contents: history });
    //const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    await ChatLog.create({
      chatId: `chat-${Date.now()}`,
      userId: userId,
      userName: userName,
      message: userMessage,
      sender: "user",
      ...(assignmentId && { assignmentId }),
    });

    await ChatLog.create({
      chatId: `chat-${Date.now()}`,
      userId: userId,
      userName: "TD3A AI",
      message: reply,
      sender: "system",
      ...(assignmentId && { assignmentId }),
    });

    res.json({ reply });
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
};

export const getInstructorChatLogs = async (req, res) => {
  try {
    const instructorId = req.user.sub;
    const { userId, assignmentId, limit = 1000, offset = 0 } = req.query;

    // Build query options
    const queryOptions = {
      where: {},
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["timestamp", "ASC"]],
    };

    const courses = await getAllCourses(instructorId);

    if (courses.length === 0) {
      return res
        .status(403)
        .json({ error: "Instructor is not part of any courses" });
    }

    const courseAssignments = courses.flatMap(
      (course) => course.assignments?.map((assignment) => assignment.id) ?? []
    );

    queryOptions.where.assignmentId = courseAssignments;

    if (assignmentId && courseAssignments.includes(parseInt(assignmentId))) {
      queryOptions.where.assignmentId = assignmentId;
    }

    if (userId) {
      queryOptions.where.userId = userId;
    }

    const chatLogs = await ChatLog.findAll(queryOptions);

    res.json(chatLogs);
  } catch (error) {
    console.error("Error retrieving chat logs:", error);
    res.status(500).json({ error: "Failed to retrieve chat logs" });
  }
};

export const getUserChatLogs = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { assignmentId, limit = 1000, offset = 0 } = req.query;

    // Build query options
    const queryOptions = {
      where: {},
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["timestamp", "ASC"]],
    };

    if (assignmentId) {
      queryOptions.where.assignmentId = assignmentId;
    }

    queryOptions.where.userId = userId;

    const chatLogs = await ChatLog.findAll(queryOptions);

    res.json(chatLogs);
  } catch (error) {
    console.error("Error retrieving chat logs:", error);
    res.status(500).json({ error: "Failed to retrieve chat logs" });
  }
};

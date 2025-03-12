import { getAssignmentById } from "../queries/assignmentQueries.js";
import { getAllCourses } from "../queries/courseQueries.js";
import { ChatLogModel } from "../server.js";
import { AssignmentModel } from "../server.js";
import { genAI, model } from "../server.js";

export const chat = async (req, res) => {
  try {
    console.log("Received user data:", req.body.user); // Log the user object
    const userId = req.body.user.sub;
    const userName = req.body.user.name;
    const userMessage = req.body.message;
    const assignmentId = req.body.assignmentId;
    //const assignmentContext = req.body.assignmentContext;
    let assignmentContext;
    console.log("Received assignment context:", assignmentContext);

    if (assignmentId) {
      // Fetch assignment details
      const assignment = await getAssignmentById(assignmentId);
      if (assignment) {
        assignmentContext = `Assignment: ${assignment.name}\nPurpose: ${assignment.purpose}\nInstructions: ${assignment.instructions}\n
        Submission Details: ${
          assignment.submission
        }\nGrading Criteria: ${assignment.grading}\nPoints: ${
          assignment.points
        }\nDue Date: ${assignment.dueDate}\nTasks: ${assignment.tasks.map(task => JSON.stringify(task)).join(", ")}`;
      }
    }
    console.log("Received assignment context:", assignmentContext);

    // A test to try to get Gemini to remember previous responses. Arbitrarily set to 10.
    const previousMessages = await ChatLogModel.findAll({
      where: { userId },
      order: [["timestamp", "ASC"]],
      limit: 100,
    });

    // Format the previous messages.
    const history = previousMessages.map((log) => ({
      role: log.sender === "user" ? "user" : "assistant",
      parts: [{ text: log.message }],
    }));

    if (assignmentContext) {
      const contextString = typeof assignmentContext === "string" ? assignmentContext : JSON.stringify(assignmentContext);
      const modifiedContextString = `This is the context of an assignment, answer any questions with this context: ${contextString}`;
      //history.unshift({ role: "user", parts: [{text: assignmentContext }] });
      history.push({ role: "user", parts: [{ text: contextString }] });
    }
    

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
      ...(assignmentId && { assignmentId })
    });

    await ChatLogModel.create({
      chatId: `chat-${Date.now()}`,
      userId: userId,
      userName: "TD3A AI",
      message: reply,
      sender: "system",
      ...(assignmentId && { assignmentId })
    });

    res.json({ reply });
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
};

export const getChatLogs = async (req, res) => {
  try {
    const { userId, limit = 100, offset = 0 } = req.query;

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
};

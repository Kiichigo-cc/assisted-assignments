import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import { Sequelize } from "sequelize";
import { ChatLog } from "./models/chatlog.js";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const ChatLogModel = ChatLog(sequelize);
ChatLogModel.sync({ force: false });

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

// Initialize Google Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const history = previousMessages.map(log => ({
      role: log.sender === "user" ? "user" : "assistant",
      parts: [{ text: log.message }]
    }));

    // Push the current user message onto the stack of messages.
    history.push({ role: "user", parts: [{ text: userMessage }] });

    //console.log("Sending to Gemini:", JSON.stringify(history, null, 2));

    // Generate response from Gemini
    const result = await model.generateContent({contents: history});
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

app.get("/chatlogs", checkJwt, async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

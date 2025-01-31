import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

dotenv.config();

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
    const userMessage = req.body.message;

    // Generate response from Gemini
    const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

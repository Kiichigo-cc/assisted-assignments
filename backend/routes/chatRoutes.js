import express from "express";
import { chat, getChatLogs } from "../controllers/chatController.js";
import { instructorScopes } from "../middleware/checkInstructorScopes.js";
import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

router.post("/", checkJwt, chat); // POST route for creating a new chat
router.get("/logs", checkJwt, instructorScopes, getChatLogs); // GET route for fetching chat logs

export default router;

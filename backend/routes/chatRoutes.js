import express from "express";
import {
  chat,
  getInstructorChatLogs,
  getUserChatLogs,
} from "../controllers/chatController.js";
import { instructorScopes } from "../middleware/checkInstructorScopes.js";
import { checkJwt } from "../middleware/checkJwt.js";
import checkUser from "../middleware/checkUser.js";

const router = express.Router();

router.post("/", checkJwt, chat); // POST route for creating a new chat
router.get(
  "/instructor/logs",
  checkJwt,
  instructorScopes,
  checkUser,
  getInstructorChatLogs
); // GET route for fetching chat logs
router.get("/user/logs", checkJwt, checkUser, getUserChatLogs); // GET route for fetching chat logs

export default router;

import express from "express";
import { createCourse, getCourses } from "../controllers/courseController.js";
import { instructorScopes } from "../middleware/checkInstructorScopes.js";
import checkUser from "../middleware/checkUser.js";
import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

router.post("/", checkJwt, instructorScopes, createCourse); // POST to create a new course
router.get("/:id?", checkJwt, checkUser, getCourses); // GET to fetch courses (with optional courseId)

export default router;

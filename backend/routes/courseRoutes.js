import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  joinCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { instructorScopes } from "../middleware/checkInstructorScopes.js";
import checkUser from "../middleware/checkUser.js";
import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

router.post("/", checkJwt, instructorScopes, createCourse); // POST to create a new course
router.get("/:id?", checkJwt, checkUser, getCourses); // GET to fetch courses (with optional courseId)
router.delete("/:id", checkJwt, instructorScopes, deleteCourse); // DELETE to remove a course
router.put("/:id", checkJwt, instructorScopes, updateCourse); // PUT to update a course
router.post("/join-course", checkJwt, joinCourse); // POST to join a course

export default router;

import express from "express";
import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  getTask,
  editAssignment,
} from "../controllers/assignmentController.js";
import { instructorScopes } from "../middleware/checkInstructorScopes.js";
import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

// GET route to fetch all assignments or a single assignment
router.get("/:courseId/:assignmentId?", checkJwt, getAssignments);

// POST route to create a new assignment for a course
router.post("/:courseId", checkJwt, instructorScopes, createAssignment);

// DELETE route to delete an assignment and its tasks
router.delete(
  "/:courseId/:assignmentId",
  checkJwt,
  instructorScopes,
  deleteAssignment
);

// GET route to fetch a specific task by ID
router.get("/:courseId/:assignmentId/:taskId", checkJwt, getTask);

// POST route to edit an assignment
router.post(
  "/:courseId/:assignmentId",
  checkJwt,
  instructorScopes,
  editAssignment
);

export default router;

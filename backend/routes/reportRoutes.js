import express from "express";
import { getMetrics } from "../controllers/reportController.js";
import { instructorScopes } from "../middleware/checkInstructorScopes.js";

import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

router.get(
  "/metrics/:courseId/:assignmentId",
  checkJwt,
  instructorScopes,
  getMetrics
);

export default router;

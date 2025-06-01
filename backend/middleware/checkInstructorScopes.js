import { claimIncludes } from "express-oauth2-jwt-bearer";

// Middleware to check if the user has the required scopes for instructor actions
export const instructorScopes = claimIncludes(
  "permissions",
  "create:courses",
  "create:assignments",
  "read:chatHistory"
);

import { claimIncludes } from "express-oauth2-jwt-bearer";

export const instructorScopes = claimIncludes(
  "permissions",
  "create:courses",
  "create:assignments",
  "read:chatHistory"
);

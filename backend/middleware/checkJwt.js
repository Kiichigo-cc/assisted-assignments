import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();

// Middleware to check JWT and validate audience, issuer, and signing algorithm
export const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.TOKEN_SIGNING_ALG,
});

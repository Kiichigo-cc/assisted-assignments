import { jwtDecode } from "jwt-decode";

export const checkUser = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Extract Authorization header

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token (after 'Bearer ')

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    // Decode the token without verification (use only for extracting user info)
    const decoded = jwtDecode(token);
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default checkUser;

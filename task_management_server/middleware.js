const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Getting token from cookies
  console.log("All cookies received:", req.cookies);
  const token = req.cookies?.token;

  if (!token) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ message: "No token provided, access denied" });
  }

  try {
    // Verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully for user:", decoded.user_id);

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };

const jwt = require("jsonwebtoken");

// Verifies the JWT sent in the Authorization header.
// Expected header format: "Authorization: Bearer <token>"
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Restricts a route to admins only. Use AFTER protect().
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: admins only" });
  }
  next();
};

// Restricts a route to faculty only. Use AFTER protect().
const isFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ message: "Access denied: faculty only" });
  }
  next();
};

module.exports = { protect, isAdmin, isFaculty };

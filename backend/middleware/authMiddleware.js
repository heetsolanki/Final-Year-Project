const jwt = require("jsonwebtoken");

/* ================= VERIFY TOKEN ================= */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

/* ================= ROLE AUTHORIZATION ================= */
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isAdminOverride =
      req.user.role === "admin" &&
      (role === "consumer" || role === "legalExpert");

    if (req.user.role !== role && !isAdminOverride) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRole,
};
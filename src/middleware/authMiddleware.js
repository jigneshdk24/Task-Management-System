const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1]; // "Bearer xyzaldf" => ["Bearer, "xyzdfkd]
    const userPayload = jwt.verify(token, JWT_SECRET);

    // Attach user info to request object
    req.user = {
      id: userPayload.id,
      email: userPayload.email,
      is_admin: userPayload.is_admin,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

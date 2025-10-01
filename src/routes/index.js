const express = require("express");
const router = express.Router();

// Helpers: middleware
const authMiddleware = require("../middleware/authMiddleware");

// Module routes
const userRoutes = require("../routes/users");
const taskRoutes = require("../routes/taskRoutes");
const statusRoutes = require("../routes/statusMaster");
const teamMemberRoutes = require("../routes/TeamMemberRoutes");

// Public routes
router.use("/users", userRoutes);

// Protected routes
router.use("/status", authMiddleware, statusRoutes);
router.use("/tasks", authMiddleware, taskRoutes); // comments nested inside task routes
router.use("/", teamMemberRoutes); // members mounted at root per current code

module.exports = router;


const express = require("express");
const router = express.Router();

// Helpers: middleware
const authMiddleware = require("../middleware/authMiddleware");

// Module routes (flat files inside src/modules)
const userRoutes = require("../modules/userRoutes");
const taskRoutes = require("../modules/taskRoutes");
const statusRoutes = require("../modules/statusMasterRoutes");
const teamMemberRoutes = require("../modules/teamMemberRoutes");

// Public routes
router.use("/users", userRoutes);

// Protected routes
router.use("/status", authMiddleware, statusRoutes);
router.use("/tasks", authMiddleware, taskRoutes); // comments nested inside task routes
router.use("/", teamMemberRoutes); // members mounted at root per current code

module.exports = router;


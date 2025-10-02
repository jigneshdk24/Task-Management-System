const express = require("express");
const router = express.Router();

// Helpers: middleware
const authMiddleware = require("../middleware/authMiddleware");

// Module routes (new structure)
const userRoutes = require("../modules/user/route");
const taskRoutes = require("../modules/task/route");
const statusRoutes = require("../modules/statusMaster/route");
const teamMemberRoutes = require("../modules/teamMember/route");

// Public routes
router.use("/users", userRoutes);

// Protected routes
router.use("/status", authMiddleware, statusRoutes);
router.use("/tasks", authMiddleware, taskRoutes); // comments nested inside task routes
router.use("/", teamMemberRoutes); // members mounted at root per current code

module.exports = router;


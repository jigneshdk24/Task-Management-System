const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const taskRbac = require("../middleware/taskRbac");
const assignRbac = require("../middleware/assignRbac");
const {
  createTask,
  updateTask,
  getAllTask,
  deleteTask,
  getTaskById,
  assignUsers,
} = require("../controllers/taskController");

// GET /tasks/:id → RBAC check
router.get("/:id", authMiddleware, taskRbac, getTaskById);

// PUT /tasks/:id → RBAC check
router.put("/:id", authMiddleware, taskRbac, updateTask);

// DELETE /tasks/:id → RBAC check
router.delete("/:id", authMiddleware, taskRbac, deleteTask);

// GET /tasks → get all tasks (admin or involved)   
router.get("/", authMiddleware, getAllTask);

// POST /tasks → any authenticated user can create
router.post("/", authMiddleware, createTask);

// Assign users to a task (only admin or creator)
router.post("/:id/assign", authMiddleware, assignRbac, assignUsers);

module.exports = router;

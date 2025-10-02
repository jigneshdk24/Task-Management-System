const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const taskRbac = require("../../middleware/taskRbac");
const assignRbac = require("../../middleware/assignRbac");
const {
  createTask,
  updateTask,
  getAllTask,
  deleteTask,
  getTaskById,
  assignUsers,
} = require("./controller");

// GET /tasks/:id → RBAC check
router.get(":/id", auth, taskRbac, getTaskById);

// PUT /tasks/:id → RBAC check
router.put(":/id", auth, taskRbac, updateTask);

// DELETE /tasks/:id → RBAC check
router.delete(":/id", auth, taskRbac, deleteTask);

// GET /tasks → get all tasks (admin or involved)
router.get("/", auth, getAllTask);

// POST /tasks → any authenticated user can create (we enforce admin check in controller)
router.post("/", auth, createTask);

// Assign users to a task (only admin or creator)
router.post(":/id/assign", auth, assignRbac, assignUsers);

module.exports = router;


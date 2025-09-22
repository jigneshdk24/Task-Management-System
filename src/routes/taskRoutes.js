const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  getAllTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", createTask);

module.exports = router;

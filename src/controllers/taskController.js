const { Task } = require("../models");

const createTask = async (req, res) => {
  const { name, desc, status_code, due_date } = req.body;
  try {
    const task = await Task.create({
      name,
      desc,
      status_code,
      due_date,
      created_by: req.user.id,
      updated_by: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, message: "Task created", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating task" });
  }
};

const updateTask = (req, res) => {};

const deleteTask = (req, res) => {};

const getAllTask = (req, res) => {};

const getTaskById = (req, res) => {};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTask,
  getTaskById,
};
